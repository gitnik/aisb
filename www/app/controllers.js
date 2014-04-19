angular.module('ServerBrowserApp.controllers', []).
controller('ServerBrowserController', function($scope, $interval, ServerDataFactory, SettingsFactory, localStorageFactory) {

    var that = this;

    $scope.reloadOnComeback = SettingsFactory.get('reloadOnComeback', false);

    $scope.toggleComebackOption = function() {
        $scope.reloadOnComeback = !$scope.reloadOnComeback;
        SettingsFactory.set('reloadOnComeback', false);// $scope.reloadOnComeback);
    }

    $scope.cacheFlagsAndLocation = SettingsFactory.get('cacheFlagsAndLocation', false);

    $scope.toggleCachingOption = function() {
        $scope.cacheFlagsAndLocation = !$scope.cacheFlagsAndLocation;
        SettingsFactory.set('cacheFlagsAndLocation', $scope.cacheFlagsAndLocation);
    }

    $scope.reloading = false;

    $scope.loadServers = function() {
        $scope.reloading = true;
        var promise = ServerDataFactory.getServerDataWithQ();
        promise.then(function(data) {
            $scope.ServerData = data;
            $scope.reloading = false;
        }, function(data) {
            alert(data.message);
            if(data.code == "0")
                $scope.loadServers();
            else if(data.code == "1")
                $scope.reloading = false;
        });
    }

    this.tickServerAge = function() {
        $interval(function() {
            if($scope.reloading)
                return;

            $scope.ServerData.age += 1;
            $scope.ServerData.ageFormat = that.formatTime($scope.ServerData.age);
        }, 1000);
    }

    this.formatTime = function(seconds) {
        var current = Date.now();
        var past = Date.now() - seconds*1000;
        var diff = current - past;
           
        var msPerMinute = 60 * 1000,
            msPerHour = msPerMinute * 60;
           
        if (diff < msPerMinute) 
            if(Math.round(diff/1000 < 2))
                return "1 second";   
            else 
                return Math.round(diff/1000) + " seconds";
                       
        if (diff < msPerHour) 
            if(Math.round(diff/msPerMinute < 2))
                return "1 minute";   
            else 
                return Math.round(diff/msPerMinute) + " minutes";
           
        // we're just gonna assume that nobody leaves 
        // their browser window open for several days without reloading ;-)
        if(Math.round(diff/msPerHour < 2))
            return "1 hour";   
        else 
            return Math.round(diff/msPerHour) + " hours";
    }

    this.registerVisibilityEvent = function() {
        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        document.addEventListener(visibilityChange, function() {
            if(document[hidden] == false && $scope.reloadOnComeback == true) {
                $scope.loadServers();
            }
        }, false);

    }

    $scope.loadServers();

    that.tickServerAge();

    this.registerVisibilityEvent();

    localStorageFactory.init();
});