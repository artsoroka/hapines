var _ 	   = require('lodash'); 
var router = require('express').Router(); 
var db     = require('../lib/db'); 

router.get('//:postId', function(req,res){
	var postId = req.params.postId || null; 

	db('posts').select([
			'user_id',
			'happiness',
			'comment',
			'created_at',
			'updated_at'
		])
		.where('id', postId)
		.then(function(posts){
			if( _.isEmpty(posts) ) 
				return res.status(404).json({
					error: 'no post found with such id ' + postId
				}); 

			var post = _.first(posts); 
			
			if( post.user_id != req._currentUser.id) 
				return res.status(401).json({
					error: 'cantuchthis'
				}); 

			res.send(post); 
		})
		.catch(function(error){
			res.send(error); 
		}); 
}); 
 
router.post('/', function(req,res){
	var userId    = req._currentUser.id; 
	var happiness = req.body.happiness || null; 
	var comment   = req.body.comment || null;  

    if( ! userId || ! happiness ) 
    	return res.status(400).json({
    		error: 'invalid request, required parameters missing'
    	}); 

    db('posts')
    	.count('id as posts')
    	.where('user_id', userId)
    	.andWhere(db.raw("created_at >= DATE_FORMAT(NOW(), '%Y-%m-%d')"))
    	.then(function(madeToday){
    		var postedToday = _.first(madeToday).posts; 

    		if( postedToday >= 1) 
    			return res.status(409).json({
    				error: 'already posted today'
    			}); 

    		return db
				.insert({
    				user_id	 : userId, 
    				happiness: happiness, 
    				comment	 : comment
    		  	})
    		  	.into('posts')
    		  	.then(function(postId){
    				console.log('new status post acquired id', postId);  
    				res.status(201).json({
    					status: 'new Post is created'
    				}); 
    		  	}).catch(function(err){
    				console.log('While saving new post an error occured'); 
    				throw new Error(err); 
    		  	}); 
    	})
    	.catch(function(err){
    		console.log('ERR', err); 
    		res.status(500).json({
    			error: 'internal db error occured'
    		}); 
    	})

}); 

router.put('/:postId', function(req,res){
	var postId    = req.params.postId || null; 
	var happiness = req.body.happiness || null; 
	var comment   = req.body.comment || null; 
	
	if( ! postId || ! happiness ) 
		return res.status(400).json({
			error: 'invalid request, required parameters missing'
		}); 

	db('posts')
		.select(['id','user_id', 'comment'])
		.where('id', postId)
		.then(function(posts){
			if( _.isEmpty(posts) ) throw new Error('no post found'); 

			var post = _.first(posts); 
			
			if( post.user_id != req._currentUser.id) 
				throw new Error('no permission'); 

			var today = (new Date()).toISOString().replace(/T\d{1,2}:\d{1,2}:\d{1,2}.*/,'')

			return db('posts').where('id', postId)
					.update({
						happiness : happiness, 
						comment   : comment || post.comment,
						updated_at: today
					}); 			 
		})
		.then(function(updatedRows){
			if( ! updatedRows ) throw new Error('no update'); 
			return db('posts')
						.select([
							'id',
						 	'happiness',
						 	'comment',
						 	'created_at',
						 	'updated_at'
						])
						.where('id', postId); 
		})
		.then(function(posts){
			var post = _.first(posts); 
			res.status(200).json(post); 
		})
		.catch(function(err){
			
			console.log('While updating Post an error occured', err)
			
			switch(err.message){
				
				case 'no post found':
					res.status(404).json({ 
						error: 'no post found with such id'
					});
					break; 
				case 'no permission':
					res.status(401).json({ 
						error: 'you have no permission to modify this entry'
					});
					break; 
				case 'no update': 
					res.status(500).json({
						error: 'db error, could not update the post'
					}); 
					break; 
				default: 
					res.status(500).json({ 
						error: 'internal error' 
					});
					break; 
			}
		}); 
})


router.delete('/:postId', function(req,res){
	var postId    = req.params.postId || null; 
	
	if( ! postId ) 
		return res.status(400).json({
			error: 'invalid request, required parameters missing'
		}); 

	db('posts')
		.select(['id','user_id'])
		.where('id', postId)
		.then(function(posts){
			if( _.isEmpty(posts) ) throw new Error('no post found'); 

			var post = _.first(posts); 
			
			if( post.user_id != req._currentUser.id) 
				throw new Error('no permission'); 

			return db('posts').where('id', postId).delete(); 			 
		})
		.then(function(deleted){
			res.status(200).json({
				status: 'entry deleted' 
			}); 
		})
		.catch(function(err){
			
			console.log('While updating Post an error occured', err)
			
			switch(err.message){
				
				case 'no post found':
					res.status(404).json({ 
						error: 'no post found with such id'
					});
					break; 
				case 'no permission':
					res.status(401).json({ 
						error: 'you have no permission to modify this entry'
					});
					break; 
				default: 
					res.status(500).json({ 
						error: 'internal error' 
					});
					break; 
			}
		}); 
}); 

module.exports = router; 