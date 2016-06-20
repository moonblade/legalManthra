angular.module('LegalManthra')
    .controller('detailController', ['$scope', '$stateParams', 'mainFactory', function($scope, $stateParams,mainFactory) {
    	var id = $stateParams.id
    	mainFactory.getById(id)
    	.success(function(data){
    		console.log(data)
    		if(data.found)
    		{
    			$scope.result = data._source;
    		}
    	}).error(function(err){
    		console.log("Error : "+err)
    		$scope.result = []
    	})

    }]);
