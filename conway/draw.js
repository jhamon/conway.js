  //// Drawing and animation methods

(function (window) {
  var Game = window.Game = (window.Game || (function () {}));

  Game.prototype.draw = function () {
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

  Game.prototype.clearScreen = function () {
    var canvas = this.canvas;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  Game.prototype.animation = function () {
    // Advance the game animation by one step.
    if (this.paused) {
      this.clearScreen();
      this.draw();
    } else {
      this.ruleCheck();
      this.clearScreen();
      this.draw();
      this.generation += 1;
    }
  }

  Game.prototype.startAnim = function () {
    window.setInterval(this.animation.bind(this), 100);
  }
})(this);