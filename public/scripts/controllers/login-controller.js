angular.module("blocTime")

    .controller("LoginCtrl", ["$rootScope", "$scope", "$state","$firebaseArray", "FBData", function($rootScope, $scope, $state, $firebaseArray, FBData) {
        "use strict";

        var users, userData;
        users = FBData.users;
        userData = FBData.users.$getAuth();
        console.log(userData);

        users.$onAuth(function (authData) {
            $rootScope.authData = authData;
            console.log("auth");
            if (authData) {
                console.log("auth data");
                $state.go("pomodoro");
                $rootScope.userId = authData.uid;
                //console.log($rootScope.userId);
            }
        });

        $scope.guestLogin = function() {
            var time, ref;
            console.log("Guest Login");
            $rootScope.guest = true;
            time = new Date().getTime();
            ref = new Firebase("https://pomodoro-timer.firebaseio.com/" + time);
            $rootScope.guestTasks = $firebaseArray(ref);
            $rootScope.guest = false;
        };

        $scope.login = function () {
            users.$authWithOAuthPopup("google").catch(function(error) {
                console.error("Authentication failed:", error);
            });
        };

        $scope.logout = function () {
            users.$unauth();
            $rootScope.userId = undefined;
        };
    }]);