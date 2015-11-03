var pomodoroDirectives = angular.module("directives", []);

pomodoroDirectives.directive("timer", ["SESSION_NAMES", function (SESSION_NAMES) {
    "use strict";

    return {
        restrict: 'EA',
        replace: false,
        scope: true,
        templateUrl: "/templates/directives/timer.html",
        controller: ["$scope", "$interval", function ($scope, $interval) {
            var currentSession, determineSessionTime, determineButtonText, startCountdown, stopCountdown, nextSession;

            $scope.$watch("timeInSeconds", function(value) {
                if (value <= 0) {
                    timerDing.play();
                    console.log("Played Ding!");
                }
            });

            var timerDing = new buzz.sound( "/assets/audio/ding", {
                formats: [ "mp3" ],
                preload: true
            });

            currentSession = "pomodoro";
            $scope.buttonText = "Start Pomodoro";
            $scope.isRunning = false;
            $scope.totalPomodoros = 0;
            $scope.timeInSeconds = 1500;

            determineSessionTime = function () {
                if (currentSession === SESSION_NAMES.POMODORO) {
                    $scope.timeInSeconds = 5;
                    $scope.sessionName = "Pomodoro";
                } else if (currentSession === SESSION_NAMES.SHORT_BREAK) {
                    $scope.timeInSeconds = 2;
                    $scope.sessionName = "Short Break";
                } else if (currentSession === SESSION_NAMES.LONG_BREAK) {
                    $scope.timeInSeconds = 4;
                    $scope.sessionName = "Long Break";
                }
            };

            determineButtonText = function() {
                if ($scope.isRunning === true) {
                    $scope.buttonText = "Reset";
                    return;
                }

                if (currentSession === "pomodoro") {
                    $scope.buttonText = "Start Pomodoro";
                } else if (currentSession === "shortBreak") {
                    $scope.buttonText = "Start Short Break";
                } else if (currentSession === "longBreak") {
                    $scope.buttonText = "Start Long Break";
                }
            };

            $scope.startStop = function () {
                if ($scope.isRunning === true) {
                    stopCountdown();
                    determineSessionTime();
                    $scope.isRunning = false;
                    determineButtonText();
                    return;
                }

                $scope.isRunning = !$scope.isRunning;
                determineSessionTime();

                determineButtonText();

                startCountdown = $interval(function() {
                    $scope.timeInSeconds -= 1;

                    if ($scope.timeInSeconds < 0) {
                        stopCountdown();
                        $scope.isRunning = false;
                        nextSession();
                    }
                }, 1000);
            };

            stopCountdown = function() {
                $interval.cancel(startCountdown);
            };

            nextSession = function() {
            // Summary:
            //    Determines what type of session to start next based on which session just ended (called in startCountdown interval)
            // If: Current session (that just ended) was a pomodoro
            //    Then: add one to the completed pomodoros total
            //        If: That number is greater than or equal to 4 then start a long break
            //        Else: Start a short break
            // Else: Start a pomodoro

                if (currentSession === "pomodoro") {
                    $scope.totalPomodoros += 1;
                    if ($scope.totalPomodoros >= 4) {
                        $scope.totalPomodoros = 0;
                        currentSession = "longBreak";
                        $scope.startStop();
                    } else {
                        currentSession = "shortBreak";
                        $scope.startStop();
                    }
                } else {
                    currentSession = "pomodoro";
                    $scope.startStop();
                }
            };
        }]
    };

}]);

