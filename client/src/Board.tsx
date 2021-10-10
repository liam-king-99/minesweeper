import { useEffect, useState } from 'react';
import Box from './Box';

type BoardProps = {
    width: number,
    height: number,
    totalNumberOfMines: number
}

function Board({width, height, totalNumberOfMines}: BoardProps) {

    const [Width, setWidth] = useState(width);
    const [Height, setHeight] = useState(height);
    const [TotalNumberOfMines, setTotalNumberOfMines] = useState(totalNumberOfMines);

    // Create a table that has height rows and width columns
    const createBoard = () => 
    {
        const gameBoard = [];
        for (let _height = 0; _height < Height; _height++)
        {
            const rowOfMines = [];
            for (let _width = 0; _width < Width; _width++)
            {
                rowOfMines.push(<td id={`${_height*Height + _width}`}><Box /></td>);
            }
            gameBoard.push(<tr>{rowOfMines}</tr>);
        }
        return gameBoard;
    }

    return (
    <div className="Board">
        {createBoard()}
    </div>
    );
}

export default Board;
