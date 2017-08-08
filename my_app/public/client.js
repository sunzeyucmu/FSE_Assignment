//Make AJAX calls
//Request to '/blocks', append the result to 'block-list'
//$.each runs for each item in the array, but returns the original array unchanged
//$.map creates a new array from returned results

$(function(){
	$.get('/blocks', appendToList);  //return blocks in JSON format
  //'$.get(url, success)' 是类似于'$.ajax' 的JQuery方法， 这里appendToList相当于success function
  
  $('form').on('submit', function(event){ //Check out JQuery&AJAX Tutorial Charpter 3<AJAX with Forms> on Code School
    event.preventDefault(); //the click event will 'bubble up', but let browser ignore it(won't handle it)
               //prevent the browser from jumping to the top of the page when the submit button is clicked as well.
    //Here the default behavior of 'form' is to submit and refresh the entire page
    var form = $(this);
    var blockData = form.serialize(); //transforms form data to URL-encoded notation
               //equal to $('form').serialize(); Pulls all the data out of the form ('name'&'description')
    
    $.ajax({ //Post request to '/blocks/' path
      type: 'POST', url: '/blocks', data: blockData
    }).done(function(blockName){
      //When request is done, get the response, get recently created blockName
      //add the new block to 'block-list'
      appendToList([blockName]); //array with the new block as its single argument
      form.trigger('reset'); //cleans up form text input fields
    });
  });
  
  $('.block-list').on('click', 'a[data-block]', function(event){
    /*The CSS specification allows elements to be identified by their attributes. 
    While not supported by some older browsers for the purpose of styling documents, 
    jQuery allows you to employ them regardless of the browser being used.
    */
    if(!confirm("Are you sure")) {//跳出删除确认框
      return false;
    }
    
    var target = $(event.currentTarget);
    
    $.ajax({//Post request to '/blocks/<target block name>' path
      type: 'DELETE', url: '/blocks/' + target.data('block')
    }).done(function(){
      target.parents('li').remove(); //removes li element containing the link Clicked on,
      //the parent() method traverses to the immediate parent in the DOM tree and constructs a new jQuery object from the matching elements.
    });
  });

  function appendToList(blocks) {
    var list = [];
    var content, block;
    for(var i in blocks){
      block = blocks[i];
      content = '<a href="/blocks/'+block+'">'+block+'</a> '+
    '<a href="#" data-block="'+block+'"><img src="del.png"></a>';
      //With link to each Block's description
			list.push($('<li>', { html : content }));
    }	
    $('.block-list').append(list); //returns blocks in JSON format
  }
});

