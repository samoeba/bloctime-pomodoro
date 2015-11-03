angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "Tasks", function($scope, Tasks) {
        "use strict";

        $scope.test = "Can you hear me now?";

        $scope.completedTasks = Tasks.all;

    }]);

