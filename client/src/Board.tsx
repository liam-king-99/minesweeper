import { useState } from 'react';
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
    const [TotalClicks, setTotalClicks] = useState(0);
    // Keep track of which boxes have been opened
    const [BoxesClicked, setBoxesClicked] = useState([]);
    const [MineLocations, setMineLocations] = useState([]);

    // Update clicks and boxes that have been opened
    const handleBoardClick = (id: string) => {
        let newBoxesClicked = BoxesClicked as string[];
        newBoxesClicked.push(id);
        setBoxesClicked(newBoxesClicked as never[]);
        console.log(BoxesClicked)
        setTotalClicks(TotalClicks + 1);
    }

    const clickOnBox = (id: string) => {
        const targetBox = document.getElementById(id);
        targetBox?.click();
    }

    // Given an id, see how many mines are touching the box
    const countMineNeighbors = (id: number) => {
        let numberOfMineNeighbors = 0;
        if (id === 450 || id === 451)
        {
            console.log({id});
        }
        // Top row
        if (id < width)
        {
            // Top left corner
            if (id === 0)
            {
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
            }
            // Top right corner
            else if (id === width-1)
            {
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
            }
            // Non-corner on top row
            else
            {
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
            }
        }
        // Left side
        else if (id % width === 0)
        {
            // Top left corner already handled
            // Bottom left corner
            if (id === width * height - width)
            {
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width+1).toString())) numberOfMineNeighbors++;
            }
            // Non-corner on left side
            else
            {
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width+1).toString())) numberOfMineNeighbors++;
            }
        }
        // Right side
        else if (id % width === (width - 1))
        {
            // Top right corner already handled
            // Bottom right corner
            if (id === width * height - 1)
            {
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width-1).toString())) numberOfMineNeighbors++;
            }
            // Non-corner on right side
            else
            {
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
            }
        }
        // Bottom row
        else if (Math.floor(id / Width) === (Height - 1))
        {
            // Both corners on bottom row already handled
            if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-width+1).toString())) numberOfMineNeighbors++;
        }
        // Non-edge
        else
        {
            if ((MineLocations as string[]).includes((id-width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-width+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
            if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
        }
        
        return numberOfMineNeighbors;
    }

    // Create a table that has height rows and width columns
    const createBoard = () => 
    {
        if (TotalClicks === 0)
        {
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                const rowOfMines = [];
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    rowOfMines.push(<td id={boxId}><Box Id={boxId} IsMine={false} MineNeighbors={0} HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} Width={Width} Height={Height}/></td>);
                }
                gameBoard.push(<tr>{rowOfMines}</tr>);
            }
            return gameBoard;
        }
        else if (TotalClicks === 1)
        {
            const firstClickId = BoxesClicked[0];
            let mineLocationIterator = 0;
            // First click happened. Generate mine locations such that first click is protected
            while(mineLocationIterator < TotalNumberOfMines && MineLocations.length < TotalNumberOfMines)
            {
                const newMineLocation: string = Math.floor(Math.random() * (Width * Height)).toString();
                if (!(MineLocations as string[]).includes(newMineLocation) && newMineLocation !== firstClickId)
                {
                    const newMineLocationArray = MineLocations as string[];
                    newMineLocationArray.push(newMineLocation);
                    setMineLocations(newMineLocationArray as never[]);
                    mineLocationIterator++;
                }
            }
            console.log(`Mines: ${MineLocations}`);
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                const rowOfMines = [];
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    if (Number(boxId) === 450)
                    {
                        console.log({boxId});
                    }
                    if ((MineLocations as string[]).includes(boxId))
                    {
                        rowOfMines.push(<td id={boxId}><Box Id={boxId} IsMine={true} MineNeighbors={countMineNeighbors(Number(boxId))} HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} Width={Width} Height={Height}/></td>);
                    }
                    else
                    {
                        rowOfMines.push(<td id={boxId}><Box Id={boxId} IsMine={false} MineNeighbors={countMineNeighbors(Number(boxId))} HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} Width={Width} Height={Height}/></td>);
                    }
                }
                gameBoard.push(<tr>{rowOfMines}</tr>);
            }
            return gameBoard;
        }
        else
        {
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                const rowOfMines = [];
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Height + _width}`;
                    if ((MineLocations as string[]).includes(boxId))
                    {
                        rowOfMines.push(<td id={boxId}><Box Id={boxId} IsMine={true} MineNeighbors={countMineNeighbors(Number(boxId))} HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} Width={Width} Height={Height}/></td>);
                    }
                    else
                    {
                        rowOfMines.push(<td id={boxId}><Box Id={boxId} IsMine={false} MineNeighbors={countMineNeighbors(Number(boxId))} HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} Width={Width} Height={Height}/></td>);
                    }
                }
                gameBoard.push(<tr>{rowOfMines}</tr>);
            }
            return gameBoard
        }
    }

    return (
    <div className="Board">
        {createBoard()}
    </div>
    );
}

export default Board;
