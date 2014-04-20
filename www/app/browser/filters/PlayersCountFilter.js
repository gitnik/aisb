angular.module('ServerBrowserApp.browser.filters').
    filter('PlayersCountFilter', function() {
        return function(ServersArray) {
            if(!ServersArray)
                return 0;

            var numPlayers = 0;
            ServersArray.forEach(function(server) {
                numPlayers += server.Players.length;
            });

            return numPlayers;
        }
    });