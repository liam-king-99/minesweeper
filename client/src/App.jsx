import Board from "./Board";
import { BoxesFlaggedContext, BoxesFlaggedDispatchContext, MinesRemainingContext, MinesRemainingDispatchContext } from "./contexts";
import { boxesFlaggedReducer, minesRemainingReducer } from "./reducers";
import './App.css'
import { useReducer } from "react";

export default function App() {

  const [boxesFlagged, dispatchBoxesFlagged] = useReducer(boxesFlaggedReducer, []);
  const [minesRemaining, dispatchMinesRemaining] = useReducer(minesRemainingReducer, 40);

  return (
    <div className="app-root">
        <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <BoxesFlaggedContext.Provider value={boxesFlagged}>
          <BoxesFlaggedDispatchContext.Provider value={dispatchBoxesFlagged}>
            <MinesRemainingContext.Provider value={minesRemaining} >
              <MinesRemainingDispatchContext.Provider value={dispatchMinesRemaining}>
                <Board width={16} height={16} totalNumberOfMines={40} />
              </MinesRemainingDispatchContext.Provider>
            </MinesRemainingContext.Provider>
          </BoxesFlaggedDispatchContext.Provider>
        </BoxesFlaggedContext.Provider>
    </div>
  );
}