"use client";

import { useEffect, useState } from "react";

import { database } from "@/lib/firebaseConfig";

import { onValue, ref } from "firebase/database";
import { TournamentType } from "@/interfaces/tournaments";

export default function useTournaments() {
  const [tournaments, setTournaments] = useState<TournamentType[] | null>(null);

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

  return { tournaments };
}
