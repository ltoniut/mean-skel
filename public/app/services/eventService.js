angular.module('services')
	.factory('Event', ['$http', '$window', 'config', function ($http, $window, config) {
		const eventFactory = {};

		// create an event
		userFactory.create = function (eventData) {
			return $http.post(config.api_url + "/users/", userData);
		};

		// update event
		userFactory.update = function (eventData) {
			return $http.put(config.api_url + "/user/", userData);
		};

		return eventFactory;
	}]);
