(function (window) {
  "use strict";

  var GOL = window.GOL = (window.GOL || {} );

  var Grid = function ( xsize , ysize ) {
    var rows;
    var checkList;

    function _initialize() {
      _initRows();
      _initCheckList();  
    };

    function _initRows() {
      var singleRow = new Array(xsize);
      var newRow;
      rows = new Array(ysize);
      for (var col = 0; col < xsize; col++) {
        singleRow[col] = 0;
      }

      for (var rowI = 0; rowI < ysize; rowI++) {
        newRow = singleRow.slice(0);
        rows[rowI] = newRow;
      }
    };

    function _initCheckList() {
      checkList = new Array(xsize*ysize);
      for (var x = 0; x < xsize; x++) {
        for (var y = 0; y < ysize; y++) {
          checkList[x+y] = [x, y];
        }
      }
    };

    function _neighborCoords(x, y) {
      if (x === 0 || x === xsize-1 || y === 0 || y === ysize-1) {
        return _edgeCoords(x, y);
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


    function _edgeCoords(x,y) {
      // For toroidal boundary conditions, I have 
      // to specially handle edges when counting
      // live neighbors.

      var xPlus1 = realMod(x+1, xsize);
      var xMinus1 = realMod(x-1, xsize);
      var yPlus1 = realMod(y+1, ysize);
      var yMinus1 = realMod(y-1, ysize);
      return [[xPlus1, y], 
              [xPlus1, yPlus1], 
              [xPlus1, yMinus1], 
              [x, yMinus1], 
              [x, yPlus1], 
              [xMinus1, yPlus1], 
              [xMinus1, y], 
              [xMinus1, yMinus1]];
    };

    function realMod(n, divisor) {
      // Because only in js world does -1 % 10 === -1.
      return ((n%divisor)+divisor)%divisor;
    }

    function _addToChangeList(x, y) {
      var neighbors = _neighborCoords(x, y);
      checkList = checkList.concat(neighbors);
    };

    function _set(x, y, value) {
      rows[y][x] = value;
      _addToChangeList(x, y);
      return true;
    };

    function isAlive(x, y) {
      return rows[y][x];
    };

    function setAlive(x ,y ) {
      return _set(x, y, 1);
    };

    function setDead(x, y) {
      return _set(x, y, 0);
    };

    function countNeighborsAt(x, y) {
      var neighborCoords = _neighborCoords(x, y);

      var getStatus = function (pos) { return isAlive(pos[0], pos[1]); };
      var sum = function (previousVal, currentVal) { return previousVal + currentVal; };
      return neighborCoords.map(getStatus).reduce(sum, 0);
    };

    _initialize(xsize, ysize);

    return {
      countNeighborsAt: countNeighborsAt,
      setDead: setDead,
      setAlive: setAlive,
      checkList: checkList,
      isAlive: isAlive
    };

  };
  
  var Game = GOL.Game = function (xsize, ysize) {
    this.xsize = xsize;
    this.ysize = ysize;
    this.changeList = [];
    this.grid = Grid(xsize, ysize); // not a constructor; new not needed.
  };

  Game.prototype.constructor = Game;

  Game.prototype.seed = function (factor) {
    // Factor should be the approximate fraction
    // of pixels you want initially turned on.
    // Suggested value: 0.3
    for (var i=0; i < factor * this.xsize * this.ysize; i++) {
      var x = Math.random() * this.xsize | 0;
      var y = Math.random() * this.ysize | 0;
      this.grid.setAlive(x, y);
    }
  };
 
  Game.prototype.tick = function () {
    var nextChange = this.grid.checkList.slice(0);
    this.grid.checkList = [];

    nextChange.forEach(
      function (coords) { 
        this.checkNode(coords[0], coords[1]);
      }, 
      this
    );
  };

  Game.prototype.checkNode = function (x, y) {
    var neighbors = this.grid.countNeighborsAt(x, y);
    if (this.grid.isAlive(x, y)) {
      return this._checkIfKeepAlive(x, y, neighbors);
    } else {
      return this._checkIfResurrect(x, y, neighbors);
    }
  };

  Game.prototype._checkIfKeepAlive = function (x, y, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this.grid.setDead(x, y);
      this.changeList.push([x,y]);
      return false;
    }
    return true;
  };

  Game.prototype._checkIfResurrect = function (x, y, neighbors) {
    if (neighbors === 3) {
      this.grid.setAlive(x, y);
      this.changeList.push([x,y]);
      return true;
    }
    return false;
  }
})(this);
