
const { assert } = require("chai");
const {ethers} = require("hardhat");
const utils = ethers.utils
const { defaultAbiCoder, toUtf8Bytes, solidityPack, keccak256, hexlify, getAddress } = utils
// const { abi:accountAbi, bytecode:accountBytecode } = require('../build/contracts/Account.json')

// async function deployAccount (factoryAddress, salt, recipient) {
//   const factory = new web3.eth.Contract(factoryAbi, factoryAddress)
//   const account = '0x303de46de694cc75a2f66da93ac86c6a6eee607e'
//   const nonce = await web3.eth.getTransactionCount(account)
//   const bytecode = `${accountBytecode}${encodeParam('address', recipient).slice(2)}`
//   const result = await factory.methods.deploy(bytecode, salt).send({
//     from: account,
//     gas: 4500000,
//     gasPrice: 10000000000,
//     nonce
//   })

//   const computedAddr = buildCreate2Address(
//     factoryAddress,
//     numberToUint256(salt),
//     bytecode
//   )

//   const addr = result.events.Deployed.returnValues.addr.toLowerCase()
//   assert.equal(addr, computedAddr)

//   return {
//     txHash: result.transactionHash,
//     address: addr,
//     receipt: result
//   }
// }

function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  // return `0x${web3.utils.sha3(`0x${[
  //   'ff',
  //   creatorAddress,
  //   saltHex,
  //   web3.utils.sha3(byteCode)
  // ].map(x => x.replace(/0x/, ''))
  // .join('')}`).slice(-40)}`.toLowerCase()
  return `0x${keccak256(`0x${[
    'ff',
    creatorAddress,
    saltHex,
    keccak256(byteCode)
  ].map(x => x.replace(/0x/, ''))
  .join('')}`).slice(-40)}`.toLowerCase()
}

function numberToUint256(value) {
  const hex = value.toString(16)
  return `0x${'0'.repeat(64-hex.length)}${hex}`
}

function encodeParam(dataType, data) {
  return defaultAbiCoder.encode(dataType, data)
}

// async function isContract(address) {
//   const code = await web3.eth.getCode(address)
//   return code.slice(2).length > 0
// }

async function main() {
  
  const [owner, other] = await ethers.getSigners()
  // We get the contract to deploy
  const Factory = await ethers.getContractFactory("Factory")
  const factory = await Factory.deploy()

  await factory.deployed();
  const factoryAddress =  factory.address
  console.log("Factory deployed to:", factory.address)

  const Account = await ethers.getContractFactory("Account")
  const bytecode = `${Account.bytecode}${encodeParam(['address'], [owner.address]).slice(2)}`
  const salt = 1
  
  const computedAddr = buildCreate2Address(
    factoryAddress,
    numberToUint256(salt),
    bytecode
  )

  console.log("Account will be deployed to", computedAddr)
  
  let tx = await factory.deploy(bytecode, salt)
  let receipt = await tx.wait()
  let events = receipt.events[0]
  assert.equal(events.event, 'Deployed')
  let deployed_address = events.args.addr
  let deployed_salt = events.args.salt

  
  assert.equal(computedAddr.toString().toLowerCase(), deployed_address.toString().toLowerCase())
  
  console.log("Account deployed to:", deployed_address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
