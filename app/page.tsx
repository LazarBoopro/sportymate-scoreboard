"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth, db, database } from "@/lib/firebaseConfig";

import { IoPersonCircleOutline } from "react-icons/io5";

import "@/ui/styles/pages/profile.page.scss";
import { getDatabase, onValue, ref, set } from "firebase/database";
import Button from "@/ui/components/atoms/Button.atom";
import { collection, getDoc, onSnapshot } from "firebase/firestore";
import { get } from "http";
import useTournaments from "@/ui/hooks/useTournaments";
import TournamentCard from "@/ui/components/moleculs/TournamentCard.molecul";

export default function Profile() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userSession = JSON.parse(sessionStorage.getItem("user")!);
  const { tournaments } = useTournaments();
  console.log(tournaments);

  if (!user && !userSession) {
    router.push("/login");
  }

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <>
      <div className="profile">
        <div className="profile__picture">
          <IoPersonCircleOutline />
        </div>

        <p>{user?.email}</p>
      </div>
      <Button onClick={handleLogout} type="primary">
        log out
      </Button>

      {tournaments?.map((n) => (
        <TournamentCard {...n} />
      ))}
    </>
  );
}
