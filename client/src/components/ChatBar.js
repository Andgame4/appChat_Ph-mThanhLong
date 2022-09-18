import React, {useEffect, useState} from 'react';

const ChatBar = ({socket, changeReceiver}) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, users]);


    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>
            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    <div><a href="#" key="chat-group" onClick={() => changeReceiver({})}>Chat with group</a></div>
                    {users.filter((user) => localStorage.getItem('userName') !== user.userName)
                        .map((user) => (
                            <div><a href="#" key={user.socketID} onClick={() => changeReceiver(user)}>{user.userName}</a></div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
