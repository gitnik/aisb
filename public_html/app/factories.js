angular.module('ServerBrowserApp.factories', ['ServerBrowserApp.localStorage']).
factory('ServerDataFactory', function($http, $q, localStorageFactory) {

    var factory = {};

    factory.getServerDataWithQ = function() {

        var deferred = $q.defer();

        var resourceNumber = 0;

        var countries = 0;

        var promiseInternal = this._ServerData(countries, resourceNumber);

        promiseInternal.then(
            function(data) {
                //success
                // we we iterate over the ips of the populated servers and check whether or not the user already has all the countries
                // if not, we request the data again, but this time with countries (which takes much longer)
                for(i=0;i<data.Servers.length;i++) {

                    server = data.Servers[i];

                    if(server.numplayers == 0)
                        break;

                    country = localStorageFactory.get(server.ip);
                    if(country == "00" || country == null) {
                        countries = 1;
                    } else {
                        server.country = country;
                    }
                }

                if(countries) {
                    var promiseInternal2 = factory._ServerData(countries, resourceNumber);
                    promiseInternal2.then(
                        function(data) {
                            for(i=0;i<data.Servers.length;i++) {

                                server = data.Servers[i];

                                if(server.numplayers > 0)
                                    localStorageFactory.set(server.ip, server.country);
                            }
                            //success
                            deferred.resolve(data);
                        },
                        function(data) {
                            alert("Unknown error");
                        });

                }
                else {
                    deferred.resolve(data);
                }
            },
            function(data) {
                resourceNumber = 1;
                alert("Trying next resource");

                var promiseInternal2 = factory._ServerData(countries, resourceNumber);
                promiseInternal2.then(
                    function(data) {
                        //success
                        // this is an awful solution, but I can't figure out how to pass promises to functions
                        for(i=0;i<data.Servers.length;i++) {

                            server = data.Servers[i];

                            if(server.numplayers == 0)
                                break;

                            country = localStorageFactory.get(server.ip);
                            if(country == "00" || country == null) {
                                countries = 1;
                            } else {
                                server.country = country;
                            }
                        }

                        if(countries) {
                            var promiseInternal2 = factory._ServerData(countries, resourceNumber);
                            promiseInternal2.then(
                                function(data) {
                                    for(i=0;i<data.Servers.length;i++) {

                                        server = data.Servers[i];

                                        if(server.numplayers > 0)
                                            localStorageFactory.set(server.ip, server.country);
                                    }
                                    //success
                                    deferred.resolve(data);
                                },
                                function(data) {
                                    alert("Unknown error");
                                });

                        }
                        else {
                            deferred.resolve(data);
                        }
                    },
                    function(data) {
                        alert("Both resources seem to be down at the moment. Please try again later");
                    });
        });

        return deferred.promise;

    };

    //private function
    factory._ServerData = function(countries, resourceNumber) {

        var deferred = $q.defer();

        $http(
            {
                method: 'GET',
                url: 'app/serverxml_to_json.php?needCountries='+countries+'&resource='+resourceNumber,
                timeout: '3500'
            }).
            success(function(data) {
                deferred.resolve(data);
            }).
            error(function(data) {
                deferred.reject();
        });

        return deferred.promise;

    }

    return factory;
});