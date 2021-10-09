import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Board from "./Board";

export default function App() {
  return (
    <div>
        <Router>
            <div>
                {/* A <Switch> looks through its children <Route>s and
                    renders the first one that matches the current URL. */}
                <Switch>
                    <Route path="/board">
                        <Board />
                    </Route>
                </Switch>
            </div>
        </Router>
    </div>
  );
}