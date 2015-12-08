var pomodoroFilters = angular.module("filters", []);

pomodoroFilters.filter('prettyTime', function(){
    return function prettyTime(input){
        var minutes, seconds;
        minutes = Math.floor(input / 60);
        seconds = Math.floor(input % 60);
        if(seconds < 10){
            input = minutes + ":0" + seconds;
        } else {
            input = minutes + ":" + seconds;
        }
        if ( isNaN(seconds) === false){
            return input;
        }
    };
});