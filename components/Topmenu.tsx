'use client'

import { MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, Menubar } from '@/components/ui/menubar'
import { useAppContext } from '@/contexts/AppContext'

export function Topmenu() {
  const { clipboard, setClipboard, minimizeAllWindows, zoomAll, closeAll, colorScheme } = useAppContext()

  const handleCopy = () => {
    const selectedText = window.getSelection()?.toString()
    if (selectedText) {
      setClipboard(selectedText)
    }
  }

  const handlePaste = () => {
    window.dispatchEvent(new CustomEvent('paste-text', { detail: { text: clipboard } }))
  }

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

  return (
    <Menubar className={`px-2 border-b ${colorClasses.border} bg-black ${colorClasses.text}`}>
      <MenubarMenu>
        <MenubarTrigger className="font-bold retro-text">Solana Terminal V.1</MenubarTrigger>
        <MenubarContent className={`bg-black ${colorClasses.border} z-[9999]`}>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={() => window.dispatchEvent(new CustomEvent('open-about'))}>About This Computer</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={() => window.dispatchEvent(new CustomEvent('open-preferences'))}>System Preferences</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`}>App Store...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="retro-text">File</MenubarTrigger>
        <MenubarContent className={`bg-black ${colorClasses.border} z-[9999]`}>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={() => window.dispatchEvent(new CustomEvent('open-terminal'))}>
            New Terminal
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="retro-text">Edit</MenubarTrigger>
        <MenubarContent className={`bg-black ${colorClasses.border} z-[9999]`}>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={handleCopy}>Cut</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={handleCopy}>Copy</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={handlePaste}>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="retro-text">Window</MenubarTrigger>
        <MenubarContent className={`bg-black ${colorClasses.border} z-[9999]`}>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={zoomAll}>Zoom All</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={closeAll}>Close All</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="retro-text">Help</MenubarTrigger>
        <MenubarContent className={`bg-black ${colorClasses.border} z-[9999]`}>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`}>Search</MenubarItem>
          <MenubarItem className={`${colorClasses.text} ${colorClasses.hover}`} onClick={() => window.open('https://www.google.com', '_blank')}>
            Online Help
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

