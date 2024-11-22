import "@/ui/styles/atoms/button.atom.scss";
import { MouseEventHandler } from "react";

type ButtonType = {
  children: React.ReactNode;
  type?: "primary" | "secondary" | "transparent" | "danger" | "action" | "fade";
  onClick?: (() => void) | (() => Promise<void>);
  className?: string;
  style?: string;
};

export default function Button({
  children,
  type = "primary",
  className,
  style,
  onClick,
}: ButtonType) {
  return (
    <button
      onClick={() => (onClick ? onClick() : null)}
      className={`button ${type} ${className} ${style} `}
    >
      {children}
    </button>
  );
}
