import { AbstractProvider, ethers, Contract, JsonRpcSigner } from 'ethers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import daiAbi from "../abi/ERC20.json"

export const SepoliaChainId = 11155111
// const ScrollSepoliaChainId = "sepolia"


const tokenContract = {
  address: "0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5",
  abi: daiAbi,
};

/* const tokenContractScroll = {
  address: "0x7A422a39583c0D84c030bAA9F0c3BC71e3B4d409",
  abi: daiAbi,
}; */

export const getTokenContract = (provider: AbstractProvider) => {
  return new Contract(tokenContract.address, tokenContract.abi, provider);
}

export const getWriteTokenContract = (walletClient: JsonRpcSigner) => {
  return new Contract(tokenContract.address, tokenContract.abi, walletClient);  
}

export const getProvider = () => {
  const provider = ethers.getDefaultProvider(SepoliaChainId, { 
    "infura": process.env.INFURA_ID
  })
  return provider
}

export const getMulticallProvider = () => {
  const infuraProvider = new ethers.InfuraProvider(SepoliaChainId, process.env.REACT_APP_INFURA_ID)
  const multiCallProvider = MulticallWrapper.wrap(infuraProvider)

  return multiCallProvider
}

export const makeShortAddress = (address: string) => {
  const shortAddress = address.slice(0, 6).concat("...").concat(address.slice(address.length - 6, address.length));

  return shortAddress;
}
