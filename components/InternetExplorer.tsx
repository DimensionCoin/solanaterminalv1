'use client'

import { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { Resizable } from 're-resizable'
import { useAppContext } from '@/contexts/AppContext'
import { ArrowLeft, ArrowRight, RotateCcw, Search } from 'lucide-react'
import { useWindowSize } from '@/hooks/useWindowSize'

interface InternetExplorerProps {
  id: number
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  isActive: boolean
  colorScheme: 'green' | 'purple'
}

export function InternetExplorer({
  id,
  zIndex,
  onClose,
  onMinimize,
  onActivate,
  isActive,
  colorScheme
}: InternetExplorerProps) {
  const [position, setPosition] = useState({ x: 100 + (id % 5) * 20, y: 100 + (id % 5) * 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [url, setUrl] = useState('https://www.google.com/search?igu=1')
  const [searchQuery, setSearchQuery] = useState('')
  const windowRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { width, height } = useWindowSize()

  const { setClipboard } = useAppContext()

  const colorClasses = useMemo(() => ({
    green: {
      bg: 'bg-green-900',
      text: 'text-green-400',
      border: 'border-green-900',
      hover: 'hover:bg-green-800',
    },
    purple: {
      bg: 'bg-purple-900',
      text: 'text-purple-400',
      border: 'border-purple-900',
      hover: 'hover:bg-purple-800',
    },
  }[colorScheme]), [colorScheme])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
      onActivate()
    }
  }, [onActivate])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      setPosition({ x: newX, y: newY })
    }
  }, [isDragging, dragOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      })
      setIsDragging(true)
      onActivate()
    }
  }, [onActivate])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDragging) {
      const newX = e.touches[0].clientX - dragOffset.x
      const newY = e.touches[0].clientY - dragOffset.y
      setPosition({ x: newX, y: newY })
    }
  }, [isDragging, dragOffset])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }, [onClose])

  const handleMinimizeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onMinimize()
  }, [onMinimize])

  const handleCopy = useCallback(() => {
    const selection = window.getSelection()
    if (selection) {
      setClipboard(selection.toString())
    }
  }, [setClipboard])

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  const handleUrlSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    let newUrl = searchQuery

    // Check if the input is a search query or URL
    if (!newUrl.includes('.') || newUrl.includes(' ')) {
      // If it's a search query, encode it and use Google search
      const encodedQuery = encodeURIComponent(newUrl)
      newUrl = `https://www.google.com/search?q=${encodedQuery}&igu=1`
    } else {
      // If it's a URL, ensure it has https://
      if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
        newUrl = `https://${newUrl}`
      }
    }

    // Update the URL
    setUrl(newUrl)
    setSearchQuery(newUrl)
  }, [searchQuery])

  const handleBackClick = useCallback(() => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.back()
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  }, [])

  const handleForwardClick = useCallback(() => {
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow?.history.forward()
      } catch (error) {
        console.error('Navigation error:', error)
      }
    }
  }, [])

  const handleRefreshClick = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }, [url])

  return (
    <Resizable
      defaultSize={{
        width: Math.min(800, width - 40),
        height: Math.min(600, height - 80)
      }}
      minWidth={300}
      minHeight={200}
      maxWidth={width - 40}
      maxHeight={height - 80}
      style={{
        position: 'absolute',
        top: Math.min(position.y, height - 80),
        left: Math.min(position.x, width - 300),
        zIndex: zIndex,
      }}
    >
      <div
        ref={windowRef}
        className={`w-full h-full bg-white ${colorClasses.text} font-mono rounded-lg shadow-lg overflow-hidden flex flex-col retro-screen ${isActive ? 'ring-2 ring-white' : ''}`}
        onClick={onActivate}
      >
        <div
          className={`${colorClasses.bg} px-4 py-2 flex justify-between items-center cursor-move`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="text-sm retro-text">Internet Explorer</div>
          <div className="flex space-x-2">
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleMinimizeClick} 
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            />
            <button 
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleCloseClick} 
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className={`flex items-center space-x-2 p-2 ${colorClasses.bg}`}>
          <button 
            onClick={handleBackClick} 
            className={`p-1 rounded ${colorClasses.text} hover:${colorClasses.hover}`}
          >
            <ArrowLeft size={16} />
          </button>
          <button 
            onClick={handleForwardClick} 
            className={`p-1 rounded ${colorClasses.text} hover:${colorClasses.hover}`}
          >
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={handleRefreshClick} 
            className={`p-1 rounded ${colorClasses.text} hover:${colorClasses.hover}`}
          >
            <RotateCcw size={16} />
          </button>
          <form onSubmit={handleUrlSubmit} className="flex-grow flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={handleUrlChange}
              placeholder="Search Google or enter a URL"
              className={`flex-grow px-2 py-1 bg-black ${colorClasses.text} border ${colorClasses.border} rounded-l focus:outline-none`}
            />
            <button 
              type="submit" 
              className={`px-3 py-1 ${colorClasses.bg} ${colorClasses.text} border-t border-r border-b ${colorClasses.border} rounded-r hover:${colorClasses.hover}`}
            >
              <Search size={16} />
            </button>
          </form>
        </div>
        <div className="flex-grow p-1 bg-white relative" onCopy={handleCopy}>
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full border-none"
            title="Internet Explorer"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-popups-to-escape-sandbox allow-presentation allow-top-navigation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="origin"
          />
          {url !== 'https://www.google.com/search?igu=1' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className={`p-4 ${colorClasses.bg} rounded-lg text-center`}>
                <p className="retro-text mb-2">This website cannot be displayed in the embedded browser.</p>
                <button
                  onClick={() => window.open(url, '_blank')}
                  className={`px-4 py-2 ${colorClasses.text} border ${colorClasses.border} rounded hover:${colorClasses.hover}`}
                >
                  Open in New Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Resizable>
  )
}

