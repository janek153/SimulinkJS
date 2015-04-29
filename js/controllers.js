/**
 * Created by Janek on 2015-04-29.
 */
var module = angular.module('SimulinkJS', ['ui.bootstrap']);
module.controller('Test', Test);
module.controller('CreateModel', CreateModel);

function Test($scope) {
    $scope.groups = [
        {
            title: 'Sources',
            content: ['step']
        },
        {
            title: 'Continuous',
            content: ['integrator', 'transferFcn']
        }
    ];

}

function CreateModel($scope) {

}