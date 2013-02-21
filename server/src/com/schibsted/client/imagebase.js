// Require
var url, http, request;
url = require('url');
http = require('http');
request = require('request');

// Don't crash when an error occurs, instead log it
process.on('uncaughtException', function(err){
    console.log(err);
});

var count = 0;

// Create our server
var server;
server = http.createServer(function(req,res){
    // Set caching
    res.setHeader('Access-Control-Max-Age', 5*60*1000);  // 5 minutes

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }

    // Get the params
    var query = url.parse(req.url,true).query;
    var imageUrl = query.url || null;
    var callback = query.callback || null;
    // check for param existance, error if not
    if ( !imageUrl ) {
        console.log('Missing arguments');
        res.writeHead(400); // 400 = Bad Request
        res.end();
        return;
    }

    // request the image url
    request({
        url: imageUrl,
        method: 'GET',
        encoding: 'base64',
        timeout: 60*1000
    },function(err,imageRes,imageData){
        var responseData, imageContentType;
        if ( !err && imageRes && imageRes.statusCode === 200 ) {
            res.setHeader('Content-Type', 'application/javascript');
            imageContentType = imageRes.headers['content-type'];
            console.log(Object.keys(imageRes));
            console.log(imageRes.headers);
            responseData = 'data:'+imageContentType+';base64,'+imageData;
            if(callback){
                res.write(callback+'('+JSON.stringify(responseData)+')');
            }else{
                res.write(JSON.stringify(responseData));
            }
            res.end();
            console.log('Sent image:', count++);
            return;
        }
        else {
            console.log('Failed image:', imageUrl);
            res.writeHead(imageRes && imageRes.statusCode || 400); // bad request
            responseData = JSON.stringify('error:Application error');
            if(callback){
                 res.write(callback+'('+responseData+')');
            }else{
                res.write(responseData);
            }
            res.end();
            return;
        }
    });
});

// Start our server
server.listen(process.env.WEBSITEPORT || process.env.PORT || 8005, function() {
    var address = server.address();
    console.log("opened server on %j", address);
});

// Export
module.exports = server;