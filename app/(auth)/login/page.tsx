"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebaseConfig";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { useToast } from "@/components/ui/use-toast";

import { useUserSignIn } from "@/infrastructure/mutations/user";

import "@/ui/styles/pages/login.page.scss";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const userSession = JSON.parse(sessionStorage.getItem("user")!);
  const [user] = useAuthState(auth);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  if (user && userSession) {
    router.push("/");
  }

  const { mutate: logIn, isError, failureReason } = useUserSignIn();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    logIn(credentials);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const checkFailureMessage = (message?: string | undefined) => {
    switch (message) {
      case "auth/wrong-password":
        return "Pogrešna lozinka";

      case "auth/user-not-found":
        return "Nepostojeći korisnik";

      case "auth/too-many-requests":
        return "Previše pokušaja";

      case "auth/missing-password":
        return "Unesi lozinku";

      case "auth/invalid-credential":
        return "Email ili šifra nisu tačni";

      default:
        return "Javila se nepoznata greška!";
    }
  };

  useEffect(() => {
    isError &&
      toast({
        title: "Greska!",
        // @ts-ignore
        description: checkFailureMessage(failureReason?.code),
        variant: "destructive",
      });
  }, [isError]);

  return (
    <section className="login">
      <div className="form">
        <div className="heading">
          <h1>Dobrodošli nazad</h1>
          <p>Unesi svoj email i lozinku kako biste pristupili nalogu</p>
        </div>
        <form className="form__form" onSubmit={handleSubmit}>
          <InputField
            onChange={handleOnChange}
            title="email"
            value={credentials.email}
            placeholder="Email address"
          />
          <InputField
            onChange={handleOnChange}
            title="password"
            type="password"
            value={credentials.password}
            placeholder="Password"
          />
          <Button type="primary">log in</Button>
        </form>

        <Link href={"/register"}>
          <Button type="transparent">
            Registruj se <u>ovde</u>{" "}
          </Button>
        </Link>
      </div>
    </section>
  );
}
