'use strict';

angular.module('app.directives', [])

    .directive('yandexMapLayout', function ($rootScope, yaMapsService) {
        return {
            // require: 'MainCtrl',
            link: function (scope, element, attrs) {
                $rootScope.$on('yaMapsReadyStatusChanged', function (event) {
                    yaMapsService.makeMap('ymap');
                });
            },
            scope: {
            },
            templateUrl: '/assets/templates/yandex.map.layout.html'
        };
    })
    .directive('searchField', function (yaMapsService, $timeout) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                scope.searchDo = function () {

                    if (angular.isUndefined(scope.location)) {
                        return;
                    }

                    yaMapsService.suggest(scope.location).then(
                        function (items) {
                            scope.$apply(function () {
                                scope.autoCompleteItems = items;
                            });
                        }, function (reason) {
                            alert('Error!');
                            console.log(reason);
                            scope.clearAutoComplete();
                        })
                };

                scope.clearAutoComplete = function () {
                    scope.autoCompleteItems = [];
                };

                scope.showAutoComplete = function () {
                    return angular.isArray(scope.autoCompleteItems) && scope.autoCompleteItems.length && scope.focus;
                };

                scope.selectPoint = function (item) {
                    scope.location = item.displayName;
                    scope.ngModel = item;
                }
            },
            scope: {
                ngModel: '=',
                title: '@searchField',
                id: '@ngModel'
            },
            templateUrl: '/assets/templates/search.field.html'
        };
    });