var Set = (function () {
  var setConstructor = function () {}
  setConstructor.prototype = {};
  setConstructor.prototype.constructor = setConstructor;

  setConstructor.prototype.add = function (x) {
    if (!this.hasOwnProperty(x)) {
      this[ x ] = true;
    }
    return this;
  }

  setConstructor.prototype.push = function (x) {
    // Alias #add
    return this.add(x);
  }

  setConstructor.prototype.values = function (x) {
    var values = [];
    var keys = Object.keys(this);
    return keys.map(this._parseKey);
  }

  setConstructor.prototype._parseKey = function (key) {
    return key.split(",").map(function (coord) { return coord | 0; })
  }

  setConstructor.prototype.forEach = function (callback) {
    return this.values().forEach(callback);
  }

  setConstructor.prototype.filter = function (callback, thisArg) {
    return Array.prototype.filter.call(this.values(), callback, thisArg);
  }

  setConstructor.prototype.pop = function () {
    var keys = Object.keys(this);
    delete this[ keys[0] ];
    debugger;
    return keys[0] ? this._parseKey(keys[0]) : undefined;
  }
  
  setConstructor.prototype.remove = function (x) {
    if (this.hasOwnProperty(x)) {
      delete this[ x ];
    }
    return this;
  }

  setConstructor.prototype.includes = function (x) {
    return this.hasOwnProperty(x)
  }

  return setConstructor;
})(this);