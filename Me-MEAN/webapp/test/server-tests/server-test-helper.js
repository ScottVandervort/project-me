var mongoClient = require('mongodb').MongoClient,
    Promise = require('bluebird'),
    fse = require('fs-extra'),
    config = require('config');

module.exports = {

    addEntries : function ( data ) {

        return new Promise( function (resolve, reject) {

            mongoClient.connect( config.get('database.url') , function(err, mongoDb) {    

                if (err) {
                    reject(err);
                }
                else {
                    // Insert journal entry.
                    mongoDb.collection("me").insert(
                        data,
                        function (err, doc) {		
                            if(err) {
                                reject(err);					
                            }			
                            else {
                                resolve(true);
                            }
                        });        
                }
            })
        });
    },        


    purgeData: function () {

        return new Promise( function (resolve, reject) {

            mongoClient.connect( config.get('database.url') , function(err, mongoDb) {    

                if (err) {
                    reject(err);
                }
                else {
                    // Purge database entries.
                    mongoDb.collection("me").deleteMany(function(err) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            // Purge uploaded images.
                            fse.emptyDir('../public/images', function (err) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(true);
                                }                            
                            });
                        }

                    });
                }
            })
        });
    }
};