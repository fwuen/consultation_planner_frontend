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
    $scope.docents = [
        {'id': '1', 'firstname': 'Andrej', 'lastname': 'Bachmann'},
        {'id': '2', 'firstname': 'Peter', 'lastname': 'Stöhr'},
        {'id': '3', 'firstname': 'Barbara', 'lastname': 'Ashauer'}
    ];
    $scope.selectedDocent = {
        'id': '1', 'firstname': 'Andrej', 'lastname': 'Bachmann'
    };
    $scope.selectedDocentMeetings = [
        {}
    ];

    $scope.searchTerm = String();

    $scope.showDocentMeetingsWell = function() {
        // Show well only in case of selected docent not having any meetings
        return $scope.selectedDocentMeetings.length < 1 &&
        !angular.equals($scope.selectedDocent, {});
    };

    $scope.docentHasMeetings = function() {
        return $scope.selectedDocentMeetings.length > 0;
    };

    $scope.setSelectorClass = function(event) {
        if(event.type === 'mouseenter') {
            event.target.classList.add("docent-selector-hovered");
        }
        if(event.type === 'mouseleave') {
            event.target.classList.remove("docent-selector-hovered");
        }
    };
}
