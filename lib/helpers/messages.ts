export const checkFailureMessage = (message?: string | undefined): string => {
  let tempString;

  if (message !== undefined) {
    const s = message?.indexOf("(") + 1;
    const e = message?.indexOf(")");

    tempString = message?.substring(s, e);
  }

  switch (tempString) {
    case "auth/wrong-password":
      return "Pogrešna lozinka";

    case "auth/user-not-found":
      return "Nepostojeći korisnik";

    case "auth/too-many-requests":
      return "Previše pokušaja";

    case "auth/missing-password":
      return "Unesi lozinku";

    case "auth/invalid-credential":
    case "auth/invalid-email":
      return "Email ili šifra nisu tačni";

    default:
      return "Javila se nepoznata greška!";
  }
};

export const checkStatusMessage = (message: string) => {
  const statusMessage = message.toLowerCase().replace(" ", "");

  switch (statusMessage) {
    case "idle":
      return "U pripremi";

    case "inprogress":
      return "U toku";

    case "completed":
      return "Završeno";

    case "paused":
      return "Pauzirano";

    case "warmup":
      return "Zagrevanje";

    case "break":
      return "Pauza";

    case "interrupted":
      return "Prekinuto";

    case "delayed":
      return "Odloženo";

    case "matchpoint":
      return "Meč lopta";

    case "tiebreak":
      return "Tie Break";

    case "suspended":
      return "Obustavljen";

    case "forfeited":
      return "Predat";

    case "canceled":
      return "Otkazano";
  }
};
