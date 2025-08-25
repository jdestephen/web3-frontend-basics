'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { Data } from './components/Data'
import { Transactions } from './components/Transactions'
import { Logs } from './components/Logs'
import { config } from './lib/config'
import { NavBar } from './components/NavBar'

const queryClient = new QueryClient()


export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="flex min-h-screen flex-col items-center justify-center py-1 px-10">
          <NavBar />
          <div className="flex w-[90%] justify-center">
            <div className="flex min-h-screen flex-col space-y-5 p-4 w-[40%]">
              <Data />
              <Transactions />
            </div>
            <Logs />
          </div>
        </div>  
      </QueryClientProvider>
    </WagmiProvider>
  )
}
