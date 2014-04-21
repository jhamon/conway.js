var Set = (function () {
  // var GOL = this.GOL = (this.GOL || {});

  // var Set = GOL.Set = function () {};
  function Set() {};
  Set.prototype = {};
  Set.prototype.constructor = Set;

  Set.prototype.add = function (x) {
    if (!this.hasOwnProperty(x)) {
      this[ x ] = true;
    }
    return this;
  }

  Set.prototype.length = function () {
    return this.values().length;
  }

  Set.prototype.push = function (x) {
    // Alias #add
    return this.add(x);
  }

  Set.prototype.values = function (x) {
    var values = [];
    var keys = Object.keys(this);
    return keys.map(this._parseKey);
  }

  Set.prototype._parseKey = function (key) {
    return key.split(",").map(function (coord) { return coord | 0; })
  }

  Set.prototype.forEach = function (callback) {
    return this.values().forEach(callback);
  }

  Set.prototype.filter = function (callback, thisArg) {
    return Array.prototype.filter.call(this.values(), callback, thisArg);
  }


  // These aren't used in conway.  Remove?
  // Set.prototype.pop = function () {
  //   var keys = Object.keys(this);
  //   delete this[ keys[0] ];
  //   return keys[0] ? this._parseKey(keys[0]) : undefined;
  // }
  //
  // Set.prototype.remove = function (x) {
  //   if (this.hasOwnProperty(x)) {
  //     delete this[ x ];
  //   }
  //   return this;
  // }

  // Set.prototype.includes = function (x) {
  //   return this.hasOwnProperty(x) ? true : false
  // }

  return Set;
})(this);