'use strict';

angular.module('MeetTheProf.viewLogin', ['ngStorage']);
/*['ngRoute']*/

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

function loginController($scope, $localStorage, $http) {
    /*var data = $.param({
     username: $scope.username
     });*/

    $scope.submit = submit;

    function submit() {
        $http({
            method: 'POST',
            url: 'http://localhost:8000/login',
            data: data.call(),
            headers: {'Content-Type': 'application/json'}
        }).then(function (response) {
                $localStorage.auth = response.headers('Authorization');
                var token = $localStorage.auth;
                if (token.substring(50) === 's') {
                    window.location.href = 'http://localhost:63342/frontend_new/app/view-student/viewstudent.html';
                }
                else {
                    window.location.href = 'http://localhost:63342/frontend_new/app/view-docent/viewdocent.html';
                }
            }
        );
    }

    var data = {
        call: function () {
            return {'username': $scope.username, 'password': $scope.password};
        }

    };

    // $.ajax({
    //     url: 'http://localhost:8000/docent/1/meeting',
    //     type: "GET",
    //     dataType: 'json',
    //     headers: {
    //         "Authorization": $localStorage.auth
    //     },
    //     success: function (data) {
    //
    //     },
    //     error: function (jqxhr, textStatus, errorThrown) {
    //
    //     }
    // });
}