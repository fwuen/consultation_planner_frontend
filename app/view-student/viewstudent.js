'use strict';

angular.module('MeetTheProf.viewStudent', []);

angular
    .module('MeetTheProf.viewStudent')
    .factory('MeetingsViewHandler', meetingsViewHandler)
    .controller('StudentMeetingsController', studentMeetingsController)
    .controller('DocentMeetingsController', docentMeetingsController);

function meetingsViewHandler() {
    return {
        getMonthName: function (aDatetime) {
            var datetime = new Date(aDatetime);

            switch (datetime.getMonth() + 1) {
                case 1:
                    return "JAN";
                    break;
                case 2:
                    return "FEB";
                    break;
                case 3:
                    return "MRZ";
                    break;
                case 4:
                    return "APR";
                    break;
                case 5:
                    return "MAI";
                    break;
                case 6:
                    return "JUN";
                    break;
                case 7:
                    return "JUL";
                    break;
                case 8:
                    return "AUG";
                    break;
                case 9:
                    return "SEP";
                    break;
                case 10:
                    return "OKT";
                    break;
                case 11:
                    return "NOV";
                    break;
                case 12:
                    return "DEZ";
                    break;
                default:
                    return "N/A";
            }
        },
        getDayNumber: function (aDatetime) {
            var datetime = new Date(aDatetime);

            return datetime.getDate().toString().length === 2 ? datetime.getDate() : ("0" + datetime.getDate());
            //return datetime.getDate();
        },
        getHoursAndMinutes: function (aDatetime) {
            var datetime = new Date(aDatetime);
            var result;

            result = datetime.getHours().toString().length === 2 ? datetime.getHours() : ("0" + datetime.getHours());
            result += ":";
            result += datetime.getMinutes().toString().length === 2 ? datetime.getMinutes() : ("0" + datetime.getMinutes());

            return result;
        },
        getDayMonthYearHourMinutes: function (aDatetime) {
            var datetime = new Date(aDatetime);
            var result;

            result = datetime.getDate().toString().length === 2 ? datetime.getDate() : ("0" + datetime.getDate());
            result += ".";
            result += (datetime.getMonth() + 1).toString().length === 2 ? (datetime.getMonth() + 1) : ("0" + (datetime.getMonth() + 1));
            result += ".";
            result += datetime.getFullYear();
            result += " ";
            result += datetime.getHours().toString().length === 2 ? datetime.getHours() : ("0" + datetime.getHours());
            result += ":";
            result += datetime.getMinutes().toString().length === 2 ? datetime.getMinutes() : ("0" + datetime.getMinutes());

            return result;
        },
        getPanelType: function (aMeeting) {
            if (aMeeting.has_passed == "true" || aMeeting.has_passed == 1) {
                return "panel-passed";
            }
            if (aMeeting.cancelled == "true" || aMeeting.cancelled == 1) {
                return "panel-cancelled";
            }
            if (aMeeting.hasOwnProperty('participation')) {
                return "panel-participants";
            }
            return "panel-no-participants";
        }
    }
}

function studentMeetingsController($scope, $http, $window, MeetingsViewHandler) {
    $scope.meetingsViewHandler = MeetingsViewHandler;
    $scope.studentMeetings = [];
    $scope.cancelParticipation = {};
    $scope.setCancelParticipation = function (aParticipation) {
        //$scope.cancelParticipation = aParticipation;
        $scope.cancelParticipation = angular.copy(aParticipation);
    };

    $scope.studentHasMeetings = function() {
        return $scope.studentMeetings.length > 0;
    }

    $scope.submitCancelForm = submitCancelForm;

    function submitCancelForm() {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8000/student/1/participation' + ($scope.cancelParticipation.id),
            headers: {'Content-Type': 'application/json'}
        }).then(function (data) {
            $window.location.href = 'http://localhost:63342/frontend_new/app/view-student/viewstudent.html';
        });
    }

    /*
    $http.get('meetingsTest.json').then(function(response) {
        $scope.studentMeetings = response.data;
    });*/

    $http.get('http://localhost:8000/student/1/participation').then(function(response) {
        $scope.studentMeetings = response.data;
    })

}

function docentMeetingsController($scope, $http) {
    $scope.docents = [];
    $scope.selectedDocent = {};
    $scope.selectedDocentMeetings = [];

    $http.get('http://localhost:8000/docent').then(function(response) {
        $scope.docents = response.data;
    });

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
