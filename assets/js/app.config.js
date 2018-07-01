'use strict';

angular.module('app', [
    'app.controllers',
    'app.directives',
    'app.services',
    'app.filters'
])
    .run(function ($rootScope) {
        window.ymaps.ready(function () {
            $rootScope.$broadcast('yaMapsReadyStatusChanged', {});
        });
    })
