angular.module('ServerBrowserApp.localStorage', []).
factory('localStorageFactory', function() {

	var factory = {};


	factory.init = function() {
	    try {
	        return 'localStorage' in window && window['localStorage'] !== null;
	    } catch (e) {
	        alert("Sorry, but your browser doesn't support localStorage");
	    }
	}

	factory.get = function(item) {
		return window.localStorage[item] || null;
	}

	factory.set = function(item, value) {
		window.localStorage[item] = value;
	}

	factory.getAll = function() {
		return window.localStorage;
	}

	factory.length = function() {
		return window.localStorage.length;
	}

	factory.remove = function(item) {
		window.localStorage.removeItem(item);
	}

	factory.clear = function() {
		window.localStorage.clear();
	}

	return factory;

});