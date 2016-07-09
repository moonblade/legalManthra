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
