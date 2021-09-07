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
  return getAvailable().slice(0, 25);
};
