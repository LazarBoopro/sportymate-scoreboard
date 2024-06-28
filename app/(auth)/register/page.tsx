"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { useToast } from "@/components/ui/use-toast";

import { auth } from "@/lib/firebaseConfig";

import coverImage from "@/public/img/cover.jpg";

import "@/ui/styles/pages/login.page.scss";

export default function Register() {
  const { toast } = useToast();

  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      return toast({
        title: "Greska!",
        description: "Lozinke nisu iste!",
        variant: "destructive",
      });
    }

    try {
      await createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      router.push("/login");
    } catch (error: any) {
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
        <div className="form__content">
          <div className="heading">
            <h1>Registruj se</h1>
            <p>Registruj besplatan nalog.</p>
          </div>
          <form className="form-contetn" onSubmit={handleSubmit}>
            <InputField
              onChange={handleOnChange}
              title="email"
              value={credentials.email}
              placeholder="Email address"
            />
            <InputField
              onChange={handleOnChange}
              title="password"
              value={credentials.password}
              type="password"
              placeholder="Password"
            />
            <InputField
              onChange={handleOnChange}
              title="confirmPassword"
              value={credentials.confirmPassword}
              type="password"
              placeholder="Password"
            />
            <Button type="primary">log in</Button>
          </form>

          <Link href={"/login"}>
            <Button type="transparent">
              Imaš nalog? Prijavi se <u>ovde</u>
            </Button>
          </Link>
        </div>
      </div>

      <div className="decoration">
        <div className="decoration__image">
          <p className="text">
            Sav sport <br />u jednoj aplikaciji
          </p>
          <Image src={coverImage} alt="sportyMate" />
        </div>
      </div>
    </section>
  );
}
