
var app = angular.module ('MyApp', []);

function ViewModelCtrl ($scope, $http) {

  var canvas = new fabric.Canvas('cvs', {
    width : 800,
    height : 500
  });

  $http.get('shape.json').success(function(rsp){
    //$scope.shapes = rsp.data;
    $scope.attrs = rsp.shape;
    $scope.shapes = [];
    for (shape in $scope.attrs) {
      $scope.shapes.push(shape);
    }
    console.log ($scope.shapes);
  });

  // generate shape
  $scope.createShape = function(type) {
      console.log (type);
    	var shape = new Eagle[type] (   $scope.attrs[type] );
      canvas.add(shape);
  };

  $scope.changeAttr = function(attr,val) {
    var obj = canvas.getActiveObject();
    if (obj) {
      obj.set(attr, val);
      canvas.renderAll();
    }
  };

}

app.controller('ViewModelCtrl', ['$scope', '$http', ViewModelCtrl]);
