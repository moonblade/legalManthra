angular.module('LegalManthra')

.controller('SearchController', ['$scope', 'mainFactory','$state', function($scope, mainFactory,$state) {
    // $scope.selectedItemChange = function(item) {
    //     console.log(item);
    // }
    var NO_STRING = "No results Found";
    $scope.height = 100
    $scope.search = function(searchText) {
        if (searchText == "")
            return;
        mainFactory.search(searchText)
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
    	if(result._source.title!=NO_STRING)
    	var param = result._source.id;
    	$state.go('detail',{"id":param});
    }
}]);
