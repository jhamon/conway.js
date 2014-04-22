(function () {
  var GOL = window.GOL = (window.GOL || {});

  GOL.numPixels = 4000; // Smaller gives better performance.

  var View = GOL.View = function () {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.configure();
  }

  View.prototype.palettes = [
    ['#44A437', '#081017'], // my original
    ['#081017', '#44A437'], // my original
    // Nice palettes from colourlovers.com:
    ['#003A54', '#325D6F'], // Dawn Watch
    ['#325D6F', '#003A54'], // Dawn Watch
    ['#FFF700', '#004E72'], // The Last Summer
    ['#004E72', '#FFF700'], // The Last Summer
    ['#80B31A', '#082A3A'], // Phone Never Answer
    ['#082A3A', '#80B31A'], // Phone Never Answer
    ['#1CB4FA', '#FF0022'], // Friendship
    ['#FF0022', '#1CB4FA'], // Friendship
    ['#242004', '#009E77'], // Clementine Gozmin
    ['#009E77', '#242004'], // Clementine Gozmin
    ['#FF3434', '#C8D319'], // Sad
    ['#C8D319', '#FF3434'], // Sad
    ['#6B07C7', '#D3D0D6'], // Planet Industry
    ['#D3D0D6', '#6B07C7']  // Planet Industry
  ];

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

    // Select a palette.
    this.palette = this.palettes[(Math.random() * this.palettes.length | 0)];

  };

  View.prototype.drawPixel = function (x, y, value) {
    var pixelX = this.dx * x;
    var pixelY = this.dx * y;
    this.ctx.fillStyle = value ? this.palette[0] : this.palette[1];
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
  });

})(this);
