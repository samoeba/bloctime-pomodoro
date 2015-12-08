//noinspection JSLint
var $j = jQuery.noConflict();

angular.module("blocTime")

    .controller("MainCtrl", ["$rootScope", "$scope", "$state", "FBData", function($rootScope, $scope, $state, FBData) {
        "use strict";

        var users, userData;
        users = FBData.users;

        $scope.logout = function () {
            users.$unauth();
            $state.go("landing");
            $rootScope.authData = null;
            $rootScope.userId = null;
        };

        $scope.clickMe = function () {
            console.log($rootScope.authData);
        };

        userData = FBData.users.$getAuth();


        if(userData) {
            $rootScope.authData = userData;
            $rootScope.userId = userData.uid;
            console.log("got data");
        }
        //else {
        //    FBData.users.$getAuth();
        //    console.log("got here");
        //}



        //================================================= Tasks ======================================================

        $scope.newTask = { title: "", created: "", pomosEst: "", pomosComp: "0", /*isSelected: "",*/ isCompleted: false };
        $scope.currentTask = null;
        $scope.tab = "todo";
        FBData.all.then(function (userTasks) {
            console.log("Hey-o");
            $scope.completedTasks = userTasks;
        });

        if(!$rootScope.authData) {
            $scope.completedTasks = $rootScope.guestTasks;
        }

        $scope.addTask = function () {
            $scope.newTask.created = new Date().getTime();
            FBData.addTask(angular.copy($scope.newTask));
            $scope.newTask = { title: "", created: "", pomosEst: "", pomosComp: "0", /*isSelected: "",*/ isCompleted: false };
        };

        $scope.removeTask = function (task, event) {
            console.log("Trashed that task!");
            FBData.removeTask(task);
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
            }
            task.isSelected = true;
            $scope.currentTask = task;
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

