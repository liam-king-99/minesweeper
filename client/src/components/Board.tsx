import { useCallback, useContext, type ReactElement } from 'react';
import Box from './Box';
import { gameStatus } from '../constants';
import { BoxesClickedContext, BoxesClickedDispatchContext, MineLocationsContext, MineLocationsDispatchContext } from '../contexts';
import { setMineLocations } from '../reducers/mineLocationsReducer';
import { addManyBoxes, addOneBox } from '../reducers/boxesClickedReducer';

export interface BoardProps {
    Width: number,
    Height: number,
    TotalNumberOfMines: number,
    gameResult: number,
    numberOfMineNeighborsByBoxId: {[key: number]: number},
    setGameResult: React.Dispatch<React.SetStateAction<number>>,
    setNumberOfMineNeighborsByBoxId: React.Dispatch<React.SetStateAction<{}>>
}

function Board({
    Width,
    Height,
    TotalNumberOfMines,
    gameResult,
    numberOfMineNeighborsByBoxId,
    setGameResult,
    setNumberOfMineNeighborsByBoxId,
}: BoardProps) {

    const UNCLICKED = 0;
    const CLICKED = 1;

    const boxesClicked = useContext(BoxesClickedContext);
    const dispatchBoxesClicked = useContext(BoxesClickedDispatchContext)

    const MineLocations = useContext(MineLocationsContext);
    const dispatchMineLocations = useContext(MineLocationsDispatchContext);

    if (boxesClicked.size === Height*Width - TotalNumberOfMines)
    {
        setGameResult(gameStatus.WON)
    }

    // Called by a box if a mine is clicked on
    const setGameLose = useCallback(() => {
        setGameResult(gameStatus.LOST);
    }, [setGameResult])

    // Called when a box that touches no mines is clicked. Returns an array of all of the boxes that 
    // should be opened as a result
    const getAllBoxesToOpenOnCascade = (id: number, NumberOfMineNeighborsByBoxId=numberOfMineNeighborsByBoxId): Set<number> => 
    {
        let setOfBoxIds = new Set<number>()
        const getAllBoxesToOpenOnCascadeHelper = (id: number) =>
        {
            if (!setOfBoxIds.has(id))
            {
                setOfBoxIds.add(id)
                if (NumberOfMineNeighborsByBoxId[id] === undefined)
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
    const handleBoardClick = (id: number) => {
        if (gameResult === gameStatus.NOT_STARTED)
        {
            setGameResult(gameStatus.IN_PROGRESS)
            const NumberOfMineNeighborsByBoxId = placeMines(id)
            clickOnBox(id, NumberOfMineNeighborsByBoxId)
        }
        else
        {
            addOneBox(dispatchBoxesClicked, id)
            if (Object.keys(numberOfMineNeighborsByBoxId).length > 0 && numberOfMineNeighborsByBoxId[id] === undefined)
            {
                clickOnBox(id)
            }
        }
    }

    // Called when a box is opened automatically. Uses getAllBoxesToOpenOnCascade
    const clickOnBox = (id: number, NumberOfMineNeighborsByBoxId=numberOfMineNeighborsByBoxId) => {
        if (NumberOfMineNeighborsByBoxId[id] === undefined)
        {
            const boxesToOpenOnCascade = getAllBoxesToOpenOnCascade(id, NumberOfMineNeighborsByBoxId)
            addManyBoxes(dispatchBoxesClicked, boxesToOpenOnCascade)
        
        }
        else
        {
            addOneBox(dispatchBoxesClicked, id);
        }
    }

    const getAdjacentBoxes = (firstClickId: number, height: number, width: number) => {
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
    const placeMines = (firstClickId: number) => {
        const firstClickAdjacentBoxes = getAdjacentBoxes(firstClickId, Height, Width);
        const templateMineLocations: number[] = []
        let templateNumberOfMineNeighborsByBoxId: {[key: number]: number} = {}
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
                    const gameBoard: ReactElement[] = [];
                    Array.from({length: Height}, (_, _height) =>
                        {
                            Array.from({length: Width}, (_, _width) => 
                            {
                                const boxId = _height*Width + _width;
                                const isClicked = boxesClicked.has(boxId) ? CLICKED : UNCLICKED
                                const mineNeighbors = gameResult === gameStatus.NOT_STARTED ? 0 : numberOfMineNeighborsByBoxId[boxId] ?? 0
                                gameBoard.push(<div id={`${boxId}`}>
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
