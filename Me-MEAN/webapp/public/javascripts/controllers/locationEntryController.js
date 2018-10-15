angular.module('me.controllers').controller('locationEntryController', function($scope, $location, $routeParams, entryService, searchService) {

    $scope.entryData = {};  

    $scope.init = function () {
        clearForm();

        if ($routeParams.id) {

            searchService.findById($routeParams.id).then(          
                function (success) {
                    if (success.data.success && success.data.payload.length) {
                        $scope.entryData._id = success.data.payload[0]._id;
                        $scope.entryData.date = new Date(success.data.payload[0].datestamp);
                        $scope.entryData.title = success.data.payload[0].title;
                        $scope.entryData.description = success.data.payload[0].description;    
                        $scope.entryData.address = success.data.payload[0].location.address;  
                        $scope.entryData.city = success.data.payload[0].location.city;
                        $scope.entryData.state = success.data.payload[0].location.state;
                        $scope.entryData.postalCode = success.data.payload[0].location.postalCode;
                        $scope.entryData.country = success.data.payload[0].location.country;
                        $scope.entryData.lat = success.data.payload[0].location.lat;
                        $scope.entryData.lng = success.data.payload[0].location.lng;                                      
                    }
                },
                function (error) {
                
                });
        }          
    }   

    $scope.onLocationChanged = function ( locationInfo ) {

        $scope.$apply(function() {       
            $scope.entryData.address = locationInfo.address;
            $scope.entryData.city = locationInfo.city;
            $scope.entryData.state = locationInfo.state;
            $scope.entryData.postalCode = locationInfo.postalCode;
            $scope.entryData.country = locationInfo.country;
            $scope.entryData.lat = locationInfo.lat;
            $scope.entryData.lng = locationInfo.lng;
        });
    }

    $scope.submitForm = function () {

        if ($scope.entryData._id) {        
            entryService
                .updateLocationEntry(
                    $scope.entryData._id,                    
                    $scope.entryData.date,       
                    $scope.entryData.title,                                 
                    $scope.entryData.description,
                    $scope.entryData.address,
                    $scope.entryData.city,
                    $scope.entryData.state,
                    $scope.entryData.postalCode,
                    $scope.entryData.lat,
                    $scope.entryData.lng                
                )
                .then(  function successCallback(response) {
                            $location.path("/");                        
                        }, 
                        function errorCallback(response) {                      
                            console.log(response);
                        });
        }
        else {
            entryService
                .createLocationEntry(
                    $scope.entryData.date,       
                    $scope.entryData.title,                                 
                    $scope.entryData.description,
                    $scope.entryData.address,
                    $scope.entryData.city,
                    $scope.entryData.state,
                    $scope.entryData.postalCode,
                    $scope.entryData.lat,
                    $scope.entryData.lng
                )
                .then(  function successCallback(response) {
                            $location.path("/");                        
                        }, 
                        function errorCallback(response) {                      
                            console.log(response);
                        });
        }
    }   

    function clearForm () {
        if ($scope.locationForm)
            $scope.locationForm.$setPristine();
                
        $scope.entryData.date = new Date();
        $scope.entryData.title = "";
        $scope.entryData.description = "";        
        $scope.entryData.address = "";
        $scope.entryData.city = "";
        $scope.entryData.state = "";
        $scope.entryData.postalCode = "";
        $scope.entryData.country = "";
        $scope.entryData.lat = "";
        $scope.entryData.lng = "";
    }    
});