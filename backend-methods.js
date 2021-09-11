const R = require("ramda");
let taken = require("./build/taken.json").taken;
let ids = [];
for (let i = 1; i < 7788; i++) ids.push(i);
exports.ids = () => ids;

function getAvailable() {
  let filteredIds= ids.filter((value) => {
    if (!taken.includes(value)) return value;
  });
  return filteredIds.sort();
}

function getTaken() {
  return taken.sort();
}

exports.getAvailable = getAvailable;
exports.getTaken = getTaken;
exports.makeAvailableList = function makeAvailableList() {
  const shuffled = getAvailable().sort(() => 0.5 - Math.random());
  return getAvailable().slice(0, 15).concat(shuffled.slice(0, 25));
};
