describe("Conway's Game of Life", function () {
  var game;

  beforeEach(function () {
    game = new GOL.Game(10, 10);
  });

  it("Is contained in a global namespace", function () {
    expect(GOL).toBeDefined();
    expect(GOL.Game).toBeDefined();
  });

  it("represents the grid as a 2D array", function () {
    expect(game.grid).toBeDefined();
  });

  it("tracks a list of changed nodes", function () {
    expect(game.changeList).toBeDefined();
  });

  describe("The grid's limited public interface", function () {
    it("#isAlive(x,y) tells whether a node is alive", function () {
      expect(game.grid.isAlive(1,1)).toBeFalsy();
    });

    it("#setAlive sets a node to alive", function () {
      game.grid.setAlive(1,1);
      expect(game.grid.isAlive(1,1)).toBeTruthy();
    });

    it("#setDead(x,y) sets a node to dead", function () {
      game.grid.setAlive(1,1);
      game.grid.setDead(1,1);
      expect(game.grid.isAlive(1,1)).toBeFalsy();
    });

    it("#checkList is a list of coordinate pairs that need checking", function () {
      expect(game.grid.checkList).toBeDefined();
      expect(game.grid.checkList instanceof Array).toEqual(true);
    });

    it("hides initialization code and private methods", function () {
      expect(game.grid.initialization).not.toBeDefined();
    });
  });

  describe("Automata evolution rules", function () {
    it("should resurrect a dead cell with three neighbors", function () {
      game.grid.setAlive(1,1);
      game.grid.setAlive(1,2);
      game.grid.setAlive(1,3);
      expect(game.checkNode(0, 2)).toBeTruthy();
    });

    it("should kill lonely cells", function () {
      game.grid.setAlive(1,1);
      expect(game.checkNode(1,1)).toBeFalsy();
    })

    it("should kill overcrowded cells", function () {
      game.grid.setAlive(1,1);
      game.grid.setAlive(1,2);
      game.grid.setAlive(1,3);
      game.grid.setAlive(2,1);
      game.grid.setAlive(2,3);
      game.grid.setAlive(2,2);
      expect(game.checkNode(2,2)).toBeFalsy();
    })
  });
});