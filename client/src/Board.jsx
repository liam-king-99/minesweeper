import { useEffect, useState } from 'react';
import Box from './Box';
import Time from './Time';
import './Board.css';

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1
};

// Map id of each box to an array containing ids of its neighbors
let NeighborsOfBox = {};

// Map id of each box to a number representing how many neighbors it has
let NumberOfMineNeighbors = {};

function Board({width, height, totalNumberOfMines}) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    const [Width, setWidth] = useState(width);
    const [Height, setHeight] = useState(height);
    const [TotalNumberOfMines, setTotalNumberOfMines] = useState(totalNumberOfMines);
    const [TotalClicks, setTotalClicks] = useState(0);
    // Keep track of which boxes have been opened. 
    const [BoxesClicked, setBoxesClicked] = useState([]);
    const [MineLocations, setMineLocations] = useState([]);
    const [MinesRemaining, setMinesRemaining] = useState(totalNumberOfMines);
    const [gameResult, setGameResult] = useState(gameStatus.IN_PROGRESS);

    // If a box doesn't touch any mines, it is elligible for cascading. Keep track of neighbors of boxes that don't touch any mines
    //const neighborsOfBoxById: NeighborsOfBox = {};
    const [neighborsOfBoxById, setNeighborsOfBoxById] = useState({})

    const [numberOfMineNeighborsByBoxId, setNumberOfMineNeighborsByBoxId] = useState({})

    const updateMinesRemaining = (delta) =>
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
    const handleBoardClick = (id) => {
        if (gameResult === gameStatus.IN_PROGRESS)
        {
            let newBoxesClicked = BoxesClicked;
            newBoxesClicked.push(id);
            setBoxesClicked(newBoxesClicked);
            setTotalClicks(TotalClicks + 1);
            if (BoxesClicked.length === Height*Width - TotalNumberOfMines)
            {
                setGameResult(gameStatus.WON)
                //alert("Victory!");
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

    const clickOnBox = (id) => {
        if (!BoxesClicked.includes(id))
        {
            const newBoxesClicked = BoxesClicked;
            newBoxesClicked.push(id);
            setBoxesClicked(newBoxesClicked);
        }
        if (BoxesClicked.length === Height*Width - TotalNumberOfMines)
        {
            setGameResult(gameStatus.WON)
            //alert("Victory!");
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
    const countMineNeighbors = (id) => {
        let numberOfMineNeighbors = 0;
        // Top row
        if (id < width)
        {
            // Top left corner
            if (id === 0)
            {
                if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width+1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id+1, id+width, id+width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id+width, id+width+1]}))
                }
            }
            // Top right corner
            else if (id === width-1)
            {
                if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width-1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+width, id+width-1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+width, id+width-1]}))
                }
            }
            // Non-corner on top row
            else
            {
                if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width+1).toString())) numberOfMineNeighbors++;
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
                if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width+1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id+1, id-width, id-width+1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id-width, id-width+1]}))
                }
            }
            // Non-corner on left side
            else
            {
                if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width+1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width+1).toString())) numberOfMineNeighbors++;
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
                if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width-1).toString())) numberOfMineNeighbors++;
                //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id-width, id-width-1];
                if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                {
                    setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id-width, id-width-1]}))
                }
            }
            // Non-corner on right side
            else
            {
                if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id-width-1).toString())) numberOfMineNeighbors++;
                if ((MineLocations).includes((id+width-1).toString())) numberOfMineNeighbors++;
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
            if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-width+1).toString())) numberOfMineNeighbors++;
            //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+1, id-width, id-width-1, id-width+1];
            if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
            {
                setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-width, id-width-1, id-width+1]}))
            }
        }
        // Non-edge
        else
        {
            if ((MineLocations).includes((id-width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-width).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-width+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id+width-1).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id+width).toString())) numberOfMineNeighbors++;
            if ((MineLocations).includes((id+width+1).toString())) numberOfMineNeighbors++;
            //if (numberOfMineNeighbors === 0) neighborsOfBoxById[id.toString()] = [id-1, id+1, id-width-1, id-width, id-width+1, id+width-1, id+width, id+width+1];
            if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
            {
                setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-width-1, id-width, id-width+1, id+width-1, id+width, id+width+1]}))
            }
        }
        
        if (numberOfMineNeighborsByBoxId[id] === undefined) setNumberOfMineNeighborsByBoxId(previousState => ({...previousState, [id]: numberOfMineNeighbors}));
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
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    gameBoard.push(<div id={boxId}>
                                    <Box Id={boxId} IsMine={false} MineNeighbors={0} 
                                    HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} 
                                    Width={Width} Height={Height} IsClicked={0} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/></div>);
                }
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
                const newMineLocation = Math.floor(Math.random() * (Width * Height)).toString();
                if (!(MineLocations).includes(newMineLocation) && newMineLocation !== firstClickId)
                {
                    const newMineLocationArray = MineLocations;
                    newMineLocationArray.push(newMineLocation);
                    setMineLocations(newMineLocationArray);
                    mineLocationIterator++;
                }
            }
            if (BoxesClicked.length === 1)
            {
                clickOnBox(BoxesClicked[0])
            }
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    gameBoard.push(<div id={boxId}>
                                    <Box Id={boxId} IsMine={(MineLocations).includes(boxId)} 
                                    MineNeighbors={countMineNeighbors(Number(boxId))} 
                                    HandleBoardClick={handleBoardClick}
                                    ClickOnBox={clickOnBox} Width={Width} Height={Height} 
                                    IsClicked={BoxesClicked.includes(boxId) ? CLICKED : UNCLICKED} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/>
                                    </div>);
                    
                }
            }
            return gameBoard;
        }
        else
        {
            const gameBoard = [];
            for (let _height = 0; _height < Height; _height++)
            {
                for (let _width = 0; _width < Width; _width++)
                {
                    const boxId = `${_height*Width + _width}`;
                    gameBoard.push(<div id={boxId}>
                                    <Box Id={boxId} IsMine={(MineLocations).includes(boxId)} 
                                    MineNeighbors={numberOfMineNeighborsByBoxId[boxId]} 
                                    HandleBoardClick={handleBoardClick} ClickOnBox={clickOnBox} 
                                    Width={Width} Height={Height} 
                                    IsClicked={BoxesClicked.includes(boxId) ? CLICKED : UNCLICKED} 
                                    UpdateMinesRemaining={updateMinesRemaining} SetGameLose={setGameLose}
                                    GetGameResult={getGameResult}/>
                                    </div>);
                    
                }
            }
            return gameBoard
        }
    }

    return (
    <div className="Game">
        <div id="MinesAndTime" style={{display: 'flex', justifyContent: 'space-between'}}>
            {Height ? <p className="MineCount">🚩 {MinesRemaining}</p> : <></>}
            {Height ?  <Time shouldDisplay={TotalClicks > 0} gameOver={gameResult !== gameStatus.IN_PROGRESS} Width={Width}/> : <></>}
        </div>
        <div>
            <div className="Table" style={{display: 'grid', gridTemplateColumns: `repeat(${Width}, 40px)`, gridTemplateRows: `repeat(${Height}, 40px)`}}>
                {createBoard()}
            </div>
        </div>
        {gameResult === gameStatus.WON ? <h2 className='centeredText'>Victory</h2> : gameResult === gameStatus.LOST ? <h2 className='centeredText'>Defeat</h2> : <></>}
    </div>
    );
}

export default Board;
