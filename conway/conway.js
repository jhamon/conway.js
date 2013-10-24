//// Game logic
(function (window) {
  var Game = window.Game = (window.Game || (function (){}));

  Number.prototype.myMod = function(n) {
    // This somewhat wat-worthy function is what
    // allows cordinate wrapping at the edges of
    // the grid.  Wouldn't be needed if javascript
    // % operator wasn't fucked.
    return ((this%n)+n)%n;
  }

  Game.prototype.countLiving = function () {
    var ctx = this.ctx;
    var gamearray = this.xy_array
    var sum = 0;

    for (var i = 0; i<ctx.gridheight; i++) {
      for (var j = 0; j<ctx.gridwidth; j++) {
        if (gamearray[i][j] != 0) {
          sum++;
        }
      }
    }
    return sum;
  }

  Game.prototype.ruleCheck = function () {
    var ctx = this.ctx;
    var xy_array = this.xy_array;
    var new_xy_array = [];

    // Loop through xy_array, calculating number of living
    // neighbors for each position.

    function countNeighbors(i, j) {
      var neighbor_deltas = [[-1, -1], [0, -1], [1, -1], [-1,0], [1,0], [-1,1], [0,1], [1,1]];
      var neighbor_count = 0;
      for (var k = 0; k < neighbor_deltas.length ; k++) {
        var neigh_x = (neighbor_deltas[k][0] + i).myMod(ctx.gridheight-1);
        var neigh_y = (neighbor_deltas[k][1] + j).myMod(ctx.gridheight-1);
        neighbor_count += xy_array[neigh_x][neigh_y];
      }

      return neighbor_count;
    }

    for (i = 0; i <= ctx.gridheight; i++) {
      new_xy_array[i] = [];
      for (j = 0; j <= ctx.gridwidth; j++) {
        new_xy_array[i][j] = xy_array[i][j];
        var neighbors = countNeighbors(i, j);

        // Any live cell with fewer than two live neighbors dies,
        // as if caused by under-population.
        if (neighbors < 2) {
          new_xy_array[i][j] = 0;
        }

        // Any live cell with more than three live neighbors dies,
        // as if by overcrowding.
        if (neighbors > 3) {
          new_xy_array[i][j] = 0;
        }

        // Any dead cell with exactly three live neighbors becomes
        // a live cell, as if by reproduction.
        if (neighbors == 3) {
          new_xy_array[i][j] = 1;
        }
      }
    }
    // Update game state to reflect outcome of rule applications
    this.xy_array = new_xy_array;
  }

  Game.prototype.editCell = function (x,y) {
    if (this.drawable && !this.erase) {
      this.xy_array[x][y] = 1;
    } else if (this.drawable && this.erase) {
      this.xy_array[x][y] = 0;
    }
  }

  Game.prototype.gliderAtXY = function (x,y) {
    this.xy_array[x-1][y+1] = 1;
    this.xy_array[x][y+1] = 1;
    this.xy_array[x+1][y+1] = 1;
    this.xy_array[x+1][y] = 1;
    this.xy_array[x][y-1] = 1;
  }

  Game.prototype.editAtPixel = function(x,y) {
    cell_coords = this.pixelCordsToCellCoords(x,y)
    this.editCell(cell_coords.x, cell_coords.y);
  }

  Game.prototype.pixelCordsToCellCoords = function (xpixel, ypixel) {
    return  {y: Math.floor(xpixel/this.ctx.shim),
             x: Math.floor(ypixel/this.ctx.shim)+1};
  }

  Game.prototype.togglePause = function () {
    this.paused = !this.paused;
  }

  Game.prototype.toggleEraser = function () {
    this.erase = !this.erase;
  }
})(this);