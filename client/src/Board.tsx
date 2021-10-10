import { useEffect, useState } from 'react';
import Box from './Box';

function Board() {

    const [width, setWidth] = useState(3);
    const [height, setHeight] = useState(3);
    const [totalNumberOfMines, setTotalNumberOfMines] = useState(0);
    const [users, setUsers] = useState([]);

    const createBoard = () => 
    {
        const gameBoard = [];
        for (let _height = 0; _height < height; _height++)
        {
            const rowOfMines = [];
            for (let _width = 0; _width < width; _width++)
            {
                rowOfMines.push(<td><Box /></td>);
            }
            gameBoard.push(<tr>{rowOfMines}</tr>);
        }
        return gameBoard;
    }

    return (
    <div className="App">
        <h1>Minesweeper</h1>
        {createBoard()}
    </div>
    );
}

export default Board;
