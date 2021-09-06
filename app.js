var found = false;

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

function notInTaken(value, index, self) {
  return !uniqueTaken.includes(value);
}

var uniqueTaken = taken.filter(unique);
var filteredIds = ids.filter(notInTaken);

function checkOwnerOf(tokenId) {
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.log(error);
    }
    console.log("checking owner for token", tokenId);
    web3.eth.defaultAccount = accounts[0];
    App.myContractInstance.ownerOf.call(tokenId, function (error, result) {
      if (!result) {
        console.log("available", tokenId);
      } else {
        taken.push(tokenId);
      }
      console.debug({ result });
    });
  });
}

App = {
  web3Provider: new Web3.providers.HttpProvider(
    "//mainnet.infura.io/v3/1805162848e74943a7f3653322ec5d22"
  ),
  contracts: {},
  myContractInstance: null,
  tokenId: taken[taken.length - 1],
  init: async function () {
    $("#tokenid").val(App.tokenId);
    return await App.initWeb3();
  },
  initWeb3: async function () {
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },
  initContract: function () {
    $.getJSON("./Contract.abi.json", function (data) {
      var contractABI = "";
      contractABI = JSON.parse(data.result);
      if (contractABI !== "") {
        var MyContract = web3.eth.contract(contractABI);
        App.myContractInstance = MyContract.at(
          "0x25ed58c027921e14d86380ea2646e3a1b5c55a8b"
        );
      } else {
        console.error("Unhandled error");
      }
    });
    return App.bindEvents();
  },
  bindEvents: function () {
    $(document).on("click", ".btn-ownerof", App.handleOwnerOf);
    $(document).on("click", ".btn-print", App.handlePrint);
    $(document).on("click", ".btn-ownerof-first", App.handleFirstOwnerOf);
  },

  handleFirstOwnerOf(event) {
    event.preventDefault();
    fetch(
      "https://raw.githubusercontent.com/svenanders/devsrev/main/taken.json"
    )
      .then((data) => data.json())
      .then((data) => {
        taken = data.taken;
        console.log("dl taken");
        uniqueTaken = taken.filter(unique);
        filteredIds = ids.filter(notInTaken);
        var available = filteredIds.filter(notInTaken);
        var list = available.filter((i, idx) => idx < 10);
        $("#result").html("Token IDs: " + list.join(", ") + " are claimable");
      });
  },
  handlePrint(event) {
    event.preventDefault();
    console.log(taken.filter(unique));
  },

  handleOwnerOf: function (event) {
    event.preventDefault();
    found = false;
    App.tokenId = parseInt($("#tokenid").val());
    var ownerInterval = setInterval(function () {
      if (!found) checkOwnerOf(App.tokenId);
      if (!found) {
        //$("#result").html("Token ID: " + App.tokenId + " is not available");
        //$("#tokenid").val(App.tokenId);
      }
      if (found) {
        //$("#result").html("Token ID: " + available[available.length - 1] + " is available");
        clearInterval(this);
        clearInterval(ownerInterval);
      }
      App.tokenId = App.tokenId + 1;
    }, 350);
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
