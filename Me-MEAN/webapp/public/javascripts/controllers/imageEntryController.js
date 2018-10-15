angular.module('me.controllers').controller('imageEntryController', function($scope, $timeout, $location, $routeParams, entryService, searchService, Upload) {
    
    $scope.entryData = {};  

    $scope.progress = -1;
    $scope.picFile = null;
    
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
                        $scope.picFile = "images\\" + success.data.payload[0].image;                                                
                    }
                },
                function (error) {
                
                });
        }        
    }  

    function clearForm () {
        if ($scope.imageForm)
            $scope.imageForm.$setPristine();
                
        $scope.entryData.date = new Date();
        $scope.entryData.title = "";
        $scope.entryData.description = "";        
    }

    $scope.onImageEdited = function ( dataUrl, blob ) {
        document.getElementById("image").src = dataUrl;
        $scope.picFile = blob;
    }
         
    $scope.upload = function () {

        if ($scope.entryData._id) {
            
            entryService.updateImageEntry(
                $scope.picFile,
                $scope.entryData._id,
                $scope.entryData.date,
                $scope.entryData.title,
                $scope.entryData.description
            ).then(          
                function (success) {
                    // TODO: Handle response from server.
                    $timeout(function() {
                        $location.path("/");
                    },
                    3000)                                    
                },
                function (error) {
                    // TODO: Handle response from server.                
                },
                function (progress){
                    $scope.progress = parseInt(100.0 * progress.loaded / progress.total);                
                });     
        }
        else {

            entryService.createImageEntry(
                $scope.picFile,
                $scope.entryData.date,
                $scope.entryData.title,
                $scope.entryData.description
            ).then(          
                function (success) {
                    // TODO: Handle response from server.
                    $timeout(function() {
                        $location.path("/");
                    },
                    3000)                                    
                },
                function (error) {
                    // TODO: Handle response from server.                
                },
                function (progress){
                    $scope.progress = parseInt(100.0 * progress.loaded / progress.total);                
                });     
        }
    }    
});