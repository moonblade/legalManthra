angular.module('LegalManthra')
    .controller('adminController', ['$scope', '$stateParams', '$state', 'mainFactory', '$mdDialog', '$localStorage', 'GooglePlus', function($scope, $stateParams, $state, mainFactory, $mdDialog, $localStorage, GooglePlus) {
        $scope.sidebar = [{
            name: "Input",
            state: "admin.input"
        }, {
            name: "Users",
            state: "admin.users"
        }]

        $scope.gotoState = function(state) {
            $state.go(state);
        }

        $scope.showMessage = function(title, message) {
            $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ok('Okay')
            );
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
                                $scope.showMessage('Failed', 'There was an error during login : ' + (err ? err : "Unknown Error"))
                            })
                    });
                }, function(err) {
                    console.log(err);
                });
            }
        }
    }]);
