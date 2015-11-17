//noinspection JSLint
var $j = jQuery.noConflict();

angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "Tasks", function($scope, Tasks) {
        "use strict";

        $scope.newTask = { title: "", created: "", pomodoros: "", isSelected: "", trashCanIsShowing: "" };
        $scope.taskSelected = false;
        $scope.completedTasks = Tasks.all;

        $scope.addTask = function () {
            $scope.newTask.created = new Date().getTime();
            $scope.newTask.trashCanIsShowing = false;
            $scope.newTask.isSelected = false;
            Tasks.addTask(angular.copy($scope.newTask));
            $scope.newTask = { title: "", created: "", trashCanIsShowing: "" };
        };

        $scope.showTrash = function (task) {
            task.trashCanIsShowing = true;
        };

        $scope.hideTrash = function (task) {
            task.trashCanIsShowing = false;
        };

        $scope.removeTask = function (event) {
            console.log("Trashed that task!");
            Tasks.removeTask(event);
        };

        $scope.selectTask = function (task) {
            //console.log("taskSelected === " + $scope.taskSelected);
            if ($scope.taskSelected === true) {
                $scope.taskSelected = false;
                $scope.currentTask.isSelected = false;
                //Tasks.updateTask($scope.currentTask.$id);
            }
            $scope.taskSelected = true;
            task.isSelected = true;
            $scope.currentTask = angular.copy(task);
            $scope.completedTasks.$save(task);
        };

        $scope.logSelectedTask = function () {
            console.log($scope.currentTask);
        };

    }]);

