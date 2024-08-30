"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "@/lib/firebaseConfig";

import logo from "@/public/img/logo.svg";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (!user && !loading) {
      router.replace("/login");
      return;
    }

    setIsLoading(false);
  }, [user, loading]);

  if (isLoading) {
    return (
      <main className="loading-screen">
        <Image src={logo} alt="SportyMate" />
        <div className="loader"></div>
      </main>
    );
  }

  return <>{children}</>;
}
