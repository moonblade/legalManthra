angular.module('LegalManthra')
    .factory('mainFactory', function($http) {
        var caseUrl = serverUrl + cases;
        var factory = {};

        // factory.getSuggestions = function(input){
        // 	return $http({
        // 		method:"GET",
        // 		url:caseUrl+"getSuggestions/"+input
        // 	});
        // }
        factory.search = function(input) {
            return $http.get(caseUrl + input);
        }

        return factory;
    });
