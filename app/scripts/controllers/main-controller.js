angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "Tasks", function($scope, Tasks) {
        "use strict";

        $scope.test = "Can you hear me now?";

        $scope.newTask = { title: "", created: "" };

        $scope.completedTasks = Tasks.all;

        $scope.addTask = function () {
            $scope.newTask.created = new Date().getTime();
            Tasks.addTask(angular.copy($scope.newTask));
            $scope.newTask = { title: "", created: "" };
        };

    }]);

