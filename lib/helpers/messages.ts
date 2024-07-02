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

    case "auth/email-already-in-use":
      return "Korisnik sa ovim email-om već postoji";

    default:
      return "Javila se nepoznata greška!";
  }
};
