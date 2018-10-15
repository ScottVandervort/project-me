angular.module('me.directives').directive('googleMap', function ($q) {

    var $scope;

    function generateLocationInfo() {
        return {
            lat         : null,
            lng         : null,
            name        : null,
            icon        : null,
            address     : null,
            city        : null,
            state       : null,
            postalCode  : null,
            country     : null 
        }                        
    }

    function link (scope, element, attrs) {

        $scope = scope;

        $scope.mapElem = element.children()[1],
        $scope.autoCompleteElem = element.children()[0];

        $scope.map = new google.maps.Map($scope.mapElem, {
                    zoom: 15
                });

        if (scope.readOnly) {
            init();                                                                 
        }   
        else {            
             $scope.autocomplete = new google.maps.places.Autocomplete($scope.autoCompleteElem);
            
             $scope.autocomplete.addListener('place_changed', onPlaceChanged);
             google.maps.event.addListener($scope.map, 'click', onClick);              

            // Initialize the map using the geo coordinates before initializing with coordinates. Needs to be orchestrated
            // as geolocation is asynchronous and coordinates may be retreived from db (also asynchronous). This can result
            // in a race condition where geolocation completes first and wipes out the user-defined coordinates.
            geoLocate().then(
                function (geolocation) { 
                    init();
                });
        }                                               
    }  

    function init () {

        // Coordinates (lat and lng) are supplied through the directivs attributes and bound to the scope. 
        // The coordinates might not be immediately available. 

        if ($scope.lat != "" && $scope.lng != "") {
            // Coordinates are available.
            initMarker($scope.lat, $scope.lng, $scope.markerTitle);                           
        }
        else {
            // Coordinates are NOT available. They are probably being loaded asynchronously. Watch them. 
            var unregister = $scope.$watchGroup(['lat', 'lng'], function( newValues, oldValues, scope){            
                if (newValues.join("").trim().length > 0) {
                    if (newValues.join("").trim() != oldValues.join("").trim()) {  
                        // Coordinaates are now available.        
                        initMarker(scope.lat, scope.lng, scope.markerTitle);
                        // Stop watching the coordinates (lat, lng) for changes. Only want to initalize once.    
                        unregister();         
                    }         
                }
            });
        }        
    }

    function initMarker( lat, lng, markerTitle ) {
        var loc = {
                lat: lat,
                lng: lng
            };

        var locationInfo = generateLocationInfo();
        locationInfo.lat = loc.lat;
        locationInfo.lng = loc.lng;
        locationInfo.name = markerTitle;                    

        placeMarker(locationInfo, false, true);        
    }

    function geoLocate() {
        var deferred = $q.defer();

        // getCurrentPosition() only works in https ...
        if (location.protocol.indexOf("https") >= 0 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    $scope.map.setCenter(geolocation);

                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
        
                    if (typeof $scope.autocomplete != 'undefined')
                        $scope.autocomplete.setBounds(circle.getBounds());

                    deferred.resolve(geolocation);                        
                },
                function () {
                    deferred.resolve();                    
                });
        }   
        else 
            deferred.resolve();
          
        return deferred.promise;
    }

    function clear () {                
        $scope.lat = "";
        $scope.lng = "";
    }    

    function placeMarker(locationInfo, isModified, recenter) {

        if ($scope.marker != null)
              $scope.marker.setMap(null);        
                    
        $scope.marker = new google.maps.Marker({
            position: { lat : locationInfo.lat, lng : locationInfo.lng },
            map: $scope.map,
            icon : locationInfo.icon,
            title : locationInfo.name
        });   

        $scope.lat = locationInfo.lat;
        $scope.lng = locationInfo.lng;

        if (recenter) {
            $scope.map.panTo({ lat: locationInfo.lat, lng: locationInfo.lng });
        }
    
        if ($scope.onLocationChanged != null && isModified)
            $scope.onLocationChanged({ arg : locationInfo});
    }

    function onClick (e) {
        
        var locationInfo = generateLocationInfo(); 
        locationInfo.lat =  e.latLng.lat();
        locationInfo.lng = e.latLng.lng();  

        placeMarker(locationInfo, true, false);             
    }

    function onPlaceChanged () {

        clear();

        var place = $scope.autocomplete.getPlace();

        var loc = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };

        var locationInfo = generateLocationInfo(),
            streetNumber = "",
            streetName = "";
        
        locationInfo.name = place.name;
        locationInfo.lat = loc.lat;
        locationInfo.lng = loc.lng;
        locationInfo.icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
    
        for (var i = 0; i < place.address_components.length; i++) {
            switch (place.address_components[i].types[0]) {
                case("street_number"):
                    streetNumber = place.address_components[i]["short_name"];
                break;
                case("route"):
                    streetName = place.address_components[i]["long_name"];
                break;                
                case("locality"):
                    locationInfo.city = place.address_components[i]["long_name"];
                break;                                
                case("administrative_area_level_1"):
                    locationInfo.state = place.address_components[i]["long_name"];
                break;                         
                case("country"):
                    locationInfo.country = place.address_components[i]["long_name"];
                break;                  
                case("postal_code"):
                    locationInfo.postalCode = place.address_components[i]["short_name"];
                break;                    
            }
        }
        locationInfo.address = ((streetNumber.length > 0) ? (streetNumber + " ") : "") + streetName;
       
        placeMarker(locationInfo, true, true);
    }
  
    return {
        scope: {
            readOnly: '=readOnly',
            lat: '=lat',
            lng: '=lng',
            markerTitle: '=markerTitle',
            onLocationChanged: '&'         
        },           
        link: link,
        templateUrl : "views/partials/googleMap.html"
    }
 });