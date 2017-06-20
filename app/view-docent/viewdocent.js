'use strict';

angular.module('MeetTheProf.viewDocent', ['ngFabForm', 'ngMessages']);

angular
    .module('MeetTheProf.viewDocent')
    .factory('MeetingsEventHandler', meetingsEventHandler)
    .factory('MeetingsViewHandler', meetingsViewHandler)
    .controller('MeetingsController', meetingsController)
    .factory('CreationFormEventHandler', creationFormEventHandler)
    .controller('CreationFormController', creationFormController);

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
            if (aMeeting.has_passed === "true") {
                return "panel-passed";
            }
            if (aMeeting.cancelled === "true") {
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

    $http.get('meetingsTest.json').then(function(meetingsTestResponse) {
        $scope.meetingsEventHandler.setMeetings(meetingsTestResponse.data);
    });
}

function creationFormEventHandler() {

    function initDatetimepicker() {
        $('.datetimepicker').datetimepicker({
            locale: 'de',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar"
            }
        });
    }

    function initTooltips() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    return {
        submit: function() {
            return alert("Halo i bims sabmitt");
        },
        initCreationForm: function() {
            initDatetimepicker();
            initTooltips();
        }
    }
}

function creationFormController($scope, CreationFormEventHandler) {
    $scope.creationFormEventHandler = CreationFormEventHandler;

    $scope.newMeeting = {};

    $scope.creationFormEventHandler.initCreationForm();
}
