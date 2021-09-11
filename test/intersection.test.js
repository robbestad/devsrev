var chai = require("chai");
var expect = chai.expect;
var R = require("ramda");
var getAvailable = require("../backend-methods").getAvailable;
var getTaken = require("../backend-methods").getTaken;
var makeAvailableList = require("../backend-methods").makeAvailableList;
var ids = require("../backend-methods").ids;

describe("Token locator", function () {
  describe("Available tokens", function () {
    it("should not return taken", function () {
      expect(getAvailable()).to.be.an("array").that.does.not.include(300);
    });
    it("ids", function () {
      expect(ids()).to.be.an("array").of.length(7787);
    });
    it("should not return taken", function () {
      expect(getTaken()).to.be.an("array").that.include(493);
    });
    it("should create a short loop list", function () {
      let lastChecked = 101;
      let totalSupply = 102;
      let checkList = makeAvailableList({
        start: lastChecked,
        stop: totalSupply,
      });
      expect(checkList).to.be.an("array").of.length(1);
    });
    it("should create a large loop list", function () {
      let lastChecked = 100;
      let totalSupply = 200;
      let checkList = makeAvailableList({
        start: lastChecked,
        stop: totalSupply,
      });
      expect(checkList).to.be.an("array").of.length(100);
    });
    it("should sort taken list", function () {
      let taken = getTaken();
      expect(taken[1]).to.eql(2);
    });
  });
});
