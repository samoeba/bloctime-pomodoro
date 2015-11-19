//noinspection JSLint
var $j = jQuery.noConflict();

angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "Tasks", function($scope, Tasks) {
        "use strict";

        $scope.newTask = { title: "", created: "", pomosEst: "", pomosComp: "0", /*isSelected: "",*/ isCompleted: false };
        $scope.currentTask = null;
        $scope.tab = "todo";
        $scope.completedTasks = Tasks.all;

        $scope.addTask = function () {
            $scope.newTask.created = new Date().getTime();
            Tasks.addTask(angular.copy($scope.newTask));
            $scope.newTask = { title: "", created: "", pomosEst: "", pomosComp: "0", /*isSelected: "",*/ isCompleted: false };
        };

        $scope.removeTask = function (task, event) {
            console.log("Trashed that task!");
            Tasks.removeTask(task);
            event.stopPropagation();
        };

        $scope.selectTask = function (task) {
            if (task.isCompleted) {
                return;
            }
            if (task === $scope.currentTask) {
                task.isSelected = false;
                $scope.currentTask = null;
                return;
            }
            if ($scope.currentTask) {
                $scope.currentTask.isSelected = false;
                //$scope.completedTasks.$save($scope.currentTask);
            }
            task.isSelected = true;
            $scope.currentTask = task;
            //$scope.completedTasks.$save(task);
        };

        var allTasks = document.getElementsByClassName("task-item");

        $scope.showCompleted = function () {
            console.log("Showing completed");
            console.log(allTasks);
            for (var i = 0; i < allTasks.length; i++) {
                allTasks[i].setAttribute("ng-show", "task.isCompleted === true");
                //$scope.apply();
            }
        };

        $scope.showTodos = function () {
            console.log("Showing todos");
            for (var i = 0; i < allTasks.length; i++) {
                allTasks[i].setAttribute("ng-show", "task.isCompleted === 'false'");
            }
        };

        var counter = 0;

        $scope.$watch(function () {
            counter += 1;
            console.log(counter);
        })

    }]);

