function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function notInTaken(value, index, self) {
  return !uniqueTaken.includes(value);
}

var uniqueTaken = taken.filter(unique);
var availableIds = ids.filter(notInTaken);

App = {
  web3Provider: null,
  contracts: {},
  myContractInstance: null,
  init: async function () {
    return App.bindEvents();
  },
  bindEvents: function () {
    $(document).on(
      "click",
      ".btn-ownerof-first",
      App.handlePrintFirstAvailable
    );
    $(document).on("click", ".btn-find", App.handleFindClosest);
  },

  handlePrintFirstAvailable(event) {
    event.preventDefault();
    fetch("./taken.json", { cache: "no-cache" })
      .then((data) => data.json())
      .then((data) => {
        taken = data.taken;
        uniqueTaken = taken.filter(unique);
        availableIds = ids.filter(notInTaken);
        let sumLeft = 7787 - taken.length;
        var available = availableIds.filter(notInTaken);
        var list = available.filter((i, idx) => idx < 20);
        $("#result").html("Here are some suggestions:<br/> " + list.join(", "));
      });
  },

  handleFindClosest(event) {
    event.preventDefault();
    fetch("./taken.json")
      .then((data) => data.json())
      .then((data) => {
        taken = data.taken;
        uniqueTaken = taken.filter(unique);
        availableIds = ids.filter(notInTaken);
        let available = availableIds.filter(notInTaken);
        let goal = $(".tokenidinput").val() || 1;
        let closest = available.reduce(function (prev, curr) {
          return Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev;
        });
        $("#resultclosest").html(
          "The closest claimable token ID to " + goal + " is " + closest
        );
      });
  },
};

$(function () {
  $(window).load(function () {
    App.init();

    fetch("./meta.json")
      .then((data) => data.json())
      .then((data) => {
        $("#totalsupply").html(`Remaining tokens: ${data.remaining}`);
      });
  });
});
