var app    = require('./app'); 
var config = require('./config');  

server = app.listen(config.App.port); 
console.log('Hapines is running on a port %d', server.address().port); 