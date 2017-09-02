/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Cmd-R),
 * 2. Inspect to bring up an Object Inspector on the result (Cmd-I), or,
 * 3. Display to insert the result in a comment after the selection. (Cmd-L)
 */

var socket = io.connect('http://localhost:8080'); //connect to our Socket.IO server
        
        socket.on('connect', function(data){
                  $('#status').html('Connected to Server');
                  join();
                  //nickname = prompt('What is your nickname'); //要求输入用户名(昵称)
                  //alert(nickname);
                  //socket.emit('join', nickname); //Emit the 'join' Event, Send NickName back to server side
                  });
        
        socket.on('logIn', function(name){
                  $('#join_form').remove();
                  $('.features').fadeIn();
                  //$('.features1').slideDown();
                  $('#chat_column').fadeIn();
                  $('#status').html('Log into ChatRoom');
                  });
        socket.on('message', function(data){ //Listen for that 'message' event
                  //alert('Get Message from Broadcast');
                  insertMessage(data); //Insert Message into the chatRoom
                  });

        socket.on('messageHis', function(data){ //Listen for that 'message' event
          //alert('Get History Messages');
          insertMessageHis(data); //Insert Message into the chatRoom
          });

        socket.on('chat', function(data){
                  //暂时将加入用户信息挂在message_list上
                  insertMessage(data);
                  });
        
        socket.on('addChatter', function(data){
                  //alert('New Chatter! ');
                  insertChatter(data);
                  //$('#join_form').remove();
                  });
        
        socket.on('removeChatter', function(name){
                  alert('A chatter Left');
                  $('.chatter_list #'+name).remove();
                  });
    
