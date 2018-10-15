var appRoot = require('app-root-path');
var helpers = require(appRoot + '\\test\\client-tests\\client-test-helper');
var ngModule = helpers.module;
var inject = helpers.inject;
var should = require('chai').should();
var fs = require('fs');
var jsdom = require('jsdom').jsdom;

global.document = jsdom('<html><head><script></script></head><body><img id="image" src="foo.jpg"></body></html>');

// Add jQuery to make it easier to validate.
global.$ = require(appRoot + '\\bower_components\\jquery\\dist\\jquery.js');

global.Cropper = require(appRoot + '\\bower_components\\cropperjs\\dist\\cropper.js');
global.sinon = require(appRoot + '\\bower_components\\sinon\\lib/sinon.js');

// Stub out Cropper. 
var stub = sinon.stub(global, "Cropper").returns( { 
    getCroppedCanvas : function () {
        return { toDataURL : function () {
                    return { "Hello" : "World" };
                 },
                toBlob : function ( callback ) {
                    callback.call( this, { "Data" : "Blob"} );
                }
        }
    },
    destroy : function () {
    }
});

require(appRoot + '\\public\\javascripts\\app');
require(appRoot + '\\public\\javascripts\\directives\\imageEditor');

// Tests .....

describe('Test ImageEditor Directive', function () {

    var $scope,
        element,
        $element;

    beforeEach(ngModule('me.directives'));    

    // Register the Views that are being tested.
    beforeEach(function() {
        inject(function($templateCache) {
            if(!$templateCache.get('views/partials/imageEditor.html')) {
                
                $templateCache.put(
                    "views/partials/imageEditor.html", 
                    "<div>" + fs.readFileSync(appRoot.resolve("/public/views/partials/imageEditor.html"),"utf8") + "</div>");

                $templateCache.get('views/partials/imageEditor.html');  
            }                              
        });
    });
    
    beforeEach(function(done) {
        inject(function(_$rootScope_, _$compile_){

            $scope = _$rootScope_.$new(),

            element = angular.element('<div image-editor img-id="image" img-src="picFile"></div>');
            _$compile_(element)($scope);    
            $scope.$digest();   

            // Let's get a JQuery handle on the element to make verfication easier.
            $element = $(element);

            done();                             
        });
    });    

    it("Verify that 'Edit Image' is visible when image source id defined but is NOT being edited.", function(done) {
    
        // Let's pretend the image src just changed.
        element.isolateScope().imgSrc = {};          
        element.isolateScope().$digest();

        // No cropper should be instantiated.
        should.equal(element.isolateScope().cropped, false);

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");   

        // Make sure image is NOT being edited.
        should.equal(element.isolateScope().cropped, false);                 

        done();
    });

    it("Verify that 'Apply Changes' and editor controls are visible when image IS being edited.", function(done) {

        // Let's pretend the image src just changed.
        element.isolateScope().imgSrc = {};          
        element.isolateScope().$digest();

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");    

        // Click the 'Edit Image' button.
        element.find("button").triggerHandler("click");
        element.isolateScope().$digest();

        // Make sure image is being edited.
        should.equal(element.isolateScope().cropped, true);

        // Make sure "Apply Changes" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Apply Changes");

        // Make sure the div containing all editor functionality IS visible.
        should.equal($($element.find("div")[1]).hasClass("ng-hide"),false);        

        done();
    });  

    it("Verify that Markup is be generated", function(done) {

        // Make sure "Rotate Clockwise" and "Rotate Counter-Clockwise" buttons exist.
        should.equal($element.find("input[type='button']").length, 2);
        should.equal($element.find("input[type='button']")[0].value,"Rotate Clockwise");
        should.equal($element.find("input[type='button']")[1].value,"Rotate Counter-Clockwise");

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");

        done();                   
    });      

    it("Verify that clicking 'Apply Changes' button invokes onImageEdited().", function(done) {
        // Let's pretend the image src just changed.
        element.isolateScope().imgSrc = {};          
        element.isolateScope().$digest();

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");    

        // Click the 'Edit Image' button.
        element.find("button").triggerHandler("click");
        element.isolateScope().$digest();

        // Make sure image is being edited.
        should.equal(element.isolateScope().cropped, true);

        // Make sure "Apply Changes" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Apply Changes");

        // Set up callback handler for onImageEdited.
        element.isolateScope().onImageEdited = function ( data ) {
            should.not.equal(data,null);
            should.not.equal(data.dataUrl,null);
            should.not.equal(data.blob,null);            
            done();
        };   

        // Now click "Apply Changes" - should trigger onImageEdited.
        element.find("button").triggerHandler("click");
        element.isolateScope().$digest();  
    });

    it("Verify when imgSrc is NOT null that 'Edit Image' or 'Apply Changes' is visible.", function(done) {
        // Let's pretend the image src just changed.
        element.isolateScope().imgSrc = {};          
        element.isolateScope().$digest();

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");            
        done();
    });    

    it("Verify that editor (aspect ratio, rotate, etc...) are only visible when the image is being edited.", function(done) {

        // Let's pretend the image src just changed.
        element.isolateScope().imgSrc = {};          
        element.isolateScope().$digest();

        // Make sure "Edit Image" is visible.
        should.equal($element.find("button").length, 1);
        should.equal($element.find("button").html(), "Edit Image");      

        // Make sure the div containing all editor functionality is NOT visible.
        should.equal($($element.find("div")[1]).hasClass("ng-hide"),true);

        done();
    });
        
});
