var appRoot = require('app-root-path');
var helpers = require(appRoot + '\\test\\client-tests\\client-test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;
var should = require('chai').should();

require(appRoot + '\\public\\javascripts\\app');
require(appRoot + '\\public\\javascripts\\controllers\\homeController');
require(appRoot + '\\public\\javascripts\\services\\searchService');
require(appRoot + '\\public\\javascripts\\services\\entryService');

// Tests .....

describe('Test Home Controller', function() {
    
    beforeEach(ngModule('me'));    

    // Mock up search and entry services.
    beforeEach(function() {

        var mockSearchService = {};
        var mockEntryService = {};

        // Add mocked services to the module.
        ngModule('me.services', function($provide) {
            $provide.value('searchService', mockSearchService);
            $provide.value('entryService', mockEntryService);
        });

        // Mock up service methods.
        inject(function($q) {

            // Mock find() method on mocked search service.
            mockSearchService.find = function() {
                var defer = $q.defer();

                defer.resolve(
                    { "data" : { 
                        "success":true,
                        "message":null,
                        "payload": [
                            {"_id":"5818ce193e2f7e076454453d","datestamp":"2016-11-01T17:17:06.345Z","type":"journal","title":"Hello","description":"World!"},
                            {"_id":"5819221d3d5d894eb8d793f1","datestamp":"2016-11-01T23:15:33.961Z","type":"journal","title":"Hello","description":"To You!"}]
                        }
                    });

                return defer.promise;
            };
        });

        inject(function($q) {

            // Mock delete() method on entry service.
            mockEntryService.deleteEntry = function() {
                var defer = $q.defer();

                defer.resolve({ data : { success : true }});

                return defer.promise;
            };
        });

    });

    describe('On Load', function () {
        it("Should display entries", function (done) {

            // Inject everything needed to create the controller. This includes the controller service (to generate a new instance of the controller), the mocked services, and a scope.
            inject(function(_$controller_, $rootScope, searchService, entryService) {

                scope = $rootScope.$new();

                // Create the controller.
                _$controller_('homeController', { $scope: scope, searchService: searchService, entryService: entryService });            

                scope.$digest();

                // Verify that the controller was initialized.
                should.equal(scope.entries.length, 2);   

                done();   

            });          
        });
    });

    describe('On Delete', function () {
        it("Should remove entry", function (done) {

            // Inject everything needed to create the controller. This includes the controller service (to generate a new instance of the controller), the mocked services, and a scope.
            inject(function(_$controller_, $rootScope, searchService, entryService) {

                scope = $rootScope.$new();

                // Create the controller.
                _$controller_('homeController', { $scope: scope, searchService: searchService, entryService: entryService });            

                scope.$digest();

                // Verify the controller was initialized.
                should.equal(scope.entries.length, 2);

                // Now, remove one of the entries.
                scope.delete("5818ce193e2f7e076454453d", "journal");

                scope.$digest();                 

                // Verify the removal.
                should.equal(scope.entries.length, 1);                 

                done();   
            });          
        });
    });            
});
