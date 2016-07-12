angular.module('LegalManthra')
    .factory('mainFactory', ['$http', '$localStorage', function($http, $localStorage) {
        var caseUrl = serverUrl + cases;
        var factory = {};

        var auth = function(json) {
            json.user = $localStorage.user;
        };

        factory.login = function(userData) {
            return $http.post(serverUrl + "login/", userData);
        };

        factory.logout = function(userData) {
            return $http.post(serverUrl + "logout/");
        };
        factory.getSuggestions = function(input) {
            console.log(caseUrl + "getsuggestions/" + input);
            return $http.get(caseUrl + "getsuggestions/" + input);
        };

        factory.search = function(input) {
            return $http.get(caseUrl + input, {
                withCredentials: true
            });
        };

        factory.getById = function(id) {
            console.log(caseUrl + 'display/' + id);
            return $http.get(caseUrl + 'display/' + id, {
                withCredentials: true
            });
        };

        factory.upload = function(data) {
            console.log(caseUrl);
            auth(data);
            return $http({
                url: caseUrl,
                method: "PUT",
                data: data
            });
        };
        return factory;
    }]);
