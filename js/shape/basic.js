/*------------------------------------------------------------------------------

  ----------------------------------------------------------------------------*/
"use strict";

(function(){

  var shapes = [
    'Rect',
    'Circle',
    'Ellipse',
    'Triangle',
    'Polygon'
  ];

  for ( var i = 0, len = shapes.length; i < len; i++ ) {

    var shape = shapes[i],
        type = 'Eagle-' + shape;

    Eagle[shape] = Eagle.Util.createClass (
      fabric[shape],
      type,
      Eagle.Embed.Text
    );

  }

})();
