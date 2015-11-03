var pomodoroServices = angular.module("services", []);

pomodoroServices.factory("Tasks", ["$firebaseArray", function($firebaseArray) {
    "use strict";

    var ref, tasks;
    ref = new Firebase("https://brilliant-torch-364.firebaseio.com/");
    tasks = $firebaseArray(ref);

    return {
        all: tasks
    };

}]);

