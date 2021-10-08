import './App.css';
import { useEffect, useState } from 'react';

function App() {

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
        {users.map((user, index) => {
            return <li key={index}>{user.name}</li>
        })}
        </ul>
    </div>
    );
}

export default App;
