import Board from "./Board";
import './App.css'

export default function App() {
  return (
    <div className="app-root">
        <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <Board width={9} height={9} totalNumberOfMines={10} />
    </div>
  );
}