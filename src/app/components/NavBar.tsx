import { useAccount, useConnect } from 'wagmi';
import { disconnect } from '@wagmi/core';

import { config } from "../lib/config"
import { makeShortAddress } from '../lib/utils';


export const NavBar = () => {
  const { connectors, connect } = useConnect();
  const account = useAccount(); 
    
  return (
    <div className="flex justify-end w-full">
      <div className="flex flex-row justify-end items-center p-4 border-gray-300 mb-4 space-x-3">
        {account.address && (
          <div className="bg-gray-200 px-4 py-2 rounded">
            <p>{makeShortAddress(account.address)}</p>
          </div>
        )}
        {account.isDisconnected && connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className="bg-green-800 w-32 m-0"
          >
            {connector.name}
          </button>
        ))}
        {account.isConnected && (
          <button
            onClick={() => {
              // @ts-ignore
              disconnect(config);
            }}
            className="bg-red-800 px-4 m-0"
          >
            Desconectar
          </button>
        )}
      </div>
    </div>  
  )
}
