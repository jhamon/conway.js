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
      this.grid.toggleAt(x, y);
    }
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

  Game.prototype.tick = function () {
    var nodesToCheck, nodesToChange;
    this.steps += 1;
    nodesToCheck = this.grid.checkNext;
    this.grid.resetCheckNext();
    this.changedNodes = [];
    nodesToCheck.map(this._markNodesToChange.bind(this));
    this._changeNodes();
  };

  Game.prototype._markNodesToChange = function (node) {
    var x = node[0];
    var y = node[1];
    var neighbors = this.grid.countNeighborsAt(x, y);

    if (this.grid.isAliveAt(x, y)) {
      this._checkIfKeepAlive(x, y, neighbors);
    } else {
      this._checkIfResurrect(x, y, neighbors);
    }
  };

  Game.prototype._changeNodes = function () {
    this.changedNodes.map( function (node) {
      this.grid.toggleAt(node[0], node[1]);
    }, this);
  };

  Game.prototype._changeAt = function (x, y, alive) {
    this.changedNodes.push([x, y, alive]);
  }

  Game.prototype._checkIfKeepAlive = function (x, y, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this._changeAt(x, y, 0);
    }
  };

  Game.prototype._checkIfResurrect = function (x, y, neighbors) {
    if (neighbors === 3) {
      this._changeAt(x, y, 1);
    }
  };
})(this);