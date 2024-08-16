"use client";

import { IoHelp } from "react-icons/io5";

import "@/ui/styles/moleculs/tabs.molecul.scss";
import { useContext } from "react";
import Context from "@/ui/providers/NavbarContext.provider";
import { MATCH_TYPES } from "@/lib/constants/match";

export default function Tabs({
  onChange,
  title,
  name,
  selected,
}: {
  selected: number;
  onChange: (e: any) => void;
  title: string;
  name: string;
  type: string;
}) {
  const { setIsDrawerOpened } = useContext(Context);

  return (
    <article className="tabs">
      <div className="tabs__title">
        <p className="title">{title}</p>
        <p className="help" onClick={() => setIsDrawerOpened(true)}>
          <IoHelp />
        </p>
      </div>

      <div className="tabs__body">
        {MATCH_TYPES.map((n, i) => (
          <button
            key={i}
            type="button"
            name={name}
            value={i}
            onClick={onChange}
            className={`option ${selected == i ? "selected-opt" : ""}`}
          >
            {n.title}
          </button>
        ))}
      </div>
    </article>
  );
}
