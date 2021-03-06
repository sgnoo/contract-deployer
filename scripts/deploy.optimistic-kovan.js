const { artifacts, ethers } = require('hardhat');
const { JsonRpcProvider } = require('@ethersproject/providers');
const { join } = require('path');
const { readFileSync } = require('fs');
require("dotenv").config()

const env = process.env
const INFURA_PROJECT_ID = env.INFURA_PROJECT_ID
const PRIVATE_KEY = env.PRIVATE_KEY

async function deploy (deployer, contract, txOpts) {
  const deployedContract = await deployContract(deployer, await getL2ContractFactory(contract), [txOpts]);
  console.log(`${contract}:`, deployedContract.address);

  return deployedContract;
}

async function getL2ContractFactory (contract) {
  const l1ArtifactPaths = await artifacts.getArtifactPaths();
  const desiredArtifacts = l1ArtifactPaths.filter((a) => a.endsWith(`/${contract}.json`));
  if (desiredArtifacts.length !== 1) {
    console.error('Couldn\'t find desired artifact or found too many');
  }

  const l1ArtifactPath = desiredArtifacts[0];
  const artifactRootPath = join(__dirname, '../../artifacts');
  const artifactOvmRootPath = join(__dirname, '../../artifacts-ovm');
  const l2ArtifactPath = l1ArtifactPath.replace(artifactRootPath, artifactOvmRootPath);

  const artifact = JSON.parse(readFileSync(l2ArtifactPath, 'utf-8'));

  return new ethers.ContractFactory(artifact.abi, artifact.bytecode);
}

async function deployContract(
  signer,
  artifact,
  args,
) {
  const contractFactory = new ethers.ContractFactory(artifact.interface, artifact.bytecode, signer);
  const contract = await contractFactory.deploy(...args);

  await contract.deployed();

  return contract;
}

async function main() {
  const provider = new JsonRpcProvider('https://kovan.optimism.io');
  const deployer = new ethers.Wallet(PRIVATE_KEY, provider);

  await deploy(deployer, 'L2Token', {});
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
