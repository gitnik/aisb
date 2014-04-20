angular.module('ServerBrowserApp.browser.controllers', []).
    controller('ServerBrowserController', function($scope, $interval, ServerDataFactory, SettingsFactory) {

        $scope.reloadOnComeback = SettingsFactory.get('reloadOnComeback', false);
        $scope.toggleComebackOption = function() {
            $scope.reloadOnComeback = !$scope.reloadOnComeback;
            SettingsFactory.set('reloadOnComeback', $scope.reloadOnComeback);
        };

        $scope.cacheFlagsAndLocation = SettingsFactory.get('cacheFlagsAndLocation', false);
        $scope.toggleCachingOption = function() {
            $scope.cacheFlagsAndLocation = !$scope.cacheFlagsAndLocation;
            SettingsFactory.set('cacheFlagsAndLocation', $scope.cacheFlagsAndLocation);
        };

        $scope.reloading = false;
        $scope.serverData = null;

        $scope.loadServers = function() {

            $scope.reloading = true;
            ServerDataFactory.then(function(data) {

                $scope.serverData = data.data;
                $scope.reloading = false;

            }, function(data) {

                /**
                 * @TODO: handle error
                 */
                $scope.reloading = false;
                alert(data);

            });

        };

        this.tickServerAge = function() {
            $interval(function() {
                if($scope.reloading)
                    return;

                $scope.serverData.age += 1;
            }, 1000);
        };

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

        };

        $scope.loadServers();

        this.tickServerAge();

        this.registerVisibilityEvent();
    });