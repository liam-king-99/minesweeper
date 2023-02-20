import { useEffect, useState } from 'react';


const Time = ({shouldDisplay, gameOver, Width}) => 
{
    const [isTimeVisible, setIsTimeVisible] = useState(shouldDisplay);
    const [isGameOver, setIsGameOver] = useState(false);
    const [secondsPassed, setSecondsPassed] = useState(0);

    useEffect(() => {
        setIsTimeVisible(shouldDisplay)
        setIsGameOver(gameOver);
    }, [shouldDisplay, gameOver])

    const updateTime = () => {
        if (isTimeVisible)
        {
            setSecondsPassed(secondsPassed + 1);
        }
    }

    if (!gameOver)
    {
        setTimeout(updateTime, 1000);
    }

    return <p className="Time">{secondsPassed < 10 ? `00${secondsPassed}` : secondsPassed < 100 ? `0${secondsPassed}` : secondsPassed}</p>
    
    return <></>
}

export default Time;
