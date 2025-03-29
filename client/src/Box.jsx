import React, { useEffect, useRef, useState } from 'react';
import facingDown from './images/facingDown.png'
import flagged from './images/flagged.png'
import mine from './images/mine.png'
import './Box.css'

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1
};

function Box({Id, IsMine, MineNeighbors, HandleBoardClick, IsClicked, SetGameLose, GetGameResult, UpdateFlaggedBoxes}) {

    const UNCLICKED = 0;
    const CLICKED = 1;

    const boxRef = useRef(null);

    const [isMine, setIsMine] = useState(IsMine);
    const [status, setStatus] = useState(IsClicked);
    const [mineNeighbors, setMineNeighbors] = useState(MineNeighbors);

    useEffect(() => {
        setIsMine(IsMine);
        setMineNeighbors(MineNeighbors);
        setStatus(IsClicked)
    }, [IsMine, MineNeighbors, IsClicked])

    const handleClick = (id) => {
        if (GetGameResult() === gameStatus.IN_PROGRESS)
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
        if (GetGameResult() === gameStatus.IN_PROGRESS)
        {
            UpdateFlaggedBoxes(Id.toString())
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
