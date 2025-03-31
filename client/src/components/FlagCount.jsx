import { useContext } from 'react';
import { MinesRemainingContext } from '../contexts';

const FlagCount = () => 
{

    const minesRemaining = useContext(MinesRemainingContext);

    return (
        <div className="MineCount">🚩 {minesRemaining}</div>
    )
    
}

export default FlagCount;
