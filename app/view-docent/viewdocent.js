'use strict';

angular.module('MeetTheProf.viewDocent', ['ngFabForm', 'ngMessages', 'ngAnimate']);

angular
    .module('MeetTheProf.viewDocent')
    .factory('MeetingsEventHandler', meetingsEventHandler)
    .factory('MeetingsViewHandler', meetingsViewHandler)
    .controller('MeetingsController', meetingsController)
    .controller('CreationFormController', creationFormController)
    .controller('CancelFormController', cancelFormController);

function meetingsEventHandler() {
    var meetings = [];
    var creationFormIsActive = false;

    return{
        getMeetings: function() {
            return meetings;
        },
        setMeetings: function(aMeetings) {
            meetings = aMeetings;
        },
        getCreationFormIsActive: function() {
            return creationFormIsActive;
        },
        openCreationForm: function() {
            creationFormIsActive = true;
            alert("Show form...");
        },
        cancelMeeting: function(meeting) {
            //TODO: Code for cancelling a meeting. Bind to "absagen"-Button.
            //meeting.cancelled = true;
            alert("Cancelling has yet to be developed!");
        },
        editMeeting: function(meeting) {
            //TODO: Code for editing a meeting. Bind to "bearbeiten"-Button.
            alert("Editing has yet to be developed!");
        }
    }
}

function meetingsViewHandler() {
    return {
        getMonthName: function (aDatetime) {
            var datetime = new Date(aDatetime);

            switch (datetime.getMonth() + 1) {
                case 1:  return "JAN"; break;
                case 2:  return "FEB"; break;
                case 3:  return "MRZ"; break;
                case 4:  return "APR"; break;
                case 5:  return "MAI"; break;
                case 6:  return "JUN"; break;
                case 7:  return "JUL"; break;
                case 8:  return "AUG"; break;
                case 9:  return "SEP"; break;
                case 10: return "OKT"; break;
                case 11: return "NOV"; break;
                case 12: return "DEZ"; break;
                default: return "N/A";
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
        hasParticipants: function (aMeeting) {
            return parseInt(aMeeting.participants_count) > 0;
        },
        getPanelType: function (aMeeting) {
            if (aMeeting.has_passed === "true" || aMeeting.has_passed === 1) {
                return "panel-passed";
            }
            if (aMeeting.cancelled === "true" || aMeeting.cancelled === 1) {
                return "panel-cancelled";
            }
            if (parseInt(aMeeting.participants_count) > 0) {
                return "panel-participants";
            }
            return "panel-no-participants";
        }
    }
}

function meetingsController($scope, $http, MeetingsEventHandler, MeetingsViewHandler){
    $scope.meetingsEventHandler = MeetingsEventHandler;
    $scope.meetingsViewHandler = MeetingsViewHandler;

    $http.get('http://localhost:8000/docent/1/meeting/coalition').then(function(meetingsTestResponse) {
        $scope.meetingsEventHandler.setMeetings(meetingsTestResponse.data);
    });
}

function creationFormController($scope, $http, ngFabForm) {
    $scope.newMeeting = {};

    $scope.submit = submit;

    $scope.fabFormOptions = {
        validationsTemplate: 'validation.html'
    };

    initCreationForm();

    function initCreationForm() {
        initTooltips();

        $scope.newMeeting.is_series = 0;
        $scope.newMeeting.has_slots = 0;
        $scope.newMeeting.email_notification_docent = 0;
        $scope.newMeeting.description_public = String();
    }

    function initTooltips() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    function submit() {

        if($scope.newMeeting.has_slots === 0)
        {
            $scope.newMeeting.slots = 1;
        }
        // ToDo: Datenkonverter einbinden.
        if($scope.creationForm.$valid) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/docent/1/meeting',
                data: $scope.newMeeting,
                headers: {'Content-Type': 'application/json'}
            });
        }
    }
}

function cancelFormController($scope) {
    $scope.cancelMeeting = {};
    $scope.cancel_series = false;

    initCancelForm();

    function initCancelForm() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    function setCancelMeeting(aMeeting) {
        $scope.meeting = aMeeting;
    }

    function submit() {
        if($scope.cancelMeeting.$valid) {
            if($scope.cancelSeries) {
                // ToDo: Cancel meeting series
                alert("Halo i bims alles kanzel");
            }
            else {
                // ToDo; Cancel single meeting
                alert("Halo i bims 1 kanzel");
            }
        }
    }
}
