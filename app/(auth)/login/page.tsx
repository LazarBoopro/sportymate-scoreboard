"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebaseConfig";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { useToast } from "@/components/ui/use-toast";

import { useUserSignIn } from "@/infrastructure/mutations/user";

import { checkFailureMessage } from "@/lib/helpers/messages";

import coverImage from "@/public/img/cover.jpg";

import "@/ui/styles/pages/login.page.scss";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const [user] = useAuthState(auth);
  const [userSession, setUserSession] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    typeof sessionStorage !== "undefined"
      ? setUserSession(JSON.parse(sessionStorage?.getItem("user")!))
      : null;
  }, []);

  useEffect(() => {
    if (user && userSession) {
      router.push("/");
    }
  }, [user, userSession]);

  const onSuccessLogin = () => {
    router.replace("/");
  };

  const {
    mutate: logIn,
    isError,
    error,
    isPending,
  } = useUserSignIn(onSuccessLogin);

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

  useEffect(() => {
    isError &&
      toast({
        title: "Greška!",
        description: checkFailureMessage(error?.message),
        variant: "destructive",
      });
  }, [isError]);

  return (
    <section className="login">
      <div className="form">
        <div className="form__content">
          <div className="heading">
            <h1>Dobrodošli nazad</h1>
            <p>Unesi svoj email i lozinku kako biste pristupili nalogu</p>
          </div>
          <form className="form-content" onSubmit={handleSubmit}>
            <InputField
              onChange={handleOnChange}
              title="email"
              value={credentials.email}
              placeholder="Email adresa"
            />
            <InputField
              onChange={handleOnChange}
              title="Lozinka"
              name="password"
              type="password"
              value={credentials.password}
              placeholder="••••••••••••••"
            />
            <Button className={isPending ? "pending" : ""}>Uloguj se</Button>
          </form>

          <Link href={"/register"}>
            <Button type="transparent">
              Registruj se <u>ovde</u>{" "}
            </Button>
          </Link>
        </div>
      </div>

      <div className="decoration">
        <div className="decoration__image">
          <p className="text">
            Sav sport <br />u jednoj aplikaciji
          </p>
          <Image
            priority={false}
            src={coverImage}
            placeholder="blur"
            alt="sportyMate"
          />
        </div>
      </div>
    </section>
  );
}
