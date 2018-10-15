/* Derived from : https://github.com/rikukissa/angular-test-examples */

'use strict';

var appRoot = require('app-root-path');
var jsdom = require('jsdom').jsdom;

var document = global.document = jsdom('<html><head></head><body></body></html>');
var window = global.window = document.defaultView;


global.navigator = window.navigator = {};
global.Node = window.Node;

/*
 * angular-mocks
 */

window.mocha = {};
window.beforeEach = global.beforeEach;
window.afterEach = global.afterEach;

require(appRoot + '\\bower_components\\angular\\angular');

// Need to register angular here as the following requires (might) use it.
global.angular = window.angular;

require(appRoot + '\\bower_components\\angular-mocks');
require(appRoot + '\\bower_components\\angular-sanitize');
require(appRoot + '\\bower_components\\angular-route');
require(appRoot + '\\bower_components\\ng-file-upload\\ng-file-upload.js');     

module.exports = {
  inject: window.angular.mock.inject,
  module: window.angular.mock.module
};
