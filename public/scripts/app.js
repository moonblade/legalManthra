var serverUrl = "http://63.141.232.148:3000/"
var serverUrl = "http://127.0.0.1:3000/"
var cases = "cases/"
angular.module('LegalManthra', ['ngMaterial', 'ui.router', 'googleplus'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/search/');

        $stateProvider
            .state('search', {
                url: '/search/:term',
                templateUrl: 'modules/search/search.html',
                controller: 'SearchController'
            })
            .state('detail', {
                url: '/detail/:id',
                templateUrl: 'modules/detail/detail.html',
                controller: 'detailController'
            })
            .state('input', {
                url: '/input',
                templateUrl: 'modules/input/input.html',
                controller: 'inputController'
            })
    }).config(['GooglePlusProvider', function(GooglePlusProvider) {
        GooglePlusProvider.init({
            clientId: '704894076751-sogp2ijut7r533b9igomll4rgs44sori.apps.googleusercontent.com',
            apiKey: 'AIzaSyAn10rsKeY1EOv4MK_3XBL7edv9hLAaVkE'
        });
    }]);
