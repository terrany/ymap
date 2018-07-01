'use strict';

angular.module('app.controllers', [])

    .controller('MainCtrl', function ($scope, $rootScope, yaMapsService) {

        $rootScope.$on('yaMapsReadyStatusChanged', function (event) {
            $scope.$apply(function () {
                $scope.yaMapsIsReady = true;
            })
        });

        $scope.go = function () {
            yaMapsService.makeRoute($scope.from, $scope.to);
        }
    });