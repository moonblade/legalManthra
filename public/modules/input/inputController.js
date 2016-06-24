angular.module('LegalManthra')
    .controller('inputController', function($scope, mainFactory, $mdDialog) {
        $scope.inputTypes = ["case"]
        $scope.selected = "case";
        $scope.commonField = {name:"type"}
        $scope.submit = function() {
            var data = {
                type: $scope.selected,
                commonField: $scope.commonField,
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
                    message = err.message;
                    if(!message)
                        message = err.msg;

                    $mdDialog.show(
                        $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Failed')
                        .textContent('There was an error during upload : ' + (message?message:"Unknown Error"))
                        .ok('Okay')
                    );

                });
        }
    })
