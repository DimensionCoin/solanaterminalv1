'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

export default function BootPage() {
  const [progress, setProgress] = useState(0)
  const [bootMessages, setBootMessages] = useState<string[]>([])
  // Remove this line:
  // const [booting, setBooting] = useState(true)
  const router = useRouter()
  const messageContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const messages = [
      'Initializing system...',
      'Performing POST (Power-On Self-Test)...',
      'Checking CPU: Solana-optimized processor detected',
      'Initializing memory: 640K OK',
      'Loading BIOS...',
      'Detecting hardware...',
      'Initializing Solana node...',
      'Loading Solana program data...',
      'Connecting to Solana cluster...',
      'Verifying Solana account permissions...',
      'Initializing graphics adapter...',
      'Loading system drivers...',
      'Syncing with Solana blockchain...',
      'Loading Solana smart contracts...',
      'Initializing network interfaces...',
      'Configuring TCP/IP...',
      'Initializing Solana wallet integration...',
      'Checking Solana token balances...',
      'Preparing Solana transaction module...',
      'Mounting file systems...',
      'Configuring Solana staking parameters...',
      'Initializing Solana DeFi protocols...',
      'Loading user preferences...',
      'Initializing sound system...',
      'Loading Solana NFT metadata...',
      'Syncing Solana validator list...',
      'Preparing Solana RPC endpoints...',
      'Initializing Solana program deployment tools...',
      'Configuring Solana network settings...',
      'Loading Solana block explorer...',
      'Initializing Solana governance module...',
      'Syncing Solana token swap pools...',
      'Preparing Solana cross-program invocation module...',
      'Starting system services...',
      'Finalizing Solana integration...',
      'Solana system is ready!',
      'Booting into Solana-powered desktop environment...'
    ]

    const totalDuration = 10000 // 10 seconds for the entire boot process
    const intervalDuration = totalDuration / messages.length
    let currentMessageIndex = 0

    const interval = setInterval(() => {
      if (currentMessageIndex < messages.length) {
        setBootMessages((prevMessages) => [...prevMessages, messages[currentMessageIndex]])
        currentMessageIndex++
      }

      setProgress((prevProgress) => {
        const newProgress = (currentMessageIndex / messages.length) * 100
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => router.push('/desktop'), 1000) // Add a small delay before navigating
          return 100
        }
        return newProgress
      })
    }, intervalDuration)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [bootMessages])

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => router.push('/desktop'), 1000) // Add a small delay before navigating
    }
  }, [progress, router])

  return (
    <div className="h-screen bg-black text-green-400 p-4 flex flex-col retro-text">
      <div 
        ref={messageContainerRef}
        className="flex-grow overflow-hidden mb-4"
      >
        {bootMessages.map((message, index) => (
          <p key={index} className="mb-2">{message}</p>
        ))}
      </div>
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-2">
          <span>Loading progress:</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full bg-green-900" />
      </div>
    </div>
  )
}

