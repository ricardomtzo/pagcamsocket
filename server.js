'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);
var clients = {}; 

io.on('connection', (client) => {

  client.on("join", function(name){
    console.log("Joined: " + name);
    clients[client.id] = name;
    client.emit("update", "You have connected to the server.");
    client.broadcast.emit("update", name + " has joined the server.")
  });

  client.on("requestVideoCall", function(request){
    console.log("Request: ", request);
    client.broadcast.emit("onReceivedVideoCall", clients[client.id], request);
  });

  client.on("acceptVideoCall", function(request){
    console.log("Request: ", request);
    client.broadcast.emit("confirmedVideoCall", clients[client.id], request);
  });

  client.on("releaseButtonFrom", function(request){
    console.log("Request: ", request);
    client.broadcast.emit("releaseButtonTo", clients[client.id], request);
  });

  client.on("disconnect", function(){
    console.log("Disconnect");
    io.emit("update", clients[client.id] + " has left the server.");
    delete clients[client.id];
  });

  //console.log('Client connected');
  //socket.on('disconnect', () => console.log('Client disconnected'));
});

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
