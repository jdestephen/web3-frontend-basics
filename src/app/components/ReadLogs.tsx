import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits, getAddress, parseAbiItem } from 'viem';
import { makeShortAddress, SepoliaChainId } from '../lib/utils';


export const ReadLogs = () => {
  const publicClient = usePublicClient({ chainId: SepoliaChainId })
  const account = useAccount()
  const [transfers, setTransfers] = useState<any>([])

  const loadData = async () => {
    if (publicClient) {
      const fromAddress = account.address || getAddress("0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5");
      const logs = await publicClient.getLogs({
        address: getAddress("0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5"),
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 tokens)'),
        args: {
          from: fromAddress,
        },
        fromBlock: 1n,
      });
      
      const trans = logs.map((log) => {
        return {
          from: log.args.from,
          to: log.args.to,
          amount: formatUnits(log.args.tokens || 0n, 18),
          blockNumber: log.blockNumber,
        }
      });
    
      setTransfers(trans);
    }
  }

  useEffect(() => { 
    loadData();
  }, [account.address])

  useEffect(() => { 
    if (publicClient) { 
      const fromAddress = account.address || getAddress("0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5");
      const unwatch = publicClient.watchEvent({
        address: getAddress("0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5"),
        event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 tokens)'),
        args: {
          from: fromAddress,
        },
        fromBlock: 1n,
        onLogs: logs => {
          const t = [...transfers];
          for (const log in logs) { 
            t.push({
              from: logs[log].args.from,
              to: logs[log].args.to,
              amount: formatUnits(logs[log].args.tokens || 0n, 18),
              blockNumber: logs[log].blockNumber,
            })
          }
          setTransfers(t);
        }
      })

      // Cleanup function to unwatch when the component unmounts
      return () => unwatch();
    }  
  }, [account.address])
  

  return (
    <div className="flex flex-row">
      <div className="flex flex-col box-border h-auto">
        {/* <button onClick={() => loadData()}>
          Leer Logs
        </button> */}
        {transfers && transfers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th />
                <th>From</th>
                <th>To</th>
                <th>Address</th>
                <th>BN</th>
                </tr>  
            </thead>
            <tbody>
              {transfers.map((transfer: any, key: number) => {
                return (
                  <tr key={key.toString()}>
                    <td>{key + 1}</td>
                    <td>{makeShortAddress(transfer.from)}</td>
                    <td>{makeShortAddress(transfer.to)}</td>
                    <td>{parseFloat(transfer.amount).toFixed(2)}</td>
                    <td>{transfer.blockNumber}</td>
                  </tr>
                )
              })}
            </tbody>  
          </table>
        ) : (
          <h4 className="text-center py-5">No hay datos</h4>  
        )}
      </div>
    </div>  
  );
}
