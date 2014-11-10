'use strict';

(function () {
  var LIFE = window.LIFE = (window.LIFE || {});

  var View = LIFE.View = function () {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.configure();
  };

  View.prototype.palettes = LIFE.palettes;

  View.prototype.configure = function () {
    // Resize canvas element to fix screen.
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.numPixels = 10000; // Smaller gives better performance.
    this.calculatePixelSize();
    this.calculateGridSize();
    this.setupListeners();

    // Select a palette and fill the background color.
    this.palette = this.palettes[(Math.random() * this.palettes.length | 0)];
    this.clearView();
  };

  View.prototype.clearView = function () {
    this.ctx.fillStyle = this.palette[1];
    this.ctx.fillRect(0, 0, this.width, this.height);
  };

  View.prototype.calculatePixelSize = function () {
    var pixelArea = this.width * this.height;
    this.pixelSize = Math.sqrt(pixelArea/this.numPixels)*0.9 | 0;
    this.pixelMargin = 0;  // (this.pixelSize * 0.2) | 0;
    this.dx = this.pixelSize + this.pixelMargin;
  };

  View.prototype.calculateGridSize = function () {
    this.gridHeight = window.innerHeight / this.pixelSize | 0 + 1;
    this.gridWidth = window.innerWidth / this.pixelSize | 0 + 1;
  };

  View.prototype.processForm = function () {
    var message = Messages.modify;
    message.commandParams.seed = $('#seed_ratio').val();
    message.commandParams.interval = $('#speed').val();
    this.numPixels = $('#size').val();
    this.calculatePixelSize();
    this.calculateGridSize();
    message.commandParams.x = this.gridWidth;
    message.commandParams.y = this.gridHeight;
    gameWorker.postMessage(message);
  };

  View.prototype.setupListeners = function () {
    $('#save').click(function () {
        window.open(v.canvas.toDataURL());
    });

    $('#refresh').click(function () { 
      location.reload();
    });

    $('#seed_ratio').mouseup(this.processForm.bind(this));
    $('#speed').mouseup(this.processForm.bind(this));
    $('#size').mouseup(this.processForm.bind(this));
  };

  View.prototype.drawPixel = function (x, y, alive) {
    var pixelX = this.dx * x;
    var pixelY = this.dx * y;
    this.ctx.fillStyle = alive ? this.palette[0] : this.palette[1];
    this.ctx.fillRect(pixelX, pixelY, this.pixelSize, this.pixelSize);
  };

  View.prototype.drawPixelPayload = function (payload) {
    payload.forEach( function (pixel) {
        v.drawPixel(pixel[0], pixel[1], pixel[2]);
    });
  }

  var v = new View();

  var gameWorker = new Worker('./src/gameWorker.js');

  var Messages = {
    init: {
      'command':'init',
      'commandParams': 
        {
          'x': v.gridWidth, 
          'y': v.gridHeight,
          'interval': 50,
          'seed': 0.3
        }
    },

     modify: {
      'command':'modify',
      'commandParams': {}
     }
   }; // end Messages

  gameWorker.addEventListener('message', function (e) {
    var status, payload;
    status = e.data.status;
    payload = e.data.payload;
    
    if (status === 'clear') v.clearView();
    if (payload !== undefined) v.drawPixelPayload(payload);
  }, false);

  gameWorker.postMessage(Messages.init);
})(this);
