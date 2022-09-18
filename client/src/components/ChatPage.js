import React, {useCallback, useEffect, useRef, useState} from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';

const ChatPage = ({socket}) => {
    const [messages, setMessages] = useState([]);
    const [typingStatus, setTypingStatus] = useState('');
    const lastMessageRef = useRef(null);
    const [receiver, setReceiver] = useState({});

    useEffect(() => {
        socket.on('messageResponse', (data) => {
            setMessages([...messages, data])
        });

        socket.on('changeReceiverResponse', (data) => {
            setMessages(data)
        });
    }, [socket, messages]);

    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);

    useEffect(() => {
        socket.emit('changeReceiver', {receiverId:  null});
        setReceiver({});
    }, [])
    const changeReceiver = useCallback((currentReceiver) => {
        socket.emit('changeReceiver', {
            receiverId: currentReceiver.socketID
        });
        setReceiver(currentReceiver);
    }, []);

    return (
        <div className="chat">
            <ChatBar socket={socket} changeReceiver={changeReceiver}/>
            <div className="chat__main">
                <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef}
                          receiver={receiver}/>
                <ChatFooter socket={socket} receiver={receiver}/>
            </div>
        </div>
    );
};

export default ChatPage;
