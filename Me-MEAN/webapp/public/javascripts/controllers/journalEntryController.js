angular.module('me.controllers').controller('journalEntryController', function($scope, $location, $routeParams, entryService, searchService ) {

    $scope.entryData = {};  

    $scope.submitForm = function () {

        if ($scope.entryData._id) {
            entryService
                .updateJournalEntry(
                    $scope.entryData._id,
                    $scope.entryData.date,
                    $scope.entryData.title,                                        
                    $scope.entryData.description)
                .then(  function successCallback(response) {
                            $location.path("/");                        
                        }, 
                        function errorCallback(response) {
                        });
        }
        else {
            entryService
                .createJournalEntry(
                    $scope.entryData.date,
                    $scope.entryData.title,                    
                    $scope.entryData.description)
                .then(  function successCallback(response) {
                            $location.path("/");                        
                        }, 
                        function errorCallback(response) {
                        });
        }
    }   

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
                    }
                },
                function (error) {
                
                });
        }          
    }

    function clearForm () {
        if ($scope.journalForm)
            $scope.journalForm.$setPristine();

        $scope.entryData.date = new Date();
        $scope.entryData.title = "";
        $scope.entryData.description = "";
    }    
});
