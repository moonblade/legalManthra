angular.module('LegalManthra')

.controller('SearchController', ['$scope','mainFactory',function($scope,mainFactory) {
    // $scope.searchText;
    // $scope.selectedItem;
    $scope.searchTextChange = function(text) {
        console.log(text);
    }
    $scope.selectedItemChange = function(item) {
        console.log(item);
    }
    $scope.search = function(searchText) {
    	console.log(searchText)
    }
}])
