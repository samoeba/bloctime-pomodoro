angular.module("blocTime")

    .controller("MainCtrl", ["$scope", "$interval", "$firebaseArray", function($scope, $interval, $firebaseArray) {
        "use strict";

        var ref = new Firebase("https://fh9olz0esil.firebaseio-demo.com/");
        $scope.messages = $firebaseArray(ref);
        $scope.test = "Can you hear me now?";

        //$scope.time = 25 * 60000;
        //
        //$interval(tick, 1000);
        //
        //function tick() {
        //    // check to see if time is up
        //    // reset if needed
        //    // check which time to use (is it a break? is it a short break?)
        //    $scope.time -= 1000;
        //}

        //// in html
        //<span class='time'>{{time | formatIntoMinutes}}</span>
        //// 25:00

        //$scope.changeButton = function (text) {
        //    console.log("Button changed!");
        //
        //    text = "Stop Pomodoro";
        //    console.log(text);
        //
        //    $scope.isRunning = !$scope.isRunning;

            //if ($scope.isRunning) {
            //    $scope.buttonText = "Stop Pomodoro";
            //} else {
            //    $scope.buttonText = "Start Pomodoro";
            //}

            // event.target === element
            // angular.element(event.target)

            //if ($scope.buttonStatus === "stopped") {
            //    $scope.buttonStatus = "running";
            //    $scope.buttonText = "Stop Pomodoro";
            //} else {
            //    $scope.buttonStatus = "stopped";
            //    $scope.buttonText = "Start Pomodoro";
            //}
        //};
    }]);