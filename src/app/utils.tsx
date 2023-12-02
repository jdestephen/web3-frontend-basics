import { AbstractProvider, ethers, Contract, JsonRpcSigner } from 'ethers'
import { MulticallWrapper } from 'ethers-multicall-provider'
import daiAbi from "../abi/ERC20.json"

const SepoliaChainId = 11155111
const ScrollSepoliaChainId = "sepolia"


const daiContract = {
  address: "0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5",
  abi: daiAbi,
};

const daiContractScroll = {
  address: "0x7A422a39583c0D84c030bAA9F0c3BC71e3B4d409",
  abi: daiAbi,
};

export const getDaiContract = (provider: AbstractProvider) => {
  return new Contract(daiContractScroll.address, daiContractScroll.abi, provider);
}

export const getWriteDaiContract = (walletClient: JsonRpcSigner) => {
  return new Contract(daiContractScroll.address, daiContractScroll.abi, walletClient);  
}

export const getProvider = () => {
  const provider = ethers.getDefaultProvider(ScrollSepoliaChainId, { 
    "infura": process.env.INFURA_ID
  })
  return provider
}

export const getMulticallProvider = () => {
  const infuraProvider = new ethers.InfuraProvider(ScrollSepoliaChainId, process.env.REACT_APP_INFURA_ID)
  const multiCallProvider = MulticallWrapper.wrap(infuraProvider)

  return multiCallProvider
}

export const makeShortAddress = (address: string) => {
  const shortAddress = address.slice(0, 6).concat("...").concat(address.slice(address.length - 6, address.length));

  return shortAddress;
}
