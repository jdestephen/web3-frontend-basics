import { useState } from "react"
import { ethers } from 'ethers'
import { getTokenContract, getMulticallProvider, getProvider } from "../utils"


export const Data = () => {
  const userAddress = "0x9B733ed4CDb40E41eeB4F79ABB0EA0812Cd1dd5f"
  const [daiBalance, setDaiBalance] = useState("0.00")
  const [daiDecimals, setDaiDecimals] = useState("0")
  const [daiTotalSupply, setDaiTotalSupply] = useState("0.00")

  const loadData = async () => {
    const provider = getProvider()

    const daiContract = getTokenContract(provider)
    const balance = await daiContract.balanceOf(userAddress)
    const decimals = await daiContract.decimals()
    const totalSupply = await daiContract.totalSupply()

    setDaiBalance(ethers.formatUnits(balance, 18))
    setDaiDecimals(decimals.toString())
    setDaiTotalSupply(ethers.formatUnits(totalSupply, 18))
  }
  
  const loadDataMulticall = async () => {
    const provider = getMulticallProvider()
    const daiContract = getTokenContract(provider)
    const [balance, decimals, totalSupply] = await Promise.all([
      daiContract.balanceOf(userAddress),
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
