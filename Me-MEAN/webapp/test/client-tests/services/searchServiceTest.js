var appRoot = require('app-root-path');
var helpers = require(appRoot + '\\test\\client-tests\\client-test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;
var should = require('chai').should();

require(appRoot + '\\public\\javascripts\\app');
require(appRoot + '\\public\\javascripts\\services\\searchService');

// Tests .....

describe('Test Angular Search Service', function() {

    var searchService, 
        httpBackend;

    beforeEach(ngModule('me.services'));

    beforeEach(inject(function(_searchService_, _$httpBackend_) {
        searchService = _searchService_;
        httpBackend = _$httpBackend_;
    }));

    it("Should support search all", function (done) {
        
        httpBackend.expectGET("/search").respond({ hello: "world" });      
    
        searchService
            .find()
            .then(function(resp) {
                should.equal(resp.data.hello, "world");
                done();
            });

        httpBackend.flush();              
    });

    it("Should support search by criteria", function (done) {
        
        httpBackend.expectGET("/search/" + encodeURIComponent("Ashley+Kaylee") ).respond({ hello: "world" });      
    
        searchService
            .search("Ashley+Kaylee")
            .then(function(resp) {
                should.equal(resp.data.hello, "world");
                done();
            });

        httpBackend.flush();              
    });    

    it("Should support search by id", function (done) {
        httpBackend.expectGET("/search/id/1234").respond({ hello: "world" });      

        searchService
            .findById(1234)
            .then(function(resp) {
                should.equal(resp.data.hello, "world");
                done();
            });

        httpBackend.flush();              
    });        
});

