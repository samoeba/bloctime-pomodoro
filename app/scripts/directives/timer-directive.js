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

            //$scope.$watch("timeInSeconds", function(value) {
            //    if (value <= 0) {
            //        timerDing.play();
            //        console.log("Played Ding!");
            //    }
            //});

            var timerDing = new buzz.sound( "/assets/audio/ding", {
                formats: [ "mp3" ],
                preload: true
            });

            currentSession = "pomodoro";
            $scope.buttonText = "Start Pomodoro";
            $scope.isRunning = false;
            $scope.totalPomodoros = 0;
            $scope.timeInSeconds = 1500;
            $scope.timerTime = 5;

            determineSessionTime = function () {
                if (currentSession === SESSION_NAMES.POMODORO) {
                    $scope.timerTime = 20;
                    $scope.sessionName = "Pomodoro";
                } else if (currentSession === SESSION_NAMES.SHORT_BREAK) {
                    $scope.timerTime = 300;
                    $scope.sessionName = "Short Break";
                } else if (currentSession === SESSION_NAMES.LONG_BREAK) {
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

            $scope.startStop = function () {
                if ($scope.isRunning === true) {
                    stopCountdown();
                    determineSessionTime();
                    $scope.timeInSeconds = $scope.timerTime;
                    $scope.isRunning = false;
                    determineButtonText();
                    return;
                }

                $scope.isRunning = !$scope.isRunning;
                determineSessionTime();
                $scope.timeInSeconds = $scope.timerTime;
                determineButtonText();

                startCountdown = $interval(function() {
                    $scope.timeInSeconds -= 1;

                    tick();
                    console.log($scope.timeInSeconds);
                    if ($scope.timeInSeconds <= 0) {
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

            //============================================== Polar Clock ===============================================

            var width, height, radius, spacing, color, arc, svg, field;

            width = 960; height = 800; radius = Math.min(width, height) / 1.9; spacing = 0.08;

            color = d3.scale.linear()
                .range(["hsl(10, 75%, 51%)", "hsl(175, 100%, 36%)"])
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
                        return "hsl(175, 100%, 36%)";
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

}]);

