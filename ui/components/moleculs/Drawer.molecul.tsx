"use client";

import { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Button from "../atoms/Button.atom";

import { IoCloseCircleOutline } from "react-icons/io5";

import "@/ui/styles/moleculs/drawer.molecul.scss";
import Context from "@/ui/providers/NavbarContext.provider";

export default function Drawer({
  title,
}: //   children,
{
  title: string;
  //   children: React.ReactNode;
}) {
  const { isDrawerOpened, setIsDrawerOpened } = useContext(Context);

  return (
    <>
      <AnimatePresence>
        {isDrawerOpened && (
          <motion.article
            className="drawer"
            transition={{
              type: "keyframes",
            }}
            initial={{
              y: "100%",
            }}
            animate={{
              y: "0%",
            }}
            exit={{
              y: "100%",
            }}
          >
            <div className="drawer__title">
              <p>{title}</p>
              <Button type="danger" onClick={() => setIsDrawerOpened(false)}>
                <IoCloseCircleOutline />
              </Button>
            </div>
            <div className="drawer__body">
              {/* {children} */}
              <ul className="match-type">
                <li className="type">
                  <p className="type__title">Standardni</p>
                  <p className="type__description">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id
                    numquam maiores tenetur, nam sit accusamus at vero
                    necessitatibus possimus obcaecati?
                  </p>
                </li>
                <li className="type">
                  <p className="type__title">Standardni</p>
                  <p className="type__description">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id
                    numquam maiores tenetur, nam sit accusamus at vero
                    necessitatibus possimus obcaecati?
                  </p>
                </li>
                <li className="type">
                  <p className="type__title">Standardni</p>
                  <p className="type__description">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id
                    numquam maiores tenetur, nam sit accusamus at vero
                    necessitatibus possimus obcaecati?
                  </p>
                </li>
              </ul>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
      {isDrawerOpened && (
        <div
          className="backdrop"
          onClick={() => setIsDrawerOpened(false)}
        ></div>
      )}
    </>
  );
}
