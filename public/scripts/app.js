// You must include the dependency on 'ngMaterial'
var serverUrl = "localhost:3000/"
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

});
