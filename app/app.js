'use strict';

// Declare app level module which depends on views, and components
angular.module('MeetTheProf', [
  'ngRoute',
  'MeetTheProf.view-docent',
  'MeetTheProf.view2',
  'MeetTheProf.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view-docent'});
}]);
