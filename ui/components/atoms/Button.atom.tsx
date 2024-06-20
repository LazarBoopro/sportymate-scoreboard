import "@/ui/styles/atoms/button.atom.scss";
import { MouseEventHandler } from "react";

type ButtonType = {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "transparent" | "danger";
  onClick?: (() => void) | (() => Promise<void>);
};

export default function Button({
  children,
  type = "primary",
  onClick,
}: ButtonType) {
  return (
    <button
      onClick={() => (onClick ? onClick() : null)}
      className={`button ${type}`}
    >
      {children}
    </button>
  );
}
