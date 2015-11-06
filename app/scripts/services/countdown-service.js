angular.module("services")

    .factory("Countdown", ["$interval", function($interval) {

        var startCountdown = $interval(function() {
            $scope.timeInSeconds -= 1;

            if ($scope.timeInSeconds < 0) {
                stopCountdown();
                $scope.isRunning = false;
                nextSession();
            }
        }, 1000);
        
        return {
            startCountdown: startCountdown
        };

    }]);