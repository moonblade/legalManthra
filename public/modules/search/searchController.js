angular.module('LegalManthra')

.controller('SearchController', ['$scope','mainFactory',function($scope,mainFactory) {
    // $scope.selectedItemChange = function(item) {
    //     console.log(item);
    // }
    mainFactory.search("limited sunquest")
    	.success(function(data){
    		console.log(data)
    	})
    $scope.search = function(searchText) {
    	console.log(searchText)
    	mainFactory.search(searchText)
    	.success(function(data){
    		console.log(data)
    	})
    }
    $scope.querySearch = function(searchText) {
    	// console.log(searchText)
    	return []
    }
}])
