angular.module('me.controllers').controller('homeController', function($scope, searchService, entryService, events) {
    
    // TODO : Handle url arguments to query by year, month, day, and search string.

    $scope.entries = [];

    _load = function ( searchCriteria ) {

        if (typeof searchCriteria == 'undefined') {
            searchService.find().then( 
                function successCallback (response) {
                    $scope.entries = response.data.payload;
                },
                function errorCallback (response) {
                    // TODO: Handle error.                                        
                });
        }
        else {
            searchService.search(searchCriteria).then( 
                function successCallback (response) {
                    $scope.entries = response.data.payload;
                },
                function errorCallback (response) {
                    // TODO: Handle error.                                        
                });            
        }
    }

    _removeEntry = function ( id ) {
        for (var entryIndex = $scope.entries.length-1; entryIndex >= 0; entryIndex --) {
            if ($scope.entries[entryIndex]._id == id) {
                $scope.entries.splice(entryIndex,1);
            }
        }        
    }

    $scope.delete = function ( id, type ) {

        entryService
            .deleteEntry(id, type)
            .then(  function successCallback(response) {
                // Only remove entry if successfully deleted.
                if (response.data.success) {
                    _removeEntry(id);
                }
                else {
                    // TDOD : Handle delete failure.
                }                                                     
            }, 
            function errorCallback(response) {
                // TODO: Handle response from server.                        
                console.log(response);
            });        
    }
    
    $scope.$on(events.ON_SEARCH_CRITERIA_CHANGED, function (event, arg) { 
        _load(arg);
    });    

    _load();
});