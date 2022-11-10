const randomWords = require("random-words");
const crypto = require("crypto");
const fs = require("fs");

const NUM_WALLETS = process.argv[2] || 10;
console.log(
  "Generating " +
    NUM_WALLETS +
    " wallets... (you can change the number of wallets by passing a number as an argument)"
);

function randomPhrase(min, max) {
  return randomWords({
    min: min,
    max: max,
    join: " ",
    formatter: (word) => word.charAt(0).toUpperCase() + word.slice(1),
  });
}

function randomUrl() {
  return (
    "https://" +
    randomWords({
      min: 1,
      max: 3,
      join: ".",
    }) +
    ".com" +
    "/" +
    randomWords({
      min: 1,
      max: 3,
      join: "/",
    })
  );
}

function randomEthereumAddress() {
  return "0x" + crypto.randomBytes(20).toString("hex");
}

function nameToSymbol(name) {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

const name = randomPhrase(2, 3);
const description = randomPhrase(10, 15);
const logoUrl = randomUrl();
const claimUrl = randomUrl();
const symbol = nameToSymbol(name);
const addresses = {};

for (let i = 0; i < NUM_WALLETS; i++) {
  addresses[randomEthereumAddress()] = Math.floor(Math.random() * 1000);
}

const token = {
  name,
  description,
  logoUrl,
  claimUrl,
  symbol,
  addresses,
};

fs.writeFileSync("./randomToken.json", JSON.stringify(token, null, 2));
