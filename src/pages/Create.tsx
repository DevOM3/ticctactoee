import {
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  withStyles,
} from "@material-ui/core";
import { green, lightGreen, red } from "@material-ui/core/colors";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  buttonVariants,
  containerVariants,
  passwordVariant,
} from "../common/commonVariants";
import { db } from "../common/firebase";
import { useStateValue } from "../context/StateProvider";
import "./Create.css";

const titleVariant = {
  initial: {
    x: "100vw",
  },
  animate: {
    x: 0,
    transition: {
      delay: 0.2,
      type: "spring",
    },
  },
};
const formVariant = {
  initial: {
    x: "-100vw",
  },
  animate: {
    x: 0,
    transition: {
      delay: 0.4,
      type: "spring",
    },
  },
};

const CustomSwitch = withStyles({
  switchBase: {
    color: red["A700"],
    "&$checked": {
      color: green["A700"],
    },
    "&$checked + $track": {
      backgroundColor: lightGreen["A400"],
    },
  },
  checked: {},
  track: {},
})(Switch);

const Create = () => {
  const history = useHistory();
  const [{ nickname, userID }] = useStateValue();
  const [roomName, setRoomName] = useState("");
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    nickname ? setRoomName(`${nickname}'s Room`) : history.replace("/");
  }, []);

  const handleCreateButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const chanceOfArray = ["creator", "guest"];
    const chanceOf = chanceOfArray[Math.floor(Math.random() * 2)];

    db.collection("rooms")
      .where("creatorID", "==", userID)
      .get()
      .then((response) => {
        if (!response.docs.length) {
          db.collection(`rooms`)
            .where("guestID", "==", userID)
            .get()
            .then((response) => {
              if (!response.docs.length) {
                db.collection(`rooms`)
                  .add({
                    roomName: roomName,
                    passwordEnabled: enablePassword,
                    password: password,
                    creatorID: userID,
                    creatorNickname: nickname,
                    guestID: "",
                    guestNickname: "",
                    creatorPoints: 0,
                    guestPoints: 0,
                    ties: 0,
                    matrix: ["", "", "", "", "", "", "", "", ""],
                    chanceOf: chanceOf,
                  })
                  .then((response) => history.replace(`/game/${response.id}`));
              } else {
                const createNewRoom = window.confirm(
                  `You are already playing as a guest in another Room, \nDo you wish to exit "${
                    response.docs[0].data().roomName
                  }" and create a new Room?`
                );

                if (createNewRoom) {
                  db.collection(`room`)
                    .doc(response.docs[0].id)
                    .update({
                      guestID: "",
                      guestNickname: "",
                      guestPoints: 0,
                      creatorPoints: 0,
                      ties: 0,
                      matrix: ["", "", "", "", "", "", "", "", ""],
                    })
                    .then(() => handleCreateButtonClick(e));
                }
              }
            });
        } else {
          const enterPreviousRoom = window.confirm(
            `You have already hosted a Room. \nDo you want to enter your previous Room "${
              response.docs[0].data().roomName
            }"?`
          );

          if (enterPreviousRoom) {
            history.replace(`/game/${response.docs[0].id}`);
          } else {
            const createNewRoom = window.confirm(
              `Do you want to create a new Room with this new Data?`
            );

            if (createNewRoom) {
              db.collection(`rooms`)
                .doc(response.docs[0].id)
                .update({
                  roomName: roomName,
                  passwordEnabled: enablePassword,
                  password: password,
                  creatorID: userID,
                  creatorNickname: nickname,
                  guestID: "",
                  guestNickname: "",
                  creatorPoints: 0,
                  guestPoints: 0,
                  ties: 0,
                  matrix: ["", "", "", "", "", "", "", "", ""],
                  chanceOf: chanceOf,
                })
                .then(() => history.replace(`/game/${response.docs[0].id}`));
            }
          }
        }
      });
  };

  return (
    <motion.div
      className="create"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={titleVariant}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{ marginBottom: 21 }}
      >
        <Typography component="h3" variant="h3">
          Create new Room
        </Typography>
      </motion.div>
      <motion.div variants={formVariant} initial="initial" animate="animate">
        <FormControl>
          <TextField
            autoFocus
            style={{ marginBottom: 11, caretColor: "transparent" }}
            onChange={(e) => setRoomName(e.target.value.slice(0, 17))}
            required
            type="text"
            variant="outlined"
            placeholder="Enter Room name"
            value={roomName}
            inputProps={{
              style: {
                textAlign: "center",
              },
            }}
          />
          <FormControlLabel
            value="start"
            control={
              <CustomSwitch
                color="primary"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEnablePassword(e.target.checked)
                }
              />
            }
            label="Enable Password"
            labelPlacement="top"
          />
          <AnimatePresence>
            {enablePassword && (
              <motion.div
                variants={passwordVariant}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <TextField
                  autoFocus
                  style={{ marginBottom: 11, caretColor: "transparent" }}
                  onChange={(e) => setPassword(e.target.value.slice(0, 12))}
                  required
                  type="text"
                  variant="outlined"
                  placeholder="Enter Room Password"
                  value={password}
                  inputProps={{
                    style: {
                      textAlign: "center",
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div style={{ height: 51 }}>
            <AnimatePresence>
              {((roomName.trim() && !enablePassword) ||
                (enablePassword && password.trim().length >= 4)) && (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="initial"
                  whileHover="hover"
                  variants={buttonVariants}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={handleCreateButtonClick}
                  >
                    Create
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FormControl>
      </motion.div>
    </motion.div>
  );
};

export default Create;
