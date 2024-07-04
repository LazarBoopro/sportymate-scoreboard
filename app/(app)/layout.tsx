import Drawer from "@/ui/components/moleculs/Drawer.molecul";
import Navbar from "@/ui/components/moleculs/Navbar.molecul";
import { Suspense } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Drawer title="Tipovi turnira" />
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>
      {children}
    </>
  );
}
