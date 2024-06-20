"use client";

import { TeamType } from "@/interfaces/tournaments";
import InputField from "@/ui/components/atoms/InputField.atom";
import Navbar from "@/ui/components/moleculs/Navbar.molecul";

import Tournamets from "@/ui/components/organism/Tournaments.organism";

import { Calendar } from "@/components/ui/calendar";
import "@/ui/styles/pages/profile.page.scss";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <Tournamets />
        <TournamentForm />
      </div>
    </>
  );
}

type TournamentType = {
  title?: string;
  startTime?: string;
  status?: string;
  host?: TeamType;
  guest?: TeamType;
};

function TournamentForm() {
  const [data, setData] = useState<TournamentType>({
    title: "",
    startTime: dayjs().format("DD.MM.YYYY HH:mm").toString(),
    status: "",
    host: {
      players: [],
    },
    guest: {
      players: [],
    },
  });

  console.log(data.startTime);

  const handleOnChange = (e: any) => {
    console.log(e.target.name);
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  // TODO:ADD TIME PICKER
  return (
    <div className="tournament-form">
      <h2>Dodaj turnir</h2>
      <div className="tournament-form__form">
        <InputField
          onChange={handleOnChange}
          title="Naziv turnira"
          value={data?.title || ""}
          placeholder="Naziv turnira"
        />
        <InputField
          onChange={handleOnChange}
          title="email"
          value={data?.title || ""}
          placeholder="Email address"
        />
        <InputField
          onChange={handleOnChange}
          title="Datum"
          type="date"
          value={data?.startTime?.split(" ")[0] || ""}
          placeholder="Datum"
        />
        <div className="time-picker">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          {/* <InputField
            onChange={handleOnChange}
            title="Sat"
            type="date"
            value={data?.startTime?.split(" ")[1].split(":")[0] || ""}
            placeholder="Datum"
          /> */}
        </div>
      </div>
    </div>
  );
}
