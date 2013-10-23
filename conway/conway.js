//// Game setup:
// #setupGame, #setupCanvas, #buildStartArray

game = {};
game.canvas = document.getElementById('mycanvas');
game.ctx = game.canvas.getContext('2d');

Number.prototype.myMod = function(n) {
  // This somewhat wat-worthy function is what
  // allows cordinate wrapping from at the edges
  // of the grid.
  return ((this%n)+n)%n;
}

game.setupGame = function () {
  this.generation = 0;
  this.paused = false;
  this.drawable = false;
  this.erase = false;

  // Seed proportion is the percent of cells
  // that are initially living.
  this._seed_propotion = 0.50;
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
  ctx.blocksize = ctx.canvas.height / 70;
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

game.editCell = function (x,y) {
  if (game.drawable && !game.erase) {
    game.xy_array[x][y] = 1;
  } else if (game.drawable && game.erase) {
    game.xy_array[x][y] = 0;
  }
}

game.gliderAtXY = function (x,y) {
  game.xy_array[x-1][y+1] = 1;
  game.xy_array[x][y+1] = 1;
  game.xy_array[x+1][y+1] = 1;
  game.xy_array[x+1][y] = 1;
  game.xy_array[x][y-1] = 1;
}

game.editAtPixel = function(x,y) {
  cell_coords = this.pixelCordsToCellCoords(x,y)
  this.editCell(cell_coords.x, cell_coords.y);
}

game.pixelCordsToCellCoords = function (xpixel, ypixel) {
  return  {y: Math.floor(xpixel/this.ctx.shim),
           x: Math.floor(ypixel/this.ctx.shim)+1};
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
  if (game.paused) {
    game.clearScreen();
    game.draw();
  } else {
    game.ruleCheck();
    game.clearScreen();
    game.draw();
    game.generation += 1;
  }
}

game.startAnim = function () {
  window.setInterval(game.animation, 100);
}

game.togglePause = function () {
  this.paused = !this.paused;
}

game.toggleEraser = function () {
  this.erase = !this.erase;
}

game.setupCanvas();
game.setupGame();
game.startAnim();

$(document).mousedown(function(event) {
  if (game.paused) {
    game.drawable = true;
    $(document).mousemove(function(event) {
      game.editAtPixel(event.pageX, event.pageY);
    })
  }
});

$(document).mouseup(function(event) {
  if (game.paused) {
    game.editAtPixel(event.pageX, event.pageY);
    game.editAtPixel(event.pageX, event.pageY);
    game.drawable = false;
  }
});

$(document).keydown(function(event) {
  console.log("A key was pressed: " + event.keyCode);
  if (event.keyCode == 32) {
    game.togglePause();
  }

  if (event.keyCode == 68) {
    // "d" was pressed
    game.toggleEraser();
  }
});