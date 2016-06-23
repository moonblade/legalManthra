var serverUrl = "http://63.141.232.148:3000/"
// var serverUrl = "http://localhost:3000/"
var cases = "cases/"
angular.module('LegalManthra', ['ngMaterial', 'ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/search');

        $stateProvider
            .state('search', {
                url: '/search',
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
