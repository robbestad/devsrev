const Web3 = require("web3");
const Contract = require("./build/Contract.abi.json");

let getAvailable = require("./backend-methods").getAvailable;
let sortAlpha = require("./backend-methods").sortAlpha;
let getTaken = require("./backend-methods").getTaken;
let lastChecked = require("./backend-methods").lastChecked;

let taken = getTaken();

const APIKEY = process.env.APIKEY;
const APISECRET = process.env.APISECRET;
const FROMADDRESS = process.env.FROMADDRESS;

const fs = require("fs");
const { makeAvailableList, getStartStop } = require("./backend-methods");
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://:${APISECRET}@mainnet.infura.io/v3/${APIKEY}`
  )
);
let contractABI = JSON.parse(Contract.result);
let MyContract = new web3.eth.Contract(
  contractABI,
  "0x25ed58c027921e14d86380ea2646e3a1b5c55a8b",
  { from: FROMADDRESS }
);

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

async function getSupply(id) {
  return new Promise((resolve, reject) => {
    MyContract.methods
      .totalSupply()
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

async function getOwner(id) {
  return new Promise((resolve, reject) => {
    MyContract.methods
      .ownerOf(id)
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

async function getOwnerByIndex(index) {
  console.log("calling getOwnerByIndex for ", index);
  return new Promise((resolve, reject) => {
    MyContract.methods
      .tokenByIndex(index)
      .call()
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

let totalSupply = 0;
let metaFile = "build/meta.json";
(async function () {
  await getSupply()
    .then((res) => {
      totalSupply = parseInt(res);
      fs.writeFile(
        metaFile,
        JSON.stringify({
          totalSupply: totalSupply,
          lastChecked: totalSupply,
          remaining: 7778 - totalSupply,
        }),
        "utf8",
        (err) => {
          if (err) {
            console.log(`Error writing ${metaFile} ${err}`);
          } else {
            console.log(`${metaFile} is written successfully`);
          }
        }
      );
    })
    .catch((err) => {
      console.error(`totalSupply ${err.message}`);
    });
  if (totalSupply > lastChecked) {
    let newTaken = [];
    let list = makeAvailableList({ start: lastChecked, stop: totalSupply });
    async function fetchTokenIds() {
      for (const value of list) {
        await getOwnerByIndex(value)
          .then((res) => {
            newTaken.push(parseInt(res, 10));
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    }

    await fetchTokenIds();
    console.log({ newTaken });
    taken = taken.concat(newTaken);

    const filteredTaken = taken.filter(unique);
    const data = JSON.stringify({ taken: sortAlpha(filteredTaken) });
    fs.writeFile("build/taken.json", data, "utf8", (err) => {
      if (err) {
        console.log(`Error writing file: ${err}`);
      } else {
        console.log(`File is written successfully to build/taken.json`);
      }
    });
  }
})();
