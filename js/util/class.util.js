/*------------------------------------------------------------------------------

  ----------------------------------------------------------------------------*/
"use strict";

(function(){

  var slice = Array.prototype.slice;

  function addMethods (addon, source) {
    for ( var prop in source ) {
      addon[prop] = source[prop];
    }
  }

  function createClass () {
    var parent = null,
        type,
        properties = slice.call(arguments, 0),
        addon = {};

    // retrieve parent class
    if (typeof properties[0] === 'function') {
      parent = properties.shift();
    }

    // retrieve class type
    if (typeof properties[0] === 'string') {
      type = properties.shift();
      addon.type = type;
    }

    // form an addon of new class by adding all mixins
    for ( var i = 0, len = properties.length; i < len; i++ ) {
      addMethods(addon, properties[i]);
    }

    // call fabric util to accomplete task
    if (parent) {
      return fabric.util.createClass(parent, addon);
    } else {
      return fabric.util.createClass(addon);
    }

  }

  Eagle.Util.createClass = createClass;

})();
