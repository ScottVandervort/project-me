var 	express = require('express'),
		path = require('path'),
		favicon = require('serve-favicon'),
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		routes = require('./routes/index'),
		search = require('./routes/search'),
		images = require('./routes/images'),
		journals = require('./routes/journals'),
		locations = require('./routes/locations'),		
		config = require('config'),
		winston = require('winston'),
		expressWinston = require('express-winston'),
		morgan = require('morgan'),
		mongoClient = require('mongodb').MongoClient;		

var app = express();

// Share configuration with routes.
app.set('config', config);

// Application logging.
winston.level = config.get('logging.level');
winston.add(	winston.transports.File, 
						{ 
							filename: config.get('logging.logLocation')  + 'application.log' 
						});
// "Share" logger with routes.						
app.set('logger', winston);						

// HTTP request / response logging.
app.use(expressWinston.logger({
     transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
        }),
		new winston.transports.File({ 
			filename: config.get('logging.logLocation') + 'http.log' 
		})		
	],
	meta: true, 
	msg: "HTTP {{req.method}} {{req.url}}", 
	expressFormat: true, 
	colorStatus: true, 
	ignoreRoute: function (req, res) { return false; } 
}));

// HTTP request / response logging (console).
app.use(morgan('dev'));

// Mongo DB connection.
mongoClient.connect( config.get('database.url') , function(err, mongoDb) {  

	if (err) {
		winston.log("error","Problem creating database connection. Exception: " + err);
	}
	else {	
		// "Share" database connection with routes. Pooling is built in.
		app.set('db', mongoDb);			
	}
});
	
hbs.registerPartials(__dirname + '/views/partials');	

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// set path variable to images.
app.set("imagesDir", __dirname + '\\public\\images');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname,'/bower_components')));

app.use('/', routes);
app.use('/search',search);
app.use('/images',images);
app.use('/journals',journals);
app.use('/locations',locations);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
  	// Log error.
	winston.log("error", err);
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
	// Log error.
	winston.log("error", err);  
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	// Log error.
	winston.log("error", err);	
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
