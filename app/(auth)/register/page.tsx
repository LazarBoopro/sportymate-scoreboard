"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Button from "@/ui/components/atoms/Button.atom";
import InputField from "@/ui/components/atoms/InputField.atom";
import { useToast } from "@/components/ui/use-toast";

import { useRegisterUser } from "@/infrastructure/mutations/user";

import { checkFailureMessage } from "@/lib/helpers/messages";

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

  const onSuccess = () => {
    router.push("/login");
  };

  const {
    mutate: register,
    isError,
    error,
    isPending,
  } = useRegisterUser(onSuccess);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      return toast({
        title: "Greska!",
        description: "Lozinke nisu iste!",
        variant: "destructive",
      });
    }

    register({ email: credentials.email, password: credentials.password });
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (isError) {
      toast({
        title: "Greška!",
        description: checkFailureMessage(error.message),
        variant: "destructive",
      });
    }
  }, [error]);

  return (
    <section className="login">
      <div className="form">
        <div className="form__content">
          <div className="heading">
            <h1>Registruj se</h1>
            <p>Registruj besplatan nalog.</p>
          </div>
          <form className="form-content" onSubmit={handleSubmit}>
            <InputField
              onChange={handleOnChange}
              title="email"
              name="email"
              type="email"
              value={credentials.email}
              placeholder="example@example.com"
            />
            <InputField
              onChange={handleOnChange}
              title="Lozinka"
              name="password"
              value={credentials.password}
              type="password"
              placeholder="••••••••••••••"
            />
            <InputField
              onChange={handleOnChange}
              title="Ponovi lozinku"
              name="confirmPassword"
              value={credentials.confirmPassword}
              type="password"
              placeholder="••••••••••••••"
            />
            <Button type="primary" className={isPending ? "pending" : ""}>
              Registruj se
            </Button>
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
