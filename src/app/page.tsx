'use client'
import { Data } from './components/Data'
import { Transactions } from './components/Transactions'
import { ReadLogs } from './components/ReadLogs'


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>Web3 Frontend Demo</h1>
      <div className="flex space-y-10 p-4">
        <div className="flex min-h-screen flex-col space-y-10 p-4">
          <Data />
        </div>
        <div>
          <ReadLogs />
        </div>
      </div>  
    </main>
  )
}
