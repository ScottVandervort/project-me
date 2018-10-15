angular.module('me.services').factory("entryService", function ($http, Upload) {

	return {

		createJournalEntry: function ( date, title, description ) {
			return $http.post(
                "/journals",
                {   description: description,
                    date: date,
                    title: title });    
		},

        updateJournalEntry: function ( id, date, title, description ) {
            return $http.put(
                '/journals/' + id,
                {   description: description,
                    date: date,
                    title: title });                
        },        

		createLocationEntry: function ( date, title, description, address, city, state, postalCode, lat, lng ) {
			return $http.post(
                "/locations", 
                {   description: description,
                    date: date,
                    title: title,
                    address : address,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    lat: lat,
                    lng: lng });   
		}, 

		updateLocationEntry: function ( id, date, title, description, address, city, state, postalCode, lat, lng	 ) {
			return $http.put(
                "/locations/" + id, 
                {   description: description,
                    date: date,
                    title: title,
                    address : address,
                    city: city,
                    state: state,
                    postalCode: postalCode,
                    lat: lat,
                    lng: lng });   
		},         
     
        createImageEntry: function ( imgData, date, title, description ) {
            return Upload.upload({  url: '/images',
                                    data: {
                                        file: imgData,
                                        description: description,
                                        date: date,
                                        title: title
                                    }});        
        },

        updateImageEntry: function ( imgData, id, date, title, description ) {
            return Upload.upload({  method: 'PUT',
                                    url: '/images/' + id,
                                    data: {                                        
                                        file: imgData,
                                        description: description,
                                        date: date,
                                        title: title
                                    }});   
        },

        deleteEntry: function ( id, type ) {

            var result = null;

            // TODO: Types should be constants.
            if (type.trim().toUpperCase() == "IMAGE") {
                result =  $http.delete(
                    "/images/" + id);
            }
            else {
                result = $http.delete(
                    "/journals/" + id);
            }    

            return result;               
        }                  
}});