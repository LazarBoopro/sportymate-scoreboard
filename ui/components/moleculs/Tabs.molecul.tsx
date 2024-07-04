"use client";

import { IoHelp } from "react-icons/io5";

import "@/ui/styles/moleculs/tabs.molecul.scss";
import { useContext } from "react";
import Context from "@/ui/providers/NavbarContext.provider";

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
        {typeOptions.map((n, i) => (
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

const typeOptions = [
  {
    id: 1,
    title: "Standardni",
  },
  {
    id: 2,
    title: "Playoff",
  },
  {
    id: 3,
    title: "Grupna faza",
  },
];
