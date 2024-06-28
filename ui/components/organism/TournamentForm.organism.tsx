"use client";

import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";

import { auth } from "@/lib/firebaseConfig";

import { useAuthState } from "react-firebase-hooks/auth";
import InputField from "@/ui/components/atoms/InputField.atom";
import Button from "@/ui/components/atoms/Button.atom";

import { useAddTournament } from "@/infrastructure/mutations/tournaments";
import { PlayerType } from "@/interfaces/tournaments";

import "@/ui/styles/organism/tournamentForm.organism.scss";
import { IoChevronBack, IoTennisballOutline } from "react-icons/io5";

type TournamentType = {
  title?: string;
  startTime?: {
    hour: string;
    minute: string;
  };
  status?: {
    id: number;
    status:
      | "idle"
      | "inProgress"
      | "paused"
      | "warmup"
      | "over"
      | "matchPoint"
      | "tieBreak"
      | "delayed"
      | "intermission"
      | "idle";
  };

  date?: string;
  players: {
    host?: PlayerType[];
    guest?: PlayerType[];
  };
  score: {
    currentSet: number[];
    sets: {
      [key: number]: number;
    }[];
  };
};

export default function TournamentForm() {
  const user = useAuthState(auth);

  const [isDouble, setIsDouble] = useState(true);
  const [data, setData] = useState<TournamentType>({
    title: "",
    date: "",
    startTime: {
      hour: dayjs().hour().toString(),
      minute: dayjs().minute().toString(),
    },
    status: {
      id: 12,
      status: "idle",
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
    score: {
      currentSet: [0, 0],
      sets: [
        {
          [0]: 0,
          [1]: 0,
        },
      ],
    },
  });

  const { mutate: addTournament, isSuccess } = useAddTournament();
  const handleOnChange = (e: any) => {
    const { name, value } = e.target;

    const [field, index, subField] = name.split(".");

    if (index !== undefined && subField !== undefined) {
      setData((prevData) => ({
        ...prevData,
        players: {
          ...prevData.players,
          // @ts-ignore
          [field]: prevData.players[field as string].map(
            (player: PlayerType, i: number) =>
              i === Number(index) ? { ...player, [subField]: value } : player
          ),
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      resetForm();
    }
  }, [isSuccess]);

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    const payload = {
      matchId: Math.floor(Math.random() * 100),
      userId: user?.[0]?.uid,
      title: data.title,
      startTime: `${data.date} ${data.startTime?.hour}:${data.startTime?.minute}`,
      status: data.status,
      players: data.players,
      score: data.score,
    };

    // @ts-ignore
    addTournament(payload);
  };

  const resetForm = () => {
    setData({
      title: "",
      date: "",
      startTime: {
        hour: dayjs().hour().toString(),
        minute: dayjs().minute().toString(),
      },
      status: {
        status: "idle",
        id: 12,
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
      score: {
        currentSet: [0, 0],
        sets: [
          {
            [0]: 0,
            [1]: 0,
          },
        ],
      },
    });
  };

  const ref = useRef<HTMLDivElement | null>(null);

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
                className="select hours"
                defaultValue={data.startTime?.hour}
                required
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i}>{(i + 1).toString().padStart(2, "0")}</option>
                ))}
              </select>
              :
              <select
                className="select minutes"
                defaultValue={data.startTime?.minute}
                required
              >
                {Array.from({ length: 60 }).map((_, i) => (
                  <option key={i}>{i.toString().padStart(2, "0")}</option>
                ))}
              </select>
            </div>
          </div>
          {/* | */}
          <InputField
            onChange={() => setIsDouble((prev) => !prev)}
            title="Dabl"
            value={isDouble}
            name="isDouble"
            type="switch"
          />
        </div>

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