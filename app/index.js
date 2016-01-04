var express = require('express'); 
var app   	= express(); 
var api     = require('./api'); 

app.use(express.static(__dirname + '/public')); 

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 

app.use('/api', api); 

app.get('/', function(req,res){
	res.render('main'); 
});

module.exports = app; 