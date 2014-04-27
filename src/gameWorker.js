(function () {
  'use strict';

  var g;  
  var timerID;
  var interval;

  importScripts('./conway.js');
  importScripts('./set.js');

  function tock() {
    g.tick();
    self.postMessage({'payload': g.changedNodes});
  }

  function pause() {
    clearInterval(timerID);
  }

  function  resume() {
    timerID = setInterval(tock, interval);
  }

  function main(params) {
    var x = params.x; 
    var y = params.y;
    var seed = params.seed || 0.3;
    var interval = params.interval || 50;
    g = new LIFE.Game(x, y);
    // g.instrument();
    g.seed(seed);
    timerID = setInterval(tock, interval);
  }

  function processCommands (e) {
    var command = e.data.command;
    var commandParams = e.data.commandParams;

    switch (command) {
      case 'init':
        self.postMessage({'status': 'Game is starting now.'});
        main(commandParams);
        break;
      case 'modify':
        pause();
        main(commandParams);
        self.postMessage({'status': 'Game modified. Restarting.'});
        break;
    }
  }

  self.addEventListener('message', processCommands, false);

})();