"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  useAddGroup,
  useDeleteGroup,
  useUpdateGroupPoints,
} from "@/infrastructure/mutations/group";
import {
  useAddTeam,
  useDeleteTeam,
  useUpdateTeam,
} from "@/infrastructure/mutations/teams";
import { GroupPhaseEnum } from "@/interfaces/enums";
import { PlayerType } from "@/interfaces/matches";
import { TeamType, TournamentType } from "@/interfaces/tournaments";
import { database } from "@/lib/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { onValue, ref } from "firebase/database";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const alphabet = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(i + 65)
);

export default function useSingleTournament({
  id,
  groupId,
}: {
  id: string;
  groupId?: string;
}) {
  // states
  const [tournament, setTournament] = useState<TournamentType | null>(null);
  const [group, setGroup] = useState<any>({
    teams: [],
    double: true,
    superTieBreak: true,
    goldenPoint: false,
    type: 0,
  });
  const [team, setTeam] = useState<TeamType>({
    player1: { firstName: "", lastName: "" },
    player2: { firstName: "", lastName: "" },
  });

  // hooks
  const { toast } = useToast();
  const router = useRouter();
  const queryParams = useSearchParams();
  const phase = (queryParams.get("phase") as GroupPhaseEnum) ?? "groups";

  // constants
  const phaseInfo = tournament?.matches?.[phase] ?? null;

  // services
  const { mutate: addGroup, isSuccess: isAddGroupSuccess } =
    useAddGroup(handleError);
  const { mutate: deleteGroup } = useDeleteGroup(handleError);
  const { mutate: updateGroup } = useUpdateGroupPoints(handleError);

  const { mutate: addTeam, isSuccess: isAddTeamSuccess } =
    useAddTeam(handleError);
  const { mutate: deleteTeam } = useDeleteTeam(handleError);
  const { mutate: updateTeam } = useUpdateTeam(handleError);

  // functions

  function handleError(error: FirebaseError) {
    toast({
      title: "Greška!",
      description: error.message,
      variant: "destructive",
    });
  }

  function handleOnChangeTeam(e: any) {
    const [player, name] = e.target.name.split(".");
    const tmpTeam = { ...team };

    // @ts-ignore
    tmpTeam[player as keyof TeamType][name as keyof PlayerType] =
      e.target.value;

    setTeam(tmpTeam);
  }

  function handleAddTeam() {
    addTeam({ tournamentId: id, data: team });
  }

  function handleUpdateTeam(teamId: string, data: TeamType) {
    updateTeam({ tournamentId: id, teamId, data });
  }

  function handleAddGroup(ev: any) {
    ev.preventDefault();

    const groupLen = phaseInfo ? Object.keys(phaseInfo)?.length : 0;

    addGroup({
      data: {
        matches: [],
        name: alphabet[groupLen],
        ...group,
      },
      tournamentId: id,
      groupId: alphabet[groupLen],
      phase,
    });
  }

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam({ tournamentId: id, teamId });
  };

  useEffect(() => {
    if (isAddGroupSuccess) {
      setGroup({ teams: [], double: true, superTieBreak: true, type: 0 });
    }
    if (isAddTeamSuccess) {
      setTeam({
        player1: { firstName: "", lastName: "" },
        player2: {
          firstName: "",
          lastName: "",
        },
      });
    }
  }, [isAddGroupSuccess, isAddTeamSuccess]);

  // Firebase
  useEffect(() => {
    const matchsRef = ref(database, `tournaments/${id}`);

    const unsubscribe = onValue(matchsRef, (snapshot) => {
      const data: TournamentType = snapshot.val();

      if (!data) {
        setTournament(null);
        router.replace("/");
        toast({
          title: "Greška!",
          description: `Meč ${id} ne postoji!`,
          variant: "destructive",
        });
      }

      setTournament(data);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

  return {
    tournament,
    handleAddGroup,
    group,
    setGroup,
    groups: phaseInfo ?? [],
    deleteGroup,
    handleAddTeam,
    handleOnChangeTeam,
    team,
    teams: tournament?.teams ?? [],
    deleteTeam,
    handleUpdateTeam,
    singleGroup: groupId ? phaseInfo?.[groupId.toUpperCase()] : null,
    updateGroup,
    phase,
    matches: groupId ? phaseInfo?.[groupId.toUpperCase()]?.matches : [],
    handleDeleteTeam,
  };
}
