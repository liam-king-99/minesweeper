import React, { useContext, useEffect, useRef, useState } from 'react';
import { 
    BoxesFlaggedContext,
    BoxesFlaggedDispatchContext,
    MinesRemainingContext,
    MinesRemainingDispatchContext
} from './contexts';
import './Box.css'

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1,
    NOT_STARTED: 2
};

function Box({Id, IsMine, MineNeighbors, HandleBoardClick, IsClicked, SetGameLose, GetGameResult, TotalNumberOfMines}) {

    const UNCLICKED = 0;
    const CLICKED = 1;

    const boxRef = useRef(null);

    const boxesFlagged = useContext(BoxesFlaggedContext);
    const dispatchBoxesFlagged = useContext(BoxesFlaggedDispatchContext);

    const minesRemaining = useContext(MinesRemainingContext);
    const dispatchMinesRemaining = useContext(MinesRemainingDispatchContext);

    const [isMine, setIsMine] = useState(IsMine);
    const [status, setStatus] = useState(IsClicked);
    const [mineNeighbors, setMineNeighbors] = useState(MineNeighbors);
    

    useEffect(() => {
        setIsMine(IsMine);
        setMineNeighbors(MineNeighbors);
        setStatus(IsClicked)
    }, [IsMine, MineNeighbors, IsClicked])

    const handleClick = (id) => {
        if (GetGameResult() === gameStatus.IN_PROGRESS || GetGameResult() === gameStatus.NOT_STARTED)
        {
            setStatus(CLICKED);
            if (isMine)
            {
                SetGameLose();
                return
            }
            HandleBoardClick(id);
        }
        
    }

    const decrementMinesReamining = () => {
        dispatchMinesRemaining({
            type: 'decrement',
            maxNumberOfMines: TotalNumberOfMines
          });
    }

    const incrementMinesRemaining = () => {
        dispatchMinesRemaining({
            type: 'increment',
            maxNumberOfMines: TotalNumberOfMines
          });
    }

    const addFlaggedBox = (id) => {
        dispatchBoxesFlagged({
            type: 'add',
            id: id
        })
    }

    const removeFlaggedBox = (id) => {
        dispatchBoxesFlagged({
            type: 'remove',
            id: id
        })
    }

    const setBoxesFlagged = (newValue) => {
        dispatchBoxesFlagged({
            type: 'set',
            value: newValue
        })
    }

    // Updates minesRemaining count and boxesFlagged array
    const rightClickOnBox = (id) => {
        if (boxesFlagged.includes(id))
        {
            // Remove it from the array
            // setMinesRemaining(previousState => Math.min(previousState + 1, TotalNumberOfMines))
            incrementMinesRemaining();
            removeFlaggedBox(id);
        }
        else
        {
            // Add it to the array
            // setMinesRemaining(previousState => Math.min(previousState - 1, TotalNumberOfMines))
            decrementMinesReamining();
            addFlaggedBox(id);
        }
    }

    const handleRightClick = (event) => {
        event.preventDefault();
        if (GetGameResult() === gameStatus.IN_PROGRESS)
        {
            rightClickOnBox(Id.toString())
        }
        
    }

    switch (status) {
        case UNCLICKED:
            return (
                <div 
                    ref={boxRef}
                    className="unopened-box box"
                    id={Id} onClick={() => handleClick(Id)}
                    onContextMenu={handleRightClick}
                />
            );
        case CLICKED:
            if (isMine)
            {
                return (
                    <div className="mine-box box" onContextMenu={(e) => e.preventDefault()}>
                        X
                    </div>
                );
            }
            return (
                <div className={`opened-box box count-${mineNeighbors}`} onContextMenu={(e) => e.preventDefault()}>
                    {mineNeighbors ? mineNeighbors : ''}
                </div>
            );
            
        default:
            return (
                <div className="flagged-box box" id={Id} onContextMenu={handleRightClick}>
                    ?
                </div>
            );
    }
}

export default Box;
