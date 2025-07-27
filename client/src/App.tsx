import Board from "./components/Board";
import { BoxesClickedContext, BoxesClickedDispatchContext, MineLocationsContext, MineLocationsDispatchContext,  MinesRemainingContext, MinesRemainingDispatchContext } from "./contexts";
import { minesRemainingReducer, setMinesRemaining } from "./reducers/minesRemainingReducer";
import { resetMineLocations } from "./reducers/mineLocationsReducer";
import './App.css'
import { type ChangeEvent, type ChangeEventHandler, useReducer, useState } from "react";
import Header from "./components/Header";
import { type difficultyOption, type gameSettings, gameStatus, mapDifficultyToGameSettings } from "./constants";
import { mineLocationsReducer } from "./reducers/mineLocationsReducer";
import { boxesClickedReducer, resetBoxesClicked } from "./reducers/boxesClickedReducer";

export default function App() {

  const [boxesClicked, dispatchBoxesClicked] = useReducer(boxesClickedReducer, new Set<number>())
  const [mineLocations, dispatchMineLocations] = useReducer(mineLocationsReducer, [] as number[]);
  const [minesRemaining, dispatchMinesRemaining] = useReducer(minesRemainingReducer, 40);

  const [Width, setWidth] = useState(16);
  const [Height, setHeight] = useState(16);
  const [TotalNumberOfMines, setTotalNumberOfMines] = useState(40);
  // Either NOT_STARTED, IN_PROGRESS, WON, or LOST. Used to see if the game is in progress
  const [gameResult, setGameResult] = useState(gameStatus.NOT_STARTED);

  
  // Maps each box ID to the number of mines that touch the box. Used to display a number 
  // when a box is opened. A key being absent means it touches 0 mines
  const [numberOfMineNeighborsByBoxId, setNumberOfMineNeighborsByBoxId] = useState({})

  const resetHandler = () => {
      setGameResult(gameStatus.NOT_STARTED)
      setMinesRemaining(dispatchMinesRemaining, TotalNumberOfMines)
      resetMineLocations(dispatchMineLocations);
      resetBoxesClicked(dispatchBoxesClicked);
      setNumberOfMineNeighborsByBoxId({})
  }

  const formChangeHandler: ChangeEventHandler<HTMLSelectElement> = (e: ChangeEvent<HTMLSelectElement>) => {
    setGameResult(gameStatus.NOT_STARTED)
    const difficultySetting = (e.target.value) as difficultyOption;
    const chosenGameSettings: gameSettings = mapDifficultyToGameSettings[difficultySetting];
    setMinesRemaining(dispatchMinesRemaining, chosenGameSettings.totalNumberOfMines)
    setTotalNumberOfMines(chosenGameSettings.totalNumberOfMines)
    resetMineLocations(dispatchMineLocations)
    resetBoxesClicked(dispatchBoxesClicked);
    setNumberOfMineNeighborsByBoxId({})
    setWidth(chosenGameSettings.width)
    setHeight(chosenGameSettings.height)
}

  return (
    <div className="app-root">
      <h1 id='MinesweeperHeader'>Minesweeper</h1>
      <BoxesClickedContext.Provider value={boxesClicked}>
        <BoxesClickedDispatchContext.Provider value={dispatchBoxesClicked}>
          <MinesRemainingContext.Provider value={minesRemaining} >
            <MinesRemainingDispatchContext.Provider value={dispatchMinesRemaining}>
              <MineLocationsContext.Provider value={mineLocations} >
                <MineLocationsDispatchContext.Provider value={dispatchMineLocations} >
                  <div className="Game">
                    <Header
                      resetHandler={resetHandler}
                      formChangeHandler={formChangeHandler}
                      gameResult={gameResult}
                    />
                    <Board 
                      Width={Width}
                      Height={Height}
                      TotalNumberOfMines={TotalNumberOfMines}
                      gameResult={gameResult}
                      numberOfMineNeighborsByBoxId={numberOfMineNeighborsByBoxId}
                      setGameResult={setGameResult}
                      setNumberOfMineNeighborsByBoxId={setNumberOfMineNeighborsByBoxId}
                    />
                  </div>
                </MineLocationsDispatchContext.Provider>
              </MineLocationsContext.Provider>
            </MinesRemainingDispatchContext.Provider>
          </MinesRemainingContext.Provider>
        </BoxesClickedDispatchContext.Provider>
      </BoxesClickedContext.Provider>
    </div>
  );
}