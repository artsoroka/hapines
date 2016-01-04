var Promise = require('bluebird'); 
var random  = require('./random'); 
var redis   = require('./redis'); 

module.exports.checkAccessToken = function(token){
	return new Promise(function(resolve, reject){
		
		redis.get(token, function(err, data){
			if( err ) {
				console.log('Redis error while checking access token', err); 
				return reject(err); 
			}
			if( ! data ) return resolve(null); 

			try {
				var user = JSON.parse(data); 
				resolve(user); 
			} catch(e){
				console.log('Redis could not parse object by key', token, data); 
				reject('Invalid JSON'); 
			}
						
		}); 

	}); 
}; 

module.exports.setToken = function(user){
	return new Promise(function(resolve, reject){
		var token = random();
		var data  = JSON.stringify(user);  
		redis.set(token, data, function(err, status){
			if( err ){
				console.log('Redis error while seting access token', err); 
				return reject(err); 
			}

			if( status != 'OK' )
				return reject('Redis set status is not OK'); 

			resolve(token); 
		}); 
	}); 
}