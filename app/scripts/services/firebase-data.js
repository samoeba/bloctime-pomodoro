var pomodoroServices = angular.module("services", []);

pomodoroServices.factory("Tasks", ["$firebaseArray", function($firebaseArray) {
    "use strict";

    var ref, tasks, addTask, removeTask, updateTask;
    ref = new Firebase("https://brilliant-torch-364.firebaseio.com/");
    tasks = $firebaseArray(ref);

    addTask = function (task) {
        tasks.$add(task);
    };

    removeTask = function (task) {
        tasks.$remove(task);
    };

    updateTask = function (taskId) {
        tasks.child(taskId).set({ isSelected: false });
    };

    return {
        all: tasks,
        addTask: addTask,
        removeTask: removeTask,
        updateTask: updateTask
    };

}]);

