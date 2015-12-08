var pomodoroDirectives = angular.module("directives", []);

pomodoroDirectives.directive("timer", function () {
    "use strict";

    return {
        restrict: 'EA',
        replace: false,
        scope: true,
        templateUrl: "/templates/directives/timer.html",
        controller: ["$scope", "$interval", function ($scope, $interval) {
            var currentSession, determineSessionTime, determineButtonText, startCountdown, countdown, stopCountdown, nextSession, secondsRemaining, currentTaskStatus;

            var timerDing = new buzz.sound( "/assets/audio/ding", {
                formats: [ "mp3" ],
                preload: true
            });

            currentSession = "pomodoro";
            $scope.buttonText = "Start Pomodoro";
            $scope.isRunning = false;
            $scope.sessionInProgress = false;
            $scope.totalPomodoros = 0;
            $scope.interruptions = 0;
            $scope.timeInSeconds = 1500;
            $scope.timerTime = 1;
            $scope.sessionName = null;


            determineSessionTime = function () {
                if (currentSession === "pomodoro") {
                    $scope.timerTime = 1500;
                    $scope.sessionName = "Pomodoro";
                } else if (currentSession === "shortBreak") {
                    $scope.timerTime = 300;
                    $scope.sessionName = "Short Break";
                } else if (currentSession === "longBreak") {
                    $scope.timerTime = 1200;
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

            //============================================== Start Alert ===============================================

            var sessionCompleteTimeout, delayedSessionCompleteAlert, sessionCompleteAlert;

            delayedSessionCompleteAlert = function () {
                sessionCompleteTimeout = window.setTimeout(sessionCompleteAlert, 80);
            };

            sessionCompleteAlert = function () {
                alert($scope.sessionName + " session completed!");
            };

            //=============================================== End Alert ================================================

            //=============================================== Countdown ================================================

            countdown = function () {
                startCountdown = $interval(function() {
                    $scope.timeInSeconds -= 1;

                    tick();
                    if ($scope.timeInSeconds <= 0) {
                        timerDing.play();
                        stopCountdown();
                        delayedSessionCompleteAlert();
                        $scope.isRunning = false;
                        if (currentSession === "pomodoro" && $scope.currentTask) {
                            currentTaskStatus();
                        }
                        nextSession();
                    }
                }, 1000);
            };

            stopCountdown = function() {
                $interval.cancel(startCountdown);
            };

            //============================================== Next Session ==============================================

            nextSession = function() {
                // Summary:
                //    Determines what type of session to start next based on which session just ended (called in startCountdown interval)
                // If: Current session (that just ended) was a pomodoro
                //    Then: add one to the completed pomodoros total
                //        If: That number is greater than or equal to 4 then start a long break
                //        Else: Start a short break
                // Else: Start a pomodoro
                $scope.interruptions = 0;
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

            //========================================== Current Task Status ===========================================

            currentTaskStatus = function () {
                var pomosComp = parseInt($scope.currentTask.pomosComp, 10);
                pomosComp += 1;
                $scope.currentTask.pomosComp = pomosComp;
                //$scope.completedTasks.$save($scope.currentTask.pomosComp);
                //$scope.currentTask.set({pomosComp: pomosComp});
                $scope.currentTask.isSelected = false;
                $scope.completedTasks.$save($scope.currentTask);
                if ($scope.currentTask.pomosComp >= $scope.currentTask.pomosEst) {
                    $scope.currentTask.isCompleted = true;
                    var taskTimeCompleted = parseInt($scope.currentTask.created);
                    $scope.currentTask.created = taskTimeCompleted / 2;
                    $scope.completedTasks.$save($scope.currentTask);
                    $scope.currentTask = null;
                }
            };

            //============================================ Start startStop =============================================

            $scope.startStop = function () {
                console.log($scope.currentTask);

                // Summary:
                //    Operates the start and reset button

                if ($scope.sessionInProgress === false) {
                    $scope.sessionInProgress = true;
                }

                if ($scope.isRunning === true) {
                    //  If: the the countdown is currently running
                    //      1) Change status of the session to not playing (false)
                    $scope.sessionInProgress = false;
                    //      2) Prevent the countdown from continuing by canceling the interval
                    stopCountdown();
                    //      3) By reading the currentSession scope determine the time for timerTime
                    determineSessionTime();
                    //      4) Reset the polar clock by making timeInSeconds equal to timerTime and then run tick() to reset it
                    $scope.timeInSeconds = $scope.timerTime;
                    tick();
                    //      5) By changing isRunning to false determineButtonText() will assign reset to the button
                    $scope.isRunning = false;
                    determineButtonText();
                    return;
                }
                // Since everything else is being reset, we also reset the interruptions
                $scope.interruptions = 0;

                $scope.isRunning = !$scope.isRunning;
                determineSessionTime();
                $scope.timeInSeconds = $scope.timerTime;
                tick();
                determineButtonText();

                countdown();
            };

            //============================================= End startStop ==============================================


            //=========================================== Start pauseResume ============================================

            $scope.pauseResume = function () {
                // Summary:
                //    Controls the pause button once a session is started
                //      1) Pull the timeInSeconds remaining when the button was pushed and assign that to a variable before stopping the countdown
                secondsRemaining = $scope.timeInSeconds;
                stopCountdown();
                if ($scope.isRunning === false) {
                    // If: timer is not currently running
                    //      Assign the time remaining just taken from the earlier variable.timeInSeconds s
                    $scope.timeInSeconds = secondsRemaining;
                    countdown();
                    $scope.isRunning = !$scope.isRunning;
                    return;
                }
                $scope.interruptions += 1;
                $scope.isRunning = !$scope.isRunning;
                console.log($scope.isRunning + " – from pauseResume");
            };

            //=========================================== End pauseResume ============================================


            //==========================================================================================================
            //============================================== Polar Clock ===============================================
            //==========================================================================================================

            var width, height, radius, spacing, color, arc, svg, field;

            width = 710; height = 710; radius = Math.min(width, height) / 1.9; spacing = 0.04;

            color = d3.scale.linear()
                .range(["hsl(10, 75%, 51%)", "hsl(155, 86%, 35%)"])
                .interpolate(interpolateHsl);

            arc = d3.svg.arc()
                .startAngle(0)
                .endAngle(function(d) { return d.value * 2 * Math.PI; })
                .innerRadius(function(d) { return d.index * radius; })
                .outerRadius(function(d) { return (d.index + spacing) * radius; });

            svg = d3.select("#polar").append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            field = svg.selectAll("g")
                .data(fields)
                .enter().append("g");

            field.append("path");

            field.append("text");

            d3.transition().duration(0).each(tick);

            d3.select(self.frameElement).style("height", height + "px");

            function tick() {
                field = field
                    .each(function(d) { this._value = d.value; })
                    .data(fields)
                    .each(function(d) { d.previousValue = this._value; });

                field.select("path")
                    .transition()
                    .ease("elastic")
                    .attrTween("d", arcTween)
                    .style("fill", function(d) {
                        if ($scope.isRunning) {
                            return color(d.value);
                        }
                        return "hsl(155, 86%, 35%)";
                        });

                field.select("text")
                    .attr("dy", function(d) { return d.value < .5 ? "-.5em" : "1em"; })
                    .text(function(d) { return d.text; })
                    .transition()
                    .ease("elastic")
                    .attr("transform", function(d) {
                        return "rotate(" + 360 * d.value + ")"
                            + "translate(0," + -(d.index + spacing / 2) * radius + ")"
                            + "rotate(" + (d.value < .5 ? -90 : 90) + ")"
                    });

            }

            function arcTween(d) {
                var i = d3.interpolateNumber(d.previousValue, d.value);
                return function(t) { d.value = i(t); return arc(d); };
            }

            function fields() {
                return [
                    { index: .7, value: $scope.timeInSeconds / $scope.timerTime }
                ];
            }

            // Avoid shortest-path interpolation.
            function interpolateHsl(a, b) {
                var i = d3.interpolateString(a, b);
                return function(t) {
                    return d3.hsl(i(t));
                };
            }

        }]
    };

});

