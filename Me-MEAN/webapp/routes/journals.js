var 	express = require('express'),
		router = express.Router(),
		ObjectId = require('mongodb').ObjectID;	

router.put('/:id', function(req, res, next) {

	var app 		= req.app,
		db 			= app.get("db"),		
		logger 		= app.get("logger"),
		result		= { "success" : true, 
						"message" : null,
						"payload" : null },
		id 			= req.params.id,
		_id 		= ObjectId(req.params.id),
		description = (req.body.description instanceof Array) ? req.body.description[0] : req.body.description,
		date 		= (req.body.date instanceof Array) ? req.body.date[0] : req.body.date,
		title 		= (req.body.title instanceof Array) ? req.body.title[0] : req.body.title;							

	db.collection("me")
        .find( { "_id" : _id } )
        .toArray(function(err,docs) {
			if(err) {
				logger.log("error", "journal.js; Update failed to find entry \"" + id + "\" in the database. Exception : " + err);
				result.success = false;	
				res.json(result);	    													
			}			
			else {
				if (docs.length > 0) {	
					db.collection("me").update( 
						{ 	"_id" 			: _id },																																				
						{ 	'datestamp'		: date,
							'type'			: 'journal',
							'title'			: title,
							'description'	: description},
						function (err, doc) {		
							if(err) { 					
								logger.log("error","journal.js; Could not update entry \"" + id + "\" in database. Exception : " + err);
								result.success = false;	
								res.json(result);
							}																						
							else { 
								result.success = true;
								result.payload = doc;	
								res.json(result);
							}																						
						});	
				}   
        		else {
					logger.log("error", "journal.js; Update failed to find entry \"" + id + "\" in the database. Exception : " + err);
					result.success = false;	
					res.json(result);	  
				}
			}				
		});	
});		

router.post('/', function(req, res, next) {

	var 	logger = req.app.get("logger"),
			db = req.app.get("db"),
			result = { 	"success" : true, 
						"message" : null,
						"payload" : [] },
			title = req.body.title,
			description = req.body.description,
			datestamp = req.body.date;  

	db.collection("me").insert( {
		'datestamp'		: datestamp,
		'type'			: 'journal',
		'title'			: title,
		'description'	: description },
		function (err, doc) {		
			if(err) {
				logger.log("error", "journal.js; db.collection.insert() failed. Exception : " + err);
				result.success = false;	
				res.json(result);	 						
			}			
			else {
				result.content = doc;
				result.success = true;					
				res.json(result);				
			}
		});
});

router.delete('/:id', function(req, res, next) {

	var app 		= req.app,
		db 			= app.get("db"),		
		logger 		= app.get("logger"),
		result		= { "success" : true, 
						"message" : null,
						"payload" : null },
		id 			= req.params.id,
		_id 		= ObjectId(req.params.id);	

	db.collection("me")
        .find( { "_id" : _id } )
        .toArray(function(err,docs) {
                    if(err) {
						logger.log("error", "journal.js; Delete failed to find entry \"" + id + "\" in the database. Exception : " + err);
						result.success = false;	
						res.json(result);	 													
                    }			
                    else {
						db.collection("me")
							.deleteOne( { "_id" : ObjectId(req.params.id) }, function(err) {
								if(err) {
									logger.log("error", "journal.js; Delete failed to remove entry \"" + id + "\" from database. Exception : " + err);
									result.success = false;	
									res.json(result);	 												
								}		
								else {
									result.success = true;												
									res.json(result);
								}	                     
							});
                    }                        
        });

});	

module.exports = router;