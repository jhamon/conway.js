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


var canvas = document.getElementById('mycanvas');
var ctx = canvas.getContext('2d');

Number.prototype.mod = function(n) {
return ((this%n)+n)%n;
}

function Init() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  // Determine blocksize so that grid is 40 blocks tall
  // this size is arbitrary, but keeping it small helps performance
  ctx.blocksize = ctx.canvas.height / 50; 
  var marginsize = ctx.blocksize*.1;
  ctx.shim = ctx.blocksize + marginsize;
  ctx.gridwidth = Math.round(ctx.canvas.width / ctx.blocksize);
  ctx.gridheight = Math.round(ctx.canvas.height / ctx.blocksize);
  // console.log(ctx.gridwidth, ctx.gridheight)
}

function countLiving(gamearray) {
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

var game = {};
function gameInit() {
  game.seed_propotion = 0.5;
  game.xy_array = [];
  for (i = 0; i <= ctx.gridheight; i++) {
    game.xy_array[i] = [];
  for (j = 0; j <= ctx.gridwidth; j++) {
      var seed = Math.random();
      if (seed < game.seed_propotion) {
        game.xy_array[i][j] = 1;
      } else {
        game.xy_array[i][j] = 0;
      }
    }
  }
  console.log(game);
}


function RuleCheck () {
  var new_xy_array = [];
  for (i = 0; i <= ctx.gridheight; i++) {
    new_xy_array[i] = [];
  for (j = 0; j <= ctx.gridwidth; j++) {
    new_xy_array[i][j] = game.xy_array[i][j];
      var iabove = (i-1).mod(ctx.gridheight-1);
      var ibelow = (i+1).mod(ctx.gridheight-1);
      var jleft = (j-1).mod(ctx.gridwidth-1);
      var jright = (j+1).mod(ctx.gridwidth-1);

      var above = game.xy_array[iabove][j];
      var below = game.xy_array[ibelow][j];
      var right = game.xy_array[i][jright];
      var left = game.xy_array[i][jleft]; 
      var uleft = game.xy_array[iabove][jleft];
      var lleft = game.xy_array[ibelow][jleft]; 
      var uright = game.xy_array[iabove][jright]; 
      var lright = game.xy_array[ibelow][jright];
      var neighbours = above + below + right + left + uleft + lleft + uright + lright;

  // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  if (neighbours < 2) {
    new_xy_array[i][j] = 0;
  }

  // Any live cell with more than three live neighbours dies, as if by overcrowding.
  if (neighbours > 3) {
    new_xy_array[i][j] = 0;
  }

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  if (!game.xy_array[i][j] && neighbours == 3) {
    new_xy_array[i][j] = 1;
  }
}
}
  // Update game state to reflect outcome of rule applications
  game.xy_array = new_xy_array;
}

function Draw () {
  var colors = ['white', 'rgba(82, 192, 247, 0.8)']
    for (i=0; i < ctx.gridheight; i++) {
      for (j=0; j < ctx.gridwidth; j++) {
    ctx.fillStyle = colors[game.xy_array[i][j]];
    var yposition = i*ctx.shim;
    var xposition = j*ctx.shim;
    // ctx.fillRect(xposition, yposition, ctx.blocksize, ctx.blocksize);
    ctx.beginPath();
    ctx.arc(xposition, yposition, ctx.blocksize/2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.lineWidth = 0;
  }
  }
  ctx.fillStyle = 'rgba(82, 192, 247, 0.5)';
  ctx.fillRect(0, 2*ctx.shim, ctx.canvas.width, ctx.blocksize*5);
  ctx.fillStyle = 'rgba(100, 120, 120, 1)';
  ctx.font = '25pt Helvetica, Arial';
  ctx.fillText("Conway's Game of Life", 3*ctx.shim, 4*ctx.shim);
  var living = countLiving(game.xy_array);
  ctx.font = '15pt Helvetica, Arial';
  ctx.fillText('using HTML5 canvas + javascript', 5*ctx.shim, 6*ctx.shim);
  ctx.fillText('alive: '+living+'  gen: '+generation, 0.8*ctx.canvas.width, 6*ctx.shim);
}

function Clear () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function Animation () {
  RuleCheck();
  Clear();
  Draw();
  generation += 1;
}

function startAnim() {
  window.setInterval(Animation, 100);
}

Init();
var game = {};
gameInit();
var generation = 0;
startAnim()

