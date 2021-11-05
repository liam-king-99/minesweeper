import { useEffect, useState } from 'react';
import Box from './Box';

type BoardProps = {
    width: number,
    height: number,
    totalNumberOfMines: number
}

type NeighborsOfBox = {
    [key: string]: number[]
  };

enum gameStatus {
    LOST = -1,
    IN_PROGRESS = 0,
    WON = 1
};

function Board({width, height, totalNumberOfMines}: BoardProps) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    const [Width, setWidth] = useState(width);
    const [Height, setHeight] = useState(height);
    const [TotalNumberOfMines, setTotalNumberOfMines] = useState(totalNumberOfMines);
    const [TotalClicks, setTotalClicks] = useState(0);
    // Keep track of which boxes have been opened. 
    const [BoxesClicked, setBoxesClicked] = useState<string[]>([]);
    const [MineLocations, setMineLocations] = useState([]);
    const [MinesRemaining, setMinesRemaining] = useState(totalNumberOfMines);
    const [gameResult, setGameResult] = useState(gameStatus.IN_PROGRESS);

    // If a box doesn't touch any mines, it is elligible for cascading. Keep track of neighbors of boxes that don't touch any mines
    //const neighborsOfBoxById: NeighborsOfBox = {};
    const [neighborsOfBoxById, setNeighborsOfBoxById] = useState<NeighborsOfBox>({})

    const updateMinesRemaining = (delta: number) =>
    {
        const newMinesRemaining = MinesRemaining + delta;
        setMinesRemaining(newMinesRemaining);
    }

    // Called by a box if a mine is clicked on
    const setGameLose = () => {
        setGameResult(gameStatus.LOST);
    }

    // Called by a box to see if the game is over yet
    const getGameResult = () => {
        return gameResult;
    }

    // Update clicks and boxes that have been opened
    const handleBoardClick = (id: string) => {
        if (gameResult === gameStatus.IN_PROGRESS)
        {
            let newBoxesClicked = BoxesClicked;
            newBoxesClicked.push(id);
            setBoxesClicked(newBoxesClicked);
            setTotalClicks(TotalClicks + 1);
            if (BoxesClicked.length === Height*Width - TotalNumberOfMines)
            {
                setGameResult(gameStatus.WON)
                alert("Victory!");
                return
            }
            if (neighborsOfBoxById[id])
            {
                for (let neighbor of neighborsOfBoxById[id])
                {
                    if (!BoxesClicked.includes(neighbor.toString())) clickOnBox(neighbor.toString());
                }
            }
        }
    }

    const clickOnBox = (id: string) => {
        if (!BoxesClicked.includes(id))
        {
            const newBoxesClicked = BoxesClicked;
            newBoxesClicked.push(id);
            setBoxesClicked(newBoxesClicked);
        }
        if (BoxesClicked.length === Height*Width - TotalNumberOfMines)
        {
            alert("Victory!");
            return
        }
        if (neighborsOfBoxById[id])
        {
            for (let neighbor of neighborsOfBoxById[id])
            {
                if (!BoxesClicked.includes(neighbor.toString())) clickOnBox(neighbor.toString());
            }
        }
    }

    // Given an id, see how many mines are touching the box
    const countMineNeighbors = (id: number) => {
        let numberOfMineNeighbors = 0;
        // Top row
        if (id < width)
        {
            // Top left corner
            if (id === 0)
            {
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id+1, id+width, id+width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id+width, id+width+1]}))
                }
            }
            // Top right corner
            else if (id === width-1)
            {
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+width, id+width-1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+width, id+width-1]}))
                }
            }
            // Non-corner on top row
            else
            {
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+1, id+width, id+width-1, id+width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id+width, id+width-1, id+width+1]}))
                }
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
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id+1, id-width, id-width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id-width, id-width+1]}))
                }
            }
            // Non-corner on left side
            else
            {
                if ((MineLocations as string[]).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width+1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id+1, id+width, id-width, id+width+1, id-width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id+width, id-width, id+width+1, id-width+1]}))
                }
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
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id-width, id-width-1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id-width, id-width-1]}))
                }
            }
            // Non-corner on right side
            else
            {
                if ((MineLocations as string[]).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id-width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations as string[]).includes((id+width-1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id-width, id+width, id+width-1, id-width-1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id-width, id+width, id+width-1, id-width-1]}))
                }
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
            //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+1, id-width, id-width-1, id-width+1];
            if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
            {
                setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-width, id-width-1, id-width+1]}))
            }
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
            //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+1, id-width-1, id-width, id-width+1, id+width-1, id+width, id+width+1];
            if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
            {
                setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-width-1, id-width, id-width+1, id+width-1, id+width, id+width+1]}))
            }
        }
        
        return numberOfMineNeighbors;
    }

    // Create a table that has height rows and width columns
    const createBoard = () => 
    {
        if (TotalClicks === 0)
        {
            const newMineArray = [];
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                const rowOfMines = [];
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    rowOfMines.push(<td id={boxId}>
                                    <Box Id={boxId} IsMine={false} MineNeighbors={0} 
                                    HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} 
                                    Width={Width} Height={Height} IsClicked={0} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/></td>);
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
            if (BoxesClicked.length === 1)
            {
                clickOnBox(BoxesClicked[0])
            }
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                const rowOfMines = [];
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    rowOfMines.push(<td id={boxId}>
                                    <Box Id={boxId} IsMine={(MineLocations as string[]).includes(boxId)} 
                                    MineNeighbors={countMineNeighbors(Number(boxId))} 
                                    HandleBoardClick={handleBoardClick}
                                    ClickOnBox={clickOnBox} Width={Width} Height={Height} 
                                    IsClicked={BoxesClicked.includes(boxId) ? CLICKED : UNCLICKED} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/>
                                    </td>);
                    
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
                    const boxId = `${_height*Width + _width}`;
                    rowOfMines.push(<td id={boxId}>
                                    <Box Id={boxId} IsMine={(MineLocations as string[]).includes(boxId)} 
                                    MineNeighbors={countMineNeighbors(Number(boxId))} 
                                    HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} 
                                    Width={Width} Height={Height} 
                                    IsClicked={BoxesClicked.includes(boxId) ? CLICKED : UNCLICKED} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/>
                                    </td>);
                    
                }
                gameBoard.push(<tr>{rowOfMines}</tr>);
            }
            return gameBoard
        }
    }

    return (
    <div className="Board">
        {Height ? <p>Mines Remaining: {MinesRemaining}</p> : <></>}
        {createBoard()}
    </div>
    );
}

export default Board;
