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
    fetch(
      "https://raw.githubusercontent.com/svenanders/devsrev/main/build/taken.json",
      { cache: "no-cache" }
    )
      .then((data) => data.json())
      .then((data) => {
        taken = data.taken;
        let sumLeft = 7787 - taken.length;
        uniqueTaken = taken.filter(unique);
        availableIds = ids.filter(notInTaken);
        var available = availableIds.filter(notInTaken);
        var list = available.filter((i, idx) => idx < 20);
        $("#result").html(
          "There are " +
            sumLeft +
            " tokens left to claim. Here are some suggestions:<br/> " +
            list.join(", ")
        );
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
        let goal = $(".tokenidinput").val();
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
  });
});
