angular.module('LegalManthra')
    .controller('inputController', function($scope, mainFactory, $mdDialog) {
        $scope.inputTypes = ["case"]
        $scope.selected = "case";
        $scope.submit = function() {
            var data = {
                type: $scope.selected,
                commonField: $scope.type,
                postData: $scope.postData
            };
            mainFactory.upload(data)
                .success(function(data) {
                    console.log(data)
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Success')
                        .textContent('The data has been uploaded successfully')
                        .ok('Okay')
                    );
                }).error(function(err) {
                    console.log(err);
                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Failed')
                        .textContent('There was an error during upload : ' + err.message||"Unknown Error")
                        .ok('Okay')
                    );

                });
        }
    })
