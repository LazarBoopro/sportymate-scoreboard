export const MATCH_TYPES = [
  {
    id: 0,
    title: "Standardni",
    description:
      "Ovaj tip meča se igra na 2 dobijena seta. Pri izjednačenju u trećem setu sa rezultatom 6:6 igra se nastavlja kroz (super)TieBreak",
    noOfSets: 3,
  },
  {
    id: 1,
    title: "Kratki",
    description:
      "Ovaj tip meča se igra na 2 dobijena seta. Ukoliko je rezultat u setovima 1:1 igra se nastavlja kroz (super)TieBreak",
    noOfSets: 2,
  },
  {
    id: 2,
    title: "Brzi",
    description:
      "Ovaj tip meča se igra na 9 dobijenih gemova. Pri izjednačenju rezultata na 8:8 igra se nastavlja kroz (super)TieBreak",
    noOfSets: 1,
  },
];

export const MATCH_DEFAULT_OPTIONS = {
  title: "",
  date: "",
  startTime: {
    hour: "00",
    minute: "00",
  },
  type: 0,
  superTieBreak: true,
  players: {
    host: [
      { firstName: "", lastName: "" },
      { firstName: "", lastName: "" },
    ],
    guest: [
      { firstName: "", lastName: "" },
      { firstName: "", lastName: "" },
    ],
  },
  winner: null,
};

export const selectOptions = [
  {
    id: 0,
    status: "Completed",
  },
  {
    id: 1,
    status: "In progress",
  },
  {
    id: 2,
    status: "Paused",
  },
  {
    id: 3,
    status: "Canceled",
  },
  {
    id: 4,
    status: "Warm up",
  },
  {
    id: 5,
    status: "Break",
  },
  {
    id: 6,
    status: "Interrupted",
  },
  {
    id: 7,
    status: "Delayed",
  },
  {
    id: 8,
    status: "Match point",
  },
  {
    id: 9,
    status: "Tie Break",
  },
  {
    id: 10,
    status: "Suspended",
  },
  {
    id: 11,
    status: "Forfeited",
  },
  {
    id: 12,
    status: "Idle",
  },
];
