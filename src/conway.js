'use strict';

(function (context) {
  var LIFE = context.LIFE = (context.LIFE || {});

  var Game = LIFE.Game = function Game(xsize, ysize) {
    this.xsize = xsize;
    this.ysize = ysize;
    this.grid = new LIFE.Grid(xsize, ysize);
    this.seed();
    this.initChangedNodes();
  }

  Game.prototype.initChangedNodes = function () {
    // For the first iteration, we must unfornately 
    // check every position.
    var that = this;
    this.changedNodes = [];
    this.grid.checkNext.forEach( function (coord) {
      var x = coord[0];
      var y = coord[1];
      that.changedNodes.push([x, y, that.grid.isAlive(x, y)]);
    });
  };

  Game.prototype.constructor = Game;

  Game.prototype.seed = function (factor) {
    // Factor should be the approximate fraction
    // of pixels you want initially turned on.
    // Suggested value: 0.3
    for (var i=0; i < factor * this.xsize * this.ysize; i++) {
      var x = Math.random() * this.xsize | 0;
      var y = Math.random() * this.ysize | 0;
      this.grid.toggle(x, y);
    }
  };
 
  Game.prototype.tick = function () {
    this.steps += 1;
    var nodesToCheck = this.grid.checkNext;
    this.changedNodes = [];
    this.grid.checkNext = new LIFE.Set();
    var nodesToChange = this.checkNodes(nodesToCheck);
    this.changeNodes(nodesToChange);
  };

  Game.prototype.instrument = function () {
    var game = this;
    setInterval(function () { 
      self.postMessage({
        'status': 'Generations per second: ' + game.steps
      });
      game.steps = 0;
    },1000)
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
  };

  Game.prototype._checkIfKeepAlive = function (x, y, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this.changedNodes.push([x,y,0]);
      return true;
    }
    return false;
  };

  Game.prototype._checkIfResurrect = function (x, y, neighbors) {
    if (neighbors === 3) {
      this.changedNodes.push([x,y,1]);
      return true;
    }
    return false;
  };
})(this);