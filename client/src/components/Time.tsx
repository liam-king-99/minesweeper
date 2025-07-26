import { useEffect, useState } from 'react';

export interface TimeProps {
  gameStarted: boolean,
  gameOver: boolean
}

const Time = ({gameStarted, gameOver}: TimeProps) => 
{
    const [secondsPassed, setSecondsPassed] = useState(0);

    useEffect(() => {
        let interval = undefined;
        if (!gameStarted && !gameOver) {
          setSecondsPassed(0)
        }
        else if (gameStarted && !gameOver) {
          interval = setInterval(() => {
            setSecondsPassed(secondsPassed => secondsPassed + 1);
          }, 1000);
        } else if (gameOver) {
          clearInterval(interval);
        }
        return () => {clearInterval(interval)};
      }, [gameStarted, gameOver, secondsPassed]);


    return <div className="Time">{secondsPassed < 10 ? `00${secondsPassed}` : secondsPassed < 100 ? `0${secondsPassed}` : secondsPassed}</div>
    
}

export default Time;
