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
        <Switch location={location} key={location.key}>
          <Route path="/game/:requestedRoomID">
            <Game />
          </Route>
          <Route path="/create">
            <Create />
          </Route>
          <Route path="/join">
            <Join />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </AnimatePresence>
    </div>
  );
}

export default App;
