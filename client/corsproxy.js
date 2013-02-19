#!/usr/bin/env node

var http = require('http');

http.createServer(function (req, res) {

    console.log("request for: ", req.url);
    var options = {
      host: 'apitestbeta3.medianorge.no',
      path: req.url,
      headers: {
        accept: '*/*'//Comment to see 500
      }
    };

    http.get(options, function(resFromApi) {

      var headers = resFromApi.headers;
      headers['access-control-allow-origin'] = '*';
      //headers['access-control-allow-headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
      res.writeHead(resFromApi.statusCode, headers);

      resFromApi.on('data', function (chunk) {
        res.write(chunk);
      });

      resFromApi.on('end', function (chunk) {
        res.end();
      });

    }).on('error', function(e) {
      console.log('ERROR: ' + e.message);
    });

}).listen(8001, 'localhost');

console.log('Server running at http://localhost:8001/');