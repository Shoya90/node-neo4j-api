/**
 * Created by Shoya on 27/04/2017.
 */
(function () {
    'use strict';
    angular.module('stardust.application')
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider' ,'$locationProvider', function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

            $urlRouterProvider.otherwise('/home');

            $stateProvider
                .state('/home',{
                    url: '/home',
                    templateUrl: '/partials/home.html',
                    controller: 'homeController',
                    controllerAs: 'homeCtrl',
                })

        }])

})();
