import { useCallback, useContext } from 'react';
import Box from './Box';
import { gameStatus } from '../constants';
import { MineLocationsContext, MineLocationsDispatchContext, MinesRemainingContext } from '../contexts';
import { setMineLocations } from '../reducers/mineLocationsReducer';

function Board({
    Width,
    Height,
    TotalNumberOfMines,
    BoxesClicked,
    gameResult,
    numberOfMineNeighborsByBoxId,
    setBoxesClicked,
    setGameResult,
    setNumberOfMineNeighborsByBoxId,
}) {

    const UNCLICKED = 0;
    const CLICKED = 1;

    const MineLocations = useContext(MineLocationsContext);
    const dispatchMineLocations = useContext(MineLocationsDispatchContext);

    // Called by a box if a mine is clicked on
    const setGameLose = useCallback(() => {
        setGameResult(gameStatus.LOST);
    }, [])

    // Called when a box that touches no mines is clicked. Returns an array of all of the boxes that 
    // should be opened as a result
    const getAllBoxesToOpenOnCascade = (id, numberOfMineNeighborsByBoxId=numberOfMineNeighborsByBoxId) => 
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
                        getAllBoxesToOpenOnCascadeHelper(neighbor)
                    }
                }
            }
        }
        getAllBoxesToOpenOnCascadeHelper(id)
        return setOfBoxIds
    }

    // Update clicks and boxes that have been opened. Only called on on a left click of an unopened box
    const handleBoardClick = (id) => {
        if (gameResult === gameStatus.NOT_STARTED)
        {
            setGameResult(gameStatus.IN_PROGRESS)
            const NumberOfMineNeighborsByBoxId = placeMines(id)
            clickOnBox(id, NumberOfMineNeighborsByBoxId)
        }
        else if (gameResult === gameStatus.IN_PROGRESS || gameResult === gameStatus.NOT_STARTED)
        {
            setBoxesClicked(previousState => new Set([...previousState, id]))
            if (BoxesClicked.size === Height*Width - TotalNumberOfMines - 1)
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
    const clickOnBox = (id, NumberOfMineNeighborsByBoxId=numberOfMineNeighborsByBoxId) => {
        if (!BoxesClicked.has(id) || BoxesClicked.size === 1)
        {
            if (NumberOfMineNeighborsByBoxId[id] === undefined && (BoxesClicked.size === 1 || !BoxesClicked.has(id)))
            {
                const boxesToOpenOnCascade = getAllBoxesToOpenOnCascade(id, NumberOfMineNeighborsByBoxId)
                setBoxesClicked(previousState =>{
                    if (new Set(previousState.union(boxesToOpenOnCascade)).size === Height*Width - TotalNumberOfMines)
                    {
                        setGameResult(gameStatus.WON)
                    }
                    return new Set(previousState.union(boxesToOpenOnCascade))
                })
            
            }
            else if (!BoxesClicked.has(id))
            {
                setBoxesClicked(previousState =>{
                    if (new Set([...previousState, id]).size === Height*Width - TotalNumberOfMines)
                    {
                        setGameResult(gameStatus.WON)
                    }
                    return new Set([...previousState, id])
                })
            }

        }
        
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
                        adjacentBoxes.push((row + rowDiff) * width + (col + colDiff) % width);
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
                const newMineLocation = Math.floor(Math.random() * (Width * Height));
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
        setMineLocations(dispatchMineLocations, templateMineLocations);
        setNumberOfMineNeighborsByBoxId(templateNumberOfMineNeighborsByBoxId)
        return templateNumberOfMineNeighborsByBoxId
    }

    return (
    <>
        <div>
            <div className="Table" style={{display: 'grid', gridTemplateColumns: `repeat(${Width}, 38px)`, gridTemplateRows: `repeat(${Height}, 38px)`}}>
                {(() => {
                    const gameBoard = [];
                    Array.from({length: Height}, (_, _height) =>
                        {
                            Array.from({length: Width}, (_, _width) => 
                            {
                                const boxId = _height*Width + _width;
                                const isClicked = BoxesClicked.has(boxId) ? CLICKED : UNCLICKED
                                const mineNeighbors = gameResult === gameStatus.NOT_STARTED ? 0 : numberOfMineNeighborsByBoxId[boxId] ?? 0
                                gameBoard.push(<div id={boxId}>
                                                    <Box Id={boxId} 
                                                        MineNeighbors={mineNeighbors} 
                                                        HandleBoardClick={handleBoardClick} 
                                                        IsClicked={isClicked}
                                                        SetGameLose={setGameLose}
                                                        TotalNumberOfMines={TotalNumberOfMines}
                                                        gameResult={gameResult}
                                                    />
                                                </div>);
                            })
                        })
                    return gameBoard
                })()}
            </div>
        </div>
        {gameResult === gameStatus.WON ? <h2 className='centeredText'>Victory</h2> : gameResult === gameStatus.LOST ? <h2 className='centeredText'>Defeat</h2> : <></>}
    </>
    );
}

export default Board;
