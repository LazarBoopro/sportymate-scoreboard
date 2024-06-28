"use client";

import { useEffect, useState } from "react";

import { auth, database } from "@/lib/firebaseConfig";

import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { TournamentType } from "@/interfaces/tournaments";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function useTournaments() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState<TournamentType[] | null>(null);

  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user?.uid) {
      return router.replace("/login");
    }

    const tournamentsRef = ref(database, "tournaments");
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

  return { tournaments };
}
