/**
 * Created by Janek on 2014-12-15.
 */
project.controller("testBtnController", function($scope) {
    $scope.save = function() {
        var realchart = document.getElementById("realChartDiv");
        var realchartCan = realchart.toDataURL("image/png");
        var w=window.open('about:blank','image from canvas');
        w.document.write("<img src='"+realchartCan+"' alt='from canvas'/>");
    }
});