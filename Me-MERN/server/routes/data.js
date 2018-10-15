module.exports = function(config,businessLogic) {
  
  var express = require('express');
  var router = express.Router();
  
  var multer  = require('multer');
  var storage = multer.memoryStorage();
  var upload = multer({ storage: storage });
  
  router.post('/photo/:entryId', ensureAuthenticated, upload.array('photos', config.maxUpload), function (req, res, next) {  
    
    var photoIds = [],
        totalPhotos = req.files.length,
        photoIndex = 0;

    while (photoIndex < req.files.length) {
      businessLogic.addPhotoToEntry ( 
        req.user.profile.id, 
        req.user.accessToken, 
        req.user.refreshToken,        
        req.params.entryId, 
        req.body.text, 
        req.files[photoIndex])
      .then(function(photoId) {

        photoIds.push(photoId);

        if (photoIndex >= totalPhotos) {
          res.json({ "photoIds" :  photoIds }); 
        }
      })
      .catch(function(err) {
        res.render('error', { message: "Error", error : { status: "500" } } );                          
      });

      photoIndex++;
  }});
   

  router.get('/photo/:photoId', ensureAuthenticated, function ( req, res, next ) {

    businessLogic.getPhoto(
      req.user.profile.id, 
      req.user.accessToken, 
      req.user.refreshToken,  
      req.params.photoId)
      .then(function( file ) {
        file.pipe(res); 
      })
      .catch(function(err) {
        res.render('error', { message: "Error", error : { status: "500" } } );                  
      });
    });

  router.put('/photo/:photoId', ensureAuthenticated, function ( req, res, next ) {
    
  });


  router.post('/entry', ensureAuthenticated, function ( req, res, next ) {
    
  });   

  router.get('/entry/:entryId', ensureAuthenticated, function ( req, res, next ) {
    
  }); 

  router.get('/entry/:month/:year', ensureAuthenticated, function ( req, res, next ) {
    
  });   

  router.put('/entry/:entryId', ensureAuthenticated, function ( req, res, next ) {
    
  });     



  // router.post('/photo', ensureAuthenticated, upload.array('photos', 1), function (req, res, next) {  
    //   })
    //       googleDrive.createFile( req.user.accessToken, req.user.refreshToken, req.files[0])
    //       .then( function(id) {
    //         // TODO: Return Success!
    //       })
    //       .catch(function(err) {
    //         console.log(err);
    //         res.render('error', { message: "Error", error : { status: "500" } } );        
    //       })         

  // router.get('/photos/:id', ensureAuthenticated, upload.array('photos', 3), function (req, res, next) {  

  //   googleDrive.getFile(
  //     req.user.accessToken,
  //     req.user.refreshToken,
  //     req.params.id)
  //   .then( function(file) {
  //     console.log(file);
  //     file.pipe(res); 
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //     res.render('error', { message: "Error", error : { status: "500" } } );        
  //   });      
  // })  
  
  // router.get('/data', ensureAuthenticated, function (req, res, next) {  
  //   googleDrive.getFileId(
  //     req.user.accessToken,
  //     req.user.refreshToken,
  //     "me.json")
  //   .then(function(id) {

  //     console.log(id);

  //     if (id == null) {
  //       googleDrive.createFile( req.user.accessToken, req.user.refreshToken,
  //         { originalname : 'me.json',
  //           mimetype : 'application/json',
  //           buffer : Buffer.from([]) 
  //         })
  //       .then( function(id) {
  //         googleDrive.getFile( req.user.accessToken, req.user.refreshToken, id)
  //         .then( function(file) {
  //           console.log(file);
  //           file.pipe(res); 
  //         })
  //         .catch(function(err) {
  //           console.log(err);
  //           res.render('error', { message: "Error", error : { status: "500" } } );        
  //         })   
  //       } )
  //       .catch( function(err) {
  //         console.log(err);
  //         res.render('error', { message: "Error", error : { status: "500" } } );                  
  //       });                    
  //     }
  //     else {
  //       googleDrive.getFile( req.user.accessToken, req.user.refreshToken, id)
  //       .then( function(file) {
  //         console.log(file);
  //         file.pipe(res); 
  //       })
  //       .catch(function(err) {
  //         console.log(err);
  //         res.render('error', { message: "Error", error : { status: "500" } } );        
  //       })    
  //     }  
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //     res.render('error', { message: "Error", error : { status: "500" } } );        
  //   })
  // });

  // Simple route middleware to ensure user is authenticated.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    
    // render the error page
    res.status(403);
    res.render('error', { message: "Unauthorized access", error : { status: "403" } } );
  }  
        
  return router;
};
    