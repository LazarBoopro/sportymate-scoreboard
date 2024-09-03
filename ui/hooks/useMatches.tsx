"use client";

import { SyntheticEvent, useEffect, useState } from "react";

import { auth, database } from "@/lib/firebaseConfig";

import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { MatchType, CreateMatchType } from "@/interfaces/matches";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { MATCH_DEFAULT_OPTIONS } from "@/lib/constants/match";
import { useAddMatch } from "@/infrastructure/mutations/matches";

type TournamentTypeExtended = MatchType & {
  id: string;
};

export default function useMatches() {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const {
    mutate: addTournament,
    isSuccess,
    isPending: isAddingTournament,
  } = useAddMatch();

  const [tournaments, setTournaments] = useState<
    TournamentTypeExtended[] | null
  >(null);
  const [isDouble, setIsDouble] = useState(true);
  const [isSuperTieBreak, setIsSuperTieBreak] = useState(
    MATCH_DEFAULT_OPTIONS.superTieBreak
  );
  const [isGoldenPoint, setIsGoldenPoint] = useState(
    MATCH_DEFAULT_OPTIONS.goldenPoint
  );
  const [data, setData] = useState<CreateMatchType>({
    ...MATCH_DEFAULT_OPTIONS,
  });

  // FUNCTIONS
  const resetForm = () => {
    setData(JSON.parse(JSON.stringify(MATCH_DEFAULT_OPTIONS)));
  };

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const payload: MatchType = {
      matchId: `${Math.floor(Math.random() * 100)}`,
      userId: user?.uid!,
      title: data.title,
      startTime: `${data.date} ${data.startTime?.hour}:${data.startTime?.minute}`,
      status: {
        id: 12,
        status: "idle",
      },
      goldenPoint: isGoldenPoint,
      superTieBreak: isSuperTieBreak,
      type: data.type,
      players: data.players,
      score: {
        currentSet: [0, 0],
        sets: [[0, 0]],
        tiebreak: [0, 0],
      },
      winner: null,
    };

    addTournament(payload);
  };

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;

    const [field, index, subField] = name.split(".");

    if (subField !== undefined && index !== undefined) {
      // @ts-ignore
      data.players[field][index][subField] = value;
      // return setData((prevData) => ({
      //     ...prevData,
      //     players: {
      //         ...prevData.players,
      //         [field]: prevData.players[field as keyof typeof prevData.players].map(
      //             (n: PlayerType, i: number) =>
      //                 i === Number(index) ? { ...n, [subField]: value } : n
      //         ),
      //     },
      // }));
    }

    if (index !== undefined) {
      return setData((prevData) => ({
        ...prevData,
        startTime: {
          ...prevData.startTime,
          [index]: value,
        },
      }));
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // USE_EFFECTS
  useEffect(() => {
    if (!user?.uid) {
      return router.replace("/login");
    }

    const tournamentsRef = ref(database, "matches");
    const tournamentQuery = query(
      tournamentsRef,
      orderByChild("userId"),
      equalTo(user?.uid)
    );

    const unsubscribe = onValue(tournamentQuery, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const tournamentsData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTournaments(tournamentsData);
      } else {
        setTournaments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  return {
    tournaments,
    data,
    isDouble,
    isAddingTournament,
    resetForm,
    handleSubmit,
    setIsDouble,
    handleOnChange,
    setIsGoldenPoint,
    isGoldenPoint,
    isSuperTieBreak,
    setIsSuperTieBreak,
  };
}
