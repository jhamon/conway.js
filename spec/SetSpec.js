describe("Set", function () {
  var set;

  beforeEach(function () {
    set = new Set();
  });

  describe("#add(number)", function () {
    it("puts new elements in the set", function () {
      set.add(5);
      set.add(7);
      set.add(6);
      expect(set.includes(6)).toEqual(true);
      expect(set.includes(10)).toEqual(false);
    });

    it("does not duplicate elements", function () {
      set.add(5);
      set.add(5);
      set.add(5);
    });

    it("understands arrays", function () {
      set.add([2,3]);
      expect(set.values()[0][0]).toEqual(2);
      expect(set.includes([2,3])).toEqual(true);
    });
  });

  describe("#includes(number)", function () {
    it("returns true if an element is in a set", function () {
      set.add(5);
      expect(set.includes(5)).toEqual(true);
    });

    it("returns false if an element is not in a set", function () {
      set.add(5);
      expect(set.includes(10)).toEqual(false);
    });
  });

  describe("#remove(num)", function () {
    it("removes a number from the set", function () {
      set.add(5);
      set.remove(5);
      expect(set.includes(5)).toEqual(false);
    });

    it("does nothing when called on the empty set", function () {
      expect(set.remove(5).values()).toEqual([]);
    });

    it("understands arrays", function () {
      set.add([2,3]);
      set.remove([2,3]);
      expect(set.includes([2,3])).toEqual(false);
    });

  });

  describe("#pop", function () {
    it("returns and removes a value from the set", function () {
      set.add(2);
      expect(set.pop()).toEqual([2]);
    });

    it("does nothing when the set is empty", function () {
      expect(set.pop()).toBeUndefined();
    });
  })

  describe("#values", function () {
    it("returns an array of values in the set", function () {
      set.add(5);
      set.add(6);
      set.add(6);
      expect(set.values()[0]).toEqual([5]);
      expect(set.values()[1]).toEqual([6]);
    });
  });
})