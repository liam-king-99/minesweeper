import React, { useContext, useEffect, useRef, useState } from 'react';
import { 
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
    const FLAGGED = 2;

    const boxRef = useRef(null);

    const minesRemaining = useContext(MinesRemainingContext);
    const dispatchMinesRemaining = useContext(MinesRemainingDispatchContext);

    const [isMine, setIsMine] = useState(IsMine);
    const [status, setStatus] = useState(IsClicked);
    const [mineNeighbors, setMineNeighbors] = useState(MineNeighbors);
    

    useEffect(() => {
        if (IsClicked === 1 && status === FLAGGED) {
            incrementMinesRemaining();
        }
        setIsMine(IsMine);
        setMineNeighbors(MineNeighbors);
        setStatus(IsClicked)
    }, [IsMine, MineNeighbors, IsClicked, TotalNumberOfMines])

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

    // Updates minesRemaining count
    const rightClickOnBox = (id) => {
        if (status === FLAGGED)
        {
            setStatus(UNCLICKED)
            incrementMinesRemaining();
        }
        else if (status === UNCLICKED)
        {
            setStatus(FLAGGED)
            decrementMinesReamining();
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
