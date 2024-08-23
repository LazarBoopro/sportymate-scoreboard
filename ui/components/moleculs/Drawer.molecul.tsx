"use client";

import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Button from "../atoms/Button.atom";

import { IoCloseCircleOutline } from "react-icons/io5";

import "@/ui/styles/moleculs/drawer.molecul.scss";
import Context from "@/ui/providers/NavbarContext.provider";
import { MATCH_TYPES } from "@/lib/constants/match";

export default function Drawer({
  title,
}: //   children,
{
  title: string;
  //   children: React.ReactNode;
}) {
  const { isDrawerOpened, setIsDrawerOpened } = useContext(Context);
  const [screenWidth, setScreenWidth] = useState(
    (typeof window !== "undefined" && window.innerWidth) || 0
  );

  const animationProps = screenWidth > 600 ? { x: "-100%" } : { y: "100%" };
  const initialProps = screenWidth > 600 ? { x: 0 } : { y: 0 };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isDrawerOpened && (
          <motion.article
            transition={{
              ease: "easeInOut",
            }}
            initial={{
              ...animationProps,
            }}
            animate={{
              ...initialProps,
            }}
            exit={{
              ...animationProps,
            }}
            className={`drawer ${isDrawerOpened ? "opened" : ""}`}
          >
            <div className="drawer__title">
              <p>{title}</p>
              <Button type="danger" onClick={() => setIsDrawerOpened(false)}>
                <IoCloseCircleOutline />
              </Button>
            </div>
            <div className="drawer__body">
              {/* {children} */}
              {/* TEMPORARY HERE */}
              <ul className="match-type">
                {MATCH_TYPES.map((n, i) => (
                  <li key={i} className="type">
                    <p className="type__title">{n.title}</p>
                    <p className="type__description">{n.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDrawerOpened && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 0.8,
            }}
            exit={{
              opacity: 0,
            }}
            className="backdrop"
            onClick={() => setIsDrawerOpened(false)}
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
