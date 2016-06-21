angular.module('LegalManthra')
    .controller('inputController', function($scope) {
        $scope.inputTypes = {
            "case":{
            	"name":"case",
            	"id":"1"
            }
        };
        $scope.selected = "case";
        
    })
