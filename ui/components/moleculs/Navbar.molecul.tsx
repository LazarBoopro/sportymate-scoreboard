"use client";

import { useContext, useEffect, useState } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import Button from "@/ui/components/atoms/Button.atom";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

import { useSignOutUser } from "@/infrastructure/mutations/user";

import {
  IoLogOutOutline,
  IoMenuOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import logo from "@/public/img/logo.svg";

import "@/ui/styles/moleculs/navbar.molecul.scss";
import Image from "next/image";
import Link from "next/link";
import Context from "@/ui/providers/NavbarContext.provider";

export default function Navbar() {
  const router = useRouter();
  const [userSession, setUserSession] = useState<string | null>(null);
  const [user] = useAuthState(auth);
  const s = useSearchParams();

  useEffect(() => {
    typeof sessionStorage !== "undefined"
      ? setUserSession(JSON.parse(sessionStorage?.getItem("user")!))
      : null;
  }, []);

  const { showNavbar } = useContext(Context);

  const [isOpenedNav, setIsOpenedNav] = useState(false);

  const { mutate: signOut, isSuccess } = useSignOutUser();

  useEffect(() => {
    if (!user && !userSession) {
      router.push("/login");
    }

    if (isSuccess) {
      router.push("/login");
    }
  }, [isSuccess]);

  const handleClick = () => {
    setIsOpenedNav((prev) => !prev);
  };

  return (
    (!showNavbar || !s.get("watch")) && (
      <>
        <nav className={`navigation ${!s.get("watch") ? "none" : ""}`}>
          <div className="navigation__header">
            <Link href={"/"}>
              <Image src={logo} alt="sportyMate" />
            </Link>

            <Button type="transparent" onClick={handleClick}>
              <IoMenuOutline />
            </Button>
          </div>

          <div
            className={`navigation__body ${
              isOpenedNav === true ? "active" : ""
            }`}
          >
            <p className="user">
              <IoPersonCircleOutline /> {user?.email}
            </p>

            <Button onClick={signOut} type="danger">
              Odjavi se
              <IoLogOutOutline />
            </Button>
          </div>
        </nav>
        <AnimatePresence>
          {isOpenedNav && (
            <motion.div
              onClick={handleClick}
              initial={{
                // height: 0,
                opacity: 0,
              }}
              animate={{
                // height: "100vh",
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                // height: 0,
              }}
              className={`overlay ${isOpenedNav ? "active" : ""}`}
            ></motion.div>
          )}
        </AnimatePresence>
      </>
    )
  );
}
