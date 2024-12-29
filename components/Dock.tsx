'use client'

import { useState, useEffect, useCallback } from 'react'
import { Terminal, Globe } from 'lucide-react'

export function Dock() {
  const [openWindows, setOpenWindows] = useState<number[]>([])
  const [minimizedWindows, setMinimizedWindows] = useState<number[]>([])

  useEffect(() => {
    const handleOpenWindow = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        setOpenWindows((prev) => [...prev, event.detail.id])
      }
    }

    const handleCloseWindow = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        setOpenWindows((prev) => prev.filter((id) => id !== event.detail.id))
        setMinimizedWindows((prev) => prev.filter((id) => id !== event.detail.id))
      }
    }

    const handleMinimizeWindow = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        setMinimizedWindows((prev) => [...prev, event.detail.id])
        setOpenWindows((prev) => prev.filter((id) => id !== event.detail.id))
      }
    }

    const handleRestoreWindow = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        setMinimizedWindows((prev) => prev.filter((id) => id !== event.detail.id))
        setOpenWindows((prev) => [...prev, event.detail.id])
      }
    }

    const handleMinimizeAllWindows = () => {
      setMinimizedWindows((prev) => [...prev, ...openWindows])
      setOpenWindows([])
    }

    const handleCloseAllWindows = () => {
      setOpenWindows([])
      setMinimizedWindows([])
    }

    window.addEventListener('open-window', handleOpenWindow as EventListener)
    window.addEventListener('close-window', handleCloseWindow as EventListener)
    window.addEventListener('minimize-window', handleMinimizeWindow as EventListener)
    window.addEventListener('restore-window', handleRestoreWindow as EventListener)
    window.addEventListener('minimize-all-windows', handleMinimizeAllWindows)
    window.addEventListener('close-all-windows', handleCloseAllWindows)

    return () => {
      window.removeEventListener('open-window', handleOpenWindow as EventListener)
      window.removeEventListener('close-window', handleCloseWindow as EventListener)
      window.removeEventListener('minimize-window', handleMinimizeWindow as EventListener)
      window.removeEventListener('restore-window', handleRestoreWindow as EventListener)
      window.removeEventListener('minimize-all-windows', handleMinimizeAllWindows)
      window.removeEventListener('close-all-windows', handleCloseAllWindows)
    }
  }, [])

  const handleTerminalClick = useCallback(() => {
    if (minimizedWindows.length > 0) {
      const lastMinimized = minimizedWindows[minimizedWindows.length - 1]
      window.dispatchEvent(new CustomEvent('restore-window', { detail: { id: lastMinimized } }))
    } else if (openWindows.length === 0) {
      window.dispatchEvent(new CustomEvent('open-terminal', { detail: { id: Date.now() } }))
    }
  }, [minimizedWindows, openWindows])

  const handleInternetExplorerClick = useCallback(() => {
    if (minimizedWindows.length > 0) {
      const lastMinimized = minimizedWindows[minimizedWindows.length - 1]
      window.dispatchEvent(new CustomEvent('restore-window', { detail: { id: lastMinimized } }))
    } else if (openWindows.length === 0) {
      window.dispatchEvent(new CustomEvent('open-internet-explorer', { detail: { id: Date.now() } }))
    }
  }, [minimizedWindows, openWindows])

  return (
    <div className="h-16 bg-black border-t border-green-900 flex items-center justify-center space-x-4 px-4">
      <button
        onClick={handleTerminalClick}
        className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center hover:bg-green-800 transition-colors relative"
      >
        <Terminal className="text-2xl text-white" />
        {(openWindows.length > 0 || minimizedWindows.length > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {openWindows.length + minimizedWindows.length}
          </span>
        )}
      </button>
      <button
        onClick={handleInternetExplorerClick}
        className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center hover:bg-green-800 transition-colors relative"
      >
        <Globe className="text-2xl text-white" />
        {(openWindows.length > 0 || minimizedWindows.length > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {openWindows.length + minimizedWindows.length}
          </span>
        )}
      </button>
    </div>
  )
}

