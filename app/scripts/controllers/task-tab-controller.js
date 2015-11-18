//noinspection JSLint
angular.module("blocTime")

    .controller('TabController', ["$scope", function ($scope) {
        "use strict";

        var allTasks = document.querySelectorAll(".task-item");

        $scope.tab = 2;

        $scope.showCompleted = function () {
            console.log("Showing completed");
            for (var i = 0; i < allTasks.length; i++) {
                allTasks[i].setAttribute("ng-show", "task.isCompleted === true")
            }
        };

        $scope.showTodos = function () {
            console.log("Showing todos");
            for (var i = 0; i < allTasks.length; i++) {
                allTasks[i].setAttribute("ng-show", "task.isCompleted === 'false'")
            }
        };

    };