var Set = (function () {
  // var GOL = this.GOL = (this.GOL || {});

  // var Set = GOL.Set = function () {};
  function Set() {};
  Set.prototype = {length: 0};
  Set.prototype.constructor = Set;

  Set.prototype.add = function (x) {
    if (!this.hasOwnProperty(x)) {
      this.length += 1;
      this[ x ] = true;
    }
    return this;
  }

  Set.prototype.push = function (x) {
    // Alias #add
    return this.add(x);
  }
  
  Set.prototype.remove = function (x) {
    if (this.hasOwnProperty(x)) {
      this.length -= 1;
      delete this[ x ];
    }
    return this;
  }
  
  Set.prototype.includes = function (x) {
    return this.hasOwnProperty(x) ? true : false
  }

  Set.prototype.pop = function () {
    var keys = Object.keys(this);
    delete this[ keys[0] ];
    return keys[0] ? this._parseKey(keys[0]) : undefined;
  }

  Set.prototype.values = function (x) {
    var values = [];
    var keys = Object.keys(this).filter( function (x) { return x !== 'length' });
    return keys.map(this._parseKey);
  }

  Set.prototype._parseKey = function (key) {
    if (key.indexOf(",") !== -1) {
      // this is an array string
      return key.split(",").map(function (coord) { return coord | 0; })
    } else {
      // integer string
      return key | 0;
    }
  }

  Set.prototype.forEach = function (callback) {
    return this.values().forEach(callback);
  }

  Set.prototype.copy = function () {
    var newObj = {};
    this.values().forEach( function (key) {
      newObj[ key ] = true;
    })
    return newObj;
  }

  Set.prototype.filter = function (callback, thisArg) {
    return Array.prototype.filter.call(this.values(), callback, thisArg);
  }

  return Set;
})(this);