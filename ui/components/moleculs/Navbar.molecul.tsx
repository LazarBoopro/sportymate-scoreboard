"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Button from "@/ui/components/atoms/Button.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { useSignOutUser } from "@/infrastructure/mutations/user";

import { IoLogOutOutline, IoPersonCircleOutline } from "react-icons/io5";
import logo from "@/public/img/logo.svg";

import "@/ui/styles/moleculs/navbar.molecul.scss";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const userSession = JSON.parse(sessionStorage.getItem("user")!);
  const [user] = useAuthState(auth);

  const { mutate: signOut, isSuccess } = useSignOutUser();

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/login");
    }

    if (isSuccess) {
      router.push("/login");
    }
  }, [isSuccess]);

  return (
    <nav className="navigation">
      <div className="navigation__user">
        <div className="picture">
          <Link href={"/"}>
            <Image src={logo} alt="sportyMate" />
          </Link>
        </div>
        |<p className="user">{user?.email}</p>
      </div>
      <div className="navigation__ctas">
        <Button onClick={signOut} type="danger">
          Odjavi se
          <IoLogOutOutline />
        </Button>
      </div>
    </nav>
  );
}
