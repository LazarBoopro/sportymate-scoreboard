// "use client";

// import { useContext, useEffect, useState } from "react";
// import { notFound, useRouter } from "next/navigation";

// import Context from "@/ui/providers/NavbarContext.provider";

// import {
//   useUpdateCurrentSet,
//   useUpdateGemScore,
//   useUpdateMatchStatus,
//   useUpdateMatchWinner,
//   useUpdateTieScore,
// } from "@/infrastructure/mutations/tournaments";

// import { database } from "@/lib/firebaseConfig";
// import { onValue, ref } from "firebase/database";

// import { TournamentType } from "@/interfaces/tournaments";
// import { useToast } from "@/components/ui/use-toast";

// export default function useSingleTournament({ id }: { id: string }) {
//   //  Context
//   const { tournament, setTournament } = useContext<{
//     tournament: TournamentType;
//     setTournament: CallableFunction;
//   }>(Context);

//   const { toast } = useToast();
//   const router = useRouter();

//   // States
//   const [params, setParams] = useState<null | number>(null);
//   const [matchType, setMatchType] = useState({
//     setDuration: 3,
//     gemDuration: 7,
//     tieBreakDuration: 7,
//   });
//   const [tieBreak, setTieBreak] = useState(false);

//   // Constants
//   const currentGem = tournament?.score?.currentSet;
//   const setsLength = tournament?.score?.sets?.length;
//   const currentSet = tournament?.score?.sets[setsLength! - 1];
//   const playerWonGem =
//     currentGem?.[params!]! > 3 &&
//     currentGem?.reduce((a, b) => Math.abs(a - b), 0)! > 1;
//   const type = +tournament?.type;
//   const tieBreakScore = tournament?.score?.tiebreak;

//   // Queries and Mutations
//   const { mutate: updateMatchScore, isSuccess: isSuccessCurrentMatchScore } =
//     useUpdateCurrentSet();
//   const { mutate: updateGemScore, isSuccess: isSuccessCurrentGemScore } =
//     useUpdateGemScore();
//   const { mutate: updateTieScore, isSuccess: isSuccessCurrentTieBreakScore } =
//     useUpdateTieScore();
//   const { mutate: updateMatchWinner } = useUpdateMatchWinner();
//   const { mutate: updateStatus, isSuccess: isSuccessStatus } =
//     useUpdateMatchStatus();
//   const total = totalPlayedSets();

//   // Functions

//   function handleUpdateCurrentTieBreakScore({
//     team,
//     action,
//   }: {
//     team: number;
//     action: "plus" | "minus";
//   }) {
//     if (action === "plus") {
//       updateTieScore({
//         id,
//         team,
//         prevScore: tieBreakScore,
//         score: tieBreakScore?.[team]! + 1,
//       });
//     }

//     if (action === "minus" && tieBreakScore?.[team]! > 0) {
//       updateTieScore({
//         id,
//         team,
//         prevScore: tieBreakScore,
//         score: tieBreakScore?.[team]! - 1,
//       });
//     }
//   }

//   function handleUpdateCurrentSetScore({ team, action, path }: any) {
//     setParams(team);

//     if (tieBreak) {
//       handleUpdateCurrentTieBreakScore({
//         team,
//         action,
//       });
//       return;
//     }

//     if (action === "minus" && currentGem?.[team]! > 0) {
//       updateMatchScore({
//         id,
//         team,
//         score: tournament?.score?.currentSet[team]! - 1,
//       });

//       return;
//     }

//     if (action === "plus" && currentGem?.[team]! <= 4) {
//       updateMatchScore({
//         id,
//         team,
//         score: tournament?.score?.currentSet[team]! + 1,
//       });

//       return;
//     }
//   }

//   useEffect(() => {
//     if (playerWonGem) {
//       Array.from({ length: 2 }).map((_, i) => {
//         updateMatchScore({
//           id,
//           team: i,
//           score: 0,
//         });
//       });

//       handleGemPoint(params!);

//       return;
//     }

//     // Both at ADV position
//     if (currentGem?.every((n) => n === 4)) {
//       Array.from({ length: 2 }).map((_, i) =>
//         updateMatchScore({
//           id,
//           team: i,
//           score: 3,
//         })
//       );
//     }
//   }, [isSuccessCurrentMatchScore, tournament?.score?.currentSet]);

//   useEffect(() => {
//     if (currentSet?.every((n) => n >= 6)) {
//       setTieBreak(true);
//     } else {
//       setTieBreak(false);
//     }
//   }, [isSuccessCurrentGemScore, tournament?.score?.sets]);

//   function handleGemPoint(team: number) {
//     const sets = tournament?.score?.sets;
//     const currentSet = sets?.[sets?.length - 1];
//     const updatedTeam = currentSet?.[team];

//     /*
//         Add new set only for type 0 or 1.
//         Type 2 is playing till 9 gem.
//     */
//     if (
//       (type === 0 || type === 1) &&
//       currentSet?.[team!]! >= matchType?.gemDuration - 1
//     ) {
//       addNewSet();
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

//   function addNewSet() {
//     if (setsLength === matchType.setDuration) return;

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

//   useEffect(() => {
//     const playerWonTieBreak =
//       tieBreakScore?.[params!]! >= matchType.tieBreakDuration &&
//       tieBreakScore?.reduce((a, b) => Math.abs(a - b), 0)! > 1;

//     console.log(playerWonTieBreak);

//     if (playerWonTieBreak) {
//       handleGemPoint(params!);
//       addNewSet();
//     }
//   }, [isSuccessCurrentTieBreakScore]);

//   // Helpers
//   function checkMatchType() {
//     const tieBreakDuration = tournament?.superTieBreak ? 10 : 7;

//     if (type === 0 || type === 1) {
//       setMatchType({
//         setDuration: 3,
//         gemDuration: 7,
//         tieBreakDuration,
//       });
//     }

//     if (type === 2) {
//       setMatchType({
//         setDuration: 1,
//         gemDuration: 9,
//         tieBreakDuration,
//       });
//     }
//   }

//   function checkForTieBreak() {
//     if (tournament?.winner) {
//       setTieBreak(false);
//       return;
//     }

//     if (type === 2) {
//       currentSet?.every((n) => n === 8)
//         ? setTieBreak(true)
//         : setTieBreak(false);

//       return;
//     }

//     if (type === 1) {
//       currentSet?.every((n) => n === 6) || total.total > 2
//         ? setTieBreak(true)
//         : setTieBreak(false);

//       return;
//     }

//     if (type === 0) {
//       currentSet?.every((n) => n === 6)
//         ? setTieBreak(true)
//         : setTieBreak(false);
//       return;
//     }

//     setTieBreak(false);
//   }

//   function totalPlayedSets() {
//     let player1 = 0,
//       player2 = 0,
//       totalPlayedSets = 0,
//       index = 0;

//     if (!tournament)
//       return {
//         player1: 0,
//         player2: 0,
//         total: 0,
//       };

//     for (const value of tournament?.score?.sets!) {
//       const [p1, p2] = value;

//       const dur = tournament?.score?.sets?.[index]?.every((n) => n >= 6)
//         ? 8
//         : 7;

//       if (p1 >= dur - 1 || p2 >= dur - 1) {
//         if (p1 > p2) {
//           player1!++;
//         } else {
//           player2!++;
//         }
//       }

//       if (tieBreak) {
//         if (p1 > p2) {
//           player1!++;
//         }

//         if (p2 < p1) {
//           player2!++;
//         }
//       }

//       totalPlayedSets++;
//     }

//     return {
//       player1,
//       player2,
//       total: totalPlayedSets,
//     };
//   }

//   // useEffects
//   useEffect(() => {
//     checkMatchType();
//     checkForTieBreak();
//   }, [tournament?.type]);

//   // Firebase
//   useEffect(() => {
//     const tournamentsRef = ref(database, `tournaments/${id}`);

//     const unsubscribe = onValue(tournamentsRef, (snapshot) => {
//       const data: TournamentType = snapshot.val();

//       if (!data) {
//         setTournament(null);
//         router.replace("/");
//         toast({
//           title: "Greška!",
//           description: `Meč ${id} ne postoji!`,
//           variant: "destructive",
//         });
//         notFound();
//       }

//       setTournament(data);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [id]);

//   return { tournament, tieBreak, handleUpdateCurrentSetScore };
// }
