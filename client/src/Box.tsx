import { useEffect, useState } from 'react';
import facingDown from './images/facingDown.png'
import './Box.css'

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
    <img className="box"  onClick={() => alert("Click")} src={facingDown}>
    
    </img>
    );
}

export default Box;
