const fs = require('fs');
const web3Utils = require('web3-utils');
// const paillier = require('../node_modules/paillier-js/paillier.js');
const paillier = require('paillier-js');
const {stringifyBigInts, unstringifyBigInts} = require("snarkjs/src/stringifybigint.js");

const { publicKey, privateKey } = paillier.generateRandomKeys(1024);

let _publicKey = JSON.stringify({
    'n': stringifyBigInts(publicKey.n.toString()), 
    'g':stringifyBigInts(publicKey.g.toString()), 
    '_n2': stringifyBigInts(publicKey._n2.toString()), 
    'bitLength': publicKey.bitLength
});

let _privateKey = JSON.stringify({
    "lambda":stringifyBigInts(privateKey.lambda.toString()),
    "mu":stringifyBigInts(privateKey.mu.toString()),
    "_p":stringifyBigInts(privateKey._p.toString()),
    "_q":stringifyBigInts(privateKey._q.toString()),
    "publicKey":{ 
        "n":stringifyBigInts(privateKey.publicKey.n.toString()),
        "_n2":stringifyBigInts(privateKey.publicKey._n2.toString()),
        "g":stringifyBigInts(privateKey.publicKey.g.toString()),
        "bitLength": privateKey.bitLength
    }})

fs.writeFileSync("../test/voteenc_privateKey.json", _privateKey, "utf8");
fs.writeFileSync("../test/voteenc_publicKey.json", _publicKey, "utf8");


/* global artifacts */
const BVoting = artifacts.require('./BVoting.sol');
const Verifier = artifacts.require('./Verifier.sol');


module.exports = (deployer) => {
    deployer.deploy(Verifier)
    .then(({ address: verifierAddress }) => deployer
    .deploy(BVoting, web3Utils.toHex('ballot0001'), web3Utils.toHex(_publicKey), verifierAddress ));
};
