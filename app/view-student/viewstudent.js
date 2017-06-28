'use strict';

angular.module('MeetTheProf.viewStudent', []);

angular
    .module('MeetTheProf.viewStudent')
    .controller('StudentMeetingsController', studentMeetingsController)
    .controller('DocentMeetingsController', docentMeetingsController);

function studentMeetingsController($scope, $http) {
    $scope.studentMeetings = [];

    $scope.studentHasMeetings = function() {
        return $scope.studentMeetings.length > 0;
    }

    /*
    $http.get('../view-docent/meetingsTest.json').then(function(response) {
        $scope.studentMeetings = response.data;
    });
    */

}

function docentMeetingsController($scope, $http) {
    $scope.docentMeetings = [];

    $scope.docentHasMeetings = function() {
        return $scope.docentHasMeetings.length > 0;
    }

    $scope.setSelectorClass = function(event) {
        if(event.type === 'mouseenter') {
            event.target.classList.add("docent-selector-hovered");
        }
        if(event.type === 'mouseleave') {
            event.target.classList.remove("docent-selector-hovered");
        }
    }
}