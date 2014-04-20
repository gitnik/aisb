angular.module('ServerBrowserApp.browser.filters').
filter('ServerCountryFilter', function() {
    return function(country) {
        if (["xx", "00", "a1", "a2", "o1"].indexOf(country) != "-1") {
            return "";
        }
        return country;
    }
});