var connect = require('connect');
var serveStatic = require('serve-static');
var port = 8000;

connect().use(serveStatic(__dirname + '/')).listen(port);
console.log('Server running on http://localhost: ' + port);