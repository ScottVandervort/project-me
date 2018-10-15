var Promise = require("bluebird");
var GoogleDrive = require('./google-drive');


function BusinessLogicLayer (opts) {    

    if (!(this instanceof BusinessLogicLayer))
        return new BusinessLogicLayer(opts);
    
    this.config = opts.config;        
    this.googleDrive = GoogleDrive(opts.config.google);
    this.database = opts.database;
}

/*  Database Schema

    userId
    id
    entryId
    photoRepoId
    date
    title
    text
*/

// Photos ...
BusinessLogicLayer.prototype.addPhotoToEntry = function( userId, accessToken, refreshToken, entryId, text, file ) {

    var self = this;

    return new Promise (function(resolve,reject) {
        self.googleDrive.createFile( 
            accessToken, 
            refreshToken, 
            file)
        .then(  function(photoRepoId) {            
                    self.database.insert(userId, entryId, photoRepoId, null, null, text)
                        .then(resolve)
                        .catch(reject);
                })
        .catch(reject)});        
};

// Remove the photo record from the DB correspondiong to the db id.
BusinessLogicLayer.prototype.removePhoto = function( userId, id ) {
    return ""; // TODO: True / False
};

BusinessLogicLayer.prototype.updatePhoto = function( userId, id ) {
    return ""; // TODO: True / False
};

BusinessLogicLayer.prototype.getPhoto = function( userId, accessToken, refreshToken, photoId ) {

    var self = this;

    return new Promise ( function(resolve,reject) {

        self.database.getRepoIdForPhoto( userId, photoId )
        .then( function (photoRepoId) {
                self.googleDrive.getFile(
                    accessToken,
                    refreshToken,
                    photoRepoId)
                .then(resolve)
                .catch(reject);  
        })
        .catch(reject);
    });
};

// Entries ...
BusinessLogicLayer.prototype.addEntry = function( userId, date, title, text ) {

    var self = this;

    return new Promise(function(resolve,reject){
        self.database.insert(userId, null, null, date, title, text)
                        .then(resolve)
                        .catch(reject);
                })
};

BusinessLogicLayer.prototype.removeEntry = function( id ) {

    // Remove Photos from Google Drive.
    // Remove Photo Entries in DB.
    // Remove Entry from DB.


    return ""; // TODO: True / False
};

BusinessLogicLayer.prototype.updateEntry = function( id, date, title, text ) {
    return ""; // TODO: True / False
};

BusinessLogicLayer.prototype.getEntry = function( id ) {
    return ""; // TODO: An entry ( to response ).
};

BusinessLogicLayer.prototype.getSummaryForMonthAndYear = function( date ) {
    return ""; // TODO: List of entry date and titles ( to response ).
};

module.exports = BusinessLogicLayer;


