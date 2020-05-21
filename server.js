const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatmessage = require('./utils/messages');
const { userJoin, getCurrUser, getRoomUsers, userLeave } = require('./utils/users')
const { appendNewGroup, listOfGroups } = require('./utils/group')


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));


const botName = 'ChatApp bot'
//Run when client connects
io.on('connection', socket => {

    //Default data of groups
    const groupData = listOfGroups();
    socket.emit('groupData', groupData)

    //New group
    socket.on('newGroup', (groupName) => {
        // Add group name in group field
        const groups = appendNewGroup(groupName);
        socket.emit('groupData', groups)
    });


    //Join room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //Welcome new user
        socket.emit('message', formatmessage(botName,'Welcome to chatApp!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit(
            'message',
            formatmessage(botName,`${user.username} has joined the chat`)
        ); 
        
        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users:getRoomUsers(user.room)
        });


        //Runs when client disconnect
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if(user) {
                io.to(user.room).emit(
                    'message', 
                    formatmessage(botName, `${user.username} has left the chat`)
                );

                //Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users:getRoomUsers(user.room)
                });
            }
        });
    });
    
    //Listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrUser(socket.id);

        io.to(user.room).emit('message', formatmessage(user.username, msg));
    });
});

const PORT = 3000 | process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));