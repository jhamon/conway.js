'use strict';

(function (context) {
  var LIFE = context.LIFE = (context.LIFE || {});

  var Game = LIFE.Game = function (xsize, ysize) {
    this.xsize = xsize;
    this.ysize = ysize;
    this.grid = new LIFE.Grid(xsize, ysize);
    this._initChangedNodes();
  };

  Game.prototype.constructor = Game;

  Game.prototype._initChangedNodes = function () {
    // For the first iteration, we must unfornately 
    // check every position.
    var that = this;
    this.changedNodes = [];
    this.grid.checkNext.forEach( function (coord) {
      var x = coord[0];
      var y = coord[1];
      that.changedNodes.push([x, y, that.grid.isAliveAt(x, y)]);
    });
  };

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
    var nodesToCheck, nodesToChange;
    this.steps += 1;
    nodesToCheck = this.grid.checkNext;
    this.grid.resetCheckNext();
    this.changedNodes = [];
    nodesToChange = nodesToCheck.filter(this._nodeShouldChange.bind(this));
    this._changeNodes(nodesToChange);
  };

  Game.prototype.instrument = function () {
    // This method enables performance logging.
    var game = this;
    setInterval(function () { 
      self.postMessage({
        'status': 'Generations per second: ' + game.steps
      });
      game.steps = 0;
    }, 1000);
  };

  Game.prototype._nodeShouldChange = function (node) {
    var x = node[0];
    var y = node[1];
    var neighbors = this.grid.countNeighborsAt(x, y);

    if (this.grid.isAliveAt(x, y)) {
      return this._checkIfKeepAlive(x, y, neighbors);
    } else {
      return this._checkIfResurrect(x, y, neighbors);
    }
  };

  Game.prototype._changeNodes = function (nodes) {
    nodes.forEach( function (node) {
      var x = node[0];
      var y = node[1];
      this.grid.toggle(x, y);
    }, this);
  };

  Game.prototype._changeAt = function (x, y, alive) {
    this.changedNodes.push([x, y, alive]);
    this.grid.toggle(x, y)
  }

  Game.prototype._checkIfKeepAlive = function (x, y, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this.changedNodes.push([x, y, 0]);
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