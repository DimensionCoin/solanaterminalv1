'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Resizable } from 're-resizable'
import { useAppContext } from '@/contexts/AppContext'
import { useWindowSize } from '@/hooks/useWindowSize'

interface PreferencesWindowProps {
  id: number
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  isActive: boolean
  colorScheme: 'green' | 'purple'
  setColorScheme: (colorScheme: 'green' | 'purple') => void
}

export function PreferencesWindow({
  id,
  zIndex,
  onClose,
  onMinimize,
  onActivate,
  isActive,
  colorScheme,
  setColorScheme
}: PreferencesWindowProps) {
  const [position, setPosition] = useState({ x: 100 + (id % 5) * 20, y: 100 + (id % 5) * 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const { width, height } = useWindowSize()

  const colorClasses = {
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
  }[colorScheme]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && windowRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && windowRef.current) {
        const newX = e.touches[0].clientX - dragOffset.x
        const newY = e.touches[0].clientY - dragOffset.y
        setPosition({ x: newX, y: newY })
      }
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove)
      document.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, dragOffset])

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

  const handleCloseClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onClose()
  }, [onClose])

  const handleMinimizeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onMinimize()
  }, [onMinimize])

  const handleColorChange = useCallback((newColor: 'green' | 'purple') => {
    setColorScheme(newColor)
    window.dispatchEvent(new CustomEvent('color-scheme-change', { detail: { colorScheme: newColor } }))
  }, [setColorScheme])

  return (
    <Resizable
      defaultSize={{
        width: Math.min(400, width - 40),
        height: Math.min(300, height - 80)
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
        className={`w-full h-full bg-black ${colorClasses.text} font-mono rounded-lg shadow-lg overflow-hidden flex flex-col retro-screen ${isActive ? 'ring-2 ring-white' : ''}`}
        onClick={onActivate}
      >
        <div
          className={`${colorClasses.bg} px-4 py-2 flex justify-between items-center cursor-move`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="text-sm retro-text">System Preferences</div>
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
        <div className="flex-grow p-4 overflow-auto">
          <h2 className={`${colorClasses.text} retro-text mb-4`}>Color Scheme</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => handleColorChange('green')}
              className={`px-4 py-2 rounded-md ${colorScheme === 'green' ? 'bg-green-600' : 'bg-green-900'} text-green-100`}
            >
              Green
            </button>
            <button
              onClick={() => handleColorChange('purple')}
              className={`px-4 py-2 rounded-md ${colorScheme === 'purple' ? 'bg-purple-600' : 'bg-purple-900'} text-purple-100`}
            >
              Purple
            </button>
          </div>
        </div>
      </div>
    </Resizable>
  )
}

