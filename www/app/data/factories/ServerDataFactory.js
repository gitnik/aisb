angular.module('ServerBrowserApp.data.factories', []).
    factory('ServerDataFactory', function($http) {

        return $http(
            {
                method: 'GET',
                url: 'app/data.json',
                timeout: '5000'
            });
    });
