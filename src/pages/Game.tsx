import { Button, IconButton, Snackbar } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  matrices: Array<number>;
  chanceOf: string;
}

const Game = () => {
  const [{ userID }] = useStateValue();
  const [gameData, setGameData] = useState<PlayerInfoInterface>();
  const { requestedRoomID } = useParams<{ requestedRoomID: string }>();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    db.collection(`rooms`)
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
  }, []);

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
      />
      <Modal
        isHost={gameData?.creatorID === userID}
        roomID={gameData?.id}
        showModal={showRestartModal}
        setShowModal={setShowLeaveModal}
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
                    matrixElement === null
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
  ) : (
    <Loader
      id={gameData?.id}
      isHost={gameData?.creatorID === userID}
      password={gameData?.password}
    />
  );
};

export default Game;
