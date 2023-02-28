import { useState } from 'react';
import Box from './Box';
import Time from './Time';
import './Board.css';

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1
};

const mapDifficultyToGameSettings = {
    "Beginner": {
        _totalNumberOfMines: 10,
        _width: 9,
        _height: 9,
    },
    "Intermediate": {
        _totalNumberOfMines: 40,
        _width: 16,
        _height: 16,
    },
    "Expert": {
        _totalNumberOfMines: 99,
        _width: 30,
        _height: 16,
    }
}

function Board({width, height, totalNumberOfMines}) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    // Width, Height, and TotalNumberOfMines stay constant unless the difficulty setting is changed 
    const [Width, setWidth] = useState(width);
    const [Height, setHeight] = useState(height);
    const [TotalNumberOfMines, setTotalNumberOfMines] = useState(totalNumberOfMines);
    // Used to track if the first click has happened. Only updates on left clicks
    const [TotalClicks, setTotalClicks] = useState(0);
    // Keep track of which boxes have been opened. Used to check if the game is won
    const [BoxesClicked, setBoxesClicked] = useState([]);
    // Updates when a user right clicks an unopened box
    const [BoxesFlagged, setBoxesFlagged] = useState([])
    // Is set at the beginning of the game and remains constant
    const [MineLocations, setMineLocations] = useState([]);
    // Updates when a user right clicks an unopened box. Starts as the TotalNumberOfMines
    const [MinesRemaining, setMinesRemaining] = useState(totalNumberOfMines);
    // Either IN_PROGRESS, WON, or LOST. Used to see if the game is in progress
    const [gameResult, setGameResult] = useState(gameStatus.IN_PROGRESS);

    // Maps IDs of boxes that don't touch any mines to all neighboring boxes
    // Used to automatically open boxes when the user opens a box that doesn't touch a mine
    const [neighborsOfBoxById, setNeighborsOfBoxById] = useState({})

    // Maps each box ID to the number of mines that touch the box. Used to display a number 
    // when a box is opened
    const [numberOfMineNeighborsByBoxId, setNumberOfMineNeighborsByBoxId] = useState({})

    // Called by a box if a mine is clicked on
    const setGameLose = () => {
        setGameResult(gameStatus.LOST);
    }

    // Called by a box to see if the game is over yet
    const getGameResult = () => {
        return gameResult;
    }

    // Called when a box that touches no mines is clicked. Returns an array of all of the boxes that 
    // should be opened as a result
    const getAllBoxesToOpenOnCascade = (id) => 
    {
        let setOfBoxIds = new Set()
        const getAllBoxesToOpenOnCascadeHelper = (id) =>
        {
            if (!setOfBoxIds.has(id))
            {
                setOfBoxIds.add(id)
                if (neighborsOfBoxById[id])
                {
                    for (const neighbor of neighborsOfBoxById[id])
                    {
                        getAllBoxesToOpenOnCascadeHelper(neighbor.toString())
                    }
                }
            }
        }
        getAllBoxesToOpenOnCascadeHelper(id)
        return Array.from(setOfBoxIds)
    }

    // Update clicks and boxes that have been opened. Only called on on a left click of an unopened box
    const handleBoardClick = (id) => {
        if (gameResult === gameStatus.IN_PROGRESS)
        {
            setBoxesClicked(previousState => Array.from(new Set([...previousState, id])))
            setTotalClicks(previousState => previousState + 1);
            if (BoxesClicked.length === Height*Width - TotalNumberOfMines - 1)
            {
                setGameResult(gameStatus.WON)
                return
            }
            if (neighborsOfBoxById[id])
            {
                clickOnBox(id)
            }
        }
    }

    // Called when a box is opened automatically. Uses getAllBoxesToOpenOnCascade
    const clickOnBox = (id) => {
        if (TotalClicks <= 1 || !BoxesClicked.includes(id))
        {
            if (neighborsOfBoxById[id] && (BoxesClicked.length === 1 || !BoxesClicked.includes(id)))
            {
                const boxesToOpenOnCascade = getAllBoxesToOpenOnCascade(id)
                setBoxesClicked(previousState =>{
                    if (Array.from(new Set([...previousState, ...boxesToOpenOnCascade])).length === Height*Width - TotalNumberOfMines)
                    {
                        setGameResult(gameStatus.WON)
                    }
                    return Array.from(new Set([...previousState, ...boxesToOpenOnCascade]))
                })
            
            }
            else if (!BoxesClicked.includes(id))
            {
                setBoxesClicked(previousState =>{
                    if (Array.from(new Set([...previousState, id])).length === Height*Width - TotalNumberOfMines)
                    {
                        setGameResult(gameStatus.WON)
                    }
                    return Array.from(new Set([...previousState, id]))
                })
            }

        }
        
    }

    // Updates minesRemaining count and boxesFlagged array
    const rightClickOnBox = (id) => {
        if (BoxesFlagged.includes(id))
        {
            // Remove it from the array
            setMinesRemaining(previousState => Math.min(previousState + 1, TotalNumberOfMines))
            setBoxesFlagged(previousState => previousState.filter(boxId => boxId !== id))
        }
        else
        {
            // Add it to the array
            setMinesRemaining(previousState => Math.min(previousState - 1, TotalNumberOfMines))
            setBoxesFlagged(previousState => [...previousState, id])
        }
    }

    // Called after the first click. Ensures that the first box to open won't be a mine
    const placeMines = (firstClickId) => {
        const templateMineLocations = []
        if (TotalClicks === 1 && MineLocations.length < TotalNumberOfMines)
        {
            // First click happened. Generate mine locations such that first click is protected
            while(templateMineLocations.length < TotalNumberOfMines)
            {
                const newMineLocation = Math.floor(Math.random() * (Width * Height)).toString();
                if (!(templateMineLocations).includes(newMineLocation) && newMineLocation !== firstClickId)
                {
                    templateMineLocations.push(newMineLocation)
                }
            }
            setMineLocations(templateMineLocations)
        }
        return templateMineLocations
    }

    // Given an id, see how many mines are touching the box. Populates setNeighborsOfBoxById
    const countMineNeighbors = (firstClickId) => {
        const templateMineLocations = MineLocations.length ? MineLocations : placeMines(firstClickId)

        for (let _width = 0; _width < Width; _width++)
        {
            for (let _height = 0; _height < Height; _height++)
            {
                const id = _height*Width + _width
                let numberOfMineNeighbors = 0;
                // Top row
                if (id < Width)
                {
                    // Top left corner
                    if (id === 0)
                    {
                        if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width+1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id+Width, id+Width+1]}))
                        }
                    }
                    // Top right corner
                    else if (id === Width-1)
                    {
                        if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width-1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+Width, id+Width-1]}))
                        }
                    }
                    // Non-corner on top row
                    else
                    {
                        if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width+1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id+Width, id+Width-1, id+Width+1]}))
                        }
                    }
                }
                // Left side
                else if (id % Width === 0)
                {
                    // Top left corner already handled
                    // Bottom left corner
                    if (id === Width * Height - Width)
                    {
                        if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width+1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id-Width, id-Width+1]}))
                        }
                    }
                    // Non-corner on left side
                    else
                    {
                        if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width+1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width+1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id+1, id+Width, id-Width, id+Width+1, id-Width+1]}))
                        }
                    }
                }
                // Right side
                else if (id % Width === (Width - 1))
                {
                    // Top right corner already handled
                    // Bottom right corner
                    if (id === Width * Height - 1)
                    {
                        if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width-1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id-Width, id-Width-1]}))
                        }
                    }
                    // Non-corner on right side
                    else
                    {
                        if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id-Width-1).toString())) numberOfMineNeighbors++;
                        if ((templateMineLocations).includes((id+Width-1).toString())) numberOfMineNeighbors++;
                        if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                        {
                            setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id-Width, id+Width, id+Width-1, id-Width-1]}))
                        }
                    }
                }
                // Bottom row
                else if (Math.floor(id / Width) === (Height - 1))
                {
                    // Both corners on bottom row already handled
                    if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-Width-1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-Width+1).toString())) numberOfMineNeighbors++;
                    if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                    {
                        setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-Width, id-Width-1, id-Width+1]}))
                    }
                }
                // Non-edge
                else
                {
                    if ((templateMineLocations).includes((id-Width-1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-Width).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-Width+1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id-1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id+1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id+Width-1).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id+Width).toString())) numberOfMineNeighbors++;
                    if ((templateMineLocations).includes((id+Width+1).toString())) numberOfMineNeighbors++;
                    if (numberOfMineNeighbors === 0 && !neighborsOfBoxById[id])
                    {
                        setNeighborsOfBoxById(previousState => ({...previousState, [id]: [id-1, id+1, id-Width-1, id-Width, id-Width+1, id+Width-1, id+Width, id+Width+1]}))
                    }
                }
                
                if (numberOfMineNeighborsByBoxId[id] === undefined) setNumberOfMineNeighborsByBoxId(previousState => ({...previousState, [id]: numberOfMineNeighbors}));
            }
        }
    }

    // Create a table that has height rows and width columns
    const createBoard = () => 
    {
        if (TotalClicks === 1)
        {
            const firstClickId = BoxesClicked[0];
            countMineNeighbors(firstClickId)
            clickOnBox(BoxesClicked[0])
        }
        const gameBoard = [];
        for (let _height = 0; _height < Height; _height++)
        {
            for (let _width = 0; _width < Width; _width++)
            {
                const boxId = `${_height*Width + _width}`;
                let isClicked
                if (BoxesFlagged.includes(boxId))
                {
                    isClicked = FLAGGED
                }
                else if (BoxesClicked.includes(boxId))
                {
                    isClicked = CLICKED
                }
                else
                {
                    isClicked = UNCLICKED
                }
                const isMine = MineLocations.includes(boxId)
                const mineNeighbors = TotalClicks === 0 ? 0 : numberOfMineNeighborsByBoxId[boxId]
                gameBoard.push(<div id={boxId}>
                                <Box Id={boxId} 
                                IsMine={isMine} 
                                MineNeighbors={mineNeighbors} 
                                HandleBoardClick={handleBoardClick} 
                                IsClicked={isClicked}
                                SetGameLose={setGameLose}
                                GetGameResult={getGameResult}
                                UpdateFlaggedBoxes={rightClickOnBox}/></div>);
            }
        }
        return gameBoard;
    }

    return (
    <div className="Game">
        <div id="MinesAndTime">
            {<div className="MineCount">🚩 {MinesRemaining}</div>}
            <div className='DifficultyFormAndReset'>
                <select defaultValue={'Intermediate'} onChange={(e) => {
                    setGameResult(gameStatus.IN_PROGRESS)
                    setMinesRemaining(mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
                    setTotalNumberOfMines(mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
                    setMineLocations([])
                    setBoxesClicked([])
                    setNeighborsOfBoxById({})
                    setNumberOfMineNeighborsByBoxId({})
                    setWidth(mapDifficultyToGameSettings[e.target.value]['_width'])
                    setHeight(mapDifficultyToGameSettings[e.target.value]['_height'])
                    setTotalClicks(0)
                    setBoxesFlagged([])
                }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                </select>
                <button onClick={() => {
                    setTotalClicks(0)
                    setGameResult(gameStatus.IN_PROGRESS)
                    setMinesRemaining(TotalNumberOfMines)
                    setTotalNumberOfMines(TotalNumberOfMines)
                    setMineLocations([])
                    setBoxesClicked([])
                    setNeighborsOfBoxById({})
                    setNumberOfMineNeighborsByBoxId({})
                    setBoxesFlagged([])
                }}>Reset</button>
            </div>
            {<Time gameStarted={TotalClicks > 0} gameOver={gameResult !== gameStatus.IN_PROGRESS}/>}
        </div>
        <div>
            <div className="Table" style={{display: 'grid', gridTemplateColumns: `repeat(${Width}, 35px)`, gridTemplateRows: `repeat(${Height}, 35px)`}}>
                {createBoard()}
            </div>
        </div>
        {gameResult === gameStatus.WON ? <h2 className='centeredText'>Victory</h2> : gameResult === gameStatus.LOST ? <h2 className='centeredText'>Defeat</h2> : <></>}
    </div>
    );
}

export default Board;
