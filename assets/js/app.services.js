'use strict';

angular.module('app.services', [])
    .service('yaMapsService', function ($rootScope) {
        var map;
        var _ready = false;
        var _routesCollection = [];

        $rootScope.$on('yaMapsReadyStatusChanged', function () {
            _ready = true;
        });

        var clearRoutes = function () {
            angular.forEach(_routesCollection, function (route) {
                map.geoObjects.remove(route);
            })
        };

        return {
            suggest: function (value) {
                return ymaps.suggest(value);
            },
            makeMap: function (selector) {
                return map = new ymaps.Map(selector, {
                    center: [55.76, 37.64],
                    zoom: 7
                });
            },
            makeRoute: function (from, to) {
                if (!from || !from.value
                    || !to || !to.value) {
                    err({message: 'Не переданы координаты точек'});
                    return;
                }

                ymaps.route([
                    {type: 'wayPoint', point: from.value},
                    {type: 'wayPoint', point: to.value}
                ], {
                    mapStateAutoApply: true
                }).then(function (route) {

                    var paths = route.getPaths();
                    var iterator = paths.getIterator();
                    var obj;
                    var data;

                    while (obj = iterator.getNext()) {
                        if (_.isEmpty(obj)) {
                            break;
                        }
                        data = obj.geometry.getCoordinates();
                    }

                    var middleCoordinates = data[Math.floor(data.length / 2)];

                    ymaps.route([
                        {type: 'wayPoint', point: from.value},
                        {type: 'wayPoint', point: middleCoordinates},
                        {type: 'wayPoint', point: to.value}
                    ], {
                        mapStateAutoApply: true
                    }).then(function (route) {
                        route.getPaths().get(0).options.set({
                            strokeColor: '#ff0000'
                        });
                        route.getPaths().get(1).options.set({
                            strokeColor: '#0000ff'
                        });

                        clearRoutes();
                        _routesCollection.push(route);
                        map.geoObjects.add(route);

                    }, err);
                }, err);

                function err(res) {
                    console.log(res);
                    alert(res.message);
                }
            }
        };
    })