var 	express = require('express'),
		Promise = require('bluebird'),
		fs = require('fs'),
		path = require('path'),
		router = express.Router(),
		multer  = require('multer'),
		sizeof = require("image-size"),
		async = require('async'),
		gm = require('gm'),
		config = require('config'),
		ObjectId = require('mongodb').ObjectID,	
		upload = multer({ dest: config.get('images.uploadLocation') });

router.delete('/:id', function(req, res, next) {

	var db 		= req.app.get("db"),	
		logger 	= req.app.get("logger"),
		result	= {	"success" : true, 
					"message" : null,
					"payload" : [] },
		id 		= req.params.id,
		_id		= ObjectId(req.params.id);					
					

	db.collection("me")
		.find( { "_id" : _id } )
		.toArray(function(err,docs) {
			if(err) {
				logger.log("error", "image.js; Delete failed to find entry \"" + id + "\" in the database. Exception : " + err);
				result.success = false;	
				res.json(result);	  													
			}			
			else {
				if (docs.length > 0) {
					db.collection("me")
						.deleteOne( { "_id" : _id }, function(err) {
									if(err) {
										logger.log("error", "image.js; Delete failed to remove entry \"" + id + "\" from database. Exception : " + err);
										result.success = false;	
										res.json(result);	  																					
									}		
									else {	
										var filePath = config.get('images.archiveLocation') + docs[0].image;	

										deleteFile(filePath)
											.then(function(filePath) {
												result.success = true;												
												res.json(result);
												return result; // Allows for chaining of Promise .then().	 														
											})
											.catch(function(err) {
												logger.log("error", "image.js; Delete failed to delete file \"" + filePath + "\". Exception : " + err);												
												result.success = false;
												res.json(result);	 
											});																												
									}		                     
						});
				}
				else {
					logger.log("error", "image.js; Delete failed to find entry \"" + id + "\" in the database.");
					result.success = false;	
					res.json(result);	  					
				}
			}                        
		});
});		

router.put('/:id', upload.array('file'), function (req, res, next) {

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
		title 		= (req.body.title instanceof Array) ? req.body.title[0] : req.body.title,
		file 		= (req.files instanceof Array) ? req.files[0] : req.files;								

	db.collection("me")
        .find( { "_id" : _id } )
        .toArray(function(err,docs) {
			if(err) {
				logger.log("error", "image.js; Update failed to find entry \"" + id + "\" in the database. Exception : " + err);
				result.success = false;	
				res.json(result);	    													
			}			
			else {
				if (docs.length > 0) {	
					if (typeof file != 'undefined') {
						// Update everything - including the file.

						var filePath = config.get('images.archiveLocation') + docs[0].image;	
						
						deleteFile(filePath)
							.then(function(fileName){
								return fileName;  // Allows for chaining of Promise .then().																				
							})
							.catch(function(err){								
								logger.log("error", "image.js; Update failed to delete file \"" + filePath + "\". Exception : " + err);								
							});

						processFile ( file )
							.then( function (fileName)  {
 								// Allows for chaining of Promise .then().								
								return updateImage(
									app,
									id,									
									{	'datestamp'		: date,
										'type'			: 'image',
										'title'			: title,
										'description'	: description,
										'image'			: fileName });
							})
							.then( function (resp) {
								result.success = true;
								result.payload = resp;	
								res.json(result);	
								return result;  // Allows for chaining of Promise .then().
							})
							.catch(function(err) {
								logger.log("error", "images.js; Update of id \"" + id + "\" failed. Exception : " + err);									
								result.success = false;	
								res.json(result);												
							});  	  
						}             
						else {
							// Just updating the text fields; Keep the same file.
							updateImage(
								app,
								id,									
								{	'datestamp'		: date,
									'type'			: 'image',
									'title'			: title,
									'description'	: description,
									'image'			: docs[0].image })
								.then( function(resp) {
									result.success = true;
									result.payload = resp;	
									res.json(result);	
									return result;  // Allows for chaining of Promise .then().																									
								})
								.catch( function(err) {
									logger.log("error", "images.js; Update failed to write to database. Exception : " + err);
									result.success = false;	
									res.json(result);																	
								})
						}   
        			}
					else {
						logger.log("error", "image.js; Update failed to find entry \"" + id + "\" in the database. Exception : " + err);
						result.success = false;	
						res.json(result);	  
					}
				}
		});
});

router.post('/', upload.array('file'), function (req, res, next) {

	var 	logger = req.app.get("logger"),
 			app = req.app,
			db = app.get("db"),				 
			result = { 	"success" : true, 
						"message" : null,
						"payload" : [] };
								
	async.forEachOf( req.files, function( file, index, callback) {	
	
			var description =	(req.body.description instanceof Array) ? req.body.description[index] : req.body.description,
				date = 			(req.body.date instanceof Array) ? req.body.date[index] : req.body.date,
				title = 		(req.body.title instanceof Array) ? req.body.title[index] : req.body.title;	

			processFile ( file )
				.then( function (fileName)  {

					db.collection("me").insert( {
						'datestamp'		: date,
						'type'			: 'image',
						'title'			: title,
						'description'	: description,
						'image'			: fileName},
						function (err, doc) {		
							if(err) {
								logger.log("error", "images.js; db.collection.insert() failed. Exception : " + err);	
							}
							else {
								result.payload.push ( doc );

								if (index >= req.files.length-1) {
									// Done!
									result.success = true;
									res.json(result);										
								}
								else 
									callback();	// Next file.																
							}	

							return doc;  // Allows for chaining of Promise .then().																
						});						

				})
				.catch(function(err) {
					logger.log("error", "image.js; Insert failed during processFile(" + file.fileName + "). Exception : " + err);
					result.success = false;	
					res.json(result);	  						
				});
         }, 
		 function(err) {
			if (err) { 			
				logger.log("error", "image.js; Insert failed to iterate through submitted images. Exception : " + err);
				result.success = false;	
				res.json(result);	 				
			}				
		}
	);    
});

function updateImage ( app, id, data ) {

	return new Promise( function (resolve, reject) {

		if (typeof app == 'undefined' || typeof id == 'undefined' || typeof data == 'undefined')
			reject("image.js; updateImage() has some undefined arguments.");

		var db = app.get("db");		

		db.collection("me").update( 
			{ "_id" : ObjectId(id) },																																				
			data,
			function (err, doc) {		
				if(err) 					
					reject("image.js; updateImage() could not update entry \"" + id + "\" in database. Exception : " + err);												
				else 
					resolve(doc);																							
			});					
	});
}

function deleteFile ( filePath ) {
	
	return new Promise ( function(resolve, reject) {

		if (typeof filePath == 'undefined')
			reject("image.js; deletFile() has some undefined arguments.");		

		fs.stat(filePath, function (err, stats) {
			if (err) 
				reject("image.js; deleteFile() failed to find existing image \"" + filePath + "\". Exception : " + err);			
			else {
				fs.unlink(filePath, function(err) {
					if (err) 
						reject("image.js; deleteFile() failed to delete image \"" + filePath + "\". Exception : " + err);											
					else
						resolve(filePath);
				});
			}
		});		

	});
}

function processFile ( file ) {
	
	return new Promise( function (resolve, reject) {

		if (typeof file == 'undefined')
			reject("image.js; processFile() has some undefined arguments.");		

		// Get size of uploaded image.
		sizeof(file.path, function (err, dimensions) {

			if (err) {		 
				reject( "images.js; processFile() encountered an error when calling sizeof(" + file.path + "). Exception : " + err);
			}	
			else {
	
				var resizeHeight,
					resizeWidth;	
	
				if (dimensions.width > dimensions.height) {
					resizeWidth = config.get('images.archiveDimensions.width');
					resizeHeight = config.get('images.archiveDimensions.height');
				}
				else {
					resizeWidth =  config.get('images.archiveDimensions.height');
					resizeHeight = config.get('images.archiveDimensions.width');		
				}
		
				// Resize and reformat image.
				gm(file.path)
					.resize(resizeWidth, resizeHeight)
					.setFormat(config.get('images.archiveFormat'))
					.compress(config.get('images.archiveCompressionFormat'))
					.noProfile()
					.write(file.path, function (err) {
			
						var newFileName = file.filename + "." + config.get('images.archiveFormat');
						var newFilePath = config.get('images.archiveLocation') + newFileName;					

						if (err) 
							reject("images.js; processFile() encountered an error when calling gm.write(" + file.path + "). Exception : " + err);												
						else {	
							// Move file from uploads location to archive and add extension.
							fs.rename(file.path, newFilePath, function (err) {
								if(err) 
									reject("images.js: processFile() ecountered an error when calling rename(" + file.path + ", " + newFilePath + "). Exception : " + err);																					
								else 
									resolve(newFileName);																			
							});
						}
					});
			}
		});
	});
}

module.exports = router;



