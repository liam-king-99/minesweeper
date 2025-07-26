import React, { useContext, useEffect, useRef, useState } from 'react';
import { 
    MineLocationsContext,
    MinesRemainingDispatchContext
} from '../contexts';
import './Box.css'
import { incrementMinesRemaining, decrementMinesReamining } from '../reducers/minesRemainingReducer';
import { gameStatus } from '../constants';

function Box({Id, MineNeighbors, HandleBoardClick, IsClicked, SetGameLose, TotalNumberOfMines, gameResult}) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    const boxRef = useRef(null);

    const MineLocations = useContext(MineLocationsContext);
    const dispatchMinesRemaining = useContext(MinesRemainingDispatchContext);

    const [status, setStatus] = useState(IsClicked);

    const isMine = MineLocations.includes(Id);
    

    useEffect(() => {
        if (IsClicked === 1 && status === FLAGGED) {
            incrementMinesRemaining(dispatchMinesRemaining, TotalNumberOfMines);
        }
        setStatus(IsClicked)
    }, [MineLocations, MineNeighbors, IsClicked, TotalNumberOfMines])

    const handleClick = (id) => {
        if (gameResult === gameStatus.IN_PROGRESS || gameResult === gameStatus.NOT_STARTED)
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

    const handleRightClick = (event) => {
        event.preventDefault();
        if (gameResult === gameStatus.IN_PROGRESS)
        {
            if (status === FLAGGED)
                {
                    setStatus(UNCLICKED)
                    incrementMinesRemaining(dispatchMinesRemaining, TotalNumberOfMines);
                }
                else if (status === UNCLICKED)
                {
                    setStatus(FLAGGED)
                    decrementMinesReamining(dispatchMinesRemaining, TotalNumberOfMines);
                }
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
                        💣
                    </div>
                );
            }
            return (
                <div className={`opened-box box count-${MineNeighbors}`} onContextMenu={(e) => e.preventDefault()}>
                    {MineNeighbors ? MineNeighbors : ''}
                </div>
            );
            
        default:
            return (
                <div className="flagged-box box" id={Id} onContextMenu={handleRightClick}>
                    🚩
                </div>
            );
    }
}

export default Box;
