angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "$interval", "$firebaseArray", function($scope, $interval, $firebaseArray) {
        "use strict";

        var ref = new Firebase("https://brilliant-torch-364.firebaseio.com/");
        $scope.messages = $firebaseArray(ref);
        $scope.test = "Can you hear me now?";

    }]);