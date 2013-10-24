var game = new Game();
game.setupCanvas();
game.setupGame();
game.startAnim();

$(document).mousedown(function(event) {
  if (game.paused) {
    game.drawable = true;
    $(document).mousemove(function(event) {
      game.editAtPixel(event.pageX, event.pageY);
    })
  }
});

$(document).mouseup(function(event) {
  if (game.paused) {
    game.editAtPixel(event.pageX, event.pageY);
    game.drawable = false;
  }
});

$(document).keydown(function(event) {
  console.log("A key was pressed: " + event.keyCode);
  if (event.keyCode == 32) {
    // spacebar pressed
    game.togglePause();
  }

  if (event.keyCode == 68) {
    // "d" was pressed
    game.toggleEraser();
  }
});

$("#speed").mouseup(function (event) {
  game.setFrameRate($("#speed").val());
});