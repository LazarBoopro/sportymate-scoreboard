"use client";

import { useUpdateServingPlayer } from "@/infrastructure/mutations/matches";
import { createContext, useEffect, useState } from "react";

import { MatchType } from "@/interfaces/matches";
import { useSearchParams } from "next/navigation";

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
  const [match, setMatch] = useState<MatchType | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const [screen, setScreen] = useState<"tournaments" | "matches">(
    "tournaments"
  );

  const searchParams = useSearchParams();

  const { mutate: updateServing } = useUpdateServingPlayer();

  useEffect(() => {
    if (serving === null) {
      return;
    }

    const teams = match?.players || {};

    if (Object.keys(teams).length) {
      Object.keys(teams).forEach((team) => {
        Object.keys(teams?.[team as keyof typeof teams]).forEach((teamId) => {
          // @ts-ignore
          updateServing({
            gameId: serving?.gameId,
            playerId: `${teamId}`,
            team,
            isServing: false,
            tournament: searchParams.get("tournamentId")
              ? {
                  tournamentId: searchParams.get("tournamentId") ?? "",
                  groupId: searchParams.get("groupId") ?? "",
                  phase: searchParams.get("phase") ?? "",
                }
              : undefined,
          });
        });
      });

      // @ts-ignore
      updateServing({
        gameId: serving?.gameId,
        playerId: `player${serving.playerId + 1}`,
        team: serving.team,
        isServing: true,
        tournament: searchParams.get("tournamentId")
          ? {
              tournamentId: searchParams.get("tournamentId") ?? "",
              groupId: searchParams.get("groupId") ?? "",
              phase: searchParams.get("phase") ?? "",
            }
          : undefined,
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
        match,
        setMatch,
        isDrawerOpened,
        setIsDrawerOpened,
        screen,
        setScreen,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
