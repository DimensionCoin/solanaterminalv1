'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AppContextType {
  clipboard: string
  setClipboard: (text: string) => void
  minimizeAll: () => void
  zoomAll: () => void
  closeAll: () => void
  colorScheme: 'green' | 'purple'
  setColorScheme: (colorScheme: 'green' | 'purple') => void
  minimizeAllWindows: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [clipboard, setClipboard] = useState('')
  const [colorScheme, setColorScheme] = useState<'green' | 'purple'>('green')

  const minimizeAll = () => {
    window.dispatchEvent(new CustomEvent('minimize-all-windows'))
  }

  const zoomAll = () => {
    window.dispatchEvent(new CustomEvent('zoom-all-windows'))
  }

  const closeAll = () => {
    window.dispatchEvent(new CustomEvent('close-all-windows'))
  }

  const minimizeAllWindows = () => {
    window.dispatchEvent(new CustomEvent('minimize-all-windows'))
  }

  useEffect(() => {
    const handleColorSchemeChange = (event: CustomEvent) => {
      if (event.detail && event.detail.colorScheme) {
        setColorScheme(event.detail.colorScheme)
      }
    }

    window.addEventListener('color-scheme-change', handleColorSchemeChange as EventListener)

    return () => {
      window.removeEventListener('color-scheme-change', handleColorSchemeChange as EventListener)
    }
  }, [])

  return (
    <AppContext.Provider value={{ clipboard, setClipboard, minimizeAll, zoomAll, closeAll, colorScheme, setColorScheme, minimizeAllWindows }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

