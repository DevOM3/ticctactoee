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
        <Route exact path="/game/:requestedRoomID">
          <Game />
        </Route>
        <Route exact path="/create">
          <Create />
        </Route>
        <Route exact path="/join">
          <Join />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
      </AnimatePresence>
    </div>
  );
}

export default App;
