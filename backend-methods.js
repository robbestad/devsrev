const R = require("ramda");
let taken = require("./build/taken.json").taken;
let ids = [];
for (let i = 1; i < 7788; i++) ids.push(i);
exports.ids = () => ids;

function getAvailable() {
  return ids.filter((value) => {
    if (!taken.includes(value)) return value;
  });
}

function getTaken() {
  return taken;
}

exports.getAvailable = getAvailable;
exports.getTaken = getTaken;
exports.makeAvailableList = function makeAvailableList() {
  const shuffled = getAvailable().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 250);
};
