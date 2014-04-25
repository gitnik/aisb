angular.module('ServerBrowserApp.browser.filters', []).
    filter('ServerNameFilter', function($sce) {
        return function(server) {
            // strip the color codes from the server name
            var strippedServer = server.name.replace(
                /0x(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})|RESETT|.{6})(.*?)(?=0x(?:.{6}|RESETT|)|$)/g,
                function(sub, hex, r_, g_, b_, colored){
                    return '<span style="color: #' + hex + '">' + colored + '</span>';
                });

            // and attach the protocol link
            return $sce.trustAsHtml('<a href="armagetronad://'+server.ip+':'+server.port+'">'+strippedServer+'</a>');
        }
    });