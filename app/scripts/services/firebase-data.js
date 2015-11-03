var pomodoroServices = angular.module("services", []);

pomodoroServices.factory("Tasks", ["$firebaseArray", "$scope", function($firebaseArray, $scope) {

    var ref = new Firebase("https://brilliant-torch-364.firebaseio.com/");
    var tasks = $firebaseArray(ref);

    return {
        all: tasks
    };

}]);

