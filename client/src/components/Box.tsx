import { type Dispatch, type MouseEvent, useContext, useEffect, useState } from 'react';
import { 
    MineLocationsContext,
    MinesRemainingDispatchContext
} from '../contexts';
import './Box.css'
import { incrementMinesRemaining, decrementMinesReamining, type MinesRemainingAction } from '../reducers/minesRemainingReducer';
import { gameStatus } from '../constants';

export interface BoxProps {
    Id: number,
    MineNeighbors: number,
    HandleBoardClick: (id: number) => void,
    IsClicked: number,
    SetGameLose: () => void,
    TotalNumberOfMines: number,
    gameResult: number
}

function Box({Id, MineNeighbors, HandleBoardClick, IsClicked, SetGameLose, TotalNumberOfMines, gameResult}: BoxProps) {

    const UNCLICKED = 0;
    const CLICKED = 1;
    const FLAGGED = 2;


    const MineLocations: number[] = useContext(MineLocationsContext);
    const dispatchMinesRemaining: Dispatch<MinesRemainingAction> = useContext(MinesRemainingDispatchContext);

    const [status, setStatus] = useState(IsClicked);

    const isMine = MineLocations.includes(Id);
    

    useEffect(() => {
        if (IsClicked === 1 && status === FLAGGED) {
            incrementMinesRemaining(dispatchMinesRemaining, TotalNumberOfMines);
        }
        setStatus(IsClicked)
    }, [MineLocations, MineNeighbors, IsClicked, TotalNumberOfMines])

    const isGameInProgress = gameResult === gameStatus.IN_PROGRESS || gameResult === gameStatus.NOT_STARTED

    const handleClick = () => {
        setStatus(CLICKED);
        if (isMine)
        {
            SetGameLose();
            return
        }
        HandleBoardClick(Id);
    }

    const handleRightClick = (event: MouseEvent) => {
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
                    className="unopened-box box"
                    id={`${Id}`} onClick={isGameInProgress ? handleClick : undefined}
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
                <div className="flagged-box box" id={`${Id}`} onContextMenu={handleRightClick}>
                    🚩
                </div>
            );
    }
}

export default Box;
