'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Terminal } from '@/components/Terminal'
import { InternetExplorer } from '@/components/InternetExplorer'
import { PreferencesWindow } from '@/components/PreferencesWindow'
import { AboutWindow } from '@/components/AboutWindow'
import { useAppContext } from '@/contexts/AppContext'

interface WindowState {
  id: number
  type: 'terminal' | 'preferences' | 'about' | 'internet_explorer'
  zIndex: number
  minimized: boolean
  content?: {
    output: string[]
    currentDirectory: string
    commandHistory: string[]
  }
}

export function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindow, setActiveWindow] = useState<number | null>(null)
  const { colorScheme, setColorScheme } = useAppContext()

  const createWindow = useCallback((type: 'terminal' | 'preferences' | 'about' | 'internet_explorer') => {
    const newId = Date.now()
    setWindows(prev => [...prev, { 
      id: newId, 
      type, 
      zIndex: prev.length, 
      minimized: false,
      content: type === 'terminal' ? {
        output: ['Welcome to Solana Terminal V.1. Type "help" for a list of commands.'],
        currentDirectory: '/home/user',
        commandHistory: []
      } : undefined
    }])
    setActiveWindow(newId)
  }, [])

  const closeWindow = useCallback((id: number) => {
    setWindows(prev => prev.filter(window => window.id !== id))
    if (activeWindow === id) {
      setActiveWindow(null)
    }
    window.dispatchEvent(new CustomEvent('close-window', { detail: { id } }))
  }, [activeWindow])

  const minimizeWindow = useCallback((id: number) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, minimized: true } : window
    ))
    setActiveWindow(null)
    window.dispatchEvent(new CustomEvent('minimize-window', { detail: { id } }))
  }, [])

  const restoreWindow = useCallback((id: number) => {
    setWindows(prev => prev.map(window => 
      window.id === id ? { ...window, minimized: false } : window
    ))
    setActiveWindow(id)
    window.dispatchEvent(new CustomEvent('restore-window', { detail: { id } }))
  }, [])

  const activateWindow = useCallback((id: number) => {
    setActiveWindow(id)
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex))
      return prev.map(window => 
        window.id === id ? { ...window, zIndex: maxZ + 1 } : window
      )
    })
  }, [])

  const updateTerminalContent = useCallback((id: number, content: WindowState['content']) => {
    setWindows(prev => prev.map(window => 
      window.id === id && JSON.stringify(window.content) !== JSON.stringify(content)
      ? { ...window, content }
      : window
    ))
  }, [])

  const minimizeAllWindows = useCallback(() => {
    setWindows(prev => prev.map(window => ({ ...window, minimized: true })))
    setActiveWindow(null)
    window.dispatchEvent(new CustomEvent('minimize-all-windows'))
  }, [])

  const closeAllWindows = useCallback(() => {
    setWindows([])
    setActiveWindow(null)
  }, [])

  useEffect(() => {
    const handleOpenTerminal = () => createWindow('terminal')
    const handleOpenInternetExplorer = () => createWindow('internet_explorer')
    const handleOpenPreferences = () => createWindow('preferences')
    const handleOpenAbout = () => createWindow('about')
    const handleRestoreWindow = (event: CustomEvent) => {
      if (event.detail && event.detail.id) {
        restoreWindow(event.detail.id)
      }
    }
    const handleMinimizeAll = () => minimizeAllWindows()
    const handleCloseAll = () => closeAllWindows()

    window.addEventListener('open-terminal', handleOpenTerminal)
    window.addEventListener('open-internet-explorer', handleOpenInternetExplorer)
    window.addEventListener('open-preferences', handleOpenPreferences)
    window.addEventListener('open-about', handleOpenAbout)
    window.addEventListener('restore-window', handleRestoreWindow as EventListener)
    window.addEventListener('minimize-all-windows', handleMinimizeAll)
    window.addEventListener('close-all-windows', handleCloseAll)

    return () => {
      window.removeEventListener('open-terminal', handleOpenTerminal)
      window.removeEventListener('open-internet-explorer', handleOpenInternetExplorer)
      window.removeEventListener('open-preferences', handleOpenPreferences)
      window.removeEventListener('open-about', handleOpenAbout)
      window.removeEventListener('restore-window', handleRestoreWindow as EventListener)
      window.removeEventListener('minimize-all-windows', handleMinimizeAll)
      window.removeEventListener('close-all-windows', handleCloseAll)
    }
  }, [createWindow, restoreWindow, minimizeAllWindows, closeAllWindows])

  const memoizedWindows = useMemo(() => windows, [windows])

  return (
    <div className={`w-full h-full bg-black relative ${colorScheme === 'purple' ? 'purple-theme' : 'green-theme'}`}>
      {memoizedWindows.map(window => {
        if (window.minimized) return null

        switch (window.type) {
          case 'terminal':
            return (
              <Terminal
                key={window.id}
                id={window.id}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onActivate={() => activateWindow(window.id)}
                isActive={activeWindow === window.id}
                colorScheme={colorScheme}
                initialContent={window.content}
                updateContent={updateTerminalContent}
              />
            )
          case 'internet_explorer':
            return (
              <InternetExplorer
                key={window.id}
                id={window.id}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onActivate={() => activateWindow(window.id)}
                isActive={activeWindow === window.id}
                colorScheme={colorScheme}
              />
            )
          case 'preferences':
            return (
              <PreferencesWindow
                key={window.id}
                id={window.id}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onActivate={() => activateWindow(window.id)}
                isActive={activeWindow === window.id}
                colorScheme={colorScheme}
                setColorScheme={setColorScheme}
              />
            )
          case 'about':
            return (
              <AboutWindow
                key={window.id}
                id={window.id}
                zIndex={window.zIndex}
                onClose={() => closeWindow(window.id)}
                onMinimize={() => minimizeWindow(window.id)}
                onActivate={() => activateWindow(window.id)}
                isActive={activeWindow === window.id}
                colorScheme={colorScheme}
              />
            )
        }
      })}
    </div>
  )
}

