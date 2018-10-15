var 	express = require('express'),
		router = express.Router(),
        ObjectId = require('mongodb').ObjectID;	

function findAll (req, res, next) {

    var 	logger = req.app.get("logger"),
	  		db = req.app.get("db"),
		  	result = { 	"success" : true, 
			        			"message" : null,
						        "payload" : [] };

    db.collection("me")
        .find()
        .toArray(function(err,docs) {
                    if(err) {
                        logger.log("error", "search.js; db.collection.find() failed. Exception : " + err);	
                    }			
                    else {
                        result.payload = docs;			
                    }
                    
                    res.json(result);	    
        });     
}


router.get('/', function(req, res, next) {
    findAll(req, res, next);   
});

router.get('/:criteria', function(req, res, next) {

  var 	logger = req.app.get("logger"),
	  	db = req.app.get("db"),
		result = { 	"success" : true, 
                    "message" : null,
					"payload" : [] },
        searchCriteria, 
        searchCriteriaRegEx;
        
        if (req.params.criteria != null && req.params.criteria.trim() != "") {

            searchCriteria = decodeURIComponent(req.params.criteria);

            searchCriteria = searchCriteria.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

            searchCriteriaRegEx = new RegExp(searchCriteria, "i");

            db.collection("me")
                .find( { $or: [ { title: { $regex : searchCriteriaRegEx }}, 
                                { description : { $regex : searchCriteriaRegEx }}, 
                                { datestamp : { $regex : searchCriteriaRegEx }} ]} )
                .toArray(function(err,docs) {
                            if(err) {
                                result.success = false;                            
                                logger.log("error", "search.js; db.collection.find(" + req.params.criteria + ") + failed. Exception : " + err);	
                            }			
                            else {
                                result.payload = docs;			
                            }
                            res.json(result);	                                                     
                });                
        }
        else
            findAll();     
});

router.get('/id/:id', function(req, res, next) {  
  var 	logger = req.app.get("logger"),
	  		db = req.app.get("db"),
		  	result = { 	"success" : true, 
			        			"message" : null,
						        "payload" : [] };

    if (ObjectId.isValid(req.params.id)) {
        db.collection("me")
            .find( { "_id" : ObjectId(req.params.id) } )
            .toArray(function(err,docs) {
                        if(err) {
                            result.success = false;                            
                            logger.log("error", "search.js; db.collection.find() failed. Exception : " + err);	
                        }			
                        else {
                            result.payload = docs;			
                        }
                        res.json(result);	                                                     
            });    
    }
    else {        
        logger.log("error", "search.js; id is not formatted properly.");
        result.success = false;
        res.json(result);	        
    }          
});

module.exports = router;
