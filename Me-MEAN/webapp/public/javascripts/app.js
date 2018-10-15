var app = angular.module('me', ['ngRoute', 'ngFileUpload', 'ngSanitize', 'me.controllers', 'me.directives', 'me.services']);
angular.module('me.controllers',[]);
angular.module('me.directives',[]);
angular.module('me.services',[]);

app.constant("entryTypes", 	
	[
		{ id: "journal", text: "Journal" },
		{ id: "image", text: "Image" },
		{ id: "location", text: "Location" }
	]
);

app.constant("events", 		
    { 
        ON_SEARCH_CRITERIA_CHANGED: "onSearchCriteriaChanged" 
    }	
);

app.config(function($routeProvider) {
    $routeProvider

        .when('/', {
            templateUrl : 'views/home.html',
            controller  : 'homeController'
        })

        .when('/create/journal', {
            templateUrl : 'views/partials/journalEntry.html',
            controller  : 'journalEntryController'
        })

        .when('/create/image', {
            templateUrl : 'views/partials/imageEntry.html',
            controller  : 'imageEntryController'
        })        

        .when('/create/location', {
            templateUrl : 'views/partials/locationEntry.html',
            controller  : 'locationEntryController'
        })          
        
        .when('/update/journal/:id', {
            templateUrl : 'views/partials/journalEntry.html',
            controller  : 'journalEntryController'
        })

        .when('/update/image/:id', {
            templateUrl : 'views/partials/imageEntry.html',
            controller  : 'imageEntryController'
        })

        .when('/update/location/:id', {
            templateUrl : 'views/partials/locationEntry.html',
            controller  : 'locationEntryController'
        });                        
});




















