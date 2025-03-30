import Board from "./Board";
import { BoxesClickedContext, BoxesClickedDispatchContext, BoxesFlaggedContext, BoxesFlaggedDispatchContext, MinesRemainingContext, MinesRemainingDispatchContext } from "./contexts";
import { boxesClickedReducer, boxesFlaggedReducer, minesRemainingReducer } from "./reducers";
import './App.css'
import { useReducer } from "react";

export default function App() {

  const [boxesClicked, dispatchBoxesClicked] = useReducer(boxesClickedReducer, []);
  const [boxesFlagged, dispatchBoxesFlagged] = useReducer(boxesFlaggedReducer, []);
  const [minesRemaining, dispatchMinesRemaining] = useReducer(minesRemainingReducer, 40);

  return (
    <div className="app-root">
        <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <BoxesClickedContext.Provider value={boxesClicked}>
          <BoxesClickedDispatchContext.Provider value={dispatchBoxesClicked}>
            <BoxesFlaggedContext.Provider value={boxesFlagged}>
              <BoxesFlaggedDispatchContext.Provider value={dispatchBoxesFlagged}>
                <MinesRemainingContext.Provider value={minesRemaining} >
                  <MinesRemainingDispatchContext.Provider value={dispatchMinesRemaining}>
                    <Board width={16} height={16} totalNumberOfMines={40} />
                  </MinesRemainingDispatchContext.Provider>
                </MinesRemainingContext.Provider>
              </BoxesFlaggedDispatchContext.Provider>
            </BoxesFlaggedContext.Provider>
          </BoxesClickedDispatchContext.Provider>
        </BoxesClickedContext.Provider>
    </div>
  );
}