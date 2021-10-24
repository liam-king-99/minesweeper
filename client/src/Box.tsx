import React, { useEffect, useState } from 'react';
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
import bomb from './images/bomb.png'
import './Box.css'

type BoxProps = {
    Id: string,
    IsMine: boolean,
    MineNeighbors: number,
    HandleBoardClick: Function,
    Width: number,
    Height: number,
    ClickOnBox: Function
}

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

function Box({Id, IsMine, MineNeighbors, HandleBoardClick, Width, Height, ClickOnBox}: BoxProps) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;

    const mouseClickEvents = ['mousedown'];

    const [isMine, setIsMine] = useState(IsMine);
    const [status, setStatus] = useState(UNCLICKED);
    const [mineNeighbors, setMineNeighbors] = useState(MineNeighbors);

    useEffect(() => {
        setIsMine(IsMine);
        setMineNeighbors(MineNeighbors);
    }, [IsMine, MineNeighbors])

    const handleClick = (id: string) => {
        setStatus(CLICKED);
        if (isMine)
        {
            alert("Game over")
            return
        }
        HandleBoardClick(id);
        if (mineNeighbors === 0)
        {
            clickOnNeighbors(Number(id))
        }
    }

    const handleDblClick = (id: string) => {
        setStatus(CLICKED);
        HandleBoardClick(id);
        if (mineNeighbors === 0)
        {
            clickOnNeighbors(Number(id))
        }
    }

    const clickOnNeighbors = (id: number) => {
        for (let horizIter = -1; horizIter < 2; horizIter++)
        {
            for (let vertIter = -1; vertIter < 2; vertIter++)
            {
                const neighborId = id + (Width * horizIter) + vertIter;
                const targetBox = document.getElementById(neighborId.toString()) as HTMLElement;
                targetBox?.click()
                ClickOnBox(neighborId.toString())
            }
        }
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
                <img className="box" id={Id} onClick={() => handleClick(Id)} onContextMenu={handleRightClick} onDoubleClick={() => handleDblClick(Id)} src={facingDown}></img>
                );
        case CLICKED:
            if (isMine)
            {
                return (
                    <img className="box" src={bomb}>
                    </img>
                    );
            }
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
                <img className="box" id={Id} onClick={() => setStatus(UNCLICKED)} onContextMenu={handleRightClick} src={flagged}>
                </img>
                );
    }
}

export default Box;
