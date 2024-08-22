// "use client";

// import { useContext, useEffect, useState } from "react";
// import { notFound } from "next/navigation";

// import Context from "@/ui/providers/NavbarContext.provider";

// import {
//   useUpdateCurrentSet,
//   useUpdateGemScore,
//   useUpdateMatchStatus,
//   // useUpdateMatchWinner,
//   useUpdateTieScore,
// } from "@/infrastructure/mutations/tournaments";

// import { database } from "@/lib/firebaseConfig";
// import { onValue, ref } from "firebase/database";
// import { selectOptions } from "@/lib/constants/match";
// import { scores } from "@/lib/helpers/score";

// import { TournamentType } from "@/interfaces/tournaments";

// type ParamsType = {
//   team: number;
//   path: string;
//   action: "plus" | "minus";
//   advIndex?: number;
// };

// type HandleUpdateType = {
//   team: number;
//   path: string;
//   action: "plus" | "minus";
// };

// /*
//   NOTICE:
//   In Handlers, we update local state (useState),
//   then on that state change we call an service
//   to firebase to actually update data
// */

// export default function useSingleTournament({ id }: { id: string }) {
//   const { tournament, setTournament } = useContext<{
//     tournament: TournamentType;
//     setTournament: CallableFunction;
//   }>(Context);

//   // --
//   const type = +tournament?.type;

//   const [score, setScore] = useState(tournament?.score?.currentSet || [0, 0]);
//   const [gemScore, setGemScore] = useState(
//     tournament?.score?.sets[tournament?.score?.sets.length - 1]
//   );
//   const [tieBreakScore, setTieBreakScore] = useState(
//     tournament?.score?.tiebreak || [0, 0]
//   );
//   const [params, setParams] = useState<ParamsType | null>(null);
//   const [currentSet, setCurrentSet] = useState([0, 0]);
//   const [tie, setIsTie] = useState(false);
//   const [totalPlayedSets, setTotalPlayedSets] = useState({
//     player1: 0,
//     player2: 0,
//     total: 0,
//   });
//   const [matchType, setMatchType] = useState({
//     setDuration: 3,
//     gemDuration: 6,
//     tieBreakDuration: 7,
//   });

//   // Queries and Mutations
//   const { mutate: updateMatchScore } = useUpdateCurrentSet();
//   const { mutate: updateGemScore } = useUpdateGemScore();
//   const { mutate: updateTieScore } = useUpdateTieScore();
//   // const { mutate: updateMatchWinner } = useUpdateMatchWinner();
//   // const { mutate: updateStatus } = useUpdateMatchStatus();

//   // Functions
//   // Check for winner
//   function checkWinner() {
//     console.log(type);
//   }

//   // Check for total played sets
//   function checkTotalPlayedSets() {
//     let player1Sets = 0;
//     let player2Sets = 0;

//     if (tournament?.score?.sets) {
//       // Iterate over each set to count the wins
//       for (const set of tournament?.score?.sets) {
//         const [player1Score, player2Score] = set;

//         // Determine who won the set
//         if (player1Score > player2Score) {
//           player1Sets++;
//         } else if (player2Score > player1Score) {
//           player2Sets++;
//         }
//       }
//     }

//     const payload = {
//       player1: player1Sets,
//       player2: player2Sets,
//       total: player1Sets + player2Sets,
//     };

//     return payload;
//   }

//   // Add new Set
//   function addNewSet(setsLength: number, team: number) {
//     setTieBreakScore([0, 0]);

//     const setLength = tournament?.score?.sets?.length!;

//     if (setLength === matchType.setDuration) {
//       return;
//     }

//     Array.from({ length: 2 }).forEach((_, i) =>
//       updateGemScore({
//         id,
//         team: i,
//         gem: setsLength,
//         score: 0,
//         prevScore: [0, 0],
//       })
//     );
//   }

//   function resetTieScore(team: number) {
//     return updateTieScore({
//       id,
//       team,
//       prevScore: [0, 0],
//       score: 0,
//     });
//   }

//   function checkIsTieBreak() {
//     const type = +tournament?.type;
//     const bothAtLastGem = currentSet.every(
//       (teamScore) => teamScore >= matchType.gemDuration
//     );
//     const bothAtLastGemMinus1 = currentSet.every(
//       (teamScore) => teamScore >= matchType.gemDuration - 1
//     );
//     const totalSetsLen = tournament?.score?.sets?.length;

//     // Brzi
//     if (type == 2 && bothAtLastGemMinus1) {
//       return true;
//     }

//     // Kratki
//     if (type == 1 && (bothAtLastGem || totalSetsLen === 3)) {
//       return true;
//     }

//     // Standard
//     if (type == 0 && bothAtLastGem) {
//       return true;
//     }

//     return false;
//   }

//   // CURRENT SCORE
//   const handleUpdateCurrentSetScore = ({
//     action,
//     path,
//     team,
//   }: HandleUpdateType) => {
//     setParams({ action, path, team });

//     if (tie) {
//       if (action === "minus" && tieBreakScore[team] !== 0) {
//         return setTieBreakScore((prev) => ({
//           ...prev,
//           [team]: prev[team] - 1,
//         }));
//       }

//       if (action === "plus") {
//         return setTieBreakScore((prev) => ({
//           ...prev,
//           [team]: prev[team] + 1,
//         }));
//       }

//       return;
//     }

//     if (action === "minus" && score?.[team] !== 0) {
//       return setScore((prev) => prev?.map((n, i) => (i === team ? n - 1 : n)));
//     }

//     if (action === "plus" && score?.[team]! < scores.length - 1) {
//       return setScore((prev) => prev?.map((n, i) => (i === team ? n + 1 : n)));
//     }
//   };

//   useEffect(() => {
//     const team = Number(params?.team);
//     const bothAdvantage = score?.every((n) => n === 4); // This is AD
//     const playerWonGem =
//       score?.[team] > 3 && score?.reduce((a, b) => Math.abs(a - b), 0) > 1;

//     // If player won gem, set new set to 0:0, and score to 0:0
//     if (playerWonGem) {
//       score?.forEach((_, i) => {
//         updateMatchScore({
//           id,
//           team: i,
//           score: 0,
//         });
//       });

//       handleGemPoints({ team });

//       return;
//     }

//     // If both teams at AD:AD, set both to 40:40
//     if (bothAdvantage) {
//       score?.forEach((_, i) => {
//         updateMatchScore({
//           id,
//           team: i,
//           score: 3, // Index of point for 40
//         });
//       });

//       return;
//     }

//     // Basic add/subtract point for gems
//     updateMatchScore({
//       id,
//       team,
//       score: score?.[team],
//     });
//   }, [score]);

//   // GEM SCORE
//   function handleGemPoints({ team }: { team: number }) {
//     const sets = tournament?.score?.sets;
//     const currentSet = sets?.[sets?.length - 1];
//     const updatedTeam = currentSet?.[team];

//     if (gemScore?.[team]! >= matchType.gemDuration) {
//       // console.log(matchType.gemDuration);
//       addNewSet(sets?.length || 0, team);

//       return;
//     }

//     updateGemScore({
//       id,
//       team,
//       gem: sets?.length! - 1,
//       score: updatedTeam === undefined ? 0 : updatedTeam + 1,
//       prevScore: sets?.[sets?.length! - 1],
//     });
//   }

//   // TIE BREAK SCORE
//   function handleTiePoints({ team }: { team: number }) {
//     const sets = tournament?.score?.sets;
//     const currentSet = sets?.[sets?.length - 1];
//     const updatedTeam = currentSet?.[team];

//     const playerWonTieBreak =
//       tieBreakScore?.[team] >= matchType.tieBreakDuration &&
//       Object.values(tieBreakScore).reduce?.((a, b) => Math.abs(a - b), 0) > 1;

//     if (playerWonTieBreak) {
//       // Update gem in current set
//       updateGemScore({
//         id,
//         team,
//         gem: sets?.length! - 1,
//         score: updatedTeam === undefined ? 0 : updatedTeam + 1,
//         prevScore: tournament?.score?.sets[sets?.length! - 1],
//       });

//       resetTieScore(team);

//       addNewSet(sets?.length || 0, team);

//       return;
//     }

//     updateTieScore({
//       id,
//       team,
//       prevScore: tieBreakScore,
//       score: tieBreakScore[team],
//     });
//   }

//   useEffect(() => {
//     const team = Number(params?.team);

//     handleTiePoints({ team });
//   }, [tieBreakScore]);

//   // Match Settings
//   useEffect(() => {
//     const type = +tournament?.type;
//     const isSuperTieBreak = tournament?.superTieBreak;

//     setMatchType({
//       setDuration: type === 2 ? 1 : 3,
//       gemDuration: type === 2 ? 9 : 6,
//       tieBreakDuration: isSuperTieBreak ? 10 : 7,
//     });
//   }, [tournament?.type, tournament?.superTieBreak]);

//   useEffect(() => {
//     const total = checkTotalPlayedSets();
//     const isTie = checkIsTieBreak();
//     setTotalPlayedSets({ ...total });

//     setIsTie(isTie);
//   }, [score]);

//   // Firebase
//   useEffect(() => {
//     const tournamentsRef = ref(database, `tournaments/${id}`);

//     const unsubscribe = onValue(tournamentsRef, (snapshot) => {
//       const data: TournamentType = snapshot.val();

//       if (!data) {
//         setTournament(null);
//         notFound();
//       }

//       setScore(data?.score?.currentSet || [0, 0]);
//       setGemScore(data?.score?.sets[data.score.sets.length - 1]);
//       setCurrentSet(data.score?.sets[data.score?.sets.length - 1] ?? [0, 0]);
//       setTournament(data);
//     });

//     return () => unsubscribe();
//   }, []);

//   return { tie, tournament, handleUpdateCurrentSetScore };
// }
