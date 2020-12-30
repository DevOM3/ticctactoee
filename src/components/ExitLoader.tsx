import { motion } from "framer-motion";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import VanillaTilt from "vanilla-tilt";
import { containerDivVariants } from "../common/commonVariants";
import "./ExitLoader.css";

const ExitLoader = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace("/");
    window.location.reload();
  }, []);

  useEffect(() => {
    const homeContainer: HTMLElement = document.querySelector(
      "#exitLoader__contanier"
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

  return (
    <motion.div className="exitLoader">
      <motion.div
        id="exitLoader__contanier"
        className="exitLoader__contanier"
        variants={containerDivVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="spinner">
          <div></div>
          <div></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExitLoader;
