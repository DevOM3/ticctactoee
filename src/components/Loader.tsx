import { IconButton, Snackbar } from "@material-ui/core";
import "./Loader.css";
import ShareRoundedIcon from "@material-ui/icons/ShareRounded";
import { useState } from "react";

interface LoaderInterface {
  id: string | undefined;
  isHost: boolean;
  password: string | undefined;
}

const Loader = ({ id, isHost, password }: LoaderInterface) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

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
          message="Room joining informationcopied to clipboard"
        />
      )}
      <div className="square">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h2>{isHost ? "Waiting for player to Join" : "Joining the Room"}</h2>
      {isHost && (
        <IconButton
          onClick={() => {
            setShowSnackbar(true);
            navigator.clipboard.writeText(
              `Joining link: http://127.0.0.1/game/${id}\nJoining ID: ${id}${
                password && "\nPassword: " + password
              }`
            );
          }}
        >
          <ShareRoundedIcon fontSize="large" />
        </IconButton>
      )}
    </div>
  );
};

export default Loader;
