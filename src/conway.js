(function (window) {
  "use strict";

  var GOL = window.GOL = (window.GOL || {} );

  function Grid(xsize , ysize) {
    this.xsize = xsize;
    this.ysize = ysize;
    this._initRows();
    this._initCheckList();  
  }

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

  Grid.prototype._initCheckList = function() {
    this.checkList = new GOL.Set();
    for (var x = 0; x < this.xsize; x++) {
      for (var y = 0; y < this.ysize; y++) {
        this.checkList.add([x, y]);
      }
    }
  };

  Grid.prototype._neighborCoords = function(x, y) {
    if (x === 0 || x === this.xsize-1 || y === 0 || y === this.ysize-1) {
      return this._edgeCoords(x, y);
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


  Grid.prototype._edgeCoords = function(x,y) {
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
  }

  Grid.prototype._addToChangeList = function(x, y) {
    var neighbors = this._neighborCoords(x, y);
    neighbors.forEach( function (neighbor) {
      this.checkList.add(neighbor) 
    }, this);
  };

  Grid.prototype._set = function(x, y, value) {
    this.rows[y][x] = value;
    this._addToChangeList(x, y);
    return true;
  };

  Grid.prototype.toggle = function(x, y) {
    this._set(x, y, !this.isAlive(x, y))
  };

  Grid.prototype.isAlive = function(x, y) {
    return this.rows[y][x];
  };

  Grid.prototype.setAlive = function(x ,y ) {
    return this._set(x, y, 1);
  };

  Grid.prototype.setDead = function(x, y) {
    return this._set(x, y, 0);
  };

  Grid.prototype.countNeighborsAt = function(x, y) {
    var that = this;
    var neighborCoords = this._neighborCoords(x, y);

    var getStatus = function (pos) { return that.isAlive(pos[0], pos[1]); };
    var sum = function (previousVal, currentVal) { return previousVal + currentVal; };
    return neighborCoords.map(getStatus).reduce(sum, 0);
  };

  var Game = GOL.Game = function (xsize, ysize) {
    this.xsize = xsize;
    this.ysize = ysize;
    this.grid = new Grid(xsize, ysize);
    this.seed();
    this.initChangeList()
  };

  Game.prototype.initChangeList = function () {
    var that = this;
    this.changeList = [];
    this.grid.checkList.forEach( function (coord) {
      var x = coord[0];
      var y = coord[1];
      that.changeList.push([x, y, that.grid.isAlive(x, y)]);
    });
  }

  Game.prototype.constructor = Game;

  Game.prototype.seed = function (factor) {
    // Factor should be the approximate fraction
    // of pixels you want initially turned on.
    // Suggested value: 0.3
    for (var i=0; i < factor * this.xsize * this.ysize; i++) {
      var x = Math.random() * this.xsize | 0;
      var y = Math.random() * this.ysize | 0;
      console.log("Seeding"); 
      this.grid.setAlive(x, y);
    }
  };

  Game.prototype.report = function () {
    var str = "Changelist: " + this.changeList.length + ", Grid checklist: " + this.grid.checkList.length
    console.log(str);
  };
 
  Game.prototype.tick = function () {
    var nodesToCheck = this.grid.checkList;
    this.changeList = [];
    this.grid.checkList = new GOL.Set();
    var nodesToChange = this.checkNodes(nodesToCheck);
    this.changeNodes(nodesToChange);
  };

  Game.prototype.checkNodes = function (nodes) {
    return nodes.filter( function (node) {
      var x = node[0];
      var y = node[1];
      var neighbors = this.grid.countNeighborsAt(x, y);

      if (this.grid.isAlive(x, y)) {
        return this._checkIfKeepAlive(x, y, neighbors);
      } else {
        return this._checkIfResurrect(x, y, neighbors);
      }
    }, this);

  };

  Game.prototype.changeNodes = function (nodes) {
    nodes.forEach( function (node) {
      var x = node[0];
      var y = node[1];
      this.grid.toggle(x, y);
    }, this);
  }

  Game.prototype._checkIfKeepAlive = function (x, y, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this.changeList.push([x,y,0]);
      return true;
    }
    return false;
  };

  Game.prototype._checkIfResurrect = function (x, y, neighbors) {
    if (neighbors === 3) {
      this.changeList.push([x,y,1]);
      return true;
    }
    return false;
  }
})(this);
