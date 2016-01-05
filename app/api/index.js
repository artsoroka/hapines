var _ 		   = require('lodash'); 
var api 	   = require('express').Router(); 
var bodyParser = require('body-parser'); 
var db 		   = require('../lib/db'); 
var auth 	   = require('../lib/auth'); 
var login      = require('./login'); 
var postRoutes = require('./posts'); 

api.use(bodyParser.urlencoded({ extended: false })); 
api.use(bodyParser.json()); 

var authRequired = function(req,res,next){
	var token = req.query.access_token || req.body.access_token || null; 
	
	if( ! token ) 
		return res.status(401).json({
			error: 'no access token provided'
		}); 

	auth
		.checkAccessToken(token)
		.then(function(user){
			if( ! user ) 
				return res.status(401).json({
					error: 'no valid access token'
				}); 

			req._currentUser = user; 
			next(); 	
		})
		.catch(function(err){
			res.status(500).json({
				error: 'internal server error'
			}); 
		}); 
}; 

api.use(function(req,res,next){
	res.set('Content-type', 'application/json'); 
	next(); 
}); 

api.get('/', function(req,res){
	res.send('api main');  
});

api.post('/auth', login);  
api.use('/posts', [authRequired], postRoutes); 

api.get('/user', [authRequired], function(req,res){
	res.send(req._currentUser); 
}); 

api.get('/users', function(req,res){
	db
	  .select(['name', 'email'])
	  .from('users')
	  .then(function(users){
  		res.status(200).json(users);  	
	  })
	  .catch(function(err){
	  	console.log('GET /users db error occurend', err); 
	  	res.status(500).json({
	  		error: 'internal db error occured'
	  	}); 
	  }); 	
}); 

api.get('/users/:userId/posts', [authRequired], function(req,res){
	var userId 	 = req.params.userId || null; 
	var earliest = req.query.fromDate  || '0'; 
	var latest   = req.query.toDate    || db.raw('NOW()'); 
	
	if( ! userId ) 
		return res.status(400).json({
			error: 'no user specified'
		}); 

	db('users')
		.join('posts', 'users.id', '=', 'posts.user_id')
	  	.select([
	  		'users.id', 
	  		'posts.id as post_id', 
	  		'posts.happiness', 
	  		'posts.comment',
	  		'posts.created_at', 
	  		'posts.updated_at', 
	  	])
	  	.where('users.id', userId)
	  	.where('posts.created_at', '>=', earliest)
	  	.where('posts.created_at', '<=', latest)
	  	.then(function(posts){
  			res.status(200).json(posts);  	
	  	})
		.catch(function(err){
			console.log('GET /users/:userId/posts db error occurend', err); 
		  	res.status(500).json({
		  		error: 'internal db error occured'
		  	}); 
		}); 	
});


module.exports = api; 