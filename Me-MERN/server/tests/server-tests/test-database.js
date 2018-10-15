var config = require('../../config/auth');
var should = require('chai').should();	
var database = null;

describe('Test database', function() {

    // Instantiate the database for these tests.
    before(function (done) {        
        database = require('../../database')({ 
            "config" : config.db,
            "isConnectedCallback" : function () { 
                // Database is ready! Start tests....
                done(); 
            }});    
    });

    it('Should insert an entry', function (done) {

        database.insert ( null, null, null, "03/01/1976", "Birthday", "I was born today!" )
                .then(function (resp) {
                    should.not.equal(resp,null);                    
                    console.log(resp);
                    done();
                })
                .catch(function (err) {
                    console.log(err);
                    done();
                });
    });
});


