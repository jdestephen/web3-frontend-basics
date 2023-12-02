import { useState } from 'react'
import { ethers, AbiCoder } from 'ethers'
import { getTokenContract, getMulticallProvider, makeShortAddress } from '../utils'


export const ReadLogs = () => {
  const [transfers, setTransfers] = useState<any>()

  const loadData = async () => {
    const fromAddress = "0x9B733ed4CDb40E41eeB4F79ABB0EA0812Cd1dd5f"
    const provider = getMulticallProvider()
    const daiContract = getTokenContract(provider)
    const transfersQuery = daiContract.filters.Transfer(fromAddress, null)
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
            <th>BN</th>
          </tr>
          <tbody>
            {transfers.map((transfer: any, key: number) => {
              const amount = AbiCoder.defaultAbiCoder().decode(["uint256"], transfer.data)
              // console.log("transfer: ", transfer)
              return (
                <tr key={key.toString()}>
                  <td>{key + 1}</td>
                  <td>{makeShortAddress(transfer.args[0])}</td>
                  <td>{makeShortAddress(transfer.args[1])}</td>
                  <td>{ethers.formatUnits(amount[0])}</td>
                  <td>{transfer.blockNumber}</td>
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
