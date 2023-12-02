import { useState,  } from "react"
import { ethers, JsonRpcSigner, ZeroAddress } from "ethers"

import { getWriteTokenContract, SepoliaChainId } from "../utils"


export const Transactions = () => { 
  const [signer, setSigner] = useState<JsonRpcSigner>()
  const [mintAmount, setMintAmount] = useState(0n)
  const [toAddress, setToAddress] = useState(ZeroAddress)
  const [transferAmount, setTransferAmount] = useState(0n)
  const [networkError, setNetworkError] = useState("")

  const onMintAmountChange = (value: string) => {
    if (value.trim() !== "") {
      const amount = ethers.parseEther(value)
      setMintAmount(amount)
    } else {
      setMintAmount(0n)
    }
  }

  const onAddressChange = (value: string) => {
    if (ethers.isAddress(value) && value !== ZeroAddress) {
      setToAddress(value)
    } else {
      setToAddress(ZeroAddress)
    }
  }

  const onTransferAmountChange = (value: string) => {
    if (value.trim() !== "") {
      const amount = ethers.parseEther(value)
      setTransferAmount(amount)
    } else {
      setTransferAmount(0n)
    }
  }

  const connectWallet = async () => {
    // @ts-ignore
    const walletProvider = new ethers.BrowserProvider(window.ethereum)
    
    if (walletProvider) { 
      const newSigner = await walletProvider.getSigner()
      setSigner(newSigner)
      
      const currentNetwork = await walletProvider.getNetwork()
      if (SepoliaChainId !== Number(currentNetwork.chainId)) {
        setNetworkError("Red incorrecta")
      } else {
        setNetworkError("")
      }
    }      
  }

  const mint = async () => {
    try {
      if (signer) {
        const tokenContract = getWriteTokenContract(signer)
        const tx = await tokenContract.mint(signer.address, mintAmount)
        await tx.wait()
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  const transferTo = async () => {
    try {
      if (signer) {
        const tokenContract = getWriteTokenContract(signer)
        const tx = await tokenContract.transfer(signer.address, transferAmount)
        await tx.wait()
      }
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div className="box-border">
      <div className="flex flex-col justify-items-center space-y-2">
        <button id="connect-wallet" onClick={() => connectWallet()}>
          {!signer ? "Conectar Billetera" : "Conectado"}
        </button>
        {signer && (
          <>
            <p>Cuenta: {signer.address}</p>
            {networkError !== "" && (
              <p className="text-red">{networkError}</p>
            )}
          </>  
        )}
      </div>
      <div className="flex flex-col justify-items-center space-y-2 my-8">
        <div className="flex flex-r ow justify-items-center space-x-4 ">
          <h4>Cantidad</h4>
          <input placeholder="0" type="number" onChange={(event) => onMintAmountChange(event.target.value)} />
        </div>
        <button disabled={!signer} onClick={() => mint()}>
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
        <button disabled={!signer} onClick={() => transferTo()}>
          Transferir
        </button>
      </div>
    </div>    
  )
}