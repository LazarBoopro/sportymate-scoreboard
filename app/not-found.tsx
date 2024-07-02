"use client";

import Link from "next/link";
import Image from "next/image";

import BubbleAnimations from "@/ui/components/atoms/BubbleAnimation.atom";
import Button from "@/ui/components/atoms/Button.atom";

import logo from "@/public/img/logoGreen.svg";

import { IoHomeOutline } from "react-icons/io5";
import "@/ui/styles/pages/not-found.scss";

export default function GlobalErrorPage() {
  return (
    <main className="error-page">
      <div className="error-page__wrapper">
        <h1>Traženi sadržaj ne postoji </h1>

        <Link href={"/"}>
          <Button type="secondary">
            Početna strana <IoHomeOutline />
          </Button>
        </Link>
      </div>
      <BubbleAnimations />
      <Image src={logo} alt="SportyMate" />
    </main>
  );
}
