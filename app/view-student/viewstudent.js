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
        getPanelType: function (aParticipation) {
            if (aMeeting.has_passed === "true" || aParticipation.meeting.has_passed === 1) {
                return "panel-passed";
            }
            if (aMeeting.cancelled === "true" || aParticipation.meeting.cancelled === 1) {
                return "panel-cancelled";
            }
            return "panel-participants";
        }
    }
}

function studentMeetingsController($scope, $http) {
    $scope.studentMeetings = [];

    $scope.studentHasMeetings = function() {
        return $scope.studentMeetings.length > 0;
    }

    $http.get('meetingsTest.json').then(function(response) {
        $scope.studentMeetings = response.data;
    });

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
