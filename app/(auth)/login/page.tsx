"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  useAuthState,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebaseConfig";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { useToast } from "@/components/ui/use-toast";

import "@/ui/styles/pages/login.page.scss";

export default function Login() {
  const { toast } = useToast();
  const router = useRouter();

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const userSession = JSON.parse(sessionStorage.getItem("user")!);
  const [user] = useAuthState(auth);

  if (user && userSession) {
    router.push("/");
  }

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(credentials.email, credentials.password);
      sessionStorage.setItem("user", JSON.stringify(user));
      router.push("/");
    } catch (error: any) {
      console.log("uso");
      toast({
        title: "Greska!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

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
