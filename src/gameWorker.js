(function () {
  var g;  
  importScripts('./conway.js');
  importScripts('./set.js');
  console.log('inside worker')

  function tock() {
    g.tick();
    self.postMessage({'payload': g.changedNodes});
  }

  function main(x, y) {
    console.log('inside main')
    g = new GOL.Game(x, y);
    g.instrument();
    g.seed(0.3);
    setInterval(tock, 100);
  }

  self.addEventListener('message', 
    function(e) {
      var status, command, payload, commandParams;
      command = e.data.command;
      commandParams = e.data.commandParams;

      if (command === 'init') {
        self.postMessage({'status': 'game is starting now.'});
        main(commandParams.x, commandParams.y);
      }
    }, false);
})();