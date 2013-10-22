window.requestAnimFrame = (
  function(callback) {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

//// Game setup:
// #setupGame, #setupCanvas, #buildStartArray

game = {};
game.canvas = document.getElementById('mycanvas');
game.ctx = game.canvas.getContext('2d');

Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

game.setupGame = function () {
  this.generation = 0;

  // Seed proportion is the percent of cells
  // that are initially living.
  this._seed_propotion = 0.5;
  this.xy_array = [];
  this.buildStartArray();
}

game.buildStartArray = function () {
  var ctx = this.ctx;

  for (i = 0; i <= ctx.gridheight; i++) {
    this.xy_array[i] = [];
    for (j = 0; j <= ctx.gridwidth; j++) {
      var seed = Math.random();
      if (seed < this._seed_propotion) {
        this.xy_array[i][j] = 1; //Living
      } else {
        this.xy_array[i][j] = 0; //Dead
      }
    }
  }
}

game.setupCanvas = function () {
  var ctx = this.ctx;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  // Determine blocksize so that grid is relatively small.
  // The size is arbitrary, but keeping it small helps performance
  ctx.blocksize = ctx.canvas.height / 100;
  var marginsize = ctx.blocksize*.1;
  ctx.shim = ctx.blocksize + marginsize;
  ctx.gridwidth = Math.round(ctx.canvas.width / ctx.blocksize);
  ctx.gridheight = Math.round(ctx.canvas.height / ctx.blocksize);
  // console.log(ctx.gridwidth, ctx.gridheight)
}


//// Game logic
// #countLiving, #ruleCheck

game.countLiving = function () {
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

game.ruleCheck = function () {
  var ctx = this.ctx;
  var xy_array = game.xy_array;
  var new_xy_array = [];

  // Loop through xy_array, calculating number of living
  // neighbors for each position.

  function countNeighbors(i, j) {
    var iabove = (i-1).mod(ctx.gridheight-1);
    var iabove = (i-1).mod(ctx.gridheight-1);
    var ibelow = (i+1).mod(ctx.gridheight-1);
    var jleft = (j-1).mod(ctx.gridwidth-1);
    var jright = (j+1).mod(ctx.gridwidth-1);

    var above = xy_array[iabove][j];
    var below = xy_array[ibelow][j];
    var right = xy_array[i][jright];
    var left = xy_array[i][jleft];
    var uleft = xy_array[iabove][jleft];
    var lleft = xy_array[ibelow][jleft];
    var uright = xy_array[iabove][jright];
    var lright = xy_array[ibelow][jright];
    return above + below + right + left + uleft + lleft + uright + lright;
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

game.resurrectCell = function (x,y) {
  this.xy_array[x][y] = 1;
}

game.resurrectAtPixel = function(x,y) {
  this.resurrectCell(this.pixelCordsToCellCoords(x,y));
}

game.pixelCordsToCellCoords = function (xpixel, ypixel) {
  return [xpixel.mod(this.ctx.shim), ypixel.mod(this.ctx.shim)];
}



//// Drawing and animation methods
// #draw, #clearScreen, #animation

game.draw = function () {
  var ctx = this.ctx;
  var that = this;
  var color = 'rgba(82, 192, 247, 0.8)'
  var living = this.countLiving(this.xy_array);

  function drawDot(i, j) {
    ctx.fillStyle = color;
    var yposition = i*ctx.shim;
    var xposition = j*ctx.shim;
    ctx.beginPath();
    ctx.arc(xposition, yposition, ctx.blocksize/2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 0;
  }

  function drawHeader() {
    ctx.fillStyle = 'rgba(82, 192, 247, 0.5)';
    ctx.fillRect(0, 2*ctx.shim, ctx.canvas.width, ctx.blocksize*3);
    ctx.fillStyle = 'rgba(100, 120, 120, 1)';
    ctx.font = '25pt Helvetica, Arial';
    ctx.fillText("Conway's Game of Life", 3*ctx.shim, 4*ctx.shim);
    ctx.font = '15pt Helvetica, Arial';
    ctx.fillText('alive: '+living+'  gen: '+that.generation, 0.8*ctx.canvas.width, 4*ctx.shim);
  }

  function isDead(i, j) {
    return game.xy_array[i][j] === 0;
  }

  for (i=0; i < ctx.gridheight; i++) {
    for (j=0; j < ctx.gridwidth; j++) {
      if (isDead(i, j)) {
        // Don't draw dead cells
        continue;
      } else {
        drawDot(i, j);
      }
    }
  }

  drawHeader();
}

game.clearScreen = function () {
  var canvas = this.canvas;
  this.ctx.clearRect(0, 0, canvas.width, canvas.height);
}

game.animation = function () {
  // Advance the game animation by one step.
  game.ruleCheck();
  game.clearScreen();
  game.draw();
  game.generation += 1;
}

game.startAnim = function () {
  window.setInterval(game.animation, 50);
}

game.setupCanvas();
game.setupGame();
game.startAnim();