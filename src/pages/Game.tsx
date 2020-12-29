import { IconButton, Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { db } from "../common/firebase";
import PlayerInfo from "../components/PlayerInfo";
import "./Game.css";
import SettingsIcon from "@material-ui/icons/Settings";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import { useStateValue } from "../context/StateProvider";
import Modal from "../components/Modal";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import { motion } from "framer-motion";
import { containerVariants } from "../common/commonVariants";
import {
  centerBottomVariants,
  centerCenterVariants,
  centerTopTitleVariants,
  centerTopVariants,
  gridBoxVariants,
} from "../common/GameVariants";
import Loader from "../components/Loader";

interface PlayerInfoInterface {
  id: string;
  roomName: string;
  passwordEnabled: boolean;
  password: string;
  creatorID: string;
  creatorNickname: string;
  guestID: string;
  guestNickname: string;
  creatorPoints: number;
  guestPoints: number;
  ties: number;
  matrices: Array<string>;
  chanceOf: string;
}

const Game = () => {
  const history = useHistory();
  const [{ userID }] = useStateValue();
  const [gameData, setGameData] = useState<PlayerInfoInterface>();
  const { requestedRoomID } = useParams<{ requestedRoomID: string }>();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [disband, setDisband] = useState(false);
  const [creatorPoints, setCreatorPoints] = useState(0);
  const [guestPoints, setGuestPoints] = useState(0);
  const [ties, setTies] = useState(0);
  const [shouldUpdatePoints, setShouldUpdatePoints] = useState(true);
  const [offlineMatrix, setOfflineMatrix] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  useEffect(() => {
    if (gameData?.matrices && gameData?.id) {
      setCreatorPoints(gameData?.creatorPoints + 1);
      setGuestPoints(gameData?.guestPoints + 1);
      setTies(gameData?.ties + 1);
    }
  }, [gameData]);

  useEffect(() => {
    const unsubscribeGameDataEvents = db
      .collection(`rooms`)
      .doc(requestedRoomID)
      .onSnapshot((snapshot) =>
        setGameData({
          id: snapshot.id,
          roomName: snapshot.data()?.roomName,
          passwordEnabled: snapshot.data()?.enablePassword,
          password: snapshot.data()?.password,
          creatorID: snapshot.data()?.creatorID,
          creatorNickname: snapshot.data()?.creatorNickname,
          guestID: snapshot.data()?.guestID,
          guestNickname: snapshot.data()?.guestNickname,
          creatorPoints: snapshot.data()?.creatorPoints,
          guestPoints: snapshot.data()?.guestPoints,
          ties: snapshot.data()?.ties,
          matrices: snapshot.data()?.matrix,
          chanceOf: snapshot.data()?.chanceOf,
        })
      );

    return () => unsubscribeGameDataEvents();
  }, []);

  useEffect(() => {
    if (!gameData?.matrices && gameData?.id) {
      db.collection(`rooms`)
        .doc(gameData?.id)
        .get()
        .then((response) => {
          if (!response.exists) {
            setDisband(true);
            history.replace("/");
          }
        });
    }
    if (gameData?.matrices) {
      setOfflineMatrix(gameData?.matrices);
    }
  }, [gameData]);

  useEffect(() => {
    if (
      gameData?.matrices !== undefined &&
      gameData?.id &&
      gameData?.creatorID !== undefined &&
      gameData?.creatorID === userID &&
      shouldUpdatePoints
    ) {
      if (
        (offlineMatrix[0] === "X" &&
          offlineMatrix[1] === "X" &&
          offlineMatrix[2] === "X") ||
        (offlineMatrix[3] === "X" &&
          offlineMatrix[4] === "X" &&
          offlineMatrix[5] === "X") ||
        (offlineMatrix[6] === "X" &&
          offlineMatrix[7] === "X" &&
          offlineMatrix[8] === "X") ||
        (offlineMatrix[0] === "X" &&
          offlineMatrix[3] === "X" &&
          offlineMatrix[6] === "X") ||
        (offlineMatrix[1] === "X" &&
          offlineMatrix[4] === "X" &&
          offlineMatrix[7] === "X") ||
        (offlineMatrix[2] === "X" &&
          offlineMatrix[5] === "X" &&
          offlineMatrix[8] === "X") ||
        (offlineMatrix[0] === "X" &&
          offlineMatrix[4] === "X" &&
          offlineMatrix[8] === "X") ||
        (offlineMatrix[2] === "X" &&
          offlineMatrix[4] === "X" &&
          offlineMatrix[6] === "X")
      ) {
        db.collection(`rooms`)
          .doc(gameData?.id)
          .update({
            creatorPoints: creatorPoints,
          })
          .then(() => setShowRestartModal(true));
        setShouldUpdatePoints(false);
      } else if (
        (offlineMatrix[0] === "O" &&
          offlineMatrix[1] === "O" &&
          offlineMatrix[2] === "O") ||
        (offlineMatrix[3] === "O" &&
          offlineMatrix[4] === "O" &&
          offlineMatrix[5] === "O") ||
        (offlineMatrix[6] === "O" &&
          offlineMatrix[7] === "O" &&
          offlineMatrix[8] === "O") ||
        (offlineMatrix[0] === "O" &&
          offlineMatrix[3] === "O" &&
          offlineMatrix[6] === "O") ||
        (offlineMatrix[1] === "O" &&
          offlineMatrix[4] === "O" &&
          offlineMatrix[7] === "O") ||
        (offlineMatrix[2] === "O" &&
          offlineMatrix[5] === "O" &&
          offlineMatrix[8] === "O") ||
        (offlineMatrix[0] === "O" &&
          offlineMatrix[4] === "O" &&
          offlineMatrix[8] === "O") ||
        (offlineMatrix[2] === "O" &&
          offlineMatrix[4] === "O" &&
          offlineMatrix[6] === "O")
      ) {
        db.collection(`rooms`)
          .doc(gameData?.id)
          .update({
            guestPoints: guestPoints,
          })
          .then(() => setShowRestartModal(true));
        setShouldUpdatePoints(false);
      } else if (
        offlineMatrix[0] !== "" &&
        offlineMatrix[1] !== "" &&
        offlineMatrix[2] !== "" &&
        offlineMatrix[3] !== "" &&
        offlineMatrix[4] !== "" &&
        offlineMatrix[5] !== "" &&
        offlineMatrix[6] !== "" &&
        offlineMatrix[7] !== "" &&
        offlineMatrix[8] !== ""
      ) {
        db.collection(`rooms`)
          .doc(gameData?.id)
          .update({
            ties: ties,
          })
          .then(() => setShowRestartModal(true));
        setShouldUpdatePoints(false);
      }
    }
  }, [offlineMatrix]);

  useEffect(() => {
    if (
      offlineMatrix !== ["", "", "", "", "", "", "", "", ""] &&
      offlineMatrix !== gameData?.matrices &&
      gameData?.id &&
      gameData?.matrices
    ) {
      updateDatabaseGridBox();
    }
  }, [offlineMatrix]);

  const handleGridBoxClicks = (e: React.MouseEvent, index: number) => {
    if (offlineMatrix[index] === "") {
      if (gameData?.chanceOf === "creator" && gameData?.creatorID === userID) {
        setOfflineMatrix(
          offlineMatrix.map((element, elementIndex) => {
            if (elementIndex === index) {
              return "X";
            } else {
              return element;
            }
          })
        );
      } else if (
        gameData?.chanceOf === "guest" &&
        gameData?.guestID === userID
      ) {
        setOfflineMatrix(
          offlineMatrix.map((element, elementIndex) => {
            if (elementIndex === index) {
              return "O";
            } else {
              return element;
            }
          })
        );
      }
    }
  };

  const updateDatabaseGridBox = () => {
    db.collection(`rooms`)
      .doc(gameData?.id)
      .update({
        matrix: offlineMatrix,
        chanceOf: gameData?.chanceOf === "creator" ? "guest" : "creator",
      });
  };

  if (showSnackbar) {
    setTimeout(() => setShowSnackbar(false), 4000);
  }

  return gameData?.guestID ? (
    <motion.div
      className="game"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        message={
          gameData?.creatorID === userID
            ? "Room joining information copied to clipboard"
            : "You can't share the joining link you are not host"
        }
      />
      <Modal
        isHost={gameData?.creatorID === userID}
        roomID={gameData?.id}
        showModal={showLeaveModal}
        setShowModal={setShowLeaveModal}
        type="leave"
        setShouldUpdatePoints={undefined}
      />
      <Modal
        isHost={gameData?.creatorID === userID}
        roomID={gameData?.id}
        showModal={showRestartModal}
        setShowModal={setShowRestartModal}
        setShouldUpdatePoints={setShouldUpdatePoints}
        type="restart"
      />
      <div className="game__guest">
        <PlayerInfo
          id={gameData?.guestID}
          name={gameData?.guestNickname}
          score={gameData?.guestPoints}
          side="left"
        />
      </div>
      <div
        className="game__center"
        style={{
          pointerEvents: showRestartModal || showLeaveModal ? "none" : "auto",
        }}
      >
        <motion.div
          className="game__centerTop"
          variants={centerTopVariants}
          initial="initial"
          animate="animate"
        >
          {gameData?.creatorID === userID ? (
            <IconButton
              onClick={() => {
                setShowSnackbar(true);
                navigator.clipboard.writeText(
                  `Joining link: http://127.0.0.1/game/${gameData?.id}\nJoining ID: ${gameData?.id}`
                );
              }}
            >
              <ShareRoundedIcon fontSize="large" />
            </IconButton>
          ) : (
            <IconButton onClick={() => setShowSnackbar(true)}>
              <StopScreenShareIcon fontSize="large" />
            </IconButton>
          )}
          <motion.h1
            className="game__roomName"
            variants={centerTopTitleVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
          >
            {gameData?.roomName}
          </motion.h1>
          <IconButton onClick={() => setShowLeaveModal(true)}>
            <SettingsIcon fontSize="large" className="settingsIcon" />
          </IconButton>
        </motion.div>
        <motion.div
          className="game__centerCenter"
          variants={centerCenterVariants}
          initial="initial"
          animate="animate"
        >
          <div className="game__board">
            {gameData?.matrices?.map((matrixElement, index) => (
              <motion.div
                onClick={(e) => handleGridBoxClicks(e, index)}
                variants={gridBoxVariants}
                whileHover="hover"
                initial="initial"
                animate="animate"
                key={index}
                className="game__boardBox"
                style={{
                  cursor:
                    ((gameData?.chanceOf === "creator" &&
                      gameData?.creatorID === userID) ||
                      (gameData?.chanceOf === "guest" &&
                        gameData?.guestID === userID)) &&
                    matrixElement.toString() === ""
                      ? "cell"
                      : "not-allowed",
                }}
              >
                {matrixElement}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <div className="game__centerBottom">
          <motion.div
            className="game__centerBottomTieContainer"
            variants={centerBottomVariants}
            initial="initial"
            animate="animate"
          >
            <h2 className="game__centerBottomTieTitle">Ties</h2>
            <h2 className="game__centerBottomTieScore">{gameData?.ties}</h2>
          </motion.div>
        </div>
      </div>
      <div className="game__creator">
        <PlayerInfo
          id={gameData?.creatorID}
          name={gameData?.creatorNickname}
          score={gameData?.creatorPoints}
          side="right"
        />
      </div>
    </motion.div>
  ) : disband ? (
    <Redirect to="/" />
  ) : (
    <Loader
      id={gameData?.id}
      isHost={gameData?.creatorID === userID}
      password={gameData?.password}
    />
  );
};

export default Game;
