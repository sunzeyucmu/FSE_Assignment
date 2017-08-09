var express = require('express'); //require the 'express' module
var app = express(); //initialize an express application
var server = require('http').createServer(app); //create an HTTP server and have it dispatch requests to express
var io = require('socket.io')(server); //require 'socket.io' module and allow it to use HTTP server to listen for requests
//Now socket.io and Express are sharing the same HTTP server

io.on('connection', function(client){
  //listen for 'connection' event inside Socket.IO
  console.log('Client connected!'); //
  //client.emit('message', {hello: 'world'});//emit 'message' event on our clien, which is the browsers!
  //Let server listen for 'message' event
  client.on('message', function(data){//监听客户发送的 Message
    console.log(data); //log out the message sent by client
    //before Broadcast , get the nickname of the client
    var nickname = client.nickname;
    //Broadcast with the name and message
    client.broadcast.emit('message', "Username: "+nickname + ": "+ data);// broadcast message to all other(注意不包括发送的那个) clients connected
    client.emit('message', nickname + ": " + data);// send the same message back to current client,
    //Let Them see their own Messages
  });
  
  client.on('join', function(name){//Somebody calls join (join the chatRoom)
    //asume they're going to send in a Name
    console.log(name);
    client.nickname = name; //Set Nick Name associate with this client
  });
});

app.use(express.static('public')); //static middleware serving files from public folder
/*
app.get('/'//root route,function(req, res){
  //serve index.html file in client side
  //sending index.html to client side with Express
  res.sendFile(__dirname//current directory+ '/index.html');
  //res.sendFile(__dirname//current directory + '/socket.io.js');
});
*/

server.listen(8080); //Get server listen on port 8080