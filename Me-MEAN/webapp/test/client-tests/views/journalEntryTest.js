var appRoot = require('app-root-path');
var helpers = require(appRoot + '\\test\\client-tests\\client-test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;
var should = require('chai').should();
var fs = require('fs');

// Add jQuery to make it easier to validate.
global.$ = require(appRoot + '/bower_components/jquery/dist/jquery.js');

require(appRoot + '\\public\\javascripts\\app');

// Tests .....

describe('Test JournalEntry View', function () {

    // Mock-up the controller that will be used to populate the views.
    beforeEach(function () {
        ngModule('me.controllers', function ( $controllerProvider) {
            $controllerProvider.register('journalEntryController', function($scope) {  
                // Can implement scope methods and objects here.
            });
        });
    });        

    // Register the Views that are being tested.
    beforeEach(function() {
            inject(function($templateCache) {
                if(!$templateCache.get('views/partials/journalEntry.html')) {
                    
                    $templateCache.put(
                        "views/partials/journalEntry.html", 
                        "<div>" + fs.readFileSync(appRoot.resolve("/public/views/partials/journalEntry.html"),"utf8") + "</div>");

                    $templateCache.put(
                        "views/partials/commonEntry.html", 
                        "<div>" + fs.readFileSync(appRoot.resolve("/public/views/partials/commonEntry.html"),"utf8") + "</div>");

                    $templateCache.get('views/partials/journalEntry.html');  
                }                              
            });
        }
    );

    it('Should be populated by Controller', function(done) {

        inject(function($controller, _$rootScope_, _$compile_, $templateCache) {
            
            var $scope = _$rootScope_.$new(),
                template = $templateCache.get('views/partials/journalEntry.html'),
                formElement,
                $formElement;

            // Modify the scope.
            $scope.entryData = {};
            $scope.entryData._id = 1234;
            $scope.entryData.title = "Hello?";
            $scope.entryData.description = "Did it work?";

            // Bind the scope to an instance of the controller.
            $controller('journalEntryController', { $scope: $scope, $rootScope: _$rootScope_ });

            // Apply the controller's scope to the template/view.
            formElement = angular.element(template);            
            _$compile_(formElement)($scope);            
            
            $scope.$digest();

            // JQuery-ize the template.
            $formElement = $(formElement);            

            should.equal($formElement.find("input[name='title']").val(), "Hello?");
            should.equal($formElement.find("textarea[name='description']").val(), "Did it work?");
            should.equal($formElement.find("h2").html(), "Update Journal");
                                        
            done();
        });
    });
});
