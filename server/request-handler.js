var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/JSON"
};
/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var results = [];
// var messages = {
//   roomname: results = [],
//   lobby:
//   whatever:
// },
exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(statusCode, headers);

  var parseURL = function(url){
    var substring = url.substring(0,9)
    console.log("This is the substring", substring);
    if (substring !== '/classes/'){
      response.writeHead(404, headers);
      response.end();
    }
  };
  //parseURL(request.url);

  if (request.method === 'GET') {
    console.log("This is the request url: ", request.url);
    //var dummyResponse = {results: ["yes", "no"]};
    // if (!allOurData[]) {
    //   response.writeHead(404, headers);
    // }
    parseURL(request.url);
    var responseObj = {};
    responseObj['results'] = results;
    var stringResults = JSON.stringify(responseObj);
    //response.write(stringDummy);
    console.log(results);
    response.end(stringResults); //we can send a json stringified object back
    // console.log("The request method is 'get'!");
  }

  if (request.method === 'POST') {
    var newData = '';
    request.on('data', function(data){
      newData += data;
    });
    request.on('end', function(){
     var parsed = JSON.parse(newData);
     results.push(parsed);
     console.log("We just posted this!", parsed);
     response.writeHead(201, headers);
     response.end();
    });
    //console.log(request);
   console.log("This is the status code " + statusCode);
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

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

