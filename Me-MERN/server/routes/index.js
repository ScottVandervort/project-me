module.exports = function() {

  var express = require('express');
  var router = express.Router();
  var path = require('path');  

  router.get('/', function(req, res) {
    res.render('index', {
      user: req.user
    });
  });

  router.get('/authenticated', ensureAuthenticated, function(req, res) {

    // Turn off layout for Angualr website. Secure.hbs will be rendered by gulp build process.
    res.render('secure', {layout: false});    
  });
  
  router.get('/account', ensureAuthenticated, function(req, res) {
    res.render('account', {
      user: req.user.profile,
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken
    });
  });  

  // Simple route middleware to ensure user is authenticated.
  function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  return router;

}
