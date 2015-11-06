angular.module("directives")

.directive("polarClock", function () {
    "use strict";

    return {
        restrict: 'EA',
        replace: false,
        scope: true,
        templateUrl: "/templates/directives/polar-clock.html",
        controller: function () {

            console.log(1000 - Date.now() % 1000);

            console.log("d3 loaded");

            var width, height, radius, spacing, formatSecond, color, arc, svg, field;

            width = 960;
            height = 800;
            radius = Math.min(width, height) / 1.9;
            spacing = 0.05;

            formatSecond = d3.time.format("%S s");
            //formatMinute = d3.time.format("%M m"),
            //formatHour = d3.time.format("%H h"),
            //formatDay = d3.time.format("%a"),
            //formatDate = d3.time.format("%d d"),
            //formatMonth = d3.time.format("%b");

            color = d3.scale.linear()
                .range(["hsl(-180,50%,50%)", "hsl(180,50%,50%)"])
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

            //d3.select(self.frameElement).style("height", height + "px");

            function tick() {
                field = field
                    .each(function(d) { this._value = d.value; })
                    .data(fields)
                    .each(function(d) { d.previousValue = this._value; });

                field.select("path")
                    .transition()
                    .ease("elastic")
                    .attrTween("d", arcTween)
                    .style("fill", function(d) { return color(d.value); });

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
                    {index: .7, text: $scope.timeInSeconds, value: $scope.timeInSeconds / $scope.timerTime}
                ];
            }

            // Avoid shortest-path interpolation.
            function interpolateHsl(a, b) {
                var i = d3.interpolateString(a, b);
                return function(t) {
                    return d3.hsl(i(t));
                };
            }

        }
    };

});