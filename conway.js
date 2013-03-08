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
  ctx.font = '40pt Arial';
  // Determine blocksize so that grid is 40 blocks tall
  // this size is arbitrary, but keeping it small helps performance
  ctx.blocksize = ctx.canvas.height / 40; 
  var marginsize = ctx.blocksize*.1;
  ctx.shim = ctx.blocksize + marginsize;
  ctx.gridwidth = Math.round(ctx.canvas.width / ctx.blocksize);
  ctx.gridheight = Math.round(ctx.canvas.height / ctx.blocksize);
  console.log(ctx.gridwidth, ctx.gridheight)
}

var game = {};
function gameInit() {
  game.seed_propotion = 0.3;
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
  for (i = 0; i <= ctx.gridwidth; i++) {
    new_xy_array[i] = [];
  for (j = 0; j <= ctx.gridheight; j++) {
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
      
      if (i == 0 && j==0) {
        console.log("index a b l r", iabove, ibelow, jleft, jright);
        console.log(i, j, 'n:',neighbours, 'above:', above, 'below:', below);
        console.log("uleft, uright:", uleft, uright);
        console.log("lleft, lright:", lleft, lright);
        console.log("left, right", left, right);
      }


  // Any live cell with fewer than two live neighbours dies, as if caused by under-population.
  if (neighbours < 2) {
    new_xy_array[i][j] = 0;
  }

  // Any live cell with more than three live neighbours dies, as if by overcrowding.
  if (neighbours > 4) {
    new_xy_array[i][j] = 0;
  }

  // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  if (!game.xy_array[i][j] && neighbours == 3) {
    new_xy_array[i][j] = 1;
  }
    }
  }
  // game.xy_array = new_xy_array;
}

function Draw () {
  var colors = ['white', 'rgba(82, 192, 247, 0.4)']
    for (i=0; i < ctx.gridheight; i++) {
      for (j=0; j < ctx.gridwidth; j++) {
    var opacity = String(Math.random()*0.6);
    ctx.fillStyle = colors[game.xy_array[i][j]];
    if (i == 0 && j == 0) {
      ctx.fillStyle = 'red'
    }
    var yposition = i*ctx.shim;
    var xposition = j*ctx.shim;
    ctx.fillRect(xposition, yposition, ctx.blocksize, ctx.blocksize);
  }
  }
  ctx.fillStyle = 'rgba(82, 192, 247, 1)';
  ctx.fillText("Conway's Game of Life", 3*ctx.shim, 4*ctx.shim);
}

function Clear () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function Animation () {
  // RuleCheck();
  Clear();
  Draw();
}

Init();
var game = {};
gameInit();

window.setInterval(Animation(), 100)

