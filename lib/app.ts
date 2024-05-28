import express = require("express");

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log('Server port: ', PORT);
});

const io = require('socket.io')(server);
const connectedUser = new Set();


var room = "";



io.on('connection', (socket) => {
    console.log("Connected: ", socket.id);
    
    connectedUser.add(socket.id);

    io.emit('connected-user', connectedUser.size);

    socket.on('join-room', (data) => {
        const roomName = data.room;
        console.log("Joining room: ", roomName);
        socket.join(roomName, () => {
            console.log(`Socket ${socket.id} joining ${roomName}`);
        });
    });

    socket.on('disconnect', () => {
        console.log("Disconnected: ", socket.id);
        // Eliminar al usuario desconectado del conjunto de usuarios conectados
        connectedUser.delete(socket.id);
        // Emitir el número actualizado de usuarios conectados a todos los clientes
        io.emit('connected-user', connectedUser.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        const roomName = data.room; 
        console.log('Sending message to room:', roomName);
        socket.to(roomName).emit('message-receive', data);
    });
});