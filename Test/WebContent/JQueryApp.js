/**
 * 
 */
$(document).ready(function(){ 
	//$("h1").text("Where to?");
	/*
	$('button').on('click', function() { //.on(<event>, <event handler>)
	     //var price = $('<p>From $399.99</p>');
		 var vacation = $(this).closest('.vacation');//search for ancestors with the class
		 var amount = vacation.data('price'); //data-price
		 var price = $('<p>From $'+amount+'</p>');
		 vacation.append(price);
	     $(this).remove(); //Remove the object where 'click' happen
	});
	*/
	$('#destinations').on('click', function(){
		$(this).toggleClass('highlighted');//Add the class if $(this) doesn't have it ,remove it otherwise
		if($(this).hasClass('highlighted')){//vacation has the class 'highlighted (return true or false)
			$(this).animate({'top' : '-10px'},'fast'/*speed of animation, 'fast' equals '200ms'*/);
			/*speed of animation, 'fast' equals '200ms'*/
			//alert('Fuck');
		}else{
			$(this).animate({'top' : '0px'},'slow'/*equals 600ms*/);
		}
	});
	
	$('#tours').on('click','.vacation',function(){ //鼠标点击到某个vacation <li>
		$(this).toggleClass('highlighted');//Add the class if $(this) doesn't have it ,remove it otherwise
		if($(this).hasClass('highlighted')){//vacation has the class 'highlighted (return true or false)
			$(this).animate({'top' : '-10px'},'fast'/*speed of animation, 'fast' equals '200ms'*/);
			/*speed of animation, 'fast' equals '200ms'*/
			//alert('Fuck');
		}else{
			$(this).animate({'top' : '0px'},'slow'/*equals 600ms*/);
		}
	})
	$('.vacation').on('click','button'/*只监听class'vacation'中的button*/, function() { //.on(<event>, <event handler>)
	     //var price = $('<p>From $399.99</p>');
		 var vacation = $(this).closest('.vacation');//search for ancestors with the class
		 var amount = vacation.data('price'); //data-price
		 var price = $('<p>From $'+amount+' per ticket</p>');
		 vacation.append(price);
	     $(this).remove(); //Remove the object where 'click' happen
	});
	
	$('.vacation').on('click', '.expand', function(event){//Listen to the click on Link of each Vacation
		event.preventDefault(); //browser won't handle the click's bubble up
		$(this).closest('.vacation').find('.comments').fadeToggle();
	});
	
	$('#filters').on('click', '.onsale-filter', function(){
		$('.highlighted').removeClass('highlighted'); //Remove the highlighted calss before adding it back
		$('.vacation').filter('.onsale').addClass('highlighted'); 
	});
	
	$('#filters').on('click', '.expiring-filter', function(){
		$('.highlighted').removeClass('highlighted'); 
		$('.vacation').filter('.expiring').addClass('highlighted'); 
		//Find elements with a class of .vacation and .onsale
	});
	/*
	*/
	function showTicket(){
		$(this).closest('.confirmation').find('.ticket').slideToggle();
	}
	$('.confirmation').on('click', 'button', showTicket);
	//$('.confirmation').on('mouseenter', 'img', showTicket);
	//$('.confirmation').on('mouseleave', 'img', showTicket);
	$('.confirmation .view-boarding-pass').on('click', function(){
		//$(this).closest('.ticket').find('img').slideToggle();//for content already loaded in the html
		$.ajax('JQueryTest.html',{
			success: function(response){//runs only when server returns a successful response
				$('.ticket').html(response).slideToggle();//??
			}
		});
	});
	
	
	$('.quantity').on('keyup', function(){
		var price = +$(this).closest('.vacation').data('price');
		var quantity = +$(this).val(); //获取填空格中数字, $(this).val(<new num>)可改变输入格中数字
		$('#total').text(price*quantity);
	});
});

