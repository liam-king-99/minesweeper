import React, { useState } from 'react';
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
import './Box.css'

function Box() {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    const [isMine, setIsMine] = useState(false);
    const [status, setStatus] = useState(UNCLICKED);
    const [mineNeighbors, setMineNeighbors] = useState(0);

    const handleClick = () => {
        setStatus(CLICKED);
    }

    const handleRightClick = (event: React.MouseEvent) => {
        event.preventDefault();
        if (status === UNCLICKED)
        {
            setStatus(FLAGGED);
        }
        else
        {
            setStatus(UNCLICKED);
        }
        
    }

    switch (status) {
        case UNCLICKED:
            return (
                <img className="box"  onClick={handleClick} onContextMenu={handleRightClick} src={facingDown}></img>
                );
        case CLICKED:
            switch (mineNeighbors) {
                case 0:
                    return (
                        <img className="box" src={box0}>
                        </img>
                        );
                case 1:
                    return (
                        <img className="box" src={box1}>
                        </img>
                        );
                case 2:
                    return (
                        <img className="box" src={box2}>
                        </img>
                        );
                case 3:
                    return (
                        <img className="box" src={box3}>
                        </img>
                        );
                case 4:
                    return (
                        <img className="box" src={box4}>
                        </img>
                        );
                case 5:
                    return (
                        <img className="box" src={box5}>
                        </img>
                        );
                case 6:
                    return (
                        <img className="box" src={box6}>
                        </img>
                        );
                case 7:
                    return (
                        <img className="box" src={box7}>
                        </img>
                        );
                default:
                    return (
                        <img className="box" src={box8}>
                        </img>
                        );
            }
        default:
            return (
                <img className="box"  onClick={() => setStatus(UNCLICKED)} onContextMenu={handleRightClick} src={flagged}>
                </img>
                );
    }
}

export default Box;
