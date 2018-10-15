angular.module('me.controllers').controller("navigationController", function ($rootScope, $scope, $location, entryTypes, events) {
    
    var lastSearchCriteria = "";
    
    $scope.entryTypes = entryTypes;
    
    $scope.$watch('searchCriteria', function() {
        
        var searchCriteria = "";                
                
        if (typeof $scope.searchCriteria != "undefined" && $scope.searchCriteria != null) 
            searchCriteria = $scope.searchCriteria.trim();

        if (lastSearchCriteria != searchCriteria) {
            $rootScope.$broadcast(events.ON_SEARCH_CRITERIA_CHANGED, searchCriteria);
            lastSearchCriteria = searchCriteria;
        }       
    });

    $scope.go = function () {
        $location.path('/create/' + $scope.selectedEntryType.id);
        $scope.reset();        
    }

    $scope.reset = function () {
        $scope.selectedEntryType = null;
    }
});