var serverUrl = "http://63.141.232.148:3000/"
var serverUrl = "http://127.0.0.1:3000/"
var cases = "cases/"
angular.module('LegalManthra', ['ngMaterial', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/search/');

        $stateProvider
            .state('search', {
                url: '/search/:term',
                templateUrl: 'modules/search/search.html',
                controller: 'SearchController'
            })
            .state('detail',{
            	url:'/detail/:id',
                templateUrl: 'modules/detail/detail.html',
                controller: 'detailController'
            })
            .state('input',{
                url:'/input',
                templateUrl: 'modules/input/input.html',
            	controller: 'inputController'
            })
    });
