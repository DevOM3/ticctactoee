import { Button, IconButton } from "@material-ui/core";
import "./Modal.css";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import { db } from "../common/firebase";
import CancelIcon from "@material-ui/icons/Cancel";
import { AnimatePresence, motion } from "framer-motion";
import { backdropVariants, modalVariants } from "../common/commonVariants";
import ReplayIcon from "@material-ui/icons/Replay";
import { useHistory } from "react-router-dom";
import { speak } from "../common/speaker";

interface LeaveModalInterface {
  isHost: boolean;
  roomID: string | undefined;
  showModal: boolean;
  setShowModal: Function;
  type: string | undefined;
  setShouldUpdatePoints: Function | undefined;
  isGuest: boolean | undefined;
}

const Modal = ({
  isHost,
  roomID,
  showModal,
  setShowModal,
  type,
  setShouldUpdatePoints,
  isGuest,
}: LeaveModalInterface) => {
  const history = useHistory();

  const handleExitClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isHost) {
      db.collection(`rooms`)
        .doc(roomID)
        .delete()
        .then(() => {
          speak(`Disbanding the Room`);
          setShowModal(false);
          history.replace("/");
        });
    } else if (isGuest) {
      db.collection(`rooms`)
        .doc(roomID)
        .update({
          guestID: "",
          guestNickname: "",
          guestPoints: 0,
          creatorPoints: 0,
          ties: 0,
          matrix: ["", "", "", "", "", "", "", "", ""],
        })
        .then(() => {
          speak("Exiting a Room");
          setShowModal(false);
          history.push("/");
        });
    } else {
      history.replace("/");
      speak("Exiting Spectator mode");
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.preventDefault();

    db.collection(`rooms`)
      .doc(roomID)
      .update({
        matrix: ["", "", "", "", "", "", "", "", ""],
      })
      .then(() => {
        speak("Game restarted");
        setShowModal(false);
        setShouldUpdatePoints && setShouldUpdatePoints(true);
      });
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {showModal && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="modal"
          style={{ display: showModal ? "flex" : "none" }}
        >
          <motion.div
            className="modal__leaveModalButtonContainer"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {type === "leave" ? (
              <>
                <Button
                  onClick={handleExitClick}
                  variant="contained"
                  color="secondary"
                  endIcon={<ExitToAppRoundedIcon />}
                >
                  {isHost ? "Disband Room" : "Leave Room"}
                </Button>
                <IconButton onClick={() => setShowModal(false)}>
                  <CancelIcon fontSize="large" />
                </IconButton>
              </>
            ) : (
              <>
                <Button
                  onClick={handleRestart}
                  variant="contained"
                  color="primary"
                  endIcon={<ReplayIcon />}
                  style={{ marginBottom: 11 }}
                >
                  Restart
                </Button>
                <Button
                  onClick={handleExitClick}
                  variant="contained"
                  color="secondary"
                  endIcon={<ExitToAppRoundedIcon />}
                  style={{ marginBottom: 21 }}
                >
                  Quit
                </Button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
