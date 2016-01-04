var random = require('random-string'); 
var string = {
	length: 33, 
	numeric: true, 
	digits : true, 
	special: false
}; 

module.exports = function(){
	return [Date.now(), random(string)].join(''); 
}; 