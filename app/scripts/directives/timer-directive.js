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

            var timerDing = new buzz.sound( "/assets/audio/ding.mp3", {
                preload: true
            });

            //$scope.$watch("isRunning", function() {
            //    timerDing.play();
            //    console.log("Played Ding!");
            //});

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
                    $scope.timeInSeconds = 1;
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
                console.log($scope.isRunning);
                if ($scope.isRunning === true) {
                    stopCountdown();
                    determineSessionTime();
                    $scope.isRunning = false;
                    determineButtonText();
                    return;
                }

                $scope.isRunning = !$scope.isRunning;
                console.log("Start " + currentSession + " session!");
                determineSessionTime();

                console.log($scope.isRunning);
                determineButtonText();

                startCountdown = $interval(function() {
                    $scope.timeInSeconds -= 1;
                    if ($scope.timeInSeconds < 0) {
                        timerDing.play();
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
                    console.log($scope.totalPomodoros + " Pomodoro(s)");
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

            $scope.testPlay = function () {
                console.log("testing the ding");
                timerDing.play();
            };
        }]
    };

}]);

