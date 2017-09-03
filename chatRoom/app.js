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
  
  client.on('message', function(data){//监听客户发送的 Message
    console.log(data); //log out the message sent by client
    //before Broadcast , get the nickname of the client
    var nickname = client.nickname;
    var d = new Date();
    /*Debug for Date formate*/
    var year = d.getFullYear();
    var month = d.getMonth();
    var date = (d.getDate() < 10) ? "0"+d.getDate() : d.getDate();
    var hour = d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0"+d.getMinutes() : d.getMinutes();
    
    console.log("Current Mesaage 's time:"+month+"."+date+"."+year+" "+hour+":"+minutes);
    var timeStamp = month+"."+date+"."+year+" "+hour+":"+minutes;
    
    var message = JSON.stringify({timeStamp: timeStamp, name: nickname, data: data});
    //Broadcast with the name and message
    client.broadcast.emit('message', message/*nickname + ": "+ data*/);// broadcast message to all other(注意不包括发送的那个) clients connected
    client.emit('message', message/*nickname + ": " + data*/);// send the same message back to current client,
    //Let Them see their own Messages
    storeMessage(message); //store the client's message
  });
  
  client.on('join', function(userInfo){//Somebody calls join (join the chatRoom)
    console.log(userInfo.name + " " + userInfo.psw + " " + userInfo.option);
    //client.broadcast.emit('addChatter', userInfo.name); //Notify other clients a chatter has joined
    var info = JSON.stringify(userInfo);
    var option = userInfo.option;

    redisClient.hget('chatters', userInfo.name, function(err, reply){
    //redisClient.sadd('chatters', info, function(err, reply){
      console.log("Reply From HGET(get the passward if userName exists): "+reply);
      if(option === 'j'){ //'Join' Request only
           if(reply === null){ //UserName Do Not Exist
            console.log(' UserName Do Not Exist!');
            client.emit('invalidUserName', userInfo);
           }
           else if(reply !== null && reply != userInfo.psw){//UserName Exists, PassWord Wrong
             console.log('Wrong PassWord');
             client.emit('wrongPsw', userInfo); //Send Back To Client
           }
           else{//UserName & Password Both Match
             console.log('Log In');
             logIn(userInfo, client);
           }
      }
      else if(option === 'rj') {//'Register and Join' Request
        if(reply === null){//VALID USERNAME
          console.log('New User!' );//
          redisClient.hset('chatters', userInfo.name, userInfo.psw, redis.print);//Add New User to 'chatters' List
          logIn(userInfo, client); //New User Login
        }
        else{ //User Already Exist
          console.log('User Exists');
          client.emit('userExist', userInfo);
        }
      }
      else{
          console.log('WTF');  
      }
    });
  });
  
  client.on('disconnect', function(name){
    if(client.nickname === undefined){
      console.log("A client has left the chatRoom");
    }
    else{
      console.log(client.nickname+" has left the chatRoom");
      var nickname = client.nickname;
      client.broadcast.emit('removeChatter', nickname);
    
      redisClient.srem('onlineUsers', nickname); //Remove them from our Redis set
    }
  })
  /*
  setTimeout(function(){
    console.log("Oh Connection Timeout");
    client.disconnect(true);
  }, 50000);
  */
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

/*assitant functions*/
var storeMessage = function(message/*name, data*/){
 // var d = new Date();
  //var message = JSON.stringify({timestamp: d.toUTCString, name: name, data: data});
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

var logIn = function(userInfo, client){ //A Chatter Log Into the ChatRoom
 
        client.emit('logIn', userInfo.name); //通知Client登陆成功
        redisClient.sadd('onlineUsers', userInfo.name); //Add To Online User List
        client.broadcast.emit('addChatter', userInfo.name); //Notify other clients a chatter has joined
        /*
        redisClient.hkeys('chatters', function(err, chatters){
        chatters.forEach(function(chatter){
          //var chatterInfo = JSON.parse(chatter);
          client.emit('addChatter', chatter); 
          //emit all the current loged in client(Stored in 'chatters', included this client) to the newly connected client
        });
       })*/
        redisClient.smembers('onlineUsers', function(err, chatters){
          chatters.forEach(function(chatter){
          //var chatterInfo = JSON.parse(chatter);
          client.emit('addChatter', chatter); 
          //emit all the current loged in client(Stored in 'chatters', included this client) to the newly connected client
        });
       });

    
      //redisClient.sadd('chatters', name); //add this chatter to our Redis set 'chatters'
        client.nickname = userInfo.name; //Set Nick Name associate with this client
        //client.broadcast.emit('chat', userInfo.name+" joined the chat"); //Broadcast new user in the chat
    
        redisClient.lrange('messages', 0, -1, function(err, messages){
          //First fetching all of the list items in 'messages' list
          messages = messages.reverse(); //使聊天信息 emitted in the correct Order
          messages.forEach(function(message){
          //iterate through each of the messages stored in the server ,
          //emit to that clien just joined
         // message = JSON.parse(message); //return it into JSON object(name and data properties)
          client.emit('messageHis', message/*message.name+": "+message.data*/); //emit History Message to login users
          });
        });
      
}