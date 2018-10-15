var 	express = require('express'),
		router = express.Router(),
		ObjectId = require('mongodb').ObjectID;	

router.put('/:id', function(req, res, next) {

	var app = req.app,
		db = app.get("db"),		
		logger = app.get("logger"),
		result = { 	"success" : true, 
				 	"message" : null,
					"payload" : null },
		id = req.params.id,
		_id = ObjectId(req.params.id),
		title = req.body.title,
		description = req.body.description,
		datestamp = req.body.date,
		address = req.body.address,
		city = req.body.city,
		state = req.body.state,
		postalCode = req.body.postalCode,
		lat = req.body.lat,
		lng = req.body.lng;					

	db.collection("me")
        .find( { "_id" : _id } )
        .toArray(function(err,docs) {
			if(err) {
				logger.log("error", "location.js; Update failed to find entry \"" + id + "\" in the database. Exception : " + err);
				result.success = false;	
				res.json(result);	    													
			}			
			else {
				if (docs.length > 0) {	
					db.collection("me").update( 
						{ 	"_id" 			: _id },																																				
						{	'datestamp'		: datestamp,
							'type'			: 'location',
							'title'			: title,
							'description'	: description,					
							'location'      : {
								'address'   	: address,
								'city'			: city,
								'state'     	: state,
								'postalCode'	: postalCode,
								'lat'			: lat,
								'lng'			: lng			
							}
						},
						function (err, doc) {		
							if(err) { 					
								logger.log("error","location.js; Could not update entry \"" + id + "\" in database. Exception : " + err);
								result.success = false;	
								res.json(result);
							}																						
							else { 
								result.success = true;
								result.payload = doc;	
								res.json(result);
							}																						
						}	
					);	
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
			datestamp = req.body.date,
            address = req.body.address,
            city = req.body.city,
            state = req.body.state,
            postalCode = req.body.postalCode,
			lat = req.body.lat,
			lng = req.body.lng;

	db.collection("me").insert( {
		'datestamp'		: datestamp,
		'type'			: 'location',
		'title'			: title,
		'description'	: description,					
        'location'      : {
            'address'   	: address,
            'city'			: city,
            'state'     	: state,
            'postalCode'	: postalCode,
			'lat'			: lat,
			'lng'			: lng			
        }
     },
		function (err, doc) {		
			if(err) {
				logger.log("error", "location.js; db.collection.insert() failed. Exception : " + err);
				result.success = false;	
				res.json(result);	 	
			}			
			else {
				result.content = doc;
				res.json(result);				
			}
		});
});

module.exports = router;