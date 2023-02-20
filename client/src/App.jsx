import DifficultyForm from "./DifficultyForm";
import './App.css'

export default function App() {
  return (
    <div className="app-root">
        <h1 id='MinesweeperHeader'>Minesweeper</h1>
        <DifficultyForm />
    </div>
  );
}