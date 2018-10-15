Initial Setup
--------------------------------------------------------------------------------------------
	
	Required Package Managers; These package managers need to be installed globally :     
		npm for node.js/server packages ( express, mongodb, etc...)
		bower for client-side pasckages (Angular.js, Bootstrap, etc...)

Stuff to do
--------------------------------------------------------------------------------------------

	Working On ...

		GraphicsMagick/ImageMagick is not installed on home machine. Document installation procedure. 

		GoogleMaps does not run on Android Emulator.

	Backlog...
	[ ] General
		[ ] Need to gracefully fail when Google API is unavailable.
		[ ] Scrub input.		
		[ ] Hook up validation.	 	
		[ ] Localized error handling.
		[ ] Hook up error messages.
		[ ] Migrate strings to constants.
		[ ] Migrate settings to configs; Unit tests current wipe out database.
		[ ] Backwards compatibility
			[ ] Google maps unavailable.
			[ ] IE 8.
		[ ] Prevent double clicks when POSTing.
		[ ] Return json after successful processing.
		[ ] Need to stop caching javascript when changed.

	[ ] Image Processing 
		[ ] Copy to images/year/month.

	[ ] Home Page	
		[ ] Hook up search.
		[ ] Add hashtag search.
		[ ] Hook up edit.
		[ ] Paginated loading when scrolling.

Phases
--------------------------------------------------------------------------------------------

	Phase 1 - Get it Working
		X - Support add | edit | delete journals, places, and images.
		- Images should be resized, renamed, annotated, and  archived into yearly | monthly folder.
		X - Allow for simple search capability.
		- Pagination through simple "Load More" button.

	Phase 2 - Make it Pretty
		- Boostrap and Masonry.	
		- Make it Mobile.

	Phase 3 - Migrate Old Data
		- Configure for environments; Make sure unit tests run against Test.

	Phase 4 - Multi-user
		- Google authentication.
		- Support user login.
		- Restrict edit/delete/view access to authenticated user.

	Phase 5 - Soft Release.
		- Store photos on s3.
		- Run app on web server.


Data format
--------------------------------------------------------------------------------------------

{   datestamp,
    title,
    description, 
	type,		
    location : {    address,
                    city,
                    state,
                    postalCode,
					country,
					lat, 
					lng }
    imagePath
}


Useful scripts
--------------------------------------------------------------------------------------------
            
		Mongo Db
		----------

			# start mongodb server
			mongod --dbpath "/Users/svandervort/Git/Me/db" 
			# or
			mongod --dbpath C:\Users\scottv\Documents\GitHub\Me\Db		
			# or 
			"C:\Program Files\MongoDB\Server\3.2\bin\mongod" --dbpath D:\Users\Scott\Documents\GitHub\Me\db			

			# start mongodb console
			mongo
			use me

			# run script
			mongo < script.js

			# quick query
			mongo 
			db.me.find()

		NPM utilities
		----------

			# Adds npm package to project (and saves to package.json).
			npm install [package] --save

			# Adds npm package to project (and saves to package.json).
			npm install [package] --save	
			# ... save to dev dependenices.
			npm install [package] --save-dev	

			# Refresh dependency cache from package.json
			npm install		

		Unit Testing
		---------- 

			# Run unit tests from command line		
			npm test

			# Run using Grunt; Runs lint, unit tests; Make sure instance of MongoDb is running.
			grunt test			

			# Run a single unit test .js from Visual Studio Code
			# Modify configuration in launch.json for "Run Unit Test". Target the desired unit test in arg field.

		Building application (for deployment to server)
		----------

			# Runs lint, unit tests, and builds /dist folder; Make sure instance of MongoDb is running.
			grunt

			# Runs lint, unit tests; Make sure instance of MongoDb is running.
			grunt test

			# Builds /dist folder.
			grunt build

		Running Application ( on server / command line)
		----------

			SET NODE_ENV=development|test|production
			npm start				
		
			# Now go here: http://localhost:3000/			
	
Useful Links
--------------------------------------------------------------------------------------------

		(Installing Brew package manager for OSX) http://www.howtogeek.com/211541/homebrew-for-os-x-easily-installs-desktop-apps-and-terminal-utilities/
		(Installing MongoDB on OSX) https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/	
		(Angular JS + Bootstrap jsFiddle) https://jsfiddle.net/pxgkcz10/2/
		(Angular JS + Masonry jsFiddle) https://jsfiddle.net/riemersebastian/rUS9n/
		(Roll your own masonry effect)	http://stackoverflow.com/questions/30686191/how-to-make-image-caption-width-to-match-image-width
															http://jsfiddle.net/15b704on/
															https://designshack.net/articles/css/masonry/	
		(Google Location API) 	https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform	
								https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete-addressform	
								https://jsfiddle.net/svandervort/82pLyj5r/2/	
		(Mocha Testing)			https://semaphoreci.com/community/tutorials/getting-started-with-node-js-and-mocha	
		(Mocha/Environments)	http://stackoverflow.com/questions/18941736/ensuring-express-app-is-running-before-each-mocha-test				
								http://stackoverflow.com/questions/15951010/is-there-a-mocha-file-where-i-can-specify-defaults-such-as-no-colors		
		(Testing Demo)			https://github.com/madhums/node-express-mongoose-demo	
		(SuperTest for testing Node.js API)	https://github.com/visionmedia/supertest
		(Testing Angular)		https://gist.github.com/rikukissa/dcb422eb3b464cc184ae
								http://www.bradoncode.com/blog/2015/05/17/angularjs-testing-controller/
								http://angular-tips.com/blog/2014/06/introduction-to-unit-test-controllers/
								http://stackoverflow.com/questions/23029502/mocking-controller-instantiation-in-angular-directive-unit-test					
								http://stackoverflow.com/questions/23083645/unit-test-views-best-practice		
								http://zealake.com/2014/01/01/unit-test-your-angularjs-views/
		(Grunt)					http://gruntjs.com/getting-started#project-and-task-configuration
								http://gruntjs.com/sample-gruntfile
		(Escaping regex)		http://stackoverflow.com/questions/3115150/how-to-escape-regular-expression-special-characters-using-javascript
		

Journal
--------------------------------------------------------------------------------------------

- Handlebars and AngularJS both use {{}} for expressions. If expression needs to be processed by AngularJS but not Handlebars it can be escaped using forwars-slash. This will cause the expression to be processed only by AngularJS.

    This element exists on an .hbs file - which is processed by Handlebars prior to being sent to client and being processed by AngularJS:

        <a ng-selected="" ng-href="#/create?type=\{{selectedEntryType.id}}">Create</a>

    The / will prevent handlebars from processing the stuff in the {{ }}.


- For ng-file-upload you need to include all three methods - success, error, and progress in the upload.then() method. I omitted the error one and the progress one was never called. The plugin should support named functions instead as this is kind of confusing.

- CropperJs is awesome - but it needs a polyfill for Internet Explorer for canvasToBlob. That polyfill can be found here: https://raw.githubusercontent.com/blueimp/JavaScript-Canvas-to-Blob/. Unfortunately, it is not in Bower.

- Always use ng-src rather than src for images. It will "wait" to load image until after angular is ready. I was getting a 404 in a repeater that had an img assigned to an angular expression. There wasn't even any data to load! http://stackoverflow.com/questions/27554765/use-of-ng-src-vs-src

- Sometimes need to apply the scope for changes made to controller to appear in view. When doing this make sure to supply the changes through a function. http://jimhoskins.com/2012/12/17/angularjs-and-apply.html

- When linking a directive attr is all of the attributes applied to the directive's element. These are static. To bind to the host's scope you can (assuming exclusive scope) bind using the scope object returned by the directive.  

- To preserve carriage returns entered into texareas use style="white-space: pre";

- Bluebird Promise's are awesome! Just remember to return object after .then() so that more .then()'s can be chained! http://bluebirdjs.com/docs/warning-explanations.html#warning-a-promise-was-created-in-a-handler-but-was-not-returned-from-it

- If directive depends on data from controller that is loaded asynchronoulsy you will need to watch the scope of the directive. If you don't do this the directive might have undefined data in its scope as it would have been initialized prior to the AJAX in the Controller completing : http://stackoverflow.com/questions/28388452/load-directive-after-ajax-call   and  http://stackoverflow.com/questions/11952579/watch-multiple-scope-attributes 

- Will also want to STOP watching changes to the scope ( if only used for initialization ). Can use this pattern: http://stackoverflow.com/questions/15715672/how-do-i-stop-watching-in-angularjs

- Re-org'd project structure based upon this: http://briantford.com/blog/huuuuuge-angular-app. Smaller file sizes makes editing code easier.

10/21/2016
----------
- Mocha, Chai, Supertest and this site (https://github.com/madhums/node-express-mongoose-demo) proved to be very useful in setting up tests for my Node RestfulAPI. 
	
	Mocha is a BDD-driven testing framework. It allows your tests to be writted based on behavior or specs.

	Chai is an assertion library that is used instead of the default Node.js assert one. 

	Supertest allows high-level HTTP request processing for use in your tests. 

	Look at the arguments for the new "test" attribute in package.json. It targets mocha as well as mocha's spec reporter (https://mochajs.org/#reporters). Recursive tells is to recursively look for/run all .js in the test folder.

10/24/2016
----------
- Environments
	
	Node config library supports different environments: https://github.com/lorenwest/node-config ; default.json is currently being used.

	Can specify environment through command-line or directly in javascript.

- Debugging tests

	This is done through changing the launch.json which is used by Visual Studio Code [https://gist.github.com/paambaati/54d33e409b4f7cf059cc]

	Add a new target for Unit Tests; program and args should be modified to target mocha and the test respectively.

10/26/2016
----------
- Initializing Mocha

	Mocha initialization should be in a before block. Next test won't be performed until done() is called. 
	Cannot put tests in a asynchronous callback invoked after initialization as Mocha will not wait around for the initialziation to complete. 

		before(function (done) {
			done();		
		})

-- Packaging up .js and including it in Node.js

	To import external javascript use this syntax. Should probably abstract the data access layer (MongoDB) like this. 

		// tools.js
		module.exports = {
			foo: function () {
				// whatever
			},
			bar: function () {
				// whatever
			}
		};

		// app.js
		var tools = require('./tools');
		console.log(typeof tools.foo); // => 'function'	
      
10/28/2016
-----------
- Angular JS Testing

   Found a few good articles on this. The stack seems to use
   
      1) Mocha as the test runner via NPM. Chai is used for BDD and assertions
      2) jsdom, a Javascript emulation of the DOM. This, I understand, is better than spooling up an actual browser (Selenium) or a headless browser (PhantomJS) because it is quick and requires fewer dependencies.
      3) angular-mock - which I know in theory how it is used - but have not implemented it.
      
    The articles are :
    
      (This looks good) https://gist.github.com/rikukissa/dcb422eb3b464cc184ae
      (This ones is a little abstract as it was written for frameworks other than Angular) http://krasimirtsonev.com/blog/article/unit-test-your-client-side-javascript-jsdom-nodejs
      
    Ironically, jsdom requires a newer (much newer) node than I have installed. Going from .0.12.2 to 4.0.

		This JUST installs npm, not doe. Sigh....
		https://www.npmjs.com/package/npm-windows-upgrade

		Here is the windows (and intergrated npm installer)
      https://nodejs.org/en/download/

	The tests are run using : npm test, just like the single node.js test I wrote a few days ago. Mocha just looks at the test folder and runs everything.
      
10/31/2016
----------
- AngularJS Service Unit Test

	Good news! I have my first jsdom, angular mock test of a service written! It was not easy. Here's what I discovoered:

		Angular needs to run in a web browser; Jsdom is a javascript-emulated web browser.

		Angular mock allows you to mock up what is returned by a HTTP service. Undoubtedly it does much much more.

		Mocha it("desc", function (done) { .... } returns a done() function that should be called after initization. done() allows you to tell Mocha when asych code has finished.

- Visual Studio Code accepts multiple launch arguments. One of which can extend mocha's timeout

		"args": [
			"--no-timeouts",                
			"${workspaceRoot}/test/searchServiceTest.js"           
		], 	 
    
- So, I now have a node.js integration test for a RESTFul service written and I have a Angular JS unit test for a service written

11/01/2016
----------
- AngularJS Controller Test

	A Controller can have a dependency on multiple services.
	
	The reason why you want to mock up services when testing a Controller is that each services could have dependencies of their own. 
	This can really over-complicate things as your Controller's unit test wouled need to  either include or mock all of these 
	additional dependencies.

	Can assert changes against the scope (or Model).

- AngularJS View Test

	The View (or DOM) should be tested separately of the Controller. Next up I hope to mock up a scope, bind it to a View, and validate the results.

11/02/2016
----------

Let the routing mechanism bind the controller to the view. DO not hard code the controller view using ngController. This will allow you to re-use views
accross controllers.

- AngularJS View Test

	It looks like I can bind HTML to a [ mocked ] controller and then looks at the changes made to the view when the controller acts on it.
	So far it looks like this :

		$controller('myController', { $scope: $scope, $rootScope: $rootScope });
		var view = $compile(window.angular.element(...html...))($scope);
		$scope.$digest();		

	... after digest I can interrogtase the view to see how it was manipulated by the controller.

	So far 2 problems (and solutions) :

		1. I am using inline html; I would like to pull in templates.

			Use node to read templates from file system and inject into angular $templateCache. 

		2. Inline html seems to ignore ngInclude - nested templates.

			Need to wrap the template in a <div> or angular will ignore it. 
			https://github.com/angular/angular.js/issues/11991

11/07/2016
----------	
- Mocha
	Mocha beforeEach() appears to be called in sequence. The will fire in an orderly manner.

	Mocha supports bootstrapping through the --require flag; However, Visual Studio Code seems unable to submit the argument and returns an error. 
	Unfortunatley, this means that my unti tests are going to have a lot of duplicate code.	 

- jsdom
	Everything added to the jsdon's Global object is injected into the global scope.

	require(appRoot + '/bower_components/angular/angular');
	require(appRoot + '/bower_components/angular-mocks');

	global.mock = global.angular.mock;

	module(...); // module() is part of global.angular.mock and is available on global scope.

11/11/2016
---------
- Testing Node.JS Routes
	Originally was going to try and mock up MongoDB. However, after reading this article the following StackOverflow entry I think I will just spool up a test instance and 
	have Node hit it directly. This means that my Node.JS routes are going to become essentially my Data Access Layer.
		http://stackoverflow.com/questions/25585569/how-to-unit-test-a-method-which-connects-to-mongo-without-actually-connecting-t

11/16/2016
----------
- Angular JS Directive Testing

	Instead of $scope.digest(), in a directive with isolated scope you need to call element.isolateScope().$digest().

	Use .triggerHandler("click") to simulate clicks in Angular directives. 

		I had problems with other alternatives whereas the scope would get modified but not the DOM and/or a scope digest already in progress error.

	Make sure all attributtes are populated in the DOM where you are declaring the directive or you will get this error:
		"Expression '{0}' in attribute '{1}' used with directive '{2}' is non-assignable!"
		https://docs.angularjs.org/error/$compile/nonassign

		This article helped a lot: http://stackoverflow.com/questions/17211466/how-can-i-simulate-a-click-event-in-my-angularjs-directive-test  

	sinon.js can be used to mock up external libraries. 

		Sinon requires sinon-chai as well as lolex.

		For Cropper.js I had a little trouble as it is intialized through a constructor, but this seemed to work. Note this is done in the context of jsdom ( i.e., the "global" variable ) :

			global.Cropper = require(appRoot + '/bower_components/cropperjs/dist/cropper.js');
			global.sinon = require(appRoot + '/bower_components/sinon/lib/sinon.js');

			// Stub out Cropper. 
			sinon.stub(global, "Cropper");

			var cropper = new Cropper(); // A dummy object.	

11/21/2016
----------
- Mocha / Angular / jsdom

	I had a lot of trouble getting the tests to run in Debug/Visual Studio Code AND the command line using npm. Single tests would run fine but the muck up 
	the environment for subsequent tests. I eventually found this [https://github.com/rikukissa/angular-test-examples] seeding project. It works great. It has a helper/bootstrap 
	module that loads/unloads dependencies each time a new unit test .js file is loaded.


11/29/2016
----------
- Grunt

	Grunt is like Ant for Javascript.

	Visual Studio Code has a "prelaunchTask" field that can invoke a (Grunt?) task prior to executing the launch itself.
		Should copy all non-custom resources ( i.e., from package managers such as Bower) to public/javascript/bin.
		Should set environment for project.

		Still need some way of referencing a SINGLE javascript file after publish and multiple javascript in development. 

	[Test]		should run jsLint.
				should run all unit tests.
				should set environment to "UnitTests".				

	[Publish] 	should render a new folder and copy all depedencies for Me into it.
				should always merge .js and .css sources and sometimes minify based upon environment.
				should take in an environment argument and set in project.

11/30/2016
----------
- Working with environments.

	Can create development.json, production.json, etc... in /config. Config should load default.json followed by whatever environment is specified.

12/2/2016
---------
- Build strategy

		BUILD; Should run UNIT-TEST, LINT, CONCAT, MINIFY, and set configuration.

			End result should be this folder and structure ....
			
			X /dist/routes
			X /dist/uploads
			X /dist/views
			X /dist/package.json
			X /dist/config
			X /dist/logs
			X /dist/app.js
			X /dist/bin/www
			X /dist/public/images
			X /dist/public/javascripts/
			X /dist/public/stylesheets/
			X /dist/public/views/
			/dist/public/views/partials/		

		CONCAT [ and copy to /dist ]; Can be used for .css and .js

		MINIFY; Should be done after concat; Can be done for .css and .js

		LINT; Should be done against source.

		UNIT-TEST; Should be done against source.

12/5/2016
---------
- Working with environments.
	 
	I have configured Me to default to development of NODE_ENV is not set. 

	When running npm or Grunt from the command line need to set environment variable for session so. Ex: 

			SET NODE_ENV=development
			npm test

	Visual Studio Code has property in launch.json that allows you to set NODE_ENV.

12/6/2016
---------
- Minification + Merging of .js

	Should only minify custom .js files as most npm/bower dependencies already have an pre-minified (and hopefully tested) version.

	Only custom .js files should be minified by Grunt. Also, only custom .js files should be merged toegther into a bundle.

	In non-development, 3rd party libraries should be loaded from CDN.

						custom libraries shoud be minified and merged into Me.js and Me.css

						custom libraries need to be stamped with a date/time to prevent caching.

	In development,  all libraries are pulled from their respective local caches ( bower_components, node_modules , etc... )

	In Grunt, grunt-contrib-uglify can handle concatenationl It only works with javascript. Can use grunt-contrib-cssmin to minify Css.

12/13/2016
---------
- How to use properties in Grunt

	I keep an array of javascript files and Css files in Grunt and re-use them for tasks. This cuts down on redundancy and centralizes file lists.

		  grunt.config( 'javascriptFiles', 
                [ 'public/javascripts/app.js',
                  'public/javascripts/directives/googleMap.js',
                  'public/javascripts/directives/imageEditor.js',
                  'public/javascripts/services/entryService.js',
                  'public/javascripts/services/searchService.js',
                  'public/javascripts/controllers/imageEntryController.js',
                  'public/javascripts/controllers/journalEntryController.js',
                  'public/javascripts/controllers/locationEntryController.js',
                  'public/javascripts/controllers/homeController.js',
                  'public/javascripts/controllers/navigationController.js' ]);


			uglify: {
			options: {
				mangle: false
			},
			js: {
				files: {
				'../dist/public/javascripts/me.min.js': grunt.config( 'javascriptFiles')
				}
			}    
			}, 

12/20/2016
---------

- Delaying model updates

	Can delay model updates using debounce feature (https://docs.angularjs.org/api/ng/directive/ngModelOptions). 
	Using this for the search field so that DB is not overloaded.

- Communication between Controllers (PubSub / Broadcast)

	As the content and navigation reside in different controllers need to use publisher/subscriber pattern. This is how it's done in Angular:

	http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs   

12/21/2016
---------

 - Duplicate Angular Broadcast Events

	I've been using the Angular PubSub pattern and couldn't figure out why the $scope.$on(...) kept getting called twice. 

	After reading this ...
		http://stackoverflow.com/questions/11591902/angularjs-can-a-on-method-be-called-more-than-once-for-a-single-broadcast 

	... I realized that I was creating the HomeController twice and registering the event handler twice. Why? Because I specified 
	the Home Controller in the HTML as well as in the route provider.

		Here ...

			app.config(function($routeProvider) {
				$routeProvider

					.when('/', {
						templateUrl : 'views/home.html',
						controller  : 'homeController'
					})  

		And here ....

			<div googleMap ng-controller="homeController">
				<div ng-repeat="entry in entries">
					<div ng-switch on="entry.type">	

- Mongo DB Search 

		This searches multiple fields using "or". Case-insensitive. Partial match.

        var searchCriteriaRegEx = new RegExp(mySearchCriteria, "i");

		db.collection("me")
        	.find( { $or: [ { field1 : { $regex : searchCriteriaRegEx }}, 
            				{ field2 : { $regex : searchCriteriaRegEx }}, 
                            { field3 : { $regex : searchCriteriaRegEx }} ]} )	

01/09/2017
----------
- How to encoding a search query string from client (Angular), to server (Node), to Db (Mongo)

	First, In Angular JS encode your query string prior to appending it to url using encodeURIComponent(); This will allow query string to contain ?, &, etc .. by encoding them
	to %3F, %26, etc.
		
		encodeURIComponent(searchCriteria)

	Second, in Node decode the query string using decodeURIComponent(). This will decode encoded stuff (so, %26 back to &, etc ...)

		decodeURIComponent(searchCriteria);

	Third, escape special characters in query (if using regex) such as +, ?, etc... These characters are keywords in regular expressions.

        searchCriteria.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

	Fourth, create a regex object to submit to MongoDb

		searchCriteriaRegEx = new RegExp(searchCriteria, "i");

	Fifth, query MongoDB
            
		db.collection("me").find( { title: { $regex : searchCriteriaRegEx }}); 

01/17/2017
----------
- Testing against Mobile

	The Chrome desktop browser allows you to test your layout however I need to test Javascript on the actual device ... for cheap.

	The biggest problem is that here at work I am behind firewalls and they do not provide VPN for mobile phones. 
		This means that I cannot whip out my mobile phone and access a website hosted on my laptop.
			This of course, is not a problem at home.
	
	So, two options ...

			1) Host the app publically. Heroku seems like the best bet as it it free. After doing this I can access the website like any other.			
			2) Host the website on my local machine and access the website through the Android Emulator that ships with Android Studio.

	I decided to go with (2). I am not ready to start hosting the website yet and I really just won't to work out any glaring functionality bugs ( i.e., client side Javascript).

	When running the Android Emulator localhost refers to the Androids own loopback. Instead, use 10.0.2.2. This refers to the HOST machine's loopback.

	Will need to install Intel HAXM runtime; Can do this through Android SDK Manager ( just make sure you actually RUN it from the extras/ folder as the Manager just downloads it).

	Will need to emulate the camera for the AVD, too. Can edit the AXD and emulate the front/rear cameras.

02/20/2017
----------
- Google Places API - autocomplete

	This component is problematic on mobile. 
	
		1) Google no longer supports getCurrentPosition() in non-https environments. I have only had this problem in mobile, however. As a result I can no longer display an initial (local) map.
		2) The autocomplete suggestions are mis-aligned on mobile; this is bacause they are not redered as <option>(s). Google has a workaround for this (supposedly) that I need to look into:

			http://stackoverflow.com/questions/7893857/how-do-you-style-the-dropdown-on-google-places-autocomplete-api

		3) Click(ing) on a map returns the wrong mouse coordinates on mobile; this results in the "pin" being stuck about 100 px off center.




	
	
	




	
	

 

