angular.module('ServerBrowserApp.browser.filters').
    filter('JoinPlayersFilter',function () {
        return function (playersArray) {
            var players = [];
            playersArray.forEach(function (player) {
                var playerString = player.name;
                if (player.gid)
                    playerString += " (" + player.gid + ")";

                players.push(playerString)

            });
            return players.join(', ');
        }
    });