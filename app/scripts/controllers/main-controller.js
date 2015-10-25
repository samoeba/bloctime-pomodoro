angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "$firebaseArray", function($scope, $firebaseArray) {
        "use strict";

        var ref = new Firebase("https://fh9olz0esil.firebaseio-demo.com/");
        $scope.messages = $firebaseArray(ref);
        $scope.test = "Hello World!";
    }]);