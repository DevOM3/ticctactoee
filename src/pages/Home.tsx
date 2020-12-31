import { Button, ButtonGroup, FormControl, TextField } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import { AnimatePresence, motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionTypes } from "../context/reducer";
import {
  containerDivVariants,
  containerVariants,
} from "../common/commonVariants";
import { v4 } from "uuid";
import VanillaTilt from "vanilla-tilt";
import { speak } from "../common/speaker";

const titleVariants = {
  initial: { y: "-100vh" },
  animate: { y: 0, transition: { delay: 0.2, type: "spring", stiffness: 120 } },
};
const divVariants = {
  initial: { y: "100vh" },
  animate: { y: 0, transition: { delay: 0.2, type: "spring", stiffness: 51 } },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.3,
      yoyo: Infinity,
    },
  },
};

const Home = () => {
  const [{ nickname }, dispatch] = useStateValue();
  const [nickName, setNickName] = useState("");

  useEffect(() => {
    const homeContainer: HTMLElement = document.querySelector(
      "#home__contanier"
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

  useEffect(() => {
    const userIDFromLocalStorage = localStorage.getItem("userID");
    if (userIDFromLocalStorage) {
      dispatch({
        type: actionTypes.SET_USER_ID,
        userID: userIDFromLocalStorage,
      });
    } else {
      const generatedUserID = v4();
      localStorage.setItem("userID", generatedUserID);
      dispatch({
        type: actionTypes.SET_USER_ID,
        userID: generatedUserID,
      });
    }
  }, []);

  useEffect(() => {
    const title: HTMLHeadingElement = document.getElementById(
      "home__title"
    ) as HTMLHeadingElement;
    const titleText: string = title.innerText;

    const titleTextArrayOfLetters: string[] = titleText.split("");
    title.innerText = "";

    titleTextArrayOfLetters.forEach((titleWord) => {
      title.innerHTML += `<span>${titleWord}</span>`;
      titleWord === "C" && (title.innerHTML += "&nbsp;");
    });

    let word: number = 0;
    const interval = setInterval(() => {
      const span: HTMLSpanElement = document.querySelectorAll("span")[word];
      span.classList.add("home__titleSpan");
      setTimeout(() => {
        span.classList.remove("home__titleSpan");
      }, 251);
      word++;
      if (word >= titleTextArrayOfLetters.length) {
        word = 0;
      }
    }, 251);

    return () => clearInterval(interval);
  }, []);

  const letsGoClick = (e: React.MouseEvent) => {
    dispatch({
      type: actionTypes.SET_NICKNAME,
      nickname: nickName.trim(),
    });

    speak(
      `Welcome to Tic Tac Toe, you can Join an existing Room or Create a new Room`
    );
  };

  console.log(window.speechSynthesis.getVoices());

  return (
    <motion.div
      className="home"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        id="home__contanier"
        className="home__contanier"
        variants={containerDivVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.h1
          className="home__title"
          id="home__title"
          initial="initial"
          animate="animate"
          variants={titleVariants}
        >
          TIC TAC TOE
        </motion.h1>

        {!nickname ? (
          <motion.div
            variants={divVariants}
            initial="initial"
            animate="animate"
          >
            <FormControl>
              <TextField
                autoFocus
                style={{ marginBottom: 11, caretColor: "transparent" }}
                onChange={(e) => setNickName(e.target.value.slice(0, 10))}
                required
                type="text"
                variant="outlined"
                placeholder="Enter a Nickname"
                value={nickName}
                inputProps={{
                  style: {
                    textAlign: "center",
                  },
                }}
              />
              <div style={{ height: 51 }}>
                <AnimatePresence>
                  {nickName.trim() && (
                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="initial"
                      whileHover="hover"
                      variants={divVariants}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        disableElevation
                        color="secondary"
                        variant="contained"
                        onClick={letsGoClick}
                      >
                        Let's Go
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FormControl>
          </motion.div>
        ) : (
          <AnimatePresence>
            {nickname && (
              <motion.div
                variants={divVariants}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <ButtonGroup style={{ marginBottom: 51 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    disableElevation
                    to="/join"
                    component={Link}
                  >
                    Join existing Room
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    disableElevation
                    to="/create"
                    component={Link}
                  >
                    Create a new Room
                  </Button>
                </ButtonGroup>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Home;
