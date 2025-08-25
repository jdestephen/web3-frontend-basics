import { useEffect, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits, getAddress, parseAbiItem } from 'viem';
import { makeShortAddress, SepoliaChainId } from '../lib/utils';
import { zeroAddress } from 'viem';

const eventAbi = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 tokens)');

export const ReadLogs = () => {
  const publicClient = usePublicClient({ chainId: SepoliaChainId })
  const account = useAccount()
  const [transfers, setTransfers] = useState<any>([])

  const loadData = async () => {
    if (publicClient) {
      const fromAddress = account.address || zeroAddress;
      const logs = await publicClient.getLogs({
        address: getAddress("0xDa57a11D954CCBE2e8A1eA142904a6C0F4b333c5"),
        event: eventAbi,
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
        event: eventAbi,
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
    <div className="flex flex-row w-[60%]">
      <div className="flex flex-col h-auto w-full">
        {transfers && transfers.length > 0 ? (
          <>
            <div className="flex flex-row w-full space-x-2 text-gray-700">
              <span className="text-center w-[10%]">#</span>
              <span className="text-base text-center w-[24%]">From</span>
              <span className="text-base text-center w-[21%]">To</span>
              <span className="text-base text-right w-[20%]">Amount</span>
              <span className="text-base text-right w-[20%]">Block</span>
            </div>
            {transfers.map((transfer: any, key: number) => {
              const cls = key % 2 === 0 ? "bg-gray-100" : "bg-white";
              return (
                <div
                  key={key.toString()}
                  className={`flex flex-row w-full space-x-2 py-3 ${cls}`}
                >
                  <span className="text-base text-center w-[10%]">{key + 1}</span>
                  <span className="text-base text-center w-[24%]">{makeShortAddress(transfer.from)}</span>
                  <span className="text-base text-center w-[21%]">{makeShortAddress(transfer.to)}</span>
                  <span className="text-base text-right w-[20%]">{parseFloat(transfer.amount).toFixed(2)}</span>
                  <span className="text-base text-right w-[20%]">{transfer.blockNumber}</span>
                </div>
              )
            })}
          </>
        ) : (
          <h4 className="text-center py-5">No hay datos</h4>  
        )}
      </div>
    </div>  
  );
}
