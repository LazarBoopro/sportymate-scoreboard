import { scores } from "@/lib/helpers/score";
import Image from "next/image";
import liveLogo from "@/public/img/logo.svg";
import { MatchType } from "@/interfaces/matches";
import { IoTennisball } from "react-icons/io5";
import { useContext } from "react";
import Context from "@/ui/providers/NavbarContext.provider";

export default function WatchTVOverlay({
  match,
  isTieBreak,
}: {
  match: MatchType;
  isTieBreak: boolean;
}) {
  const isPlayersUndefined =
    typeof match?.players?.guest?.player1?.firstName === "undefined";

  // const {match} = useContext(Context)

  console.log({ match });

  return (
    <section className="tv-overlay">
      <Image src={liveLogo} alt="S" />
      <div className="table">
        {isPlayersUndefined ? (
          <p style={{ padding: "1rem .5rem" }}>Učitavam...</p>
        ) : (
          <>
            <div className="table__team">
              <div className="players">
                <p className="player">
                  {match?.players?.host?.player1?.serving && (
                    <IoTennisball className="ball_icon" />
                  )}
                  <span>
                    {`${match?.players?.host?.player1?.firstName?.[0]}. ${match?.players?.host?.player1?.lastName}`}
                  </span>
                </p>
                <p className="player">
                  {match?.players?.host?.player2?.serving && (
                    <IoTennisball className="ball_icon" />
                  )}
                  <span>
                    {" "}
                    {`${match?.players?.host?.player2?.firstName?.[0]}. ${match?.players?.host?.player2?.lastName}`}
                  </span>
                </p>
              </div>
              <div className="score">
                {/* <p className="current-gem">
            {scores[match?.score?.currentSet?.[0]!]}
            </p> */}
                <div className="sets">
                  {match?.score?.sets.map((n, i) => (
                    <p
                      key={i}
                      className={`set ${
                        i === match.score?.sets?.length! - 1 && !match?.winner
                          ? "active"
                          : (match.score?.sets?.[i]?.[0] ?? 0) <
                            (match.score?.sets?.[i]?.[1] ?? 0)
                          ? "prev"
                          : ""
                      }`}
                    >
                      {n[0]}
                    </p>
                  ))}
                </div>
                <p className="current-set">
                  {isTieBreak
                    ? match?.score?.tiebreak[0] ?? 0
                    : scores?.[match?.score?.currentSet[0] ?? 0]}

                  {/* {match?.score?.sets?.[match?.score?.sets?.length - 1][0]} */}
                </p>
              </div>
            </div>
            <div className="table__team">
              <div className="players">
                <p className="player">
                  {match?.players?.guest?.player1?.serving && (
                    <IoTennisball className="ball_icon" />
                  )}
                  <span>
                    {`${match?.players?.guest?.player1?.firstName?.[0]}. ${match?.players?.guest?.player1?.lastName}`}
                  </span>
                </p>
                <p className="player">
                  {match?.players?.guest?.player2?.serving && (
                    <IoTennisball className="ball_icon" />
                  )}
                  <span>
                    {`${match?.players?.guest?.player2?.firstName?.[0]}. ${match?.players?.guest?.player2?.lastName}`}
                  </span>
                </p>
              </div>
              <div className="score">
                {/*
                <p className="current-gem">
                    {scores[match?.score?.currentSet?.[1]!]}
                </p> 
                */}
                <div className="sets">
                  {match?.score?.sets.map((n, i) => (
                    <p
                      key={i}
                      className={`set ${
                        i === match.score?.sets?.length! - 1 && !match?.winner
                          ? "active"
                          : (match.score?.sets?.[i]?.[0] ?? 0) >
                            (match.score?.sets?.[i]?.[1] ?? 0)
                          ? "prev"
                          : ""
                      }`}
                    >
                      {n[1]}
                    </p>
                  ))}
                </div>
                <p className={`current-set`}>
                  {isTieBreak
                    ? match?.score?.tiebreak[1] ?? 0
                    : scores?.[match?.score?.currentSet[1] ?? 0]}

                  {/* {match?.score?.sets?.[match?.score?.sets?.length - 1][1]} */}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
