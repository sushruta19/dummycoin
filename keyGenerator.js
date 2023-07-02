// Import required modules
const EC = require("elliptic").ec;
const bs58 = require("bs58");
const { SHA256, RIPEMD160 } = require("crypto-js");
const fs = require('fs');

// Create an instance of the elliptic curve used in Bitcoin (secp256k1)
const ec = new EC("secp256k1");

// Function to generate a new Bitcoin wallet address with a key pair
function generateWalletAddress() {
  // Step 1: Generate a new key pair (private key and public key)
  const key = ec.genKeyPair();
  const privateKey = key.getPrivate('hex');
  const publicKey = key.getPublic('hex');

  // Step 2: Compute the public key hash (RIPEMD160(SHA256(publicKey)))
  const publicKeyHash = RIPEMD160(SHA256(publicKey)).toString();

  // Step 3: Add version byte to create the extended public key hash
  // "6F" for Testnet, "00" for Mainnet (Bitcoin addresses on Testnet start with "m" or "n")
  const versionByte = "6F";
  const extendedPubKeyHash = versionByte + publicKeyHash;

  // Step 4: Compute the checksum (SHA256(SHA256(extendedPubKeyHash)).slice(0, 8))
  const checksum = SHA256(SHA256(extendedPubKeyHash)).toString().slice(0, 8);

  // Step 5: Append the checksum to the extended public key hash
  const addressBytes = extendedPubKeyHash + checksum;

  // Step 6: Base58Check encode the address bytes to get the final wallet address
  const walletAddress = bs58.encode(Buffer.from(addressBytes, 'hex'));

  // Return the generated private key, public key, and wallet address
  return {
    privateKey,
    publicKey,
    walletAddress
  };
}

// Function to convert a private key to a Bitcoin wallet address
function getWalletFromPvtKey(pvtKey) {

  // Create a key pair object from the private key
  const key = ec.keyFromPrivate(pvtKey, 'hex');
  
  // Get the public key in hexadecimal format
  const pubKey = key.getPublic('hex');

  // Step 1: Compute the public key hash (RIPEMD160(SHA256(pubKey)))
  const publicKeyHash = RIPEMD160(SHA256(pubKey)).toString();

  // Step 2: Add version byte to create the extended public key hash
  // "6F" for Testnet, "00" for Mainnet (Bitcoin addresses on Testnet start with "m" or "n")
  const versionByte = "6F";
  const extendedPubKeyHash = versionByte + publicKeyHash;

  // Step 3: Compute the checksum (SHA256(SHA256(extendedPubKeyHash)).slice(0, 8))
  const checksum = SHA256(SHA256(extendedPubKeyHash)).toString().slice(0, 8);

  // Step 4: Append the checksum to the extended public key hash
  const addressBytes = extendedPubKeyHash + checksum;

  // Step 5: Base58Check encode the address bytes to get the final wallet address
  const walletAddress = bs58.encode(Buffer.from(addressBytes, 'hex'));

  // Return the wallet address
  return walletAddress;
}

// Function to derive the public key from a private key
function getPubKeyFromPvtKey(privateKey) {
  // Create a key pair object from the private key
  const key = ec.keyFromPrivate(privateKey, 'hex');
  
  // Get the public key in hexadecimal format
  const publicKey = key.getPublic('hex');
  
  // Return the public key
  return publicKey;
}

function generateMultipleWallets(value) {
  const wallets = [];
  for(let i=0; i<value; i++) {
    const wallet = generateWalletAddress();
    var walletObj = {
      name : `friend${i}`,
      pvtKey : wallet.privateKey,
      pubKey : wallet.publicKey,
      wallet : wallet.walletAddress
    }
    wallets.push(walletObj);
  }
  const walletsJson = JSON.stringify(wallets, null, 1);
  fs.writeFileSync('dummyKeys.json', walletsJson);
  console.log("JSON file generated successfully!");
}

// Export the functions to be used by other parts of the application
module.exports = {
  generateWalletAddress,
  getWalletFromPvtKey,
  getPubKeyFromPvtKey,
  generateMultipleWallets
};
