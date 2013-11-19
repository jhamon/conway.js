//// Setup/config functions.
(function (window) {
  var Game = window.Game = (window.Game || (function (){}));
  Game.prototype.setupGame = function () {
      this.generation = 0;
      this.paused = false;
      this.drawable = false;
      this.erase = false;
      this.rule1 = true;
      this.rule2 = true;
      this.rule3 = true;

      // Seed proportion is the percent of cells
      // that are initially living.
      this._seed_propotion = 0.50;
      this.xy_array = [];
      this.buildStartArray();
    }

    Game.prototype.buildStartArray = function () {
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

    Game.prototype.setupCanvas = function () {
      this.canvas = document.getElementById('mycanvas');
      this.ctx = this.canvas.getContext('2d');

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
    }
})(this);
