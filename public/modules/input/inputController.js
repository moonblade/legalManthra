angular.module('LegalManthra')
    .controller('inputController', function($scope, mainFactory, $mdDialog, GooglePlus, $localStorage) {
        $scope.inputTypes = ["case"]
        $scope.selected = "case";
        $scope.commonField = {
            name: "type"
        }
        var show = function(title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ok('Okay')
            );
        }
        $scope.submit = function() {
            var data = {
                type: $scope.selected,
                commonField: $scope.commonField,
                postData: $scope.postData
            };
            if (!$localStorage.user) {
                show("Error", "Please login for upload");
            } else if (!$scope.postData) {
                show("Error", "Please enter data to upload");
            } else {
                console.log(data)
                mainFactory.upload(data)
                    .success(function(data) {
                        console.log(data)
                        show("Success", "The data has been uploaded successfully")
                    }).error(function(err) {
                        console.log(err);
                        message = err ? (err.message || err.message) : "Unknown Error";
                        show("Failed", 'There was an error during upload : ' + message)
                    });
            }
        }

        $scope.loginAction = $localStorage.user ? "Logout" : "Login";
        $scope.login = function() {
            if ($localStorage.user) {
                // logout
                $localStorage.user = null
                $scope.loginAction = "Login"
                GooglePlus.logout();
            } else {
                // login
                GooglePlus.login().then(function(authResult) {
                    // console.log(authResult);
                    GooglePlus.getUser().then(function(user) {
                        // console.log(user);
                        mainFactory.login({
                                user: user
                            })
                            .success(function(result) {
                                // console.log(result)
                                $scope.loginAction = "Logout"
                                $localStorage.user = user;
                            }).error(function(err) {
                                console.log(err)
                                show('Failed', 'There was an error during login : ' + (err ? err : "Unknown Error"))
                            })
                    });
                }, function(err) {
                    console.log(err);
                });
            }
        }
    })
