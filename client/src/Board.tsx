import { useEffect, useState } from 'react';
import Box from './Box';

function Board() {

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
    <div className="App">
        <h1>Users</h1>
        <ul>
            {users.map((user) => (
                <li>
                    {JSON.stringify(user, null, 2)}
                </li>
                ))}
        </ul>
        <Box />
    </div>
    );
}

export default Board;
