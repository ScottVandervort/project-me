var 	express = require('express'),
		router = express.Router(),
        env = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development',        
        isDevelopment = (env == 'development'),
        isTest = (env == 'test'),
        isProduction = (env == 'production');

router.get('/', function(req, res, next) {

  var config = req.app.get("config"),  
      googleApiKey = config.get("apiKeys.googleApiKey");

  res.render('index', { 'title': 'Me', 
                        'googleApiKey': googleApiKey,
                        'isDevelopment' : isDevelopment,
                        'isTest': isTest,
                        'isProduction': isProduction });
});

router.get('/test', function(req, res, next) {

  var config = req.app.get("config"),  
      googleApiKey = config.get("apiKeys.googleApiKey");

  res.render('test', { 'title': 'Test', 
                        'googleApiKey': googleApiKey,
                        'isDevelopment' : isDevelopment,
                        'isTest': isTest,
                        'isProduction': isProduction });
});

module.exports = router;
