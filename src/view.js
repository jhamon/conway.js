'use strict';

(function () {
  var GOL = window.GOL = (window.GOL || {});

  var View = GOL.View = function () {
    this.canvas = document.getElementById('mycanvas');
    this.ctx = this.canvas.getContext('2d');
    this.configure();
  };

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

    this.numPixels = 10000; // Smaller gives better performance.
    this.calculatePixelSize();
    this.calculateGridSize();
    this.setupListeners();

    // Select a palette.
    this.palette = this.palettes[(Math.random() * this.palettes.length | 0)];

  };

  View.prototype.calculatePixelSize = function () {
    var pixelArea = window.innerWidth * window.innerHeight;
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
    this.calculatePixelSize()
    this.calculateGridSize()
    message.commandParams.x = this.gridWidth;
    message.commandParams.y = this.gridHeight;

    gameWorker.postMessage(message);
    this.clearView();
  };

  View.prototype.setupListeners = function () {
    $('#save').click(function () {
        window.open(v.canvas.toDataURL());
    });

    $('#pause').click(function () { 
      gameWorker.postMessage(Messages.pause);
    });

    $('#resume').click(function () { 
      gameWorker.postMessage(Messages.resume);
    });

    $('#seed_ratio').mouseup(this.processForm.bind(this));
    $('#speed').mouseup(this.processForm.bind(this));
    $('#size').mouseup(this.processForm.bind(this));
  };

  View.prototype.drawPixel = function (x, y, value) {
    var pixelX = this.dx * x;
    var pixelY = this.dx * y;
    this.ctx.fillStyle = value ? this.palette[0] : this.palette[1];
    this.ctx.fillRect(pixelX, pixelY, this.pixelSize, this.pixelSize);
  };

  View.prototype.clearView = function () {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  View.prototype.drawPixelPayload = function (payload) {
    payload.forEach( function (pixel) {
        v.drawPixel(pixel[0], pixel[1], pixel[2]);
    });
  }

  var v = new View();

  var gameWorker = new Worker('./src/gameWorker.js');

  // Messaging protocol
  //   POJO with any of the following.
  //      status: message to print to console.
  //      command: passing a function reference
  //      commandParams: object containing data for command.
  //      payload: raw data transfer. Assumed for pixel plotting.

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

    reset: {
      'command':'reset',
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
     },

     pause: {
      'command':'pause'
     },

     resume: {
      'command':'resume'
     }
   }; // end Messages

  gameWorker.addEventListener('message', function (e) {
    var status, payload;
    status = e.data.status;
    payload = e.data.payload;
    
    if (status !== undefined) console.log(status);
    if (payload !== undefined) v.drawPixelPayload(payload);
  }, false);

  gameWorker.postMessage(Messages.init);

})(this);