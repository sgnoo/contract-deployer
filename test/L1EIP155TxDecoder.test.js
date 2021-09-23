const { ethers } = require("hardhat");

describe("L1EIP155TxDecoder", function () {
  it("should decode encoded eip-155 transaction", async function () {
    const L1EIP155TxDecoder = await ethers.getContractFactory("L1EIP155TxDecoder");
    const l1EIP155TxDecoder = await L1EIP155TxDecoder.deploy();
    await l1EIP155TxDecoder.deployed();

    const encodedTx = "0xf901098083e4e1c0831b296094420000000000000000000000000000000000001080b8a432b7006d0000000000000000000000004200000000000000000000000000000000000006000000000000000000000000000000000000000000000000008dea48e5e9010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000000081ada0ccaf2812448987361e38173ddc36b75e46ca88ce2fb9e92f3ef08f1491104562a0690d0f826eb927e5ee60be5898cb2363df44a961ed4cfbdc601ac889c9d0a1be";
    const chainId = "69";
    const decodedTx = await l1EIP155TxDecoder.decodeEIP155Tx(encodedTx, chainId);

    console.log(decodedTx);
  });
});

