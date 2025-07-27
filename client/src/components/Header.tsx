import { gameStatus } from '../constants';
import FlagCount from './FlagCount';
import './Board.css'
import Time from './Time';
import FormAndReset from './FormAndReset';
import type { ChangeEvent } from 'react';

export interface HeaderProps {
    resetHandler: () => void,
    formChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void,
    gameResult: Number
}

const Header = ({ resetHandler, formChangeHandler, gameResult }: HeaderProps) => 
{

    return (
        <div id='MinesAndTime'>
            <FlagCount />
            <FormAndReset resetHandler={resetHandler} formChangeHandler={formChangeHandler} />
            <Time gameStarted={gameResult === gameStatus.IN_PROGRESS} gameOver={gameResult === gameStatus.WON || gameResult === gameStatus.LOST}/>
        </div>
    )
    
}

export default Header;
