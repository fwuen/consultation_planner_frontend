'use strict';

angular.module('MeetTheProf.viewLogin', []); /*['ngRoute']*/

angular
    .module('MeetTheProf.viewLogin')
    .controller('LoginController', loginController);
    /*
    .config('$routeProvider', function($routeProvider) {
        $routeProvider.when('/view-login', {
            templateUrl: 'view-login/view-login.html',
            controller: 'LoginController'
        })
    });
    */

function loginController($scope) {
    $scope.email = String();
    $scope.password = String();

    $scope.submit = submit;

    function submit() {
        if($scope.loginForm.$valid) {
            alert("Halo i bims 1 sabmitt!");
        }
        else {
            alert("Nope!");
        }
    }
}