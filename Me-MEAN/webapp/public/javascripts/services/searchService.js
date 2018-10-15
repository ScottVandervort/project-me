angular.module('me.services').factory("searchService", ['$http', function ($http) {

    return {
        find: function () {
            return $http.get("/search");                
        },
        findById: function ( id ) {
            return $http.get("/search/id/" + id );                
        },        
        search: function ( searchCriteria ) {
			return $http.get("/search/" + encodeURIComponent(searchCriteria));       
        }
    }

}]);