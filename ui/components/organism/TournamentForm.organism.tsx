"use client";

import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { auth } from "@/lib/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

import InputField from "@/ui/components/atoms/InputField.atom";
import Button from "@/ui/components/atoms/Button.atom";

import { useAddTournament } from "@/infrastructure/mutations/tournaments";

import {
  PlayerType,
  TournamentType,
  TournamentTypeService,
} from "@/interfaces/tournaments";

import { IoChevronBack } from "react-icons/io5";

import "@/ui/styles/organism/tournamentForm.organism.scss";

export default function TournamentForm() {
  const ref = useRef<HTMLDivElement | null>(null);

  const user = useAuthState(auth);
  const [isDouble, setIsDouble] = useState(true);
  const [data, setData] = useState<TournamentType>({
    title: "",
    date: "",
    startTime: {
      hour: "00",
      minute: "00",
    },
    players: {
      host: [
        { firstName: "", lastName: "" },
        { firstName: "", lastName: "" },
      ],
      guest: [
        { firstName: "", lastName: "" },
        { firstName: "", lastName: "" },
      ],
    },
  });

  const { mutate: addTournament, isSuccess } = useAddTournament();

  const handleOnChange = (e: any) => {
    const { name, value } = e.target;

    const [field, index, subField] = name.split(".");

    if (subField !== undefined && index !== undefined) {
      return setData((prevData) => ({
        ...prevData,
        players: {
          ...prevData.players,
          [field]: prevData.players[field as keyof typeof prevData.players].map(
            (n: PlayerType, i: number) =>
              i === Number(index) ? { ...n, [subField]: value } : n
          ),
        },
      }));
    }

    if (index !== undefined) {
      return setData((prevData) => ({
        ...prevData,
        startTime: {
          ...prevData.startTime,
          [index]: value,
        },
      }));
    }

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const payload: TournamentTypeService = {
      matchId: Math.floor(Math.random() * 100),
      userId: user?.[0]?.uid!,
      title: data.title,
      startTime: `${data.date} ${data.startTime?.hour}:${data.startTime?.minute}`,
      status: {
        id: 12,
        status: "idle",
      },
      players: data.players,
      score: {
        currentSet: [0, 0],
        sets: [
          {
            [0]: 0,
            [1]: 0,
          },
        ],
        tiebreak: [0, 0],
      },
    };

    addTournament(payload);
  };

  const resetForm = () => {
    setData({
      title: "",
      date: "",
      startTime: {
        hour: "00",
        minute: "00",
      },
      players: {
        host: [
          { firstName: "", lastName: "" },
          { firstName: "", lastName: "" },
        ],
        guest: [
          { firstName: "", lastName: "" },
          { firstName: "", lastName: "" },
        ],
      },
    });
  };

  const handleClick = () => {
    const parent = ref.current?.parentElement;

    parent?.children[0].scrollIntoView();
  };

  return (
    <div ref={ref} id="add-tournaments" className="tournament-form">
      <div className="header">
        <Button onClick={handleClick} className="cta-slide" type="fade">
          <IoChevronBack />
          Turniri
        </Button>
        <h2 className="title">Dodaj turnir</h2>
      </div>
      <form onSubmit={handleSubmit} className="tournament-form__form">
        <InputField
          onChange={handleOnChange}
          title="Naziv turnira"
          name="title"
          placeholder="Naziv turnira"
          value={data?.title ?? ""}
          required
        />

        <InputField
          name="date"
          onChange={handleOnChange}
          title="Datum"
          type="date"
          value={data?.date}
          placeholder="Datum"
          required
        />
        <div className="inline">
          <div className="time-picker">
            <p>Vreme</p>
            <div className="selects">
              <select
                onChange={handleOnChange}
                className="select hours"
                name="startTime.hour"
                defaultValue={data.startTime?.hour}
                required
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
              :
              <select
                onChange={handleOnChange}
                className="select minutes"
                name="startTime.minute"
                defaultValue={data.startTime?.minute}
                required
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i} value={5 * i}>
                    {(5 * i).toString().padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <InputField
            onChange={() => setIsDouble((prev) => !prev)}
            title="Dabl"
            value={isDouble}
            name="isDouble"
            type="switch"
          />
        </div>
        <br />
        <div className="team">
          <p className="team__title">Domaćin</p>

          <div className="team__players">
            <div className="player">
              <InputField
                onChange={handleOnChange}
                title="Ime"
                name="host.0.firstName"
                value={data?.players.host?.[0].firstName ?? ""}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChange}
                title="Prezime"
                name="host.0.lastName"
                value={data?.players.host?.[0].lastName ?? ""}
                placeholder="Prezime"
                required
              />
            </div>
            <AnimatePresence mode="popLayout" presenceAffectsLayout>
              {isDouble && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="player"
                >
                  <InputField
                    onChange={handleOnChange}
                    title="Ime"
                    name="host.1.firstName"
                    value={data?.players.host?.[1].firstName ?? ""}
                    placeholder="Ime"
                    required
                  />
                  <InputField
                    onChange={handleOnChange}
                    title="Prezime"
                    name="host.1.lastName"
                    value={data?.players.host?.[1].lastName ?? ""}
                    placeholder="Prezime"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <br />
        <div className="team">
          <p className="team__title">Gost</p>

          <div className="team__players">
            <div className="player">
              <InputField
                onChange={handleOnChange}
                title="Ime"
                name="guest.0.firstName"
                value={data?.players.guest?.[0].firstName ?? ""}
                placeholder="Ime"
                required
              />
              <InputField
                onChange={handleOnChange}
                title="Prezime"
                name="guest.0.lastName"
                value={data?.players.guest?.[0].lastName ?? ""}
                placeholder="Prezime"
                required
              />
            </div>
            <AnimatePresence mode="popLayout" presenceAffectsLayout>
              {isDouble && (
                <motion.div
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="player"
                >
                  <InputField
                    onChange={handleOnChange}
                    title="Ime"
                    name="guest.1.firstName"
                    value={data?.players.guest?.[1].firstName ?? ""}
                    placeholder="Ime"
                    required
                  />
                  <InputField
                    onChange={handleOnChange}
                    title="Prezime"
                    name="guest.1.lastName"
                    value={data?.players.guest?.[1].lastName ?? ""}
                    placeholder="Prezime"
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <br />

        <Button className="submit">Dodaj turnir</Button>
      </form>
    </div>
  );
}
