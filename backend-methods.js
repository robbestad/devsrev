const R = require("ramda");
let taken = require("./build/taken.json").taken;
exports.sortAlpha = sortAlpha = R.sortBy(R.identity);

let ids = [];
for (let i = 1; i < 7788; i++) ids.push(i);
exports.ids = () => ids;

function getAvailable() {
  return sortAlpha(ids.filter((value) => {
    if (!taken.includes(value)) return value;
  }));
}

function getTaken() {
  return sortAlpha(taken);
}

exports.getAvailable = getAvailable;

exports.getTaken = getTaken;

exports.makeAvailableList = function makeAvailableList() {
  return getAvailable().sort(() => 0.5 - Math.random()).slice(0, 5).concat(shuffled.slice(0, 35));
};
