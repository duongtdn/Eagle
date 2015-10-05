
var app = angular.module ('MyApp', []);

function ViewModelCtrl ($scope, $http) {

  var align = {
    textHAlign : ['left','center','right'],
    textVAlign : ['top','middle','bottom']
  };

  var canvas = new fabric.Canvas('cvs', {
    width : 800,
    height : 500
  });

  canvas.on('object:selected', function(evt){
    var hAlign = evt.target.textHAlign,
        vAlign = evt.target.textVAlign,
        hIdx = align.textHAlign.indexOf(hAlign),
        vIdx = align.textVAlign.indexOf(vAlign);
      $scope.$apply(function() {
        $scope.textHAlign = hIdx;
        $scope.textVAlign = vIdx;
      })
  });

  function changeAttr (attr,val) {
    var obj = canvas.getActiveObject();
    if (obj) {
      obj.set(attr, val);
      canvas.renderAll();
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  $http.get('shape.json').success(function(rsp){
    //$scope.shapes = rsp.data;
    $scope.attrs = rsp.shape;
    $scope.shapes = [];
    for (shape in $scope.attrs) {
      $scope.shapes.push(shape);
    }
  });

  // initial attr of object
  $scope.textHAlign = 0;
  $scope.textVAlign = 0;
  $scope.padLeft = 0;
  $scope.padRight = 0;
  $scope.padTop = 0;
  $scope.padBottom = 0;

  // generate shape
  $scope.createShape = function(type) {
    var shape = {};
    if (type === 'Polygon') {
      var points = $scope.attrs[type].points;
      shape = new Eagle[type] (points , $scope.attrs[type]);
    } else {
      shape = new Eagle[type] ( $scope.attrs[type] );
    }
    canvas.add(shape);
  };


  $scope.alignText = function(dim) {
    $scope[dim] = $scope[dim] === 2? 0 : $scope[dim] + 1;
    var val = align[dim][$scope[dim]];
    changeAttr(dim, val);
  };

  $scope.getAlign = function(dim) {
    var idx =  $scope[dim] === 2? 0 : $scope[dim] + 1;
    return align[dim][idx];
  };

  $scope.setPad = function(pad, val) {
    var attr = 'pad' + capitalizeFirstLetter(pad);
    changeAttr(attr, val);
  };

}

app.controller('ViewModelCtrl', ['$scope', '$http', ViewModelCtrl]);
