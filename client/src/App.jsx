import Board from "./Board";
import { MinesRemainingContext, MinesRemainingDispatchContext } from "./contexts";
import { minesRemainingReducer, setMinesRemaining } from "./reducers/minesRemaining/reducers";
import './App.css'
import { useReducer, useState } from "react";
import Header from "./Header";
import { gameStatus, mapDifficultyToGameSettings } from "./constants";

export default function App() {

  const [minesRemaining, dispatchMinesRemaining] = useReducer(minesRemainingReducer, 40);

  const [Width, setWidth] = useState(16);
  const [Height, setHeight] = useState(16);
  const [TotalNumberOfMines, setTotalNumberOfMines] = useState(40);
  // Keep track of which boxes have been opened. Used to check if the game is won
  const [BoxesClicked, setBoxesClicked] = useState([]);
  // Is set at the beginning of the game and remains constant
  const [MineLocations, setMineLocations] = useState([]);
  // Either NOT_STARTED, IN_PROGRESS, WON, or LOST. Used to see if the game is in progress
  const [gameResult, setGameResult] = useState(gameStatus.NOT_STARTED);

  
  // Maps each box ID to the number of mines that touch the box. Used to display a number 
  // when a box is opened. A key being absent means it touches 0 mines
  const [numberOfMineNeighborsByBoxId, setNumberOfMineNeighborsByBoxId] = useState({})

  const resetHandler = () => {
      setGameResult(gameStatus.NOT_STARTED)
      setMinesRemaining(dispatchMinesRemaining, TotalNumberOfMines)
      setMineLocations([])
      setBoxesClicked([])
      setNumberOfMineNeighborsByBoxId({})
  }

  const formChangeHandler = (e) => {
    setGameResult(gameStatus.NOT_STARTED)
    setMinesRemaining(dispatchMinesRemaining, mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
    setTotalNumberOfMines(mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
    setMineLocations([])
    setBoxesClicked([])
    setNumberOfMineNeighborsByBoxId({})
    setWidth(mapDifficultyToGameSettings[e.target.value]['_width'])
    setHeight(mapDifficultyToGameSettings[e.target.value]['_height'])
}

  return (
    <div className="app-root">
      <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <MinesRemainingContext.Provider value={minesRemaining} >
          <MinesRemainingDispatchContext.Provider value={dispatchMinesRemaining}>
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
                BoxesClicked={BoxesClicked}
                MineLocations={MineLocations}
                gameResult={gameResult}
                numberOfMineNeighborsByBoxId={numberOfMineNeighborsByBoxId}
                setBoxesClicked={setBoxesClicked}
                setMineLocations={setMineLocations}
                setGameResult={setGameResult}
                setNumberOfMineNeighborsByBoxId={setNumberOfMineNeighborsByBoxId}
              />
            </div>
          </MinesRemainingDispatchContext.Provider>
        </MinesRemainingContext.Provider>
    </div>
  );
}