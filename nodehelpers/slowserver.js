var http = require('http'),
    httpProxy = require('http-proxy');

httpProxy.createServer(function (req, res, proxy) {

  var buffer = httpProxy.buffer(req);

  setTimeout(function () {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: 8080,
      buffer: buffer
    });
  }, 6000);
}).listen(8000);