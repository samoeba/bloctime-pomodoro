var pomodoroServices = angular.module("services", []);

pomodoroServices.factory("FBData", ["$rootScope","$firebaseArray", "$firebaseAuth", "$q", function($rootScope, $firebaseArray, $firebaseAuth, $q) {
    "use strict";

    var ref, userRef, guestTasks, userTasks, users, deferred, addTask, removeTask, updateTask;
    userRef = new Firebase("https://pomodoro-timer.firebaseio.com");
    users = $firebaseAuth(userRef);

    deferred = $q.defer();

    $rootScope.$watch("userId", function (newValue) {
        console.log("user ID change");
        if (newValue) {
            ref = new Firebase("https://pomodoro-timer.firebaseio.com/" + $rootScope.userId);
            userTasks = $firebaseArray(ref);
            deferred.resolve(userTasks);
        }
    });

    addTask = function (task) {
        if (userTasks) {
            userTasks.$add(task);
            return;
        }
        $rootScope.guestTasks.$add(task);
    };

    removeTask = function (task) {
        if (userTasks) {
            userTasks.$remove(task);
            return;
        }
        $rootScope.guestTasks.$remove(task);

    };

    updateTask = function (taskId) {
        userTasks.child(taskId).set({ isSelected: false });
    };

    return {
        all: deferred.promise,
        users: users,
        addTask: addTask,
        removeTask: removeTask,
        updateTask: updateTask
    };

}]);

