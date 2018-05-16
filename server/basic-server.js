/* Import node's http module: */
var http = require('http');
var fs = require('fs');
var path = require('path');
var requestHandler = require('./request-handler');
var url = require('url');
var express = require('express');

// Every server needs to listen on a port with a unique number. The
// standard port for HTTP servers is port 80, but that port is
// normally already claimed by another server and/or not accessible
// so we'll use a standard testing port like 3000, other common development
// ports are 8080 and 1337.
// For now, since you're running this server on your local machine,
// we'll have it listen on the IP address 127.0.0.1, which is a
// special address that always refers to localhost.

// We use node's http module to create a server.
//
// The function we pass to http.createServer will be used to handle all
// incoming requests.
//
// After creating the server, we will tell it to listen on the given port and IP. */
var server = express();

server.set('port', (process.env.PORT || 3000));

server.all('/*', function(request, response) {
  
  var parts = url.parse(request.url);
  // console.log(parts.pathname);
  
  if (parts.pathname.includes('client')) {
    fs.readFile(path.join(__dirname, '..', request.url), 'utf8', function(err, data) {
      if (err) { throw err; }
      if (request.url.includes('.css')) {
        response.writeHead(200, {'Content-Type': 'text/css'});
      } else {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
      }
      
      response.write(data);
      response.end();
    });
  } else {
    requestHandler.handleRequest(request, response); 
    console.log('Serving request type ' + request.method + ' for url ' + request.url);
  }
});
server.listen(server.get('port'), function() {
  console.log('Node app is running on port', server.get('port'));
});

// To start this server, run:
//
//   node basic-server.js
//
// on the command line.
//
// To connect to the server, load http://127.0.0.1:3000 in your web
// browser.
//
// server.listen() will continue running as long as there is the
// possibility of serving more requests. To stop your server, hit
// Ctrl-C on the command line.

