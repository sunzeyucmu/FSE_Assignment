var express = require('express'); //require the 'express' module
var app = express(); //initialize an express application
var server = require('http').createServer(app); //create an HTTP server and have it dispatch requests to express
var io = require('socket.io')(server); //require 'socket.io' module and allow it to use HTTP server to listen for requests
//Now socket.io and Express are sharing the same HTTP server
var redis = require('redis');// Redis is non-blocking ***NEED TO RUN REDIS IN THE FIRST PLACE***
//Redis Sets are lists of unique data, can't have duplicates
var redisClient = redis.createClient(); //Create our Redis client
//var messages = []; //Store the Messages Also need to persist the messages even if the server restart

io.on('connection', function(client){
  //listen for 'connection' event inside Socket.IO
  console.log('Client connected!'); //
  //client.emit('message', {hello: 'world'});//emit 'message' event on our clien, which is the browsers!
  //Let server listen for 'message' event
  setTimeout(function(){
    console.log("Oh");
    client.disconnect(true);
  }, 5000);
  
  client.on('message', function(data){//监听客户发送的 Message
    console.log(data); //log out the message sent by client
    //before Broadcast , get the nickname of the client
    var nickname = client.nickname;
    //Broadcast with the name and message
    client.broadcast.emit('message', nickname + ": "+ data);// broadcast message to all other(注意不包括发送的那个) clients connected
    client.emit('message', nickname + ": " + data);// send the same message back to current client,
    //Let Them see their own Messages
    storeMessage(nickname, data); //store the client's message
  });
  
  client.on('join', function(name){//Somebody calls join (join the chatRoom)
    //asume they're going to send in a Name
    console.log(name);
    client.broadcast.emit('addChatter', name); //Notify other clients a chatter has joined
    
    redisClient.smembers('chatters', function(err, chatters){
      chatters.forEach(function(chatter){
        client.emit('addChatter', chatter); 
        //emit all the current loged in client(Stored in 'chatters') to the newly connected client
      });
    })
    
    redisClient.sadd('chatters', name); //add this chatter to our Redis set 'chatters'
    client.nickname = name; //Set Nick Name associate with this client
    client.broadcast.emit('chat', name+" joined the chat"); //Broadcast new user in the chat
    
    redisClient.lrange('messages', 0, -1, function(err, messages){
      //First fetching all of the list items in 'messages' list
      messages = messages.reverse(); //使聊天信息 emitted in the correct Order
      messages.forEach(function(message){
        //iterate through each of the messages stored in the server ,
        //emit to that clien just joined
        message = JSON.parse(message); //return it into JSON object(name and data properties)
        client.emit('message', message.name+": "+message.data);
      });
    });
  });
  
  client.on('disconnect', function(name){
    console.log(client.nickname+" has left the chatRoom");
    var nickname = client.nickname;
    client.broadcast.emit('removeChatter', nickname);
    
    redisClient.srem('chatters', nickname); //Remove them from our Redis set
  })
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

var storeMessage = function(name, data){
  var message = JSON.stringify({name: name, data: data});
  //Turn the object into a String, whcih can be easily stored in Redis
  redisClient.lpush('messages', message, function(err, response){
  //send in the new message(contain name and data), into 'messages' list Stored in Redis
    redisClient.ltrim('messages', 0, 9); //Keep the newest 10 items in the 'messages' list
  });
  /*
  messages.push({name: name, data: data}); //Push an object with the client's name and messages into the array
  if(messages.length > 10){
    messages.shift(); //if more than 10 messages long, remove the first one
  }
  */
}