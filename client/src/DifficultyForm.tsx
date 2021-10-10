import React, { FormEvent, useEffect, useState } from 'react';
import Board from './Board';

function DifficultyForm() {

    const BEGINNER = 0;
    const INTERMEDIATE = 1;
    const EXPERT = 2;

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [totalNumberOfMines, setTotalNumberOfMines] = useState(0);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        const difficultyValue = (event.nativeEvent.target as HTMLFormElement).value;
        switch (difficultyValue) {
            case "Beginner":
                setWidth(9);
                setHeight(9);
                setTotalNumberOfMines(10);
                break;
            case "Intermediate":
                setWidth(16);
                setHeight(16);
                setTotalNumberOfMines(40);
                break;
            case "Expert":
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

    

    return (
        <div>
            <form onChange={handleSubmit}>
                <label>
                Beginner (9x9)
                <input type="radio" value="Beginner" name="difficulty" />
                </label><br/>
                <label>
                Intermediate (16x16)
                <input type="radio" value="Intermediate" name="difficulty"/>
                </label>
                <label><br/>
                Expert (16x30)
                <input type="radio" value="Expert" name="difficulty"/>
                </label><br/>
                <input type="submit" value="Reset" />
            </form>
            {width > 0 && <Board width={width} height={height} totalNumberOfMines={totalNumberOfMines}/>}
        </div>
        
    );
}

export default DifficultyForm;
