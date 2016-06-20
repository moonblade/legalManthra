angular.module('LegalManthra')
    .factory('mainFactory', function($http) {
        var caseUrl = serverUrl + cases;
        var factory = {};

        factory.getSuggestions = function(input){
        	console.log(caseUrl+"getsuggestions/"+input)
        	return $http.get(caseUrl+"getsuggestions/"+input);
        }

        factory.search = function(input) {
            return $http.get(caseUrl + input);
        }

        factory.getById = function(id){
        	console.log(caseUrl+'display/'+id)
        	return $http.get(caseUrl+'display/'+id);
        }
        return factory;
    });
