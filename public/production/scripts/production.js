var serverUrl = "http://63.141.232.148:3000/",
    cases = "cases/"
angular.module('LegalManthra', ['ngMaterial', 'ui.router', 'googleplus', 'ngStorage'])
    .config(function($stateProvider, $urlRouterProvider, GooglePlusProvider) {

        $urlRouterProvider.otherwise('/search/');

        $stateProvider
            .state('search', {
                url: '/search/:term',
                templateUrl: 'modules/search/search.html',
                controller: 'SearchController'
            })
            .state('detail', {
                url: '/detail/:id',
                templateUrl: 'modules/detail/detail.html',
                controller: 'detailController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'modules/admin/admin.html',
                controller: 'adminController',
                abstract: true
            })
            .state('admin.input', {
                url: '/input',
                templateUrl: 'modules/input/input.html',
                controller: 'inputController'
            })
            .state('admin.users', {
                url: '/users',
                templateUrl: 'modules/admin/users.html',
                controller: 'userControlelr'
            });

        GooglePlusProvider.init({
            clientId: '704894076751-sogp2ijut7r533b9igomll4rgs44sori.apps.googleusercontent.com',
            apiKey: 'AIzaSyAn10rsKeY1EOv4MK_3XBL7edv9hLAaVkE'
        });
    });

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

angular.module('LegalManthra')
    .filter('titlecase', function($sce) {
        return function(input) {
            if (input == undefined)
                return "";
            var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

            input = input.toLowerCase();
            return input.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
                if (index > 0 && index + match.length !== title.length &&
                    match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                    (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                    title.charAt(index - 1).search(/[^\s-]/) < 0) {
                    return match.toLowerCase();
                }

                if (match.substr(1).search(/[A-Z]|\../) > -1) {
                    return match;
                }

                return match.charAt(0).toUpperCase() + match.substr(1);
            });
        }
    }).filter('html', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });

angular.module('LegalManthra')
    .controller('detailController', ['$scope', '$stateParams', 'mainFactory', function($scope, $stateParams, mainFactory) {
        var id = $stateParams.id
        mainFactory.getById(id)
            .success(function(data) {
                console.log(data)
                if (data.found) {
                    $scope.result = data._source;
                }
            }).error(function(err) {
                console.log("Error : " + err)
                $scope.result = []
            })

    }]);

angular.module('LegalManthra')
    .controller('inputController', function($scope, mainFactory, $mdDialog, $localStorage) {
        $scope.inputTypes = ["case"]
        $scope.selected = "case";
        $scope.commonField = {
            name: "type"
        }
        $scope.submit = function() {
            var data = {
                type: $scope.selected,
                commonField: $scope.commonField,
                postData: $scope.postData
            };
            if (!$localStorage.user) {
                $scope.showMessage("Error", "Please login for upload");
            } else if (!$scope.postData) {
                $scope.showMessage("Error", "Please enter data to upload");
            } else {
                console.log(data)
                mainFactory.upload(data)
                    .success(function(data) {
                        console.log(data)
                        $scope.showMessage("Success", "The data has been uploaded successfully")
                    }).error(function(err) {
                        console.log(err);
                        message = err ? (err.message || err.message) : "Unknown Error";
                        $scope.showMessage("Failed", 'There was an error during upload : ' + message)
                    });
            }
        }


    })

angular.module('LegalManthra')
    .controller('adminController', ['$scope', '$stateParams', '$state', 'mainFactory', '$mdDialog', '$localStorage', 'GooglePlus', function($scope, $stateParams, $state, mainFactory, $mdDialog, $localStorage, GooglePlus) {
        $scope.sidebar = [{
            name: "Input",
            state: "admin.input"
        }, {
            name: "Users",
            state: "admin.users"
        }]

        $scope.gotoState = function(state) {
            $state.go(state);
        }

        $scope.showMessage = function(title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ok('Okay')
            );
        }

        $scope.loginAction = $localStorage.user ? "Logout" : "Login";
        $scope.login = function() {
            if ($localStorage.user) {
                // logout
                $localStorage.user = null
                $scope.loginAction = "Login"
                GooglePlus.logout();
            } else {
                // login
                GooglePlus.login().then(function(authResult) {
                    // console.log(authResult);
                    GooglePlus.getUser().then(function(user) {
                        // console.log(user);
                        mainFactory.login({
                                user: user
                            })
                            .success(function(result) {
                                // console.log(result)
                                $scope.loginAction = "Logout"
                                $localStorage.user = user;
                            }).error(function(err) {
                                console.log(err)
                                $scope.showMessage('Failed', 'There was an error during login : ' + (err ? err : "Unknown Error"))
                            })
                    });
                }, function(err) {
                    console.log(err);
                });
            }
        }
    }])
    .controller('userControlelr', ['$scope', function($scope) {
        
    }]);

angular.module('LegalManthra')

.controller('SearchController', function($scope, mainFactory, $state, $stateParams) {
    // $scope.selectedItemChange = function(item) {
    //     console.log(item);
    // }
    var NO_STRING = "No results Found";
    $scope.height = 100
    $scope.search = function(searchText) {
        if (searchText == "")
            return;
        else {
            $state.go('search', {
                term: searchText
            })
        }
    }

    if ($stateParams.term) {
        mainFactory.search($stateParams.term)
            .success(function(data) {
                console.log(data)
                if (!data.timed_out) {
                    hits = data.hits;
                    if (hits.total > 0) {
                        $scope.height = 20
                        $scope.results = hits.hits
                    } else {
                        $scope.results = [{
                            "_source": {
                                "title": NO_STRING
                            }
                        }];
                        // No results found
                    }
                }
            }).error(function(error) {
                $scope.results = [{
                    "_source": {
                        "title": NO_STRING
                    }
                }];
            })
    }

    $scope.searchTextChange = function(searchText) {
        // if(searchText=="")
        // $scope.results=[]
    }

    $scope.querySearch = function(searchText) {
        // console.log(searchText)
        return []
    }

    $scope.showDetails = function(result) {
        console.log(result);
        if (result._source.title != NO_STRING)
            var param = result._source.id;
        $state.go('detail', {
            "id": param
        });
    }
});
