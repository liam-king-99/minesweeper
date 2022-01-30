import React, { FormEvent, MouseEventHandler, useEffect, useState } from 'react';
import Board from './Board';
import './DifficultyForm.css';

function DifficultyForm() {

    const BEGINNER = 0;
    const INTERMEDIATE = 1;
    const EXPERT = 2;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [totalNumberOfMines, setTotalNumberOfMines] = useState(0);

    const handleButtonClick = (difficulty: any) => 
    {
        console.log({difficulty})
        switch (difficulty) {
            case "Beginner (9x9, 10 mines)":
                setWidth(9);
                setHeight(9);
                setTotalNumberOfMines(10);
                break;
            case "Intermediate (16x16, 40 mines)":
                setWidth(16);
                setHeight(16);
                setTotalNumberOfMines(40);
                break;
            case "Expert (16x30, 99 mines)":
                setWidth(30);
                setHeight(16);
                setTotalNumberOfMines(99);
                break;
            default:
                setWidth(0);
                setHeight(0);
                setTotalNumberOfMines(0);
                break;
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const difficultyValue = (event.nativeEvent.target as HTMLFormElement).value;
        console.log({difficultyValue})
        switch (difficultyValue) {
            case "Beginner (9x9, 10 mines)":
                setWidth(9);
                setHeight(9);
                setTotalNumberOfMines(10);
                break;
            case "Intermediate (16x16, 40 mines)":
                setWidth(16);
                setHeight(16);
                setTotalNumberOfMines(40);
                break;
            case "Expert (16x30, 99 mines)":
                setWidth(30);
                setHeight(16);
                setTotalNumberOfMines(99);
                break;
            default:
                setWidth(0);
                setHeight(0);
                setTotalNumberOfMines(0);
                break;
        }
    }

    if (width === 0)
    {
        return (
            <div>
                <form id='DifficultyForm' onSubmit={handleSubmit}>
                    <input id='FormButton' type="submit" value="Beginner (9x9, 10 mines)" name="difficulty" onClick={() => {
                        handleButtonClick("Beginner (9x9, 10 mines)")
                    }}/><br/><br/>
                    <input id='FormButton' type="submit" value="Intermediate (16x16, 40 mines)" name="difficulty" onClick={() => {
                        handleButtonClick("Intermediate (16x16, 40 mines)")
                    }}/><br/><br/>
                    <input id='FormButton' type="submit" value="Expert (16x30, 99 mines)" name="difficulty" onClick={() => {
                        handleButtonClick("Expert (16x30, 99 mines)")
                    }}/><br/>
                </form>
            </div>
        );
    }
    else
    {
        return (
            <div>
                <button onClick={() => setWidth(0)}>Reset</button>
                {<Board width={width} height={height} totalNumberOfMines={totalNumberOfMines}/>}
            </div>
        )
    }
}

export default DifficultyForm;
