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
                  $('.features').slideDown();
                  $('.features1').slideDown();
                  //$('.features2').fadeIn();
                  $('#status').html('Log into ChatRoom');
                  });
        socket.on('message', function(data){ //Listen for that 'message' event
                  alert('Get Message from Broadcast');
                  insertMessage(data); //Insert Message into the chatRoom
                  });

        socket.on('messageHis', function(data){ //Listen for that 'message' event
          alert('Get History Messages');
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
    
        $('#chat_form').on('click', '#sendBtn', function(event){ //Hit Submit to send message
                               event.preventDefault();
                               alert('Submit Hit!!!');
                               var message = $('#chat_input').val(); //grab the Message from message input Box
                               socket.emit('message', message); //Emit the message event on the Server
                               //***先假设Server Side 批准该Message***//
                               //insertMessage(message);
                               });
        $('#quitChat').on('click', function(event){
                          event.preventDefault();
                          alert('QuitChatRoom!');
                          socket.disconnect(true);
        });

        $('#pswVisible').on('click', function(event){
                    event.preventDefault();
                            if($(this).attr('class') === 'glyphicon glyphicon-eye-close feature-i'){
                                $('#user_psw').attr('type', 'text');
                                $('#psw_confirm').attr('type', 'text');
                                $(this).attr('class', 'glyphicon glyphicon-eye-open feature-i');
                            }
                            else{
                                $('#user_psw').attr('type', 'password');
                                $('#psw_confirm').attr('type', 'password');
                                $(this).attr('class', 'glyphicon glyphicon-eye-close feature-i');
                            }
        });

        $('#show_chathis').on('click', function(event){
                    event.preventDefault();
                              //console.log(list.find('.features-chatHis'));
                              console.log($('#messageHis_list').find('.list-group-item').length);
                              if($('#messageHis_list').find('.list-group-item').length === 0){
                                var message = $('<a href="#" class="list-group-item">No History Messages Available</a>');
                              $('#messageHis_list').append(message);
                              $(this).remove();
                               $('#messageHis_list').fadeIn();
                              }
                              else{
                              $('#messageHis_list').fadeToggle();
                              }
                    });

        /*
        window.onunload=function(){
         
            socket.disconnect(true);
        }
         */
        function insertMessage(data){
            message = JSON.parse(data); //return it into JSON object(timeStamp, name and data properties)
            var messageLi = $('<a href="#" class="list-group-item features2"></a>');
            //features2 control the style of each message Box
            $('<h4 class="list-group-item-heading">'+message.timeStamp+'</h4>').appendTo(messageLi);
            $('<p class="list-group-item-text">'+message.name+": "+message.data+'</p>').appendTo(messageLi);
            $('#message_list').append(messageLi);
        }

function insertMessageHis(data){ //Insert chat History
    message = JSON.parse(data); //return it into JSON object(timeStamp, name and data properties)
    var messageLi = $('<a href="#" class="list-group-item features2"></a>');
    //features2 control the style of each message Box
    $('<h4 class="list-group-item-heading">'+message.timeStamp+'</h4>').appendTo(messageLi);
    $('<p class="list-group-item-text">'+message.name+": "+message.data+'</p>').appendTo(messageLi);
    $('#messageHis_list').append(messageLi);
}

    function insertChatter(name){
        //var chatter = $('<li>'+ name +'</li>').data('name', name);
        var chatter = $('<li></li>');
        $('<h3>'+name+'</h3>').appendTo(chatter);
        chatter.attr('id', name);
        $('.chatter_list').append(chatter);
    }
    function join(){
        $(document).ready(function(){
            $('#join_btn').on('click', function(event){ //Hit Submit to send message
                                   event.preventDefault();
                                   var form = $(this).closest('#join_form');
                                   alert('Join_Form Submit Hit!!!');
                                   var userName = $('#user_name').val();
                                   var userPsw = $('#user_psw').val();
                                   //alert(userName +" "+ userPsw);
                                   if(userName === ""){
                                        alert("Empty UserName!");
                                        form.trigger('reset'); //cleans up form text input fields
                                   }else if(userPsw === ""){
                                        alert("Empty UserPassword!");
                                        form.trigger('reset');  //cleans up form text input fields
                                   }else{
                                    //alert("HHH");
                                   socket.emit('join',{'name' : userName, 'psw' : userPsw, 'option' : 'j'});
                                    //'option : j' stands for join request only
                                   socket.on('invalidUserName', function(userInfo){
                                             alert('UserName Do Not Exist!');
                                             form.trigger('reset');
                                             });
                                   socket.on('wrongPsw', function(existInfo){
                                             alert('Wrong PassWord! :)');
                                             form.trigger('reset');
                                             });
                                   }
            });
          
            $('#register').on('click', function(event){
                           event.preventDefault();
                           var form = $(this).closest('#join_form');
                           form.find('#psw_confirm_div').slideDown();
                           form.find('#regis_join').fadeIn();
                           //Remove button 'Join the Chat' & 'Register'
                           form.find('#join_btn').remove();
                           $(this).remove();
            });
            
            $('#regis_join').on('click', function(event){
                                event.preventDefault();
                                var form = $(this).closest('#join_form');
                                var userName = $('#user_name').val();
                                var preUserName = userName;
                                var userPsw = $('#user_psw').val();
                                var pswCof = $('#psw_confirm').val();
                                if(userName === ""){
                                alert("Empty UserName!");
                                form.trigger('reset'); //cleans up form text input fields
                                }else if(userPsw === ""){
                                alert("Empty UserPassword!");
                                form.trigger('reset');  //cleans up form text input fields
                                }else if(pswCof === ""){
                                alert("Please confim your PassWord!");
                                form.trigger('reset');  //cleans up form text input fields
                                }
                                else if(userPsw !== pswCof){
                                alert("Please enter the same PassWord");
                                form.trigger('reset');  //cleans up form text input fields
                                $('#user_name').val(preUserName);
                                }
                                else{//Register and Join
                                //Register and Join Request
                                socket.emit('join',{'name' : userName, 'psw' : userPsw, 'option' : 'rj'});
                                socket.on('userExist', function(userInfo){
                                          alert('User Already Exists! Try Another One');
                                          form.trigger('reset');
                                          });
                                }
               
            });
       
        });
    }
