var should = require('chai').should(),
    request = require('supertest'),
    appRoot = require('app-root-path'),
    ObjectId = require('mongodb').ObjectID;	

var app = require(appRoot + '/app');
var helpers = require(appRoot + '/test/server-tests/server-test-helper');

// Wrap the node.js application with supertest; Will allow http requests to be overridden.
var agent = request.agent(app);

// Initialization ....

before(function (done) {

  helpers.purgeData().then( function () {
    return helpers.addEntries( [{ _id : ObjectId("582f7b3e766e8d39ac8632e9"), type: 'journal', datestamp: '01/18/2010', title: "Hello", description : "Ashley"},
                                { _id : ObjectId("582f7b3e766e8d39ac8632e8"), type: 'journal', datestamp: '12/26/2011', title: "Hello", description : "Kaylee"},
                                { _id : ObjectId("582f7b3e766e8d39ac8632e7"), type: 'journal', datestamp: '12/26/2011', title: "Hello", description : "Ashley+Kaylee"}]).then( 
    function () {
      return done();
    }).catch ( function (err) {
      done(err);      
    })
  }).catch ( function (err) {
    done(err);
  });
});

// Tests .....

describe('GET /search/', function() {
  it('Should return journal items', function(done) {
    agent
    .get('/search')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      should.not.equal(res.body,null);
      should.not.equal(res.body.payload,null);
      should.equal(res.body.payload.length,3);
      should.not.equal(res.body.success,null);
      should.equal(res.body.success,true);      

      done();
    });
  });
});

describe('GET /criteria/[search_criteria]', function() {
  it('Should return journal items with the specified search criteria', function(done) {
    agent
    .get('/search/' + encodeURIComponent("Ashley+Kaylee"))
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      should.not.equal(res.body,null);
      should.not.equal(res.body.payload,null);
      should.equal(res.body.payload.length,1);
      should.not.equal(res.body.success,null);
      should.equal(res.body.success,true);      
      done();
    });
  });
});

describe('GET /search/[id]', function() {
  it('Should return the specified journal item', function(done) {
    agent
    .get('/search/id/582f7b3e766e8d39ac8632e8')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);

      should.not.equal(res.body,null);
      should.not.equal(res.body.payload,null);
      should.equal(res.body.payload.length,1);
      should.not.equal(res.body.success,null);
      should.equal(res.body.success,true);      
      done();
    });
  });
});
