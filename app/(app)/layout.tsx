"use client";

import { Suspense, useEffect, useState } from "react";

import Drawer from "@/ui/components/moleculs/Drawer.molecul";
import Navbar from "@/ui/components/moleculs/Navbar.molecul";

import "@/ui/styles/pages/home.page.scss";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebaseConfig";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);

  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [user]);

  return (
    <>
      <Suspense fallback={null}>
        {showNav && <Navbar />}
        <Drawer title="Tipovi turnira" />
        {children}
      </Suspense>
    </>
  );
}
