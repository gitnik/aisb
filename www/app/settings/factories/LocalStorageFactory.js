angular.module('ServerBrowserApp.settings.factories').
    factory('localStorageFactory', function() {

        var factory = {};

        factory.get = function(item) {
            return window.localStorage[item] || null;
        };

        factory.set = function(item, value) {
            window.localStorage[item] = value;
        };

        factory.getAll = function() {
            return window.localStorage;
        };

        factory.length = function() {
            return window.localStorage.length;
        };

        factory.remove = function(item) {
            window.localStorage.removeItem(item);
        };

        factory.clear = function() {
            window.localStorage.clear();
        };

        return factory;

    });