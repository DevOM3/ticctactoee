import { motion } from "framer-motion";
import { useEffect } from "react";
import { actionTypes } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import "./PlayerInfo.css";

interface PlayerInfoInterface {
  id: string | undefined;
  name: string | undefined;
  score: number | undefined;
  side: string;
}

const PlayerInfo = ({ id, name, score, side }: PlayerInfoInterface) => {
  const [{ userID }, dispatch] = useStateValue();

  useEffect(() => {
    const userIDFromLocalStorage = localStorage.getItem("userID");
    if (userIDFromLocalStorage) {
      dispatch({
        type: actionTypes.SET_USER_ID,
        userID: userIDFromLocalStorage,
      });
    }
  }, []);

  return (
    <motion.div
      style={{
        borderTopLeftRadius: side === "right" ? 51 : 0,
        borderBottomLeftRadius: side === "right" ? 51 : 0,
        borderTopRightRadius: side === "left" ? 51 : 0,
        borderBottomRightRadius: side === "left" ? 51 : 0,
        borderRightWidth: side === "left" ? 2 : 0,
        borderLeftWidth: side === "right" ? 2 : 0,
        borderLeftStyle: "solid",
        borderRightStyle: "solid",
      }}
      className="userInfo"
      whileHover={{
        x: side === "left" ? -24 : 24,
        transition: {
          duration: 0.4,
          yoyo: Infinity,
        },
      }}
    >
      <motion.div className="userInfo__container">
        <motion.h2
          initial={{
            x: side === "left" ? "-100vw" : "100vw",
          }}
          animate={{
            x: 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.44,
            stiffness: 111,
            delay: 1.5,
            damping: 9.5,
          }}
          className="userInfo__name"
        >
          {userID === id ? "You" : name}
        </motion.h2>
        <motion.h1
          initial={{
            x: side === "left" ? "-100vw" : "100vw",
          }}
          animate={{
            x: 0,
          }}
          transition={{
            type: "spring",
            bounce: 0.44,
            stiffness: 111,
            delay: 1.8,
            damping: 9.5,
          }}
          className="userInfo__score"
        >
          {score}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default PlayerInfo;
