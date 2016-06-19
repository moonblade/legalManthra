// You must include the dependency on 'ngMaterial'
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
