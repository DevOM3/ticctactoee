import { IconButton, Snackbar } from "@material-ui/core";
import "./Loader.css";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { containerDivVariants } from "../common/commonVariants";
import VanillaTilt from "vanilla-tilt";
import { speak } from "../common/speaker";

interface LoaderInterface {
  id: string | undefined;
  isHost: boolean;
  password: string | undefined;
}

const Loader = ({ id, isHost, password }: LoaderInterface) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    isHost && speak(`Waiting for player to join`);
  }, [isHost]);

  useEffect(() => {
    const homeContainer: HTMLElement = document.querySelector(
      "#loader__contanier"
    ) as HTMLElement;
    if (homeContainer) {
      VanillaTilt.init(homeContainer, {
        max: 21,
        speed: 444,
        glare: true,
        "max-glare": 1,
      });
    }
  }, []);

  if (showSnackbar) {
    setTimeout(() => setShowSnackbar(false), 4000);
  }

  return (
    <div className="loader">
      {isHost && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={showSnackbar}
          onClose={() => setShowSnackbar(false)}
          message="Room joining information copied to the clipboard"
        />
      )}
      <motion.div
        id="loader__contanier"
        className="loader__contanier"
        variants={containerDivVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="square"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </motion.div>
        <motion.h2 initial={{ y: "100vh" }} animate={{ y: 0 }}>
          {isHost ? "Waiting for player to Join" : "Joining the Room"}
        </motion.h2>
        {isHost && (
          <IconButton
            onClick={() => {
              setShowSnackbar(true);
              navigator.clipboard.writeText(
                `Joining link: http://127.0.0.1:3000/\nJoining ID: ${id}${
                  password && "\nPassword: " + password
                }`
              );
            }}
          >
            <ShareRoundedIcon fontSize="large" />
          </IconButton>
        )}
      </motion.div>
    </div>
  );
};

export default Loader;
