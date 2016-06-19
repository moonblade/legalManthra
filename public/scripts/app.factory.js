angular.module('LegalManthra')


.factory('mainFactory', function($http) {

    var factory = {}

    factory.getSomething = function(input){
    	return 'something'
    }

    return factory



});
