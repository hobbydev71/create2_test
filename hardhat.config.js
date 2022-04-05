require("@nomiclabs/hardhat-waffle");
require("dotenv").config()
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.5.16",
  networks: {
    mainnet: {
      url: process.env.MAINNET_END_POINT,
      accounts: [process.env.MAINNET_PRIVATE_KEY]
    },
    rinkeby: {
      url: process.env.RINKEBY_END_POINT,
      accounts: [process.env.RINKEBY_PRIVATE_KEY]
    },
    bsc_test: {
      url: process.env.BSC_TEST_END_POINT,
      accounts: [process.env.BSC_TEST_PRIVATE_KEY, process.env.BSC_OTHER_KEY]
    },
    local: {
      chainid: 828,
      url: process.env.LOCAL_END_POINT,
      accounts: [process.env.LOCAL_PRIVATE_KEY, process.env.LOCAL_OTHER_KEY]
    },
    huygens_test: {
      url: process.env.HUYGENS_TEST_END_POINT,
      accounts: [process.env.HUYGENS_TEST_PRIVATE_KEY, process.env.HUYGENS_TEST_OTHER_KEY]
    }
  }
};
