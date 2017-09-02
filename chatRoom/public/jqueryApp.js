/*
 * This is a JavaScript Scratchpad.
 *
 * Enter some JavaScript, then Right Click or choose from the Execute Menu:
 * 1. Run to evaluate the selected text (Cmd-R),
 * 2. Inspect to bring up an Object Inspector on the result (Cmd-I), or,
 * 3. Display to insert the result in a comment after the selection. (Cmd-L)
 */
/*
        window.onunload=function(){
         
            socket.disconnect(true);
        }
         */

$(document).ready(function () {
  // make sure the DOM has finished loading the HTML content before we can reliably use jQuery.
  $('#chat_form').on('click', '#sendBtn', function (event) { //Hit Submit to send message
    event.preventDefault();
    //alert('Submit Hit!!!');
    var message = $('#chat_input').val(); //grab the Message from message input Box
    socket.emit('message', message); //Emit the message event on the Server
    $('#chat_input').val(""); //Clear the input box
    //***先假设Server Side 批准该Message***//
    //insertMessage(message);
  });
  $('#quitChat').on('click', function (event) {
    event.preventDefault();
    alert('QuitChatRoom!');
    $('#status').html('Disconnected to Server');
    socket.disconnect(true);
  });
  $('#pswVisible').on('click', function (event) {
    event.preventDefault();
    if ($(this).attr('class') === 'glyphicon glyphicon-eye-close feature-i') {
      $('#user_psw').attr('type', 'text');
      $('#psw_confirm').attr('type', 'text');
      $(this).attr('class', 'glyphicon glyphicon-eye-open feature-i');
    } 
    else {
      $('#user_psw').attr('type', 'password');
      $('#psw_confirm').attr('type', 'password');
      $(this).attr('class', 'glyphicon glyphicon-eye-close feature-i');
    }
  });
  $('#show_chathis').on('click', function (event) {
    event.preventDefault();
    //console.log(list.find('.features-chatHis'));
    console.log($('#messageHis_list').find('.list-group-item').length);
    if ($('#messageHis_list').find('.list-group-item').length === 0) {
      var message = $('<a href="#" class="list-group-item">No History Messages Available</a>');
      $('#messageHis_list').append(message);
      $(this).remove();
      $('#messageHis_list').fadeIn();
    } 
    else {
      $('#messageHis_list').fadeToggle();
    }
  });
});

function join() { 
  //These Only can be operated after the Client has connected to Server!
  $(document).ready(function () {
    // make sure the DOM has finished loading the HTML content before we can reliably use jQuery.
    $('#join_btn').on('click', function (event) { //Hit Submit to send message
      event.preventDefault();
      var form = $(this).closest('#join_form');
      //alert('Join_Form Submit Hit!!!');
      var userName = $('#user_name').val();
      var userPsw = $('#user_psw').val();
      //alert(userName +" "+ userPsw);
      if (userName === '') {
        alert('Empty UserName!');
        form.trigger('reset'); //cleans up form text input fields
      } else if (userPsw === '') {
        alert('Empty UserPassword!');
        form.trigger('reset'); //cleans up form text input fields
      } else {
        //alert("HHH");
        socket.emit('join', {
          'name': userName,
          'psw': userPsw,
          'option': 'j'
        });
        //'option : j' stands for join request only
        socket.on('invalidUserName', function (userInfo) {
          alert('UserName Do Not Exist!');
          form.trigger('reset');
        });
        socket.on('wrongPsw', function (existInfo) {
          alert('Wrong PassWord! :)');
          form.trigger('reset');
        });
      }
    });
    $('#register').on('click', function (event) {
      event.preventDefault();
      var form = $(this).closest('#join_form');
      form.find('#psw_confirm_div').slideDown();
      form.find('#rjDiv').fadeIn();
      //Remove button 'Join the Chat' & 'Register'
      form.find('#join_btn').remove();
      $(this).remove();
    });
    $('#regis_join').on('click', function (event) {
      event.preventDefault();
      var form = $(this).closest('#join_form');
      var userName = $('#user_name').val();
      var preUserName = userName;
      var userPsw = $('#user_psw').val();
      var pswCof = $('#psw_confirm').val();
      if (userName === '') {
        alert('Empty UserName!');
        form.trigger('reset'); //cleans up form text input fields
      } else if (userPsw === '') {
        alert('Empty UserPassword!');
        form.trigger('reset'); //cleans up form text input fields
      } else if (pswCof === '') {
        alert('Please confim your PassWord!');
        form.trigger('reset'); //cleans up form text input fields
      } 
      else if (userPsw !== pswCof) {
        alert('Please enter the same PassWord');
        form.trigger('reset'); //cleans up form text input fields
        $('#user_name').val(preUserName);
      } 
      else { //Register and Join
        //Register and Join Request
        socket.emit('join', {
          'name': userName,
          'psw': userPsw,
          'option': 'rj'
        });
        socket.on('userExist', function (userInfo) {
          alert('User Already Exists! Try Another One');
          form.trigger('reset');
        });
      }
    });
  });
}

function insertMessage(data) {
  message = JSON.parse(data); //return it into JSON object(timeStamp, name and data properties)
  /* var messageLi = $('<a href="#" class="list-group-item features2"></a>');
     //features2 control the style of each message Box
     $('<h6 class="list-group-item-heading">'+message.timeStamp+'</h6>').appendTo(messageLi);
     $('<p class="list-group-item-text">'+message.name+": "+message.data+'</p>').appendTo(messageLi);
     $('#message_list').append(messageLi);
     */
  var messageLi = $('<a href="#" class="list-group-item features2"></a>');
  var headDiv0 = $('<div class="list-group-item-heading col-sm-4 features-mesHead"></div>');
  var headDiv1 = $('<div class="list-group-item-heading col-sm-4 col-sm-offset-4 features-mesHead"></div>');
  //features2 control the style of each message Box
  $('<h5 class="text-left">' + message.name + '</h6>').appendTo(headDiv0);
  $('<h6 class="text-right">' + message.timeStamp + '</h6>').appendTo(headDiv1);
  headDiv0.appendTo(messageLi);
  headDiv1.appendTo(messageLi);
  $('<p class="list-group-item-text">' + message.data + '</p>').appendTo(messageLi);
  $('#message_list').append(messageLi);
}

function insertMessageHis(data) { //Insert chat History
  message = JSON.parse(data); //return it into JSON object(timeStamp, name and data properties)
  var messageLi = $('<a href="#" class="list-group-item features2"></a>');
  var headDiv0 = $('<div class="list-group-item-heading col-sm-4 features-mesHead"></div>');
  var headDiv1 = $('<div class="list-group-item-heading col-sm-4 col-sm-offset-4 features-mesHead"></div>');
  //features2 control the style of each message Box
  $('<h5 class="text-left">' + message.name + '</h6>').appendTo(headDiv0);
  $('<h6 class="text-right">' + message.timeStamp + '</h6>').appendTo(headDiv1);
  headDiv0.appendTo(messageLi);
  headDiv1.appendTo(messageLi);
  $('<p class="list-group-item-text">' + message.data + '</p>').appendTo(messageLi);
  $('#messageHis_list').append(messageLi);
}

function insertChatter(name) {
  //var chatter = $('<li>'+ name +'</li>').data('name', name);
  var chatter = $('<li></li>');
  //var headDiv = $('<div class="well"></div>');
  $('<h4 class="lead">' + name + '</h4>').appendTo(chatter);
  chatter.attr('id', name);
  //headDiv.append(chatter);
  $('.chatter_list').append(chatter);
}
