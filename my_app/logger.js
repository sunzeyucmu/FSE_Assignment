module.exports = function (request, response, next) {
  var startTime = +new Date();
  var stream = process.stdout;
  var url = request.url;
  var method = request.method;
  var duration = null;

  response.on('finish', function () {
    duration = +new Date() - startTime;
    var message = method + ' to ' + url +
     '\ntook ' + duration + ' ms \n\n';
    stream.write(message); //print the log message
    
  });
   next();
  
};

//An middleware