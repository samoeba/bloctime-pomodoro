var pomodoroDirectives = angular.module("directives", []);

pomodoroDirectives.directive("timer", function () {
    "use strict";

    return {
        restrict: 'EA',
        replace: false,
        scope: true,
        templateUrl: "/templates/directives/timer.html",
        controller: ["$scope", "$interval", function ($scope, $interval) {
            $scope.buttonText = "Start Pomodoro";
            $scope.isRunning = false;
            $scope.totalPomodoros = 0;
            $scope.currentSession = "pomodoro";
            $scope.timeInSeconds = 0;

            $scope.determineSessionTime = function () {
                if ($scope.currentSession === "pomodoro") {
                    $scope.timeInSeconds = 5;
                    //$scope.buttonText = "Reset";
                } else if ($scope.currentSession === "shortBreak") {
                    $scope.timeInSeconds = 1;
                } else if ($scope.currentSession === "longBreak") {
                    $scope.timeInSeconds = 4/*1200*/;
                }
            };

            $scope.determineButtonText = function() {
                if ($scope.isRunning === true) {
                    $scope.buttonText = "Reset";
                    return;
                }

                if ($scope.currentSession === "pomodoro") {
                    $scope.buttonText = "Start Pomodoro";
                } else if ($scope.currentSession === "shortBreak") {
                    $scope.buttonText = "Start Short Break";
                } else if ($scope.currentSession === "longBreak") {
                    $scope.buttonText = "Start Long Break";
                }
            };

            var startCountdown;
            $scope.startStop = function () {
                console.log($scope.isRunning);
                if ($scope.isRunning === true) {
                    $scope.stopCountdown();
                    $scope.determineSessionTime();
                    $scope.isRunning = false;
                    $scope.determineButtonText();
                    return;
                }

                $scope.isRunning = !$scope.isRunning;
                console.log("Start " + $scope.currentSession + " session!");
                $scope.determineSessionTime();

                console.log($scope.isRunning);
                $scope.determineButtonText();

                startCountdown = $interval(function() {
                    $scope.timeInSeconds -= 1;
                    //console.log($scope.timeInSeconds);
                    if ($scope.timeInSeconds < 0) {
                        $scope.stopCountdown();
                        $scope.isRunning = false;
                        $scope.nextSession();
                    }
                }, 1000);
            };

            $scope.stopCountdown = function() {
                $interval.cancel(startCountdown);
            };

            $scope.nextSession = function() {
            // Summary:
            //    Determines what type of session to start next based on which session just ended (called in startCountdown interval)
            // If: Current session (that just ended) was a pomodoro
            //    Then: add one to the completed pomodoros total
            //        If: That number is greater than or equal to 4 then start a long break
            //        Else: Start a short break
            // Else: Start a pomodoro

                if ($scope.currentSession === "pomodoro") {
                    $scope.totalPomodoros += 1;
                    console.log($scope.totalPomodoros + " Pomodoro(s)");
                    if ($scope.totalPomodoros >= 4) {
                        $scope.totalPomodoros = 0;
                        $scope.currentSession = "longBreak";
                        $scope.startStop();
                    } else {
                        $scope.currentSession = "shortBreak";
                        $scope.startStop();
                    }
                } else {
                    $scope.currentSession = "pomodoro";
                    $scope.startStop();
                }
            };
        }]
    };

});

