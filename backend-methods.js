const R = require("ramda");
let taken = require("./build/taken.json").taken;
let totalSupply = require("./build/meta.json").totalSupply;
let lastChecked = require("./build/meta.json").lastChecked;
exports.lastChecked = lastChecked;
exports.sortAlpha = sortAlpha = R.sortBy(R.identity);

let ids = [];
for (let i = 1; i < 7788; i++) ids.push(i);
exports.ids = () => ids;

function getAvailable() {
  return sortAlpha(
    ids.filter((value) => {
      if (!taken.includes(value)) return value;
    })
  );
}

function getTaken() {
  return sortAlpha(taken);
}

exports.getAvailable = getAvailable;

exports.getTaken = getTaken;

exports.makeAvailableList = function makeAvailableList() {
  const shuffled = getAvailable().sort(() => 0.5 - Math.random());
  return getAvailable().slice(0, 15).concat(shuffled.slice(0, 25));
};
