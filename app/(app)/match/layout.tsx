import { Suspense } from "react";

export default function MatchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>{children}</Suspense>
    </>
  );
}
