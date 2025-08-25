import { useState,  } from "react"

import { Erc20Abi } from "@/contracts/Erc20.abi"
import { useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { getAddress, isAddress, parseUnits, zeroAddress } from "viem"
import { sepolia } from "viem/chains"
import { SimulateTransfer } from "./Simulate"


export const Transactions = () => {
  const account = useAccount()
  const {  data: hash, isPending, writeContract } = useWriteContract() 

  const [mintAmount, setMintAmount] = useState(0n)
  const [toAddress, setToAddress] = useState<string | `0x${string}`>(zeroAddress)
  const [transferAmount, setTransferAmount] = useState(0n)

  const onMintAmountChange = (value: string) => {
    if (value.trim() !== "") {
      const amount = parseUnits(value, 18);
      setMintAmount(amount)
    } else {
      setMintAmount(0n)
    }
  }

  const onAddressChange = (value: string) => {
    if (isAddress(value) && value !== zeroAddress) {
      setToAddress(value)
    } else {
      setToAddress(zeroAddress)
    }
  }

  const onTransferAmountChange = (value: string) => {
    if (value.trim() !== "") {
      const amount = parseUnits(value, 18);
      setTransferAmount(amount)
    } else {
      setTransferAmount(0n)
    }
  }

  const mint = async () => {
    if (!account.address) return

    try {
      writeContract({
        ...Erc20Abi,
        functionName: 'mint',
        args: [account.address, mintAmount],
      })

    } catch (ex) {
      console.log(ex)
    }
  }

  const transferTo = async () => {
    if (!account.address) return

    try {
      writeContract({
        ...Erc20Abi,
        functionName: 'transfer',
        args: [getAddress(toAddress), transferAmount],
        chainId: sepolia.id,
      })
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="box-border">
      <div className="flex flex-col justify-items-center space-y-2 my-8">
        <div className="flex flex-r ow justify-items-center space-x-4 ">
          <h4>Cantidad</h4>
          <input placeholder="0" type="number" onChange={(event) => onMintAmountChange(event.target.value)} />
        </div>
        <button disabled={!account.isConnected || isPending} onClick={() => mint()}>
          Mint Token
        </button>
      </div>
      <div className="flex flex-col justify-items-center space-y-2 my-8">
        <div className="flex flex-r ow justify-items-center space-x-4 ">
          <h4>Address</h4>
          <input placeholder="" onChange={(event) => onAddressChange(event.target.value)} />
        </div>
        <div className="flex flex-r ow justify-items-center space-x-4 ">
          <h4>Cantidad</h4>
          <input placeholder="0" type="number" onChange={(event) => onTransferAmountChange(event.target.value)} />
        </div>
        <button disabled={!account.isConnected || isPending} onClick={() => transferTo()}>
          Transferir
        </button>
        {/* <SimulateTransfer toAddress={getAddress(toAddress)} amount={transferAmount} /> */}
      </div>
    </div>    
  )
}