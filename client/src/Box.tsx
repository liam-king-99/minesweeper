import { useEffect, useState } from 'react';
import facingDown from './images/facingDown.png'

function Box() {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        const response = await fetch('/users');
        const data = await response.json();
        setUsers(data)
    }

    useEffect(() =>
    {
        fetchUsers();
    }, [])

    return (
    <img src={facingDown}>
    
    </img>
    );
}

export default Box;
