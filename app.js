function unique(value, index, self) {
  return self.indexOf(value) === index;
}
function notInTaken(value, index, self) {
  return !uniqueTaken.includes(value);
}
var uniqueTaken = taken.filter(unique);
var availableIds = ids.filter(notInTaken);

function checkOwnerOf(tokenId) {
  web3.eth.getAccounts(function (error, accounts) {
    if (error) {
      console.error(error);
    }
    console.debug("checking owner for token", tokenId);
    web3.eth.defaultAccount = accounts[0];
    App.myContractInstance.ownerOf.call(tokenId, function (error, result) {
      if (!result) {
        console.debug("available", tokenId);
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
    //$(document).on("click", ".btn-ownerof", App.handleOwnerOfAll);
    $(document).on("click", ".btn-ownerof", App.handleOwnerOfDelta);
    $(document).on("click", ".btn-print", App.handlePrint);
    $(document).on("click", ".btn-ownerof-first", App.handlePrintFirstAvailable);
  },

  handlePrintFirstAvailable(event) {
    event.preventDefault();
	/*  uniqueTaken = taken.filter(unique);
	  availableIds = ids.filter(notInTaken);
	  var available = availableIds.filter(notInTaken);
	  var list = available.filter((i, idx) => idx < 10);
	  $("#result").html("Token IDs: " + list.join(", ") + " are claimable");
*/
    fetch(
      "https://raw.githubusercontent.com/svenanders/devsrev/main/taken.json"
    )
      .then((data) => data.json())
      .then((data) => {
        taken = data.taken;
        uniqueTaken = taken.filter(unique);
        availableIds = ids.filter(notInTaken);
        var available = availableIds.filter(notInTaken);
        var list = available.filter((i, idx) => idx < 10);
        $("#result").html("Token IDs: " + list.join(", ") + " are claimable");
      });
  },
  handlePrint(event) {
    event.preventDefault();
    console.log(taken.filter(unique));
  },

  handleOwnerOfAll: function (event) {
    event.preventDefault();
    App.tokenId = parseInt($("#tokenid").val());
    let ownerInterval = setInterval(function () {
      if (!found) checkOwnerOf(App.tokenId);
      if (found) {
        clearInterval(this);
        clearInterval(ownerInterval);
      }
      App.tokenId = App.tokenId + 1;
    }, 350);
  },

  handleOwnerOfDelta: function (event) {
    event.preventDefault();
    let idx=0;
	  uniqueTaken = taken.filter(unique);
	  availableIds = ids.filter(notInTaken);

	  let ownerInterval = setInterval(()=>{
	    tokenToCheck = availableIds[idx];
	    checkOwnerOf(tokenToCheck);
	    idx++;
	    if(idx===10){
		    clearInterval(this);
		    clearInterval(ownerInterval);
	    }
    },500)
  },
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
