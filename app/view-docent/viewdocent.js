'use strict';

angular.module('MeetTheProf.viewDocent', ['ngFabForm', 'ngMessages', 'ngAnimate', 'ngStorage']);

angular
    .module('MeetTheProf.viewDocent')
    .factory('MeetingsViewHandler', meetingsViewHandler)
    .controller('MeetingsController', meetingsController)
    .controller('CreationFormController', creationFormController)
    .controller('LogoutController', logoutController);

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
        hasParticipants: function (aMeeting) {
            return (parseInt(aMeeting.participants_count) > 0) || (aMeeting.participating_students.length !== 0);
        },
        getPanelType: function (aMeeting) {
            if (aMeeting.has_passed === "true" || aMeeting.has_passed === 1) {
                return "panel-passed";
            }
            if (aMeeting.cancelled === "true" || aMeeting.cancelled === 1) {
                return "panel-cancelled";
            }
            if ((parseInt(aMeeting.participants_count) > 0) || (aMeeting.participating_students.length !== 0)) {
                return "panel-participants";
            }
            return "panel-no-participants";
        },
        convertIntToYesNo: function(aNumber) {
            if(aNumber === 0) {
                return 'Nein';
            }
            else {
                return 'Ja';
            }
        }
    }
}

function meetingsController($scope, $http, $window, MeetingsViewHandler, ngFabForm, $localStorage) {
    $scope.meetingsViewHandler = MeetingsViewHandler;

    $scope.fabFormOptions = {
        validationsTemplate: 'validation.html'
    };

    $scope.meetings = [];
    $scope.hasMeetings = function() {
        return $scope.meetings.length > 0;
    };

    $scope.isDataLoaded = false;

    $scope.cancelMeeting = {};
    $scope.setCancelMeeting = function (aMeeting) {
        $scope.cancelMeeting = angular.copy(aMeeting);
    };

    $scope.cancel_series = false;
    $scope.setCancelSeries = function (bool) {
        $scope.cancel_series = bool
    };

    $scope.editMeeting = {};
    $scope.setEditMeeting = function (aMeeting) {
        $scope.editMeeting = angular.copy(aMeeting);
    };

    $scope.submitCancelForm = submitCancelForm;
    $scope.submitEditForm = submitEditForm;

    var docentID = $localStorage.auth.substring(51);
    $http({
        method: 'GET',
        url: 'http://localhost:8000/docent/' + docentID + '/meeting/coalition',
        headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
    }).then(function (response) {
        $scope.meetings = response.data;
        $scope.isDataLoaded = true;
    });

    function submitCancelForm() {
        $scope.isDataLoaded = false;
        if ($scope.cancel_series) {
            $http({
                method: 'PUT',
                url: 'http://localhost:8000/docent/' + docentID + '/meeting/' + ($scope.cancelMeeting.id) + '/cancelseries',
                headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
            }).then(function (data) {
                $window.location.href = 'http://localhost:63342/frontend_new/app/view-docent/viewdocent.html';
            });
        }
        else {
            $scope.cancelMeeting.cancelled = 1;
            $http({
                method: 'PUT',
                url: 'http://localhost:8000/docent/' + docentID + '/meeting/' + ($scope.cancelMeeting.id),
                data: $scope.cancelMeeting,
                headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
            }).then(function (data) {
                $window.location.href = 'http://localhost:63342/frontend_new/app/view-docent/viewdocent.html';
            });
        }
    }

    function submitEditForm() {
        $scope.isDataLoaded = false;
        $http({
            method: 'PUT',
            url: 'http://localhost:8000/docent/' + docentID + '/meeting/' + ($scope.editMeeting.id),
            data: $scope.editMeeting,
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (data) {
            $window.location.href = 'http://localhost:63342/frontend_new/app/view-docent/viewdocent.html';
        });
    }

    $scope.showCancelled = false;
    $scope.cancelledFilter = function() {
        if($scope.showCancelled) {
            return {'cancelled': '0'};
        }
        else {
            return {};
        }
    };
    $scope.toggleCancelled = function() {
        $scope.showCancelled = !$scope.showCancelled;
    };
}

function creationFormController($scope, $http, $window, ngFabForm, $localStorage) {
    $scope.newMeeting = {};

    $scope.submit = submit;

    $scope.fabFormOptions = {
        validationsTemplate: 'validation.html'
    };

    initCreationForm();

    function initCreationForm() {
        $scope.newMeeting.is_series = 0;
        $scope.newMeeting.has_slots = 0;
        $scope.newMeeting.cancelled = 0;
        $scope.newMeeting.email_notification_docent = 0;
        $scope.newMeeting.description = String();
    }

    var docentID = $localStorage.auth.substring(51);
    function submit() {

        if ($scope.newMeeting.has_slots === false || $scope.newMeeting.has_slots === 0) {
            $scope.newMeeting.slots = 1;
        } else {
            $scope.newMeeting.max_participants = 1;
        }
        if ($scope.creationForm.$valid) {
            $http({
                method: 'POST',
                url: 'http://localhost:8000/docent/' + docentID + '/meeting',
                data: $scope.newMeeting,
                headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
            }).then(function (data) {
                $window.location.href = 'http://localhost:63342/frontend_new/app/view-docent/viewdocent.html';
            });
        }
    }
}

function logoutController($scope, $http, $localStorage, $window) {

    $scope.logout = function() {
        $http({
            method: 'POST',
            url: 'http://localhost:8000/logout',
            headers: {'Content-Type': 'application/json', 'Authorization': $localStorage.auth}
        }).then(function (response) {
            $window.location.href = 'http://localhost:63342/frontend_new/app/view-login/viewlogin.html'
        });
    }
}
