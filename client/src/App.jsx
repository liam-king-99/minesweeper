import Board from "./Board";
import './App.css'

export default function App() {
  return (
    <div className="app-root">
        <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <Board width={16} height={16} totalNumberOfMines={40} />
    </div>
  );
}