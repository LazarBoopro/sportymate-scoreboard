"use client";

import { useAddTournament } from "@/infrastructure/mutations/tournaments";
import { database } from "@/lib/firebaseConfig";
import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

type TournamentTypeExtended = {
  id: string;
  title: string;
};

export default function useTournaments() {
  const [tournaments, setTournaments] = useState<
    TournamentTypeExtended[] | null
  >(null);

  const { mutate: addTournament, isSuccess } = useAddTournament();

  function addNewTournament({ title }: { title: string }) {
    console.log("sasa");
    return addTournament({
      title,
      id: Math.floor(Math.random() * 10000) + title.slice(0, 5),
    });
  }

  // USE_EFFECTS
  useEffect(() => {
    const tournamentsRef = ref(database, "tournaments");

    const unsubscribe = onValue(tournamentsRef, (snapshot) => {
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

  return { tournaments, addNewTournament };
}
