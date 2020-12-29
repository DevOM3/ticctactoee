import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./ExitLoader.css";

const ExitLoader = () => {
  const history = useHistory();

  useEffect(() => {
    history.replace("/");
    window.location.reload();
  }, []);

  return (
    <div className="exitLoader">
      <div className="spinner">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default ExitLoader;
