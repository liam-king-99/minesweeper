import { useEffect, useState } from 'react';


const Time = ({gameStarted, gameOver}) => 
{
    const [secondsPassed, setSecondsPassed] = useState(0);

    useEffect(() => {
        let interval = null;
        if (gameStarted && !gameOver) {
          interval = setInterval(() => {
            setSecondsPassed(secondsPassed => secondsPassed + 1);
          }, 1000);
        } else if (gameOver) {
          clearInterval(interval);
        }
        return () => clearInterval(interval);
      }, [gameStarted, gameOver, secondsPassed]);


    return <p className="Time">{secondsPassed < 10 ? `00${secondsPassed}` : secondsPassed < 100 ? `0${secondsPassed}` : secondsPassed}</p>
    
}

export default Time;
