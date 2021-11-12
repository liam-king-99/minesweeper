import { useEffect, useState } from 'react';

type Props = {
    shouldDisplay: boolean,
    gameOver: boolean
}

const Time = ({shouldDisplay, gameOver}: Props) => 
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

    const secondsPassedToTimeString = () =>
    {
        const hours = Math.floor(secondsPassed / 3600);
        const minutes = Math.floor((secondsPassed - (3600 * hours)) / 60);
        const seconds = secondsPassed - (3600 * hours) - (60 * minutes);
        return `${hours > 0 ? hours + ':' : ''}${hours > 0 ? (minutes > 9 ? minutes : `0${minutes}:`) : (minutes > 0 ? `${minutes}:` : '0:')}${seconds > 9 ? seconds : `0${seconds}`}`
        // return `${secondsPassed}`
    }

    if (isTimeVisible)
    {
        return <p className="Time">{secondsPassedToTimeString()}</p>
    }
    
    return <></>
}

export default Time;
