import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import ChatPage from './components/ChatPage';
import socketIO from 'socket.io-client';

const socket = socketIO.connect('http://192.168.1.13:4000');
function App() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Home socket={socket}/>}/>
                    <Route path="/chat" element={<ChatPage socket={socket}/>}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
