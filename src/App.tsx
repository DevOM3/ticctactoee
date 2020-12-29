import "./App.css";
import Home from "./pages/Home";
import { Route, Switch, useLocation } from "react-router-dom";
import Join from "./pages/Join";
import Game from "./pages/Game";
import Create from "./pages/Create";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <AnimatePresence exitBeforeEnter>
        <Route exact path="/game/:requestedRoomID" key="game">
          <Game />
        </Route>
        <Route exact path="/create" key="create">
          <Create />
        </Route>
        <Route exact path="/join" key="join">
          <Join />
        </Route>
        <Route exact path="/" key="home">
          <Home />
        </Route>
      </AnimatePresence>
    </div>
  );
}

export default App;
