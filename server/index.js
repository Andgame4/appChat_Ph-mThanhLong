const express = require('express');
const app = express();
const PORT = 14444;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

let users = [];
let messages = {"groups": []};

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('message', (data) => {
        if (data.receiverId) {
            if(typeof messages[socket.id + data.receiverId] === 'undefined'){
                messages[socket.id + data.receiverId] = [];
            }
            messages[socket.id + data.receiverId].push(data);

            if(typeof messages[data.receiverId + socket.id] === 'undefined'){
                messages[data.receiverId + socket.id] = [];
            }
            messages[data.receiverId + socket.id].push(data);

            socketIO.to(socket.id).emit('messageResponse', data);
            let receiver = users.filter(user => user.socketID === data.receiverId)[0];
            if(receiver.currentReceiver === socket.id){
                socketIO.to(data.receiverId).emit('messageResponse', data);
            }
        } else {
            messages.groups.push(data);
            let canReceiveUsers = users.filter(user => user.currentReceiver === null).map(data => data.socketID);
            socketIO.to(canReceiveUsers).emit('messageResponse', data);
        }
    });

    socket.on('changeReceiver', (data) => {
        let currentUser = users.filter(user => user.socketID === socket.id)[0];
        if (data.receiverId) {
            if(currentUser){
                currentUser['currentReceiver'] = data.receiverId;
            }
            socketIO.to(socket.id).emit('changeReceiverResponse', messages[data.receiverId + socket.id] ? messages[data.receiverId + socket.id] : []);
        } else {
            if(currentUser){
                currentUser['currentReceiver'] = null;
            }
            socketIO.to(socket.id).emit('changeReceiverResponse', messages.groups);
        }
    });

    //Listens when a new user joins the server
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        //Updates the list of users when a user disconnects from the server
        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });

    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));
});

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello world',
    });
});


