import React, { useEffect, useRef, useState } from 'react';
import facingDown from './images/facingDown.png'
import box0 from './images/box0.png'
import box1 from './images/box1.png'
import box2 from './images/box2.png'
import box3 from './images/box3.png'
import box4 from './images/box4.png'
import box5 from './images/box5.png'
import box6 from './images/box6.png'
import box7 from './images/box7.png'
import box8 from './images/box8.png'
import flagged from './images/flagged.png'
import mine from './images/mine.png'
import './Box.css'


const MineNeighborImages = [
    box0,
    box1,
    box2,
    box3,
    box4,
    box5,
    box6,
    box7,
    box8
]

const gameStatus = {
    LOST: -1,
    IN_PROGRESS: 0,
    WON: 1
};

function Box({Id, IsMine, MineNeighbors, HandleBoardClick, IsClicked, UpdateMinesRemaining, SetGameLose, GetGameResult, UpdateFlaggedBoxes}) {

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
                <img ref={boxRef} className="box" id={Id} onClick={() => handleClick(Id)} onContextMenu={handleRightClick} src={facingDown} alt="unopened"></img>
                );
        case CLICKED:
            if (isMine)
            {
                return (
                    <img className="box" onContextMenu={(e) => e.preventDefault()} src={mine} alt="mine">
                    </img>
                    );
            }
            return (
                <img className="box" onContextMenu={(e) => e.preventDefault()} src={MineNeighborImages[mineNeighbors]} alt={mineNeighbors}>
                </img>
                );
            
        default:
            return (
                <img className="box" id={Id} onContextMenu={handleRightClick} src={flagged} alt="flagged">
                </img>
                );
    }
}

export default Box;
