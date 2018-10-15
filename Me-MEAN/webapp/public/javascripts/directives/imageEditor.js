angular.module('me.directives').directive('imageEditor', function () {

    var $scope;    

    function link (scope, element, attrs) {
        $scope = scope;

        $scope.cropped = false;
        $scope.cropper = null;
        $scope.aspectRatio = "";
        $scope.dragMode = "crop";
        
        $scope.imageElemId = attrs.imgId; 
        $scope.$watch("imgSrc", onNewImageSelected);
        
        $scope.cropImage = cropImage;    
        $scope.aspectRatioChanged = aspectRatioChanged;
        $scope.movementChanged = movementChanged;
        $scope.rotateClockwise = rotateClockwise;
        $scope.rotateCounterClockwise = rotateCounterClockwise;
    }

    function onNewImageSelected (image) {
        $scope.cropped = false;
        if (typeof $scope.cropper != 'undefined' && $scope.cropper != null) 
            $scope.cropper.destroy();   
        $scope.cropper = null;          
    }

    function cropImage () {
    
        var image = document.getElementById($scope.imageElemId);

        $scope.cropped = !$scope.cropped;

        if ($scope.cropped){
            $scope.cropper = new Cropper(image, {
                aspectRatio: $scope.aspectRatio,  
                dragMode: $scope.dragMode
            });
        }
        else {            

            // TODO: Can I set original image?
            $scope.cropper.getCroppedCanvas().toBlob( function (blob) {

                var dataUrl = $scope.cropper.getCroppedCanvas().toDataURL();

                $scope.imgSrc = dataUrl;

                if ($scope.onImageEdited != null)
                    $scope.onImageEdited({ dataUrl : dataUrl, blob : blob});


                $scope.cropper.destroy();
                $scope.cropper = null;                       
            } );          
        }             
    }    

    function aspectRatioChanged () {
        $scope.cropper.setAspectRatio($scope.aspectRatio);
    }

    function movementChanged () {
        $scope.cropper.setDragMode($scope.dragMode)
    }

    function rotateClockwise () {
        $scope.cropper.rotate(90);
    }

    function rotateCounterClockwise () {
        $scope.cropper.rotate(-90);
    }    

    return {         
        link: link,
        templateUrl : "views/partials/imageEditor.html",
        scope: {
            imgSrc: '=imgSrc',
            onImageEdited: '&'                          
        }            
    }    
});