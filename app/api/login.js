var _    = require('lodash'); 
var db   = require('../lib/db'); 
var auth = require('../lib/auth'); 

module.exports = function(req,res){
	var email 	 = req.body.email || null; 
	var password = req.body.password || null; 

	if( ! email || ! password) 
		return res.status(400).json({
			error: 'required parameters are missing' 
		}); 

	db
		.select(['id', 'name', 'email','password'])
		.from('users')
		.where('email', email)
		.andWhere('password', password)
		.then(function(users){
			if( _.isEmpty(users) ) return null; 

			var user = _.first(users);

			console.log('User successfuly authorized', user);  
			
			return auth.setToken({
				id   : user.id, 
				name : user.name, 
				email: user.email
			});  
		}) 
		.then(function(token){
			if( ! token ) 
				return res.status(401).json({
					error: 'invalid credentials' 
				});
			
			res.json({
				access_token: token
			});
		})
		.catch(function(err){
			console.log('An error occured duric authorization', err); 
			res.status(500).json({
				error: 'internal error' 
			}); 
		}); 
}; 