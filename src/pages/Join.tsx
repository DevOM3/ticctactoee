import { Button, FormControl, TextField, Typography } from "@material-ui/core";
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
import "./Join.css";

const titleVariant = {
  initial: {
    x: "-100vw",
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
    x: "100vw",
  },
  animate: {
    x: 0,
    transition: {
      delay: 0.5,
      type: "spring",
    },
  },
};

const Join = () => {
  const history = useHistory();
  const [{ nickname, userID }] = useStateValue();
  const [joiningID, setJoiningID] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    !nickname && history.push("/");
  }, []);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const joinRoom = () => {
      db.collection(`rooms`)
        .doc(joiningID)
        .update({
          guestID: userID,
          guestNickname: nickname,
          guestPoints: 0,
          creatorPoints: 0,
          ties: 0,
        })
        .then(() => history.push(`/game/${joiningID}`));
    };

    db.collection("rooms")
      .doc(joiningID)
      .get()
      .then((response) => {
        if (response.exists) {
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
                        .doc(joiningID)
                        .get()
                        .then((data) => {
                          if (!data.data()?.guestID) {
                            db.collection(`rooms`)
                              .doc(joiningID)
                              .get()
                              .then((response) => {
                                if (response.data()?.passwordEnabled) {
                                  !showPasswordField &&
                                    setShowPasswordField(true);
                                  if (showPasswordField) {
                                    if (
                                      password === response.data()?.password
                                    ) {
                                      joinRoom();
                                    } else {
                                      setPasswordError("Wrong Password");
                                    }
                                  }
                                } else {
                                  joinRoom();
                                }
                              });
                          } else {
                            setError("Room is already Occupied");
                          }
                        });
                    } else {
                      const leaveJoinedRoomAndJoinThisRoom = window.confirm(
                        `You have already joined a Room named "${
                          response.docs[0].data().roomName
                        }".\nDo you wish to leave that Room and join this Room?`
                      );

                      if (leaveJoinedRoomAndJoinThisRoom) {
                        db.collection(`rooms`)
                          .doc(response.docs[0].id)
                          .update({
                            guestID: "",
                            guestNickname: "",
                            guestPoints: 0,
                            creatorPoints: 0,
                            ties: 0,
                            matrix: [
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                              null,
                            ],
                          })
                          .then(() => handleJoinClick(e));
                      }
                    }
                  });
              } else {
                const deleteCreatedRoomAndJoinThisRoom = window.confirm(
                  `You already created another Room, \nDo you wish to disbanned "${
                    response.docs[0].data().roomName
                  }" and join this Room?`
                );

                if (deleteCreatedRoomAndJoinThisRoom) {
                  db.collection(`rooms`)
                    .doc(response.docs[0].id)
                    .delete()
                    .then(() => handleJoinClick(e));
                }
              }
            });
        } else {
          setError("Invalid Room ID");
          setJoiningID("");
        }
      });
  };

  return (
    <motion.div
      className="join"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        variants={titleVariant}
        initial="initial"
        animate="animate"
        style={{ marginBottom: 21 }}
      >
        <Typography component="h3" variant="h3">
          Join existing Room
        </Typography>
      </motion.div>
      <motion.div variants={formVariant} initial="initial" animate="animate">
        <FormControl>
          <AnimatePresence>
            {!showPasswordField && (
              <motion.div
                variants={passwordVariant}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <TextField
                  helperText={error}
                  FormHelperTextProps={{ style: { textAlign: "center" } }}
                  error={!!error}
                  style={{ marginBottom: 11 }}
                  onChange={(e) => {
                    setJoiningID(e.target.value);
                    if (error && e.target.value.trim()) setError("");
                  }}
                  required
                  type="text"
                  variant="outlined"
                  placeholder="Enter Joining ID"
                  value={joiningID}
                  inputProps={{
                    style: {
                      textAlign: "center",
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {showPasswordField && (
              <motion.div
                variants={passwordVariant}
                initial="initial"
                animate="animate"
                exit="initial"
              >
                <TextField
                  style={{ marginBottom: 11 }}
                  FormHelperTextProps={{ style: { textAlign: "center" } }}
                  error={!!passwordError}
                  helperText={passwordError}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError && e.target.value.trim())
                      setPasswordError("");
                  }}
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
              {((joiningID.trim() && !showPasswordField) ||
                (password.trim() && showPasswordField)) && (
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
                    onClick={handleJoinClick}
                  >
                    Join
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

export default Join;
