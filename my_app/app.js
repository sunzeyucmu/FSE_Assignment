var express = require('express');
var app = express();

var logger = require('./logger');
var blocks = require('./routes/blocks');

app.use(logger);
app.use('/blocks', blocks); //All requests to the '/blocks'/ url are dispathced to the blocks router

app.use(express.static('public')); //static middleware serving files from public folder

/*Chain functions: eliminate intermediate variables */
/*Version 1.0
app.route('/blocks')  //returns route object which handles all requests to '/blocks' path
  .get(function(request, response){
		//var blocks = ['Fixed', 'Movable', 'Rotating'];
		if (request.query.limit>=0){
			response.json(Object.keys(blocks.slice(0, request.query.limit))); //returns a portion of array
		}
		else{
			response.json(Object.keys(blocks)); //return properties from the blocks object
		}
		//response.json(blocks);
  })
  .post(parseUrlencoded, function(request, response){
		//Using multiple route handlers,  parseUrlencoded will run first
		var newBlock = request.body; //form elements are parsed to object properties, name and description
		blocks[newBlock.name] = newBlock.description; //adds new block to the blocks object

		response.status(201).json(newBlock.name);
	});

app.route('/blocks/:name') //returns route object which handles all request to the '/blocks/:name' path
  .get(function(request, response){
		var description = blocks[request.blockName];
		if(!description){
			response.status(404).json('No description found for ' + request.params.name);
		}
		else{
			response.json(description);
		}
	})
  .delete(function(request, response){
		delete blocks[request.blockName];//set in app.param
		response.sendStatus(200); //Sets response body to "OK"
	});

app.param('name', function(request, response, next) {
	//app.param function maps placeholders to callback functions, 
	//useful for running pre-conditions on dynamic routes
	//Here it called for routes which include the :name placeholder
  var name = request.params.name;
  var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
  request.blockName = block;  //can be accessed from other routes in the app
	
	next();//resume request
});
*/

/* Version 0.0
app.get('/blocks', function(request, response){
	//var blocks = ['Fixed', 'Movable', 'Rotating'];
	if (request.query.limit>=0){
		response.json(Object.keys(blocks.slice(0, request.query.limit))); //returns a portion of array
	}
	else{
		response.json(Object.keys(blocks)); //return properties from the blocks object
	}
	//response.json(blocks);
});

app.post('/blocks', parseUrlencoded, function(request, response){
	//Using multiple route handlers,  parseUrlencoded will run first
	var newBlock = request.body; //form elements are parsed to object properties, name and description
	blocks[newBlock.name] = newBlock.description; //adds new block to the blocks object
	
	response.status(201).json(newBlock.name);
});
*/
/*
app.get('/blocks/:name', function(request, response){
	var description = blocks[request.blockName];
	if(!description){
		response.status(404).json('No description found for ' + request.params.name);
	}
	else{
		response.json(description);
	}
});

app.delete('/blocks/:name', function(request, response){
  delete blocks[request.blockName];//set in app.param
	response.sendStatus(200); //Sets response body to "OK"
});
*/
app.get('/locations/:name', function(request, response){
	var location = locations[request.blockName];
	if(!location){
		response.status(404).json('No location found for ' + request.params.name);
	}
	else{
		response.json(location);
	}
});

													 
app.listen(3000);
