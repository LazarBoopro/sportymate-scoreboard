import { motion } from "framer-motion";

import "@/ui/styles/atoms/watchStatus.atom.scss";
import BubbleAnimations from "./BubbleAnimation.atom";

const duration = 0.2;
const stagger = 0.025;

export default function WatchStatus({
  status,
}: {
  status: string | undefined;
}) {
  return (
    <>
      <section className="watch-message">
        <motion.div
          className="wrapper"
          initial="initial"
          animate="animated"
          transition={{
            delayChildren: 2,
            repeat: Infinity,
            repeatType: "mirror",
            duration: 2,
            repeatDelay: 1,
          }}
        >
          <div>
            {status?.split("").map((n, i) => {
              return (
                <motion.span
                  key={i}
                  transition={{
                    duration,
                    ease: "easeInOut",
                    delay: stagger * i,
                  }}
                  variants={{
                    initial: { y: 0 },
                    animated: { y: "-100%" },
                  }}
                >
                  {n}
                </motion.span>
              );
            })}
          </div>
          <div>
            {status?.split("").map((n, i) => {
              return (
                <motion.span
                  key={i}
                  transition={{
                    duration,
                    ease: "easeInOut",
                    delay: stagger * i,
                  }}
                  variants={{
                    initial: { y: "100%" },
                    animated: { y: 0 },
                  }}
                >
                  {n}
                </motion.span>
              );
            })}
          </div>
        </motion.div>
        <BubbleAnimations />
      </section>
    </>
  );
}
