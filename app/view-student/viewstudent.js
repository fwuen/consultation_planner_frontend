'use strict';

angular.module('MeetTheProf.viewStudent', ['ngStorage', 'ngFabForm']);

angular
    .module('MeetTheProf.viewStudent')
    .factory('MeetingsViewHandler', meetingsViewHandler)
    .controller('StudentMeetingsController', studentMeetingsController)
    .controller('DocentMeetingsController', docentMeetingsController)
    .controller('LogoutController', logoutController)
;

function meetingsViewHandler() {
    function hasPassed(aMeeting) {
        if(aMeeting.hasOwnProperty('has_passed')) {
            return aMeeting.has_passed == 1;
        }

        return false;
    }

    function isCancelled(aMeeting) {
        if(aMeeting.hasOwnProperty('cancelled')) {
            return aMeeting.cancelled == 1;
        }

        return false;
    }

    function hasSlots(aMeeting) {
        if (aMeeting.hasOwnProperty('slots')) {
            return aMeeting.slots > 1;
        }

        return false;
    }

    function isParticipateable(aMeeting) {
        var result = true;

        result = result && !isCancelled(aMeeting);

        if (hasSlots(aMeeting)) {
            if (aMeeting.hasOwnProperty('unoccupiedSlots')) {
                result = result && (aMeeting.unoccupiedSlots.length > 0);
            }
        }
        else {
            result = result && (aMeeting.max_participants > aMeeting.participants_count);
        }

        return result;
    }

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
        getPanelTypeStudent: function(aMeeting) {
            if (hasPassed(aMeeting)) {
                return "panel-passed";
            }
            if(isCancelled(aMeeting)) {
                return 'panel-cancelled';
            }
            return "panel-participants";
        },
        getPanelTypeDocent: function (aMeeting) {
            if (hasPassed(aMeeting)) {
                return "panel-passed";
            }
            if (!isParticipateable(aMeeting)) {
                return "panel-cancelled";
            }
            if (aMeeting.hasOwnProperty('participation')) {
                return "panel-participants";
            }
            return "panel-no-participants";
        },
        isParticipateable: isParticipateable,
        hasSlots: hasSlots,
        isCancelled: isCancelled,
        hasPassed: hasPassed,
        convertIntToYesNo: function (aNumber) {
            if (aNumber === 0) {
                return 'Nein';
            }
            else {
                return 'Ja';
            }
        }
    }
}

function studentMeetingsController($scope, $http, $window, MeetingsViewHandler, $localStorage, ngFabForm) {
    $scope.meetingsViewHandler = MeetingsViewHandler;

    $scope.now = new Date();

    $scope.studentMeetings = [];
    $scope.cancelParticipation = {};
    $scope.setCancelParticipation = function (aParticipation) {
        $scope.cancelParticipation = angular.copy(aParticipation);
    };

    $scope.isDataLoaded = false;

    $scope.studentHasMeetings = function () {
        return $scope.studentMeetings.length > 0;
    };

    var studentID = $localStorage.auth.substring(51);

    $scope.submitCancelForm = submitCancelForm;

    $http({
        method: 'GET',
        url: 'http://localhost:8000/student/' + studentID + '/participation/',
        headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
    }).then(function (response) {
        $scope.studentMeetings = response.data;
        $scope.isDataLoaded = true;
    });

    function submitCancelForm() {
        $http({
            method: 'DELETE',
            url: 'http://localhost:8000/student/' + studentID + '/participation/' + ($scope.cancelParticipation.id),
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (data) {
            $window.location.href = 'http://localhost:80/frontend_new/app/view-student/viewstudent.html';
            $scope.isDataLoaded = true;
        });
    }

    $scope.fabFormOptions = {
        validationsTemplate: 'validation.html'
    };

}

function docentMeetingsController($scope, $http, $window, MeetingsViewHandler, $localStorage, ngFabForm) {
    $scope.meetingsViewHandler = MeetingsViewHandler;

    $scope.docents = [];
    $scope.selectedDocent = {};
    $scope.selectedDocentMeetings = [];
    $scope.setSelectedDocentAndMeetings = function (aDocent) {
        $scope.isDataLoaded = false;
        $scope.searchTerm = String();
        $scope.selectedDocent = angular.copy(aDocent);
        $http({
            method: 'GET',
            url: 'http://localhost:8000/docent/' + aDocent.id + '/meeting/coalition',
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (response) {
            $scope.selectedDocentMeetings = response.data;
            $scope.isDataLoaded = true;
        });
    };

    $scope.isDataLoaded = false;

    $http({
        method: 'GET',
        url: 'http://localhost:8000/docent',
        headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
    }).then(function (response) {
        $scope.docents = response.data;
        $scope.isDataLoaded = true;
    });

    $scope.searchTerm = String();

    $scope.showDocentMeetingsWell = function () {
        // Show well only in case of selected docent not having any meetings
        return $scope.selectedDocentMeetings.length < 1 &&
            !angular.equals($scope.selectedDocent, {});
    };

    $scope.docentHasMeetings = function () {
        return $scope.selectedDocentMeetings.length > 0;
    };

    $scope.docentIsSelected = function () {
        return !angular.equals($scope.selectedDocent, {});
    };

    $scope.handleSelectorEvent = function (event, docent) {
        if (event.type === 'mouseenter') {
            event.target.classList.add("docent-selector-hovered");
        }
        if (event.type === 'mouseleave') {
            event.target.classList.remove("docent-selector-hovered");
        }
        if (event.type === 'click') {
            event.target.classList.remove("docent-selector-hovered");
            $scope.setSelectedDocentAndMeetings(docent)
        }
    };

    $scope.newParticipation = {};
    $scope.participateMeeting = {};
    $scope.participateSlot = {};
    $scope.setParticipateMeetingAndSlot = function (aMeeting, aSlot) {
        $scope.newparticipation = {};

        $scope.participateMeeting = aMeeting;
        $scope.participateSlot = aSlot;

        $scope.newParticipation.meeting_id = $scope.participateMeeting.id;
        $scope.newParticipation.slot_id = $scope.participateSlot.id;
        $scope.newParticipation.start = aSlot.start;
        $scope.newParticipation.end = aSlot.end;
    };
    $scope.setParticipateMeeting = function (aMeeting) {
        $scope.newparticipation = {};

        $scope.participateMeeting = aMeeting;

        $scope.newParticipation.meeting_id = $scope.participateMeeting.id;
        $scope.newParticipation.start = aMeeting.start;
        $scope.newParticipation.end = aMeeting.end;
    };

    $scope.submit = submit;

    var studentID = $localStorage.auth.substring(51);

    initCreationForm();

    function initCreationForm() {
        $scope.newParticipation.student_id = studentID;
        $scope.newParticipation.email_notification_student = false;
        $scope.newParticipation.remark = String();
    }


    function submit() {
        $scope.isDataLoaded = false;
        $http({
            method: 'POST',
            url: 'http://localhost:8000/student/' + studentID + '/participation',
            data: $scope.newParticipation,
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (data) {
            $window.location.href = 'http://localhost:63342/frontend_new/app/view-student/viewstudent.html';
            $scope.isDataLoaded = true;
        });
    }

    $scope.fabFormOptions = {
        validationsTemplate: 'validation.html'
    };
}

function logoutController($scope, $http, $localStorage, $window) {

    $scope.logout = function () {
        $http({
            method: 'POST',
            url: 'http://localhost:8000/logout',
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (response) {
            $window.location.href = 'http://localhost:63342/frontend_new/app/view-login/viewlogin.html';
        });
    }
}