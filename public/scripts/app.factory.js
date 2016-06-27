angular.module('LegalManthra')
    .factory('mainFactory', function($http, $localStorage) {
        var caseUrl = serverUrl + cases;
        var factory = {};

        factory.login = function(userData) {
            return $http.post(serverUrl + "login/", userData);
        }

        factory.logout = function(userData) {
            return $http.post(serverUrl + "logout/");
        }
        factory.getSuggestions = function(input) {
            console.log(caseUrl + "getsuggestions/" + input)
            return $http.get(caseUrl + "getsuggestions/" + input);
        }

        factory.search = function(input) {
            return $http.get(caseUrl + input, {
                withCredentials: true
            });
        }

        factory.getById = function(id) {
            console.log(caseUrl + 'display/' + id)
            return $http.get(caseUrl + 'display/' + id, {
                withCredentials: true
            });
        }

        factory.upload = function(data) {
            console.log(caseUrl)
            return $http({
                "url": caseUrl,
                "method": "PUT",
                "data": data
            })

        }
        return factory;
    });
