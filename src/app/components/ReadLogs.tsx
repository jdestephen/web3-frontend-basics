import { useState } from "react"
import { ethers } from 'ethers'
import { getDaiContract, getMulticallProvider, makeShortAddress } from "../utils"
import { AbiCoder } from "ethers"


export const ReadLogs = () => {
  const [transfers, setTransfers] = useState<any>()

  const loadData = async () => {
    const addressFrom = "0xd4fa23307a181B9ca567886eB5bCd5c8f8f8bB3E"
    const provider = getMulticallProvider()
    const daiContract = getDaiContract(provider)
    const transfersQuery = daiContract.filters.Transfer(addressFrom, null)
    const [transfersData] = await Promise.all([
      daiContract.queryFilter(transfersQuery)
    ])
    setTransfers(transfersData)
  }

  return (
    <div className="box-border justify-items-center space-y-4">
      <button onClick={() => loadData()}>
        Leer Logs
      </button>
      {transfers && transfers.length > 0 ? (
        <table>
          <tr>
            <th />
            <th>From</th>
            <th>To</th>
            <th>Address</th>
          </tr>
          <tbody>
            {transfers.map((transfer: any, key: number) => {
              const amount = AbiCoder.defaultAbiCoder().decode(["uint256"], transfer.data);
              return (
                <tr key={key.toString()}>
                  <td>{key + 1}</td>
                  <td>{makeShortAddress(transfer.args[0])}</td>
                  <td>{makeShortAddress(transfer.args[1])}</td>
                  <td>{ethers.formatUnits(amount[0])}</td>
                </tr>
              )
            })}
          </tbody>  
        </table>
      ) : (
        <h4 className="text-center">No hay datos</h4>  
      )}    
    </div>
  )
}
