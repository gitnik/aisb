angular.module('ServerBrowserApp.data.factories', []).
    factory('ServerDataFactory', function($http) {

        return $http(
            {
                method: 'GET',
                url: 'http://technik.io/tron/serverxml_to_json.php',
                timeout: '5000'
            });
    });
