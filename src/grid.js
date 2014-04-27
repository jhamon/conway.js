'use strict';

(function (context) {
  var LIFE = context.LIFE = (context.LIFE || {});

  var Grid = LIFE.Grid = function (xsize , ysize) {
    this.steps = 0;
    this.xsize = xsize;
    this.ysize = ysize;
    this._initRows();
    this._initCheckNext();  
    this._initNeighborCoords();
  }

  Grid.prototype.resetCheckNext = function () {
    this.checkNext = new LIFE.Set();
  };

  Grid.prototype.toggleAt = function(x, y) {
    this._set(x, y, !this.isAliveAt(x, y));
  };

  Grid.prototype.isAliveAt = function(x, y) {
    return this.rows[y][x];
  };

  Grid.prototype.countNeighborsAt = function(x, y) {
    var that = this;
    var neighborCoords = this.neighborCoords[[x, y]];

    var getStatus = function (pos) { return that.isAliveAt(pos[0], pos[1]); };
    var sum = function (previousVal, currentVal) { return previousVal + currentVal; };
    return neighborCoords.map(getStatus).reduce(sum, 0);
  };

  Grid.prototype._initRows = function() {
    var singleRow = new Array(this.xsize);
    var newRow;
    this.rows = new Array(this.ysize);
    for (var col = 0; col < this.xsize; col++) {
      singleRow[col] = 0;
    }

    for (var rowI = 0; rowI < this.ysize; rowI++) {
      newRow = singleRow.slice(0);
      this.rows[rowI] = newRow;
    }
  };

  Grid.prototype._initCheckNext = function() {
    // The checkNext attribute is a set of 
    // coordinates that need to be checked in the
    // next iteration.  When a value is set on the
    // grid, that location and all its neighbors
    // must be considered in the next cycle so they
    // are stored in checkNext.

    // For the first iteration, we have to look at 
    // every location in the grid.  
    this.checkNext = new LIFE.Set();
    for (var x = 0; x < this.xsize; x++) {
      for (var y = 0; y < this.ysize; y++) {
        this.checkNext.add([x, y]);
      }
    }
  };

  Grid.prototype._initNeighborCoords = function () {
    // The coordinates for the neighbors of a given
    // x,y location do not change, so there's no reason
    // to recalculate them thousands of times. Instead,
    // memoize them.
    var that = this;
    this.neighborCoords = {};
    this.checkNext.forEach(function (coord) {
      that.neighborCoords[ [coord[0], coord[1]] ] = that._neighborCoordsAt(coord[0], coord[1]);
    });
  }

  Grid.prototype._neighborCoordsAt = function(x, y) {
    if (x === 0 || x === this.xsize-1 || y === 0 || y === this.ysize-1) {
      return this._edgeCoordsAt(x, y);
    }

    return [[x+1, y], 
            [x+1, y+1], 
            [x+1, y-1], 
            [x, y-1], 
            [x, y+1], 
            [x-1, y+1], 
            [x-1, y], 
            [x-1, y-1]];
  };

  Grid.prototype._edgeCoordsAt = function(x,y) {
    // For toroidal boundary conditions, I have 
    // to specially handle edges when counting
    // live neighbors.

    var xPlus1 = realMod(x+1, this.xsize);
    var xMinus1 = realMod(x-1, this.xsize);
    var yPlus1 = realMod(y+1, this.ysize);
    var yMinus1 = realMod(y-1, this.ysize);
    return [[xPlus1, y], 
            [xPlus1, yPlus1], 
            [xPlus1, yMinus1], 
            [x, yMinus1], 
            [x, yPlus1], 
            [xMinus1, yPlus1], 
            [xMinus1, y], 
            [xMinus1, yMinus1]];
  };

  var realMod = function(n, divisor) {
    // Because only in js world does -1 % 10 === -1.
    return ((n%divisor)+divisor)%divisor;
  };

  Grid.prototype._addToCheckNext = function(x, y) {
    // The grid has changed at [x,y] so we add that location
    // and all of its neighbors to checkNext to be
    // examined in the next iteration. 
    this.checkNext.add([x,y])
    var neighbors = this.neighborCoords[[x, y]];
    neighbors.forEach( function (neighbor) {
      this.checkNext.add(neighbor);
    }, this);
  };

  Grid.prototype._set = function(x, y, value) {
    this.rows[y][x] = value;
    this._addToCheckNext(x, y);
    return true;
  };
})(this);