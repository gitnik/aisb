angular.module('ServerBrowserApp.controllers', []).
controller('ServerBrowserController', function($scope, ServerDataFactory, SettingsFactory, localStorageFactory) {

    $scope.reloadOnComeback = SettingsFactory.get('reloadOnComeback', true);

    $scope.toggleComebackOption = function() {
        $scope.reloadOnComeback = !$scope.reloadOnComeback;
        SettingsFactory.set('reloadOnComeback', $scope.reloadOnComeback);
    }

    $scope.cacheFlagsAndLocation = SettingsFactory.get('cacheFlagsAndLocation', true);

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
            if(document[hidden] == false && !!$scope.reloadOnComeback === true) {
                $scope.loadServers();
            }
        }, false);

    }

    $scope.loadServers();

    this.registerVisibilityEvent();

    localStorageFactory.init();
});