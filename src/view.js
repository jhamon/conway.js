(function () {
  var GOL = window.GOL = (window.GOL || {});

  GOL.numPixels = 20000; // Smaller gives better performance.

  var View = GOL.View = function () {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.configure();

  }

  View.prototype.configure = function () {
    // Resize canvas element to fix screen.
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Compute a pixel size that should run smoothly 
    // in the browser.
    var pixelArea = window.innerWidth * window.innerHeight;
    this.pixelSize = Math.sqrt(pixelArea/GOL.numPixels)*0.9 | 0;
    this.pixelMargin = this.pixelSize * 0.1 | 0;
    this.dx = this.pixelSize + this.pixelMargin;

    // Compute needed data grid sizes
    this.gridHeight = window.innerHeight / this.pixelSize | 0 + 1;
    this.gridWidth = window.innerWidth / this.pixelSize | 0 + 1;
  };

  View.prototype.drawPixel = function (x, y, value) {
    var pixelX = this.dx * x;
    var pixelY = this.dx * y;
    this.ctx.fillStyle = value ? "#000000" : "#FFFFFF";
    this.ctx.fillRect(pixelX, pixelY, this.dx, this.dx);
  };


  v = new View();
  g = new GOL.Game(v.gridWidth, v.gridHeight);
  g.seed(0.3);

  function animate() {
    g.changeList.forEach( 
      function (pixel) { v.drawPixel(pixel[0], pixel[1], pixel[2]); }
    );
    g.tick();
    requestAnimationFrame(animate);
  }

  // window.setInterval(animate, 500);
  animate();
})(this);