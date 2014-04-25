angular.module('ServerBrowserApp.browser.filters').
    filter('TimeFormatFilter', function () {
        return function (seconds) {
            var current = Date.now();
            var past = Date.now() - seconds * 1000;
            var diff = current - past;

            var msPerMinute = 60 * 1000,
                msPerHour = msPerMinute * 60;

            if (diff < msPerMinute) {
                if (Math.round(diff / 1000) == 1)
                    return "1 second";
                else
                    return Math.round(diff / 1000) + " seconds";
            }

            if (diff < msPerHour)
                if (Math.round(diff / msPerMinute))
                    return "1 minute";
                else
                    return Math.round(diff / msPerMinute) + " minutes";

            // we're just gonna assume that nobody leaves
            // their browser window open for several days without reloading ;-)
            if (Math.round(diff / msPerHour))
                return "1 hour";
            else
                return Math.round(diff / msPerHour) + " hours";
        };
    });