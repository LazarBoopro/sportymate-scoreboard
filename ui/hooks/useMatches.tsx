"use client";

import { SyntheticEvent, useEffect, useState } from "react";

import { auth, database } from "@/lib/firebaseConfig";

import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { MatchType, CreateMatchType } from "@/interfaces/matches";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { MATCH_DEFAULT_OPTIONS } from "@/lib/constants/match";
import { useAddMatch } from "@/infrastructure/mutations/matches";

type MatchTypeExtended = MatchType & {
  id: string;
};

export function useMatches() {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const {
    mutate: addMatch,
    isSuccess,
    isPending: isAddingMatch,
  } = useAddMatch();

  const [matches, setMatches] = useState<MatchTypeExtended[] | null>(null);
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

    addMatch(payload);
  };

  const handleOnChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    const [field, index, subField] = name.split(".");

    if (subField !== undefined && index !== undefined) {
      // @ts-ignore
      data.players[field][index][subField] = value;
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

    const matchesRef = ref(database, "matches");

    const matchQuery = query(
      matchesRef,
      orderByChild("userId"),
      equalTo(user?.uid)
    );

    const unsubscribe = onValue(matchQuery, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const matchesData = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMatches(matchesData);
      } else {
        setMatches([]);
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
    matches,
    data,
    isDouble,
    isAddingMatch,
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
