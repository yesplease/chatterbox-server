var fs = require("fs");

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/JSON"
};

var objectId = 1;
var results = [
  // Useful for debugging
  // {
  //   text: 'hello world',
  //   username: 'fred',
  //   objectId: objectId
  // }
];

exports.requestHandler = function(request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;


  var parseURL = function(url){
    var substring = url.substring(0,9)
    if (substring !== '/classes/'){
      response.writeHead(404, headers);
      response.end();
    }
  };

  var sendResponse = function(data, statusCode){
    statusCode = statusCode || 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  };

  var collectData = function(request, callback){
    var data = "";
    request.on('data', function(chunk){
      data += chunk;
    });
    request.on('end', function(){
      callback(JSON.parse(data));
    });
  };

  // var actions = {
  //   'GET': function(request, response){

  //   },
  //   'POST': somethingElse,
  //   'OPTIONS': something
  // };

  if (request.method === 'GET') {
    //console.log("This is the request url: ", request.url);
    parseURL(request.url);

    sendResponse({results: results}, 200);
  }

  if (request.method === 'POST') {
    var msg;
    collectData(request, function(message){
      message.objectId = ++objectId;
      msg = message;
      results.push(message);
      saving(msg);
      sendResponse("dummydata", 201);
    });

   var saving = function(msg) {
     var logResult = JSON.stringify(msg);
     fs.appendFile("log.txt", logResult, function (err) {
      if (err) return console.log(err);
      console.log('Successfully saved to log.txt');
    });
   }

   // setTimeout(saving(), 3000);
   console.log("This is results right before saving", results);
   //saving();

    // var newData = '';
    // request.on('data', function(data){
    //   newData += data;
    // });
    // request.on('end', function(){
    //  var parsed = JSON.parse(newData);
    //  results.push(parsed);
    //  response.writeHead(201, headers);
    //  response.end();
    // });
  }

  if (request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end();
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};


