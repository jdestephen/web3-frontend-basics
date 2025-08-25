import { useMemo } from "react"

import { useAccount, useReadContracts } from "wagmi"
import { formatUnits, zeroAddress } from "viem"

import { Erc20Abi } from "@/contracts/Erc20.abi"


export const Data = () => {
  const account = useAccount()
  const {
    data,
    error,
    isPending,
    refetch,
  } = useReadContracts({
    contracts: [{
      ...Erc20Abi,
      functionName: 'balanceOf',
      args: [account.address || zeroAddress],
    }, {
      ...Erc20Abi,
      functionName: 'decimals',
    }, {
      ...Erc20Abi,
      functionName: 'totalSupply',
    }]
  });

  const [daiBalance, daiDecimals, daiTotalSupply] = useMemo(() => { 
    if (!data || error || isPending) return ["0.00", "0", "0.00"]

    const decimals = data[1].result || 18;
    const balance = formatUnits(data[0].result || 0n, decimals);
    const totalSupply = formatUnits(data[2].result || 0n, decimals);

    return [balance, decimals, totalSupply]
  }, [data])

  return (
    <div className="box-border">
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Token Balance:</h4>
        <span>{parseFloat(daiBalance).toFixed(2)}</span>
      </div>
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Decimals:</h4>
        <span>{daiDecimals}</span>
      </div>
      <div className="flex flex-row justify-items-center justify-between space-x-4">
        <h4>Total Supply:</h4>
        <span>{parseFloat(daiTotalSupply).toFixed(2)}</span>
      </div>
      <button onClick={() => refetch()}>
        Leer Datos
      </button>
    </div>
  )
}
