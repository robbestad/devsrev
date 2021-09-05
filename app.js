var found=false;
var taken = [];
function checkOwnerOf(tokenId){
	web3.eth.getAccounts(function (error, accounts) {
		if (error) {
			console.log(error);
		}
		var account = accounts[0];
		console.log("checking owner", account, tokenId)
		web3.eth.defaultAccount = accounts[0];
		App.myContractInstance.ownerOf.call(tokenId, {
			from: account
		}, function (error, result) {
			found = !result;
			console.log({found, error, result});
		})
	})
}
App = {
	web3Provider: null,
	contracts: {},
	myContractInstance: null,
	tokenId: 236,
	init: async function () {
		$("#tokenid").val(App.tokenId);
		return await App.initWeb3();
	}, initWeb3: async function () {
		//----
		// Modern dapp browsers...
		if (window.ethereum) {
			App.web3Provider = window.ethereum;
			try {
				// Request account access
				await window.ethereum.enable();
			} catch (error) {
				// User denied account access...
				console.error(error)
			}
		}
		web3 = new Web3(App.web3Provider);
		return App.initContract();
	}, initContract: function () {
		//----
		$.getJSON("./Contract.abi.json", function (data) {
			var contractABI = "";
			contractABI = JSON.parse(data.result);
			if (contractABI !== "") {
				var MyContract = web3.eth.contract(contractABI);
				App.myContractInstance = MyContract.at("0x25ed58c027921e14d86380ea2646e3a1b5c55a8b");
			} else {
				console.error("Unhandled error");
			}
		});
		return App.bindEvents();
	},
	bindEvents: function () {
		$(document).on("click", ".btn-ownerof", App.handleOwnerOf);
	},

	handleOwnerOf: function (event) {
		event.preventDefault();
		found=false;
		App.tokenId = parseInt($("#tokenid").val());
		checkOwnerOf(App.tokenId);
		if(!found){
			$("#result").html("Token ID: " + App.tokenId + " is not available");
			taken.push(App.tokenId);
			App.tokenId = App.tokenId + 1;
			$("#tokenid").val(App.tokenId);
		}
		if(found){
			$("#result").html("Token ID: " + App.tokenId + " is available");
			$("#error").html(error.message);
			clearInterval(this);
			clearInterval(ownerInterval);
		}
/*
		var ownerInterval = setInterval(function(){
			if(!found) checkOwnerOf(App.tokenId);
			if(!found){
				$("#result").html("Token ID: " + App.tokenId + " is not available");
				taken.push(App.tokenId);
				App.tokenId = App.tokenId + 1;
				$("#tokenid").val(App.tokenId);
			}
			if(found){
				$("#result").html("Token ID: " + App.tokenId + " is available");
				$("#error").html(error.message);
				clearInterval(this);
				clearInterval(ownerInterval);
			}
		},5000);
*/
	}
};

$(function () {
	$(window).load(function () {
		App.init();
	});
});

