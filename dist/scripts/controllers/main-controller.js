angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "Tasks", function($scope, Tasks) {
        "use strict";

        $scope.test = "Can you hear me now?";

        $scope.newTask = { title: "" };

        $scope.completedTasks = Tasks.all;

        $scope.addTask = function () {
            Tasks.addTask(angular.copy($scope.newTask));
            $scope.newTask = { title: "" };
        };

    }]);

