'use client'

import { useState, useRef, useEffect, useCallback, KeyboardEvent, useMemo } from 'react'
import { useClear } from '@/hooks/useClear'
import { usePwd } from '@/hooks/usePwd'
import { useJsonFileSystem } from '@/hooks/useJsonFileSystem'
import { Resizable } from 're-resizable'
import { useAppContext } from '@/contexts/AppContext'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useConnect } from '@/hooks/useConnect'
import { useDisconnect } from '@/hooks/useDisconnect'
import { useTransfer } from '@/hooks/useTransfer'
import { useReceive } from '@/hooks/useReceive'
import { useBalance } from '@/hooks/useBalance'
import { usePublicKey } from '@/hooks/usePublicKey'
import { useSwap } from '@/hooks/useSwap'
import { useCreateSpl } from '@/hooks/useCreateSpl'
import { useBurner } from '@/hooks/useBurner'

interface TerminalProps {
  id: number
  zIndex: number
  onClose: () => void
  onMinimize: () => void
  onActivate: () => void
  isActive: boolean
  colorScheme: 'green' | 'purple'
  initialContent?: {
    output: string[]
    currentDirectory: string
    commandHistory: string[]
  }
  updateContent: (id: number, content: TerminalProps['initialContent']) => void
}

export function Terminal({
  id,
  zIndex,
  onClose,
  onMinimize,
  onActivate,
  isActive,
  colorScheme,
  initialContent,
  updateContent
}: TerminalProps) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState(initialContent?.output || ['Welcome to RetroOS. Type "help" for a list of commands.'])
  const [currentDirectory, setCurrentDirectory] = useState(initialContent?.currentDirectory || '/home/user')
  const [position, setPosition] = useState({ x: 50 + (id % 5) * 20, y: 50 + (id % 5) * 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState('')
  const [editFileName, setEditFileName] = useState('')
  const [commandHistory, setCommandHistory] = useState(initialContent?.commandHistory || [])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isPlayingGame, setIsPlayingGame] = useState<false | 'guess_number' | 'rock_paper_scissors'>(false)
  const [secretNumber, setSecretNumber] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [rpsGame, setRpsGame] = useState<Function | null>(null)

  const terminalRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const editRef = useRef<HTMLTextAreaElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  const { setClipboard } = useAppContext()
  const { width, height } = useWindowSize()

  const clear = useClear()
  const pwd = usePwd()
  const { getDirectoryContents, createFile, createDirectory, updateFileContent, getFileContent, directoryExists, normalizePath, fileSystem, removeItem, moveItem } = useJsonFileSystem()
  const connect = useConnect()
  const disconnect = useDisconnect()
  const transfer = useTransfer()
  const receive = useReceive()
  const balance = useBalance()
  const publicKey = usePublicKey()
  const swap = useSwap()
  const createSpl = useCreateSpl()
  const burner = useBurner()

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

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && terminalRef.current) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y
        setPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
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
    if (terminalRef.current) {
      const rect = terminalRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
      setIsDragging(true)
      onActivate()
    }
  }, [onActivate])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (terminalRef.current) {
      const rect = terminalRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      })
      setIsDragging(true)
      onActivate()
    }
  }, [onActivate])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && terminalRef.current) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      setPosition({ x: newX, y: newY })
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

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


  const cd = useCallback((targetDirectory: string): string => {
    if (targetDirectory === '..') {
      const parts = currentDirectory.split('/').filter(Boolean)
      parts.pop()
      return '/' + parts.join('/') || '/'
    }

    const newPath = targetDirectory.startsWith('/')
      ? targetDirectory
      : `${currentDirectory}/${targetDirectory}`

    const normalizedPath = '/' + normalizePath(newPath).join('/')

    if (directoryExists(normalizedPath)) {
      return normalizedPath
    } else {
      throw new Error(`cd: ${targetDirectory}: No such file or directory`)
    }
  }, [currentDirectory, directoryExists, normalizePath])

  const handleCommand = useCallback(async (command: string) => {
    const parts = command.trim().split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    setOutput((prev) => {
      const newOutput = [...prev, `${currentDirectory} $ ${command}`]

      try {
        switch (cmd) {
          case 'clear':
            return clear()
          case 'pwd':
            return [...newOutput, pwd(currentDirectory)]
          case 'ls':
            const contents = getDirectoryContents(currentDirectory)
            return [...newOutput, ...contents.map(item => `${item.name}${item.type === 'directory' ? '/' : ''}`)]
          case 'mkdir':
            if (args.length === 1) {
              createDirectory(currentDirectory, args[0])
              return [...newOutput, `Directory created: ${args[0]}`]
            } else {
              return [...newOutput, 'Usage: mkdir <directory_name>']
            }
          case 'touch':
            if (args.length === 1) {
              createFile(currentDirectory, args[0])
              return [...newOutput, `File created: ${args[0]}`]
            } else {
              return [...newOutput, 'Usage: touch <file_name>']
            }
          case 'cd':
            if (args.length === 1) {
              try {
                const newDir = cd(args[0])
                setCurrentDirectory(newDir)
                return [...newOutput, `Changed directory to: ${newDir}`]
              } catch (error) {
                return [...newOutput, (error as Error).message]
              }
            } else {
              return [...newOutput, 'Usage: cd <directory>']
            }
          case 'nano':
            if (args.length === 1) {
              const content = getFileContent(currentDirectory, args[0]) || ''
              setIsEditing(true)
              setEditContent(content)
              setEditFileName(args[0])
              return newOutput
            } else {
              return [...newOutput, 'Usage: nano <file_name>']
            }
          case 'cat':
            if (args.length === 1) {
              const content = getFileContent(currentDirectory, args[0])
              return content !== undefined
                ? [...newOutput, content]
                : [...newOutput, `cat: ${args[0]}: No such file or directory`]
            } else {
              return [...newOutput, 'Usage: cat <file_name>']
            }
          case 'rm':
            if (args.length === 1) {
              const item = getDirectoryContents(currentDirectory).find(item => item.name === args[0])
              if (item) {
                removeItem(currentDirectory, args[0])
                return [...newOutput, `Removed: ${args[0]}`]
              } else {
                return [...newOutput, `rm: ${args[0]}: No such file or directory`]
              }
            } else {
              return [...newOutput, 'Usage: rm <file_or_directory_name>']
            }
          case 'mv':
            if (args.length === 2) {
              const sourcePath = args[0].startsWith('/') ? args[0] : `${currentDirectory}/${args[0]}`
              const destPath = args[1].startsWith('/') ? args[1] : `${currentDirectory}/${args[1]}`
              moveItem(sourcePath, destPath)
              return [...newOutput, `Moved ${args[0]} to ${args[1]}`]
            } else {
              return [...newOutput, 'Usage: mv <source> <destination>']
            }
          case 'connect':
            return [...newOutput, connect()]
          case 'disconnect':
            return [...newOutput, disconnect()]
          case 'transfer':
            return [...newOutput, transfer()]
          case 'receive':
            return [...newOutput, receive()]
          case 'balance':
            return [...newOutput, balance()]
          case 'publickey':
            return [...newOutput, publicKey()]
          case 'swap':
            return [...newOutput, swap()]
          case 'createspl':
            return [...newOutput, createSpl()]
          case 'burner':
            const { mnemonic, privateKey, publicKey, walletInfo } = burner();
            createDirectory('/home/user', 'burner');
            createFile('/home/user/burner', 'wallet.txt');
            updateFileContent('/home/user/burner', 'wallet.txt', walletInfo);
            return [
              ...newOutput,
              'Burner wallet generated successfully!',
              '',
              `Mnemonic: ${mnemonic}`,
              `Private Key: ${privateKey}`,
              `Public Key: ${publicKey}`,
              '',
              'Wallet information has been saved to /home/user/burner/wallet.txt.',
              '',
              'SECURITY DISCLAIMER:',
              'This is an unsafe burner wallet with little security.',
              'DO NOT load a large amount of money into this wallet.',
              'It is intended for temporary use and testing purposes only.',
              'For long-term storage or significant amounts, use a hardware wallet or a more secure solution.',
            ];
          case 'help':
            return [
              ...newOutput,
              'Available commands:',
              'clear - Clear the terminal',
              'pwd - Print working directory',
              'ls - List directory contents',
              'mkdir <directory_name> - Create a new directory',
              'touch <file_name> - Create a new file',
              'cd <directory> - Change directory',
              'nano <file_name> - Edit a file',
              'cat <file_name> - Display file contents',
              'rm <file_or_directory_name> - Remove a file or directory',
              'mv <source> <destination> - Move a file or directory',
              'connect - Connect to a Solana wallet',
              'disconnect - Disconnect from the current Solana wallet',
              'transfer - Transfer SOL or SPL tokens',
              'receive - Display address to receive SOL or SPL tokens',
              'balance - Check balance of SOL or SPL tokens',
              'publickey - Display the public key of the connected wallet',
              'swap - Swap tokens on the Solana blockchain',
              'createspl - Create a new SPL token',
              'burner - Generate a burner wallet',
              'help - Show this help message',
              'play guess_number - Play the Guess the Number game',
              'play rock_paper_scissors - Play the Rock Paper Scissors game',
            ]
          case 'play':
            if (args.length === 1) {
              if (currentDirectory === '/home/user/Games') {
                if (args[0] === 'guess_number') {
                  const gameContent = getFileContent(currentDirectory, 'guess_number.js')
                  if (gameContent) {
                    setIsPlayingGame('guess_number')
                    setSecretNumber(Math.floor(Math.random() * 100) + 1)
                    setAttempts(0)
                    return [
                      ...newOutput,
                      "Starting Guess the Number game...",
                      "Welcome to Guess the Number!",
                      "I'm thinking of a number between 1 and 100.",
                      "What's your guess? "
                    ]
                  } else {
                    return [...newOutput, "Error: Unable to start the game."]
                  }
                } else if (args[0] === 'rock_paper_scissors') {
                  const gameContent = getFileContent(currentDirectory, 'rock_paper_scissors.js')
                  if (gameContent) {
                    setIsPlayingGame('rock_paper_scissors')
                    try {
                      const gameFunction = new Function(gameContent + '\nreturn rockPaperScissors();')()
                      if (typeof gameFunction === 'function') {
                        setRpsGame(() => gameFunction)
                        return [
                          ...newOutput,
                          "Starting Rock Paper Scissors game...",
                          "Enter 'rock', 'paper', or 'scissors' to play.",
                          "Enter 'quit' to end the game.",
                          "What's your choice? "
                        ]
                      } else {
                        throw new Error("Game function is not valid")
                      }
                    } catch (error) {
                      return [...newOutput, "Error: Unable to start the game. The game file might be corrupted."]
                    }
                  } else {
                    return [...newOutput, "Error: Unable to start the game. The game file is missing."]
                  }
                } else {
                  return [...newOutput, "Unknown game. Available games: guess_number, rock_paper_scissors"]
                }
              } else {
                return [...newOutput, "Error: Please navigate to the Games directory to play."]
              }
            } else {
              return [...newOutput, "Usage: play <game_name>"]
            }
          default:
            return [...newOutput, `Command not found: ${cmd}`]
        }
      } catch (error) {
        if (error instanceof Error) {
          return [...newOutput, `Error: ${error.message}`]
        } else {
          return [...newOutput, 'An unknown error occurred']
        }
      }
    })

    setCommandHistory(prev => [...prev, command])
  }, [clear, pwd, cd, currentDirectory, getDirectoryContents, createFile, createDirectory, getFileContent, removeItem, moveItem, connect, disconnect, transfer, receive, balance, publicKey, swap, createSpl, burner, updateFileContent])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      if (isPlayingGame === 'guess_number') {
        const guess = parseInt(input)
        setAttempts(prev => prev + 1)
        setOutput(prev => {
          const newOutput = [...prev, input]
          if (isNaN(guess)) {
            return [...newOutput, "Please enter a valid number.", "What's your guess? "]
          } else if (guess < secretNumber) {
            return [...newOutput, "Too low! Try again.", "What's your guess? "]
          } else if (guess > secretNumber) {
            return [...newOutput, "Too high! Try again.", "What's your guess? "]
          } else {
            setIsPlayingGame(false)
            return [...newOutput, `Congratulations! You guessed the number in ${attempts + 1} attempts.`]
          }
        })
      } else if (isPlayingGame === 'rock_paper_scissors') {
        const playerChoice = input.toLowerCase()
        if (['rock', 'paper', 'scissors'].includes(playerChoice)) {
          if (rpsGame && typeof rpsGame === 'function') {
            try {
              const result = rpsGame(playerChoice)
              setOutput(prev => [...prev, input, result, "What's your choice? "])
            } catch (error) {
              setOutput(prev => [...prev, "An error occurred while playing. The game will now end."])
              setIsPlayingGame(false)
              setRpsGame(null)
            }
          } else {
            setOutput(prev => [...prev, "An error occurred with the game. The game will now end."])
            setIsPlayingGame(false)
            setRpsGame(null)
          }
        } else if (playerChoice === 'quit') {
          setIsPlayingGame(false)
          setRpsGame(null)
          setOutput(prev => [...prev, "Thanks for playing Rock Paper Scissors!"])
        } else {
          setOutput(prev => [...prev, "Invalid choice. Please enter 'rock', 'paper', 'scissors', or 'quit'.", "What's your choice? "])
        }
      } else {
        handleCommand(input)
      }
      setHistoryIndex(-1)
      setInput('')
    }
  }, [input, handleCommand, isPlayingGame, secretNumber, attempts, rpsGame])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = prev < commandHistory.length - 1 ? prev + 1 : prev
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        return newIndex
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : -1
        setInput(newIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - newIndex] || '')
        return newIndex
      })
    }
  }, [commandHistory])

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

  const handleCopy = useCallback(() => {
    const selection = window.getSelection()
    if (selection) {
      setClipboard(selection.toString())
    }
  }, [setClipboard])

  const handleSaveEdit = useCallback(() => {
    updateFileContent(currentDirectory, editFileName, editContent)
    setIsEditing(false)
    setOutput(prev => [...prev, `File saved: ${editFileName}`])
  }, [updateFileContent, currentDirectory, editFileName, editContent])

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false)
    setOutput(prev => [...prev, 'File edit cancelled'])
  }, [])

  useEffect(() => {
    const newContent = { output, currentDirectory, commandHistory }
    if (JSON.stringify(newContent) !== JSON.stringify(initialContent)) {
      updateContent(id, newContent)
    }
  }, [output, currentDirectory, commandHistory, updateContent, id, initialContent])

  return (
    <Resizable
      defaultSize={{
        width: Math.min(600, width - 40),
        height: Math.min(400, height - 80)
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
        ref={terminalRef}
        className={`w-full h-full bg-black ${colorClasses.text} font-mono rounded-lg shadow-lg overflow-hidden flex flex-col retro-screen ${isActive ? 'ring-2 ring-white' : ''}`}
        onClick={onActivate}
      >
        <div
          className={`${colorClasses.bg} px-4 py-2 flex justify-between items-center cursor-move`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="text-sm retro-text">Terminal</div>
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
        <div
          ref={outputRef}
          className="flex-grow p-4 overflow-auto"
          onCopy={handleCopy}
        >
          {output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap retro-text">{line}</div>
          ))}
        </div>
        {isEditing ? (
          <div className="p-4">
            <textarea
              ref={editRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className={`w-full h-40 bg-black ${colorClasses.text} font-mono p-2 border ${colorClasses.border} focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            />
            <div className="flex justify-end mt-2 space-x-2">
              <button
                onClick={handleSaveEdit}
                className={`px-4 py-2 ${colorClasses.bg} ${colorClasses.text} rounded`}
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className={`px-4 py-2 bg-gray-700 text-gray-300 rounded`}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`flex px-4 py-2 ${colorClasses.bg}`}>
            <span className="mr-2 retro-text">{currentDirectory} $</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`flex-grow bg-transparent outline-none retro-text ${colorClasses.text}`}
              autoFocus
            />
          </form>
        )}
      </div>
    </Resizable>
  )
}

