import BubbleAnimations from "@/ui/components/atoms/BubbleAnimation.atom";
import Image from "next/image";

import logo from "@/public/img/logoGreen.svg";

import "@/ui/styles/pages/watch.page.scss";

export default function TvLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="watch-tv">
      <Image src={logo} alt="SportyMate" />
      {children}
      <BubbleAnimations />
    </main>
  );
}
