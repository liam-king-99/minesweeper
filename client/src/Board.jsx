import { useCallback, useContext, useState } from 'react';
import Box from './Box';
import Time from './Time';
import { 
    MinesRemainingContext,
    MinesRemainingDispatchContext
} from './contexts';
import './Board.css';

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1,
    NOT_STARTED: 2
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
    // Keep track of which boxes have been opened. Used to check if the game is won
    const [BoxesClicked, setBoxesClicked] = useState([]);
    // Is set at the beginning of the game and remains constant
    const [MineLocations, setMineLocations] = useState([]);
    // Either NOT_STARTED, IN_PROGRESS, WON, or LOST. Used to see if the game is in progress
    const [gameResult, setGameResult] = useState(gameStatus.NOT_STARTED);

    const minesRemaining = useContext(MinesRemainingContext);
    const dispatchMinesRemaining = useContext(MinesRemainingDispatchContext);

    // Maps each box ID to the number of mines that touch the box. Used to display a number 
    // when a box is opened. A key being absent means it touches 0 mines
    const [numberOfMineNeighborsByBoxId, setNumberOfMineNeighborsByBoxId] = useState({})

    // Called by a box if a mine is clicked on
    const setGameLose = useCallback(() => {
        setGameResult(gameStatus.LOST);
    }, [])

    // Called by a box to see if the game is over yet
    const getGameResult = useCallback(() => {
        return gameResult;
    }, [gameResult])

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
                if (numberOfMineNeighborsByBoxId[id] === undefined)
                {
                    const adjacentBoxes = getAdjacentBoxes(id, Height, Width);
                    for (const neighbor of adjacentBoxes)
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
        if (gameResult === gameStatus.NOT_STARTED)
        {
            setGameResult(gameStatus.IN_PROGRESS)
            placeMines(id)
        }
        if (gameResult === gameStatus.IN_PROGRESS || gameResult === gameStatus.NOT_STARTED)
        {
            setBoxesClicked(previousState => Array.from(new Set([...previousState, id])))
            if (BoxesClicked.length === Height*Width - TotalNumberOfMines - 1)
            {
                setGameResult(gameStatus.WON)
                return
            }
            if (Object.keys(numberOfMineNeighborsByBoxId).length > 0 && numberOfMineNeighborsByBoxId[id] === undefined)
            {
                clickOnBox(id)
            }
        }
    }

    // Called when a box is opened automatically. Uses getAllBoxesToOpenOnCascade
    const clickOnBox = (id) => {
        if (!BoxesClicked.includes(id) || BoxesClicked.length === 1)
        {
            if (numberOfMineNeighborsByBoxId[id] === undefined && (BoxesClicked.length === 1 || !BoxesClicked.includes(id)))
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
    
    const setMinesRemaining = (newValue) => {
        dispatchMinesRemaining({
            type: 'set',
            value: newValue
          });
    }

    const getAdjacentBoxes = (firstClickId, height, width) => {
        const row = Math.floor(firstClickId / width);
        const col = firstClickId % width;
        let adjacentBoxes = [];
        for (let rowDiff = -1; rowDiff <= 1; rowDiff++)
        {
            for (let colDiff = -1; colDiff <= 1; colDiff++)
            {
                if (rowDiff !== 0 || colDiff !== 0)
                {
                    if (row + rowDiff >= 0 && row + rowDiff < height && col + colDiff >= 0 && col + colDiff < width)
                    {
                        adjacentBoxes.push(((row + rowDiff) * width + (col + colDiff) % width).toString());
                    }
                }
            }
        }
        return adjacentBoxes;
    }

    // Called after the first click. Ensures that the first box to open won't be a mine
    const placeMines = (firstClickId) => {
        const firstClickAdjacentBoxes = getAdjacentBoxes(firstClickId, Height, Width);
        const templateMineLocations = []
        let templateNumberOfMineNeighborsByBoxId = {}
        if (gameResult === gameStatus.NOT_STARTED && MineLocations.length < TotalNumberOfMines)
        {
            // First click happened. Generate mine locations such that first click is protected
            // Surrounding squares should be safe as well
            while(templateMineLocations.length < TotalNumberOfMines)
            {
                const newMineLocation = Math.floor(Math.random() * (Width * Height)).toString();
                if (newMineLocation !== firstClickId && !templateMineLocations.includes(newMineLocation) && !firstClickAdjacentBoxes.includes(newMineLocation))
                {
                    templateMineLocations.push(newMineLocation)
                    const adjacentBoxes = getAdjacentBoxes(newMineLocation, Height, Width);
                    for (const neighborId of adjacentBoxes)
                    {
                        if (templateNumberOfMineNeighborsByBoxId[neighborId] === undefined)
                        {
                            templateNumberOfMineNeighborsByBoxId[neighborId] = 1
                        }
                        else
                        {
                            templateNumberOfMineNeighborsByBoxId[neighborId] += 1
                        }
                    }
                }
            }
        }
        setNumberOfMineNeighborsByBoxId(templateNumberOfMineNeighborsByBoxId)
        setMineLocations(templateMineLocations)
        return templateMineLocations
    }

    // Create a table that has height rows and width columns
    const createBoard = () => 
    {
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
                let isClicked
                if (BoxesClicked.includes(boxId))
                {
                    isClicked = CLICKED
                }
                else
                {
                    isClicked = UNCLICKED
                }
                const mineNeighbors = gameResult === gameStatus.NOT_STARTED ? 0 : numberOfMineNeighborsByBoxId[boxId] ?? 0
                gameBoard.push(<div id={boxId}>
                                    <Box Id={boxId} 
                                        MineLocations={MineLocations} 
                                        MineNeighbors={mineNeighbors} 
                                        HandleBoardClick={handleBoardClick} 
                                        IsClicked={isClicked}
                                        SetGameLose={setGameLose}
                                        GetGameResult={getGameResult}
                                        TotalNumberOfMines={TotalNumberOfMines}
                                    />
                                </div>);
            }
        }
        return gameBoard;
    }

    return (
    <div className="Game">
        <div id="MinesAndTime">
            {<div className="MineCount">🚩 {minesRemaining}</div>}
            <div className='DifficultyFormAndReset'>
                <select defaultValue={'Intermediate'} onChange={(e) => {
                    setGameResult(gameStatus.NOT_STARTED)
                    setMinesRemaining(mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
                    setTotalNumberOfMines(mapDifficultyToGameSettings[e.target.value]['_totalNumberOfMines'])
                    setMineLocations([])
                    setBoxesClicked([])
                    setNumberOfMineNeighborsByBoxId({})
                    setWidth(mapDifficultyToGameSettings[e.target.value]['_width'])
                    setHeight(mapDifficultyToGameSettings[e.target.value]['_height'])
                }}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                </select>
                <button onClick={() => {
                    setGameResult(gameStatus.NOT_STARTED)
                    setMinesRemaining(TotalNumberOfMines)
                    setTotalNumberOfMines(TotalNumberOfMines)
                    setMineLocations([])
                    setBoxesClicked([])
                    setNumberOfMineNeighborsByBoxId({})
                }}>Reset</button>
            </div>
            {<Time gameStarted={gameResult === gameStatus.IN_PROGRESS} gameOver={gameResult === gameStatus.WON || gameResult === gameStatus.LOST}/>}
        </div>
        <div>
            <div className="Table" style={{display: 'grid', gridTemplateColumns: `repeat(${Width}, 38px)`, gridTemplateRows: `repeat(${Height}, 38px)`}}>
                {createBoard()}
            </div>
        </div>
        {gameResult === gameStatus.WON ? <h2 className='centeredText'>Victory</h2> : gameResult === gameStatus.LOST ? <h2 className='centeredText'>Defeat</h2> : <></>}
    </div>
    );
}

export default Board;
