import { Address } from "viem"
import { sepolia } from "viem/chains"
import { simulateContract } from '@wagmi/core'

import { Erc20Abi } from "@/contracts/Erc20.abi"
import { config } from "../lib/config"


export const SimulateTransfer = ({ toAddress, amount } : { toAddress: Address, amount: bigint }) => {
    
  const simulate = async () => { 
    try {
      // @ts-ignore
      const { request } = await simulateContract(config, {
        ...Erc20Abi,
        functionName: 'transfer',
        args: [toAddress, amount],
        chainId: sepolia.id,
        account: '0xFE5F1A8DF29B2803Fde2319fDDC5ba198416089F',
      })
      console.log('Simulation request:', request);
    } catch (error) { 
      console.error('Simulation error:', error);
    }
  }

  return (
    <button onClick={() => simulate()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Simular
    </button>
  )
}