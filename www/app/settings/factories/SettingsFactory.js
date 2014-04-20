angular.module('ServerBrowserApp.settings.factories', []).
    factory('SettingsFactory', function (localStorageFactory) {

        var factory = {};

        factory.get = function (setting, defaultValue) {
            if (localStorageFactory.get(setting))
                return localStorageFactory.get(setting);
            else
                factory.set(setting, defaultValue);
            return defaultValue;
        };

        factory.set = function (setting, value) {
            localStorageFactory.set(setting, value);
        };

        return factory;
    });