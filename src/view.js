(function () {
  var GOL = window.GOL = (window.GOL || {});

  GOL.numPixels = 5000; // Smaller gives better performance.

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
    this.ctx.fillStyle = value ? "#44A437" : "#081017";
    this.ctx.fillRect(pixelX, pixelY, this.dx, this.dx);
  };

  v = new View();

  var gameWorker = new Worker('./src/conway.js');

  gameWorker.addEventListener('message', function (e) {
    var changePixels = e.data;
    if (Object.prototype.toString.apply(changePixels) === '[object Array]') {
      changePixels.forEach( function (pixel) {
        v.drawPixel(pixel[0], pixel[1], pixel[2]);
      });
    }
  }, false);

  gameWorker.postMessage({
    'command':'init', 
    x: v.gridWidth,
    y: v.gridHeight
  })

})(this);
