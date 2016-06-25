angular.module('LegalManthra')

.controller('SearchController', function($scope, mainFactory, $state, $stateParams, GooglePlus, $localStorage) {
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

    $scope.login = function() {
        GooglePlus.login().then(function(authResult) {
            console.log(authResult);
            GooglePlus.getUser().then(function(user) {
                console.log(user);
                $localStorage.user = user;
            });
        }, function(err) {
            console.log(err);
        });
    }
    // $scope.$on('$viewContentLoaded', function() {
        //Here your view content is fully loaded !!
        // $scope.login();
    // });

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
