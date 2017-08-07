//Extracting routes to modules
//for routes '/blocks' 

var express = require('express');
var router = express.Router(); //returns router instance which can be mounted as a middleware
//get all block-related logic encapsulated inside this route file
var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({ extended: false});//forces the use of the native querystring Node library


var blocks = { //Can be accessed from other routes in the file
  'Fixed': 'Fastened securely in position',
	'Movable': 'Capable of being moved',
  'Rotating': 'Moving in a circle around its center'
};

var locations = {
	'Fixed': 'First floor', 
	'Movable': 'Second floor', 
	'Rotating': 'Penthouse'
};

/*Chain functions: eliminate intermediate variables */
router.route('/'/*mounted on the  '/blocks' path*/)  //returns route object which handles all requests to '/blocks' path
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

router.route('/:name') //returns route object which handles all request to the '/blocks/:name' path
  .all(function(request, response, next) { //Kind Same as 'app.param()
    
    var name = request.params.name;
    var block = name[0].toUpperCase() + name.slice(1).toLowerCase();
    request.blockName = block;  //can be accessed from other routes in the app

    next();//resume request
  })  // all route is called for all requests for a given URL path
  .get(function(request, response){
		var description = blocks[request.blockName];
		if(!description){
			response.status(404).json('No description found for ' + request.params.name);
		}
		else{
			response.json(description); //返回到clien.js形式为 Json格式
		}
	})
  .delete(function(request, response){
		delete blocks[request.blockName/*set in app.param*/];
		response.sendStatus(200); //Sets response body to "OK"
	});




module.exports = router; //exports the router as a Node Module

