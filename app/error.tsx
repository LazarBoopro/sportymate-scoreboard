"use client";

import Image from "next/image";

import BubbleAnimations from "@/ui/components/atoms/BubbleAnimation.atom";
import Button from "@/ui/components/atoms/Button.atom";

import logo from "@/public/img/logoGreen.svg";

import { IoHomeOutline } from "react-icons/io5";
import "@/ui/styles/pages/not-found.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="error-page">
      <div className="error-page__wrapper">
        <h1>Ups... Dogodila se greška </h1>

        <Button onClick={() => reset()} type="secondary">
          Pokušaj ponovo <IoHomeOutline />
        </Button>
      </div>
      <BubbleAnimations />
      <Image src={logo} alt="SportyMate" />
    </main>
  );
}
