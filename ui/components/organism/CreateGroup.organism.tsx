"use client";

import useSingleTournament from "@/ui/hooks/useSingleTournament.hook";
import { useEffect, useState } from "react";
import { useAddMatch } from "@/infrastructure/mutations/matches";

import "@/ui/styles/pages/profile.page.scss";
import "@/ui/styles/pages/tournament.page.scss";

import { GroupPhaseEnum, MatchTypeEnum } from "@/interfaces/enums";
import { TeamType } from "@/interfaces/tournaments";

import CreateGroupForm from "../moleculs/CreateGroupForm.molecul";
import CreateMatchForm from "../moleculs/CreateMatchForm.molecul";
import dayjs from "dayjs";
import { CreateGroupMatchType, MatchType } from "@/interfaces/matches";
import AddTeamsForm from "../moleculs/AddTeamsForm.molecul";
import { useUpdateGroup } from "@/infrastructure/mutations/group";

const CreateGroup = ({ tournamentId }: { tournamentId: string }) => {
    const { handleAddGroup, group, setGroup, teams, phase, groups, tournament } =
        useSingleTournament({
            id: tournamentId,
        });

    const [type, setType] = useState("group");
    const [phaseTeams, setPhaseTeams] = useState<TeamType[]>([]);

    const [match, setMatch] = useState<CreateGroupMatchType>({
        guest: null,
        host: null,
        goldenPoint: false,
        group: "",
        superTieBreak: true,
        type: 0,
    });

    const { mutate: updateGroup } = useUpdateGroup(() => {});
    const { mutate: addMatch } = useAddMatch();

    function handleAddMatch(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!match.host || !match.guest) {
            alert("Morate izabrati igrace");
            return;
        }
        const payload: MatchType = {
            matchId: `${Math.floor(Math.random() * 100)}`,
            title: `${tournament?.title} - ${match.group}`,
            startTime: dayjs().format("YYYY-MM-DD HH:mm"),
            status: {
                id: 12,
                status: "idle",
            },
            superTieBreak: match.superTieBreak,
            goldenPoint: match.goldenPoint,
            type: match.type,
            players: {
                host: match.host,
                guest: match.guest,
            },
            score: {
                currentSet: [0, 0],
                sets: [[0, 0]],
                tiebreak: [0, 0],
            },
            winner: null,
        };

        const tournamentInfo = {
            tournamentId,
            groupId: match.group,
            phase: phase,
        };
        addMatch({ ...payload, tournament: tournamentInfo });

        setMatch({
            guest: null,
            host: null,
            goldenPoint: false,
            group: "",
            superTieBreak: true,
            type: 0,
        });
    }

    function handleAddTeams(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        updateGroup({ data: { teams: phaseTeams }, tournamentId, groupId: "A", phase });
    }

    useEffect(() => {
        if (groups?.A?.teams) { 
            
            setPhaseTeams(groups.A.teams); 
            
            if(Object.keys(groups).length === 1)
            {
                setMatch({
                    guest: null,
                    host: null,
                    goldenPoint: groups.A.goldenPoint,
                    group: "A",
                    superTieBreak: groups.A.superTieBreak,
                    type: groups.A.type,
                }) 
            }
    }
        else setPhaseTeams([]);
    }, [groups]);

    return (
        <div>
            <div className="group-btn-header">
                <button
                    onClick={() => setType("group")}
                    className={`group-btn  ${type === "group" ? " active" : ""}`}
                >
                    Grupa
                </button>
                <button
                    onClick={() => setType("match")}
                    className={`group-btn  ${type === "match" ? " active" : ""}`}
                >
                    Meč
                </button>
            </div>
            {type === "group" ? (
                phase === GroupPhaseEnum.GROUPS ? (
                    <CreateGroupForm
                        handleAddGroup={handleAddGroup}
                        teams={teams}
                        group={group}
                        setGroup={setGroup}
                    />
                ) : (
                    <AddTeamsForm
                        handleAddTeams={handleAddTeams}
                        teams={teams}
                        phaseTeams={phaseTeams}
                        setPhaseTeams={setPhaseTeams}
                    />
                )
            ) : (
                <CreateMatchForm
                    match={match}
                    setMatch={setMatch}
                    handleAddMatch={handleAddMatch}
                    groups={groups}
                    teams={teams}
                />
            )}
        </div>
    );
};

export default CreateGroup;
