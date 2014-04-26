(function () {
  var g;  
  var timerID;

  importScripts('./conway.js');
  importScripts('./set.js');

  function tock() {
    g.tick();
    self.postMessage({'payload': g.changedNodes});
  }

  function main(params) {
    var x = params.x; 
    var y = params.y;
    var seed = params.seed || 0.3;
    var interval = params.interval || 50;
    g = new GOL.Game(x, y);
    // g.instrument();
    g.seed(seed);
    timerID = setInterval(tock, interval);
  }

  self.addEventListener('message', 
    function(e) {
      var status, command, payload, commandParams;
      command = e.data.command;
      commandParams = e.data.commandParams;

      if (command === 'init') {
        self.postMessage({'status': 'game is starting now.'});
        main(commandParams);
      }
    }, false);
})();