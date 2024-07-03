"use client";

import { useUpdateServingPlayer } from "@/infrastructure/mutations/tournaments";
import { createContext, useEffect, useState } from "react";

import { TournamentType } from "@/interfaces/tournaments";

const Context = createContext<any>({});

type ServingType = {
  playerId: string;
  team: "guest" | "host";
  gameId: string;
};

export function NavbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavbar, setShowNavbar] = useState(true);
  const [serving, setServing] = useState<ServingType | null>(null);
  const [tournament, setTournament] = useState<TournamentType | null>(null);

  const { mutate: updateServing } = useUpdateServingPlayer();

  useEffect(() => {
    if (serving === null) {
      return;
    }

    const teams = tournament?.players || {};

    if (Object.keys(teams).length) {
      Object.keys(teams).forEach((team) => {
        Object.keys(teams?.[team as keyof typeof teams]).forEach((teamId) => {
          updateServing({
            gameId: serving?.gameId,
            playerId: teamId,
            team,
            isServing: false,
          });
        });
      });

      updateServing({
        gameId: serving?.gameId,
        playerId: serving.playerId,
        team: serving.team,
        isServing: true,
      });
    }
  }, [serving]);

  return (
    <Context.Provider
      value={{
        showNavbar,
        setShowNavbar,
        serving,
        setServing,
        tournament,
        setTournament,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
