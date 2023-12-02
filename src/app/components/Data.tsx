import { useState } from "react"
import { ethers } from 'ethers'
import { getDaiContract, getMulticallProvider, getProvider } from "../utils"


export const Data = () => {
  const address = "0xd4fa23307a181B9ca567886eB5bCd5c8f8f8bB3E"
  const [daiBalance, setDaiBalance] = useState("0.00")
  const [daiDecimals, setDaiDecimals] = useState("0")
  const [daiTotalSupply, setDaiTotalSupply] = useState("0.00")

  const loadData = async () => {
    const provider = getProvider()

    const daiContract = getDaiContract(provider)
    const balance = await daiContract.balanceOf(address)
    const decimals = await daiContract.decimals()
    const totalSupply = await daiContract.totalSupply()

    setDaiBalance(ethers.formatUnits(balance, 18))
    setDaiDecimals(decimals.toString())
    setDaiTotalSupply(ethers.formatUnits(totalSupply, 18))
  }
  
  const loadDataMulticall = async () => {
    const provider = getMulticallProvider()
    const daiContract = getDaiContract(provider)
    const [balance, decimals, totalSupply] = await Promise.all([
      daiContract.balanceOf(address),
      daiContract.decimals(),
      daiContract.totalSupply(),
    ])

    setDaiBalance(ethers.formatUnits(balance, 18))
    setDaiDecimals(decimals.toString())
    setDaiTotalSupply(ethers.formatUnits(totalSupply, 18))
  }

  return (
    <div className="box-border">
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Token Balance:</h4>
        <span>{daiBalance}</span>
      </div>
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Decimals:</h4>
        <span>{daiDecimals}</span>
      </div>
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Total Supply:</h4>
        <span>{daiTotalSupply}</span>
      </div>
      <button onClick={() => loadDataMulticall()}>
        Leer Datos
      </button>
    </div>
  )
}
