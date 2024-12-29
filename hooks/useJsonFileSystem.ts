import { useState, useCallback } from 'react'

interface FileSystemItem {
  name: string
  type: 'file' | 'directory'
  content?: string
  children?: { [key: string]: FileSystemItem }
}

interface FileSystem {
  [key: string]: FileSystemItem
}

const initialFileSystem: FileSystem = {
  '/': {
    name: '/',
    type: 'directory',
    children: {
      'home': {
        name: 'home',
        type: 'directory',
        children: {
          'user': {
            name: 'user',
            type: 'directory',
            children: {
              'Documents': {
                name: 'Documents',
                type: 'directory',
                children: {
                  'journal.txt': { name: 'journal.txt', type: 'file', content: "April 15, 1992\nDear Diary,\nToday I started learning BASIC. It's pretty cool! I hope I can make my own games someday.\n\nApril 20, 1992\nMom says I spend too much time on the computer. But I'm learning so much!" },
                  'todo.txt': { name: 'todo.txt', type: 'file', content: "1. Finish BASIC tutorial\n2. Debug space invaders clone\n3. Call grandma\n4. Buy new floppy disks" },
                  'homework': {
                    name: 'homework',
                    type: 'directory',
                    children: {
                      'math_assignment.txt': { name: 'math_assignment.txt', type: 'file', content: "1. Solve quadratic equations on page 57\n2. Complete geometry worksheet\n3. Study for upcoming test on logarithms" },
                      'history_essay.txt': { name: 'history_essay.txt', type: 'file', content: "The Impact of the Industrial Revolution\n\n[Essay content to be written]" }
                    }
                  }
                }
              },
              'Desktop': {
                name: 'Desktop',
                type: 'directory',
                children: {}
              },
              'Pictures': {
                name: 'Pictures',
                type: 'directory',
                children: {
                  'family_picnic.bmp': { name: 'family_picnic.bmp', type: 'file', content: "[Binary content of a bitmap image]" },
                  'my_cat.bmp': { name: 'my_cat.bmp', type: 'file', content: "[Binary content of a bitmap image]" }
                }
              },
              'Music': {
                name: 'Music',
                type: 'directory',
                children: {
                  'favorite_songs.txt': { name: 'favorite_songs.txt', type: 'file', content: "1. Smells Like Teen Spirit - Nirvana\n2. Gonna Make You Sweat - C+C Music Factory\n3. Ice Ice Baby - Vanilla Ice\n4. Nothing Compares 2 U - Sinéad O'Connor" },
                  'midi_files': {
                    name: 'midi_files',
                    type: 'directory',
                    children: {
                      'awesome_tune.mid': { name: 'awesome_tune.mid', type: 'file', content: "[Binary content of a MIDI file]" }
                    }
                  }
                }
              },
              'Games': {
                name: 'Games',
                type: 'directory',
                children: {
                  'guess_number.js': { 
                    name: 'guess_number.js', 
                    type: 'file', 
                    content: `
const readline = require('readline');

function guessNumber() {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Welcome to Guess the Number!");
  console.log("I'm thinking of a number between 1 and 100.");

  function askGuess() {
    rl.question("What's your guess? ", (answer) => {
      const guess = parseInt(answer);
      attempts++;

      if (isNaN(guess)) {
        console.log("Please enter a valid number.");
        askGuess();
      } else if (guess < secretNumber) {
        console.log("Too low! Try again.");
        askGuess();
      } else if (guess > secretNumber) {
        console.log("Too high! Try again.");
        askGuess();
      } else {
        console.log(\`Congratulations! You guessed the number in \${attempts} attempts.\`);
        rl.close();
      }
    });
  }

  askGuess();
}

guessNumber();
`
                  },
                  'rock_paper_scissors.js': {
                    name: 'rock_paper_scissors.js',
                    type: 'file',
                    content: `
function rockPaperScissors() {
  const choices = ['rock', 'paper', 'scissors'];
  let playerScore = 0;
  let computerScore = 0;

  function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'player';
    }
    return 'computer';
  }

  function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    let message = \`You chose \${playerChoice}, computer chose \${computerChoice}. \`;

    if (result === 'tie') {
      message += "It's a tie!";
    } else if (result === 'player') {
      playerScore++;
      message += "You win this round!";
    } else {
      computerScore++;
      message += "Computer wins this round!";
    }

    message += \`\\nScore - You: \${playerScore}, Computer: \${computerScore}\`;

    return message;
  }

  return playRound;
}

// The game logic is returned as a function to be used in the terminal
rockPaperScissors();
`
                  }
                }
              },
              'Programs': {
                name: 'Programs',
                type: 'directory',
                children: {
                  'BASIC': {
                    name: 'BASIC',
                    type: 'directory',
                    children: {
                      'hello_world.bas': { name: 'hello_world.bas', type: 'file', content: "10 PRINT \"Hello, World!\"\n20 END" },
                      'calculator.bas': { name: 'calculator.bas', type: 'file', content: "10 INPUT \"Enter first number: \", A\n20 INPUT \"Enter second number: \", B\n30 PRINT \"Sum: \"; A + B\n40 END" }
                    }
                  },
                  'WordProcessor': {
                    name: 'WordProcessor',
                    type: 'directory',
                    children: {
                      'letter.doc': { name: 'letter.doc', type: 'file', content: "Dear Sir/Madam,\n\nI hope this letter finds you well...\n\n[Rest of the letter content]" }
                    }
                  }
                }
              },
              'CONFIG.SYS': { name: 'CONFIG.SYS', type: 'file', content: "FILES=40\nBUFFERS=20\nDEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE RAM" },
              'AUTOEXEC.BAT': { name: 'AUTOEXEC.BAT', type: 'file', content: "@ECHO OFF\nPROMPT $P$G\nPATH C:\\DOS;C:\\WINDOWS\nWIN" }
            },
          },
        },
      },
      'system': {
        name: 'system',
        type: 'directory',
        children: {
          'COMMAND.COM': { name: 'COMMAND.COM', type: 'file', content: "[Binary content of COMMAND.COM]" },
          'MSDOS.SYS': { name: 'MSDOS.SYS', type: 'file', content: "[Binary content of MSDOS.SYS]" },
          'IO.SYS': { name: 'IO.SYS', type: 'file', content: "[Binary content of IO.SYS]" },
          'DRIVERS': {
            name: 'DRIVERS',
            type: 'directory',
            children: {
              'MOUSE.SYS': { name: 'MOUSE.SYS', type: 'file', content: "[Binary content of mouse driver]" },
              'HIMEM.SYS': { name: 'HIMEM.SYS', type: 'file', content: "[Binary content of extended memory manager]" }
            }
          }
        }
      }
    },
  },
}

export function useJsonFileSystem() {
  const [fileSystem, setFileSystem] = useState<FileSystem>(initialFileSystem)

  const updateFileSystem = useCallback((newFileSystem: FileSystem) => {
    setFileSystem(newFileSystem)
  }, [])

  const normalizePath = useCallback((path: string): string[] => {
    return path.split('/').filter(Boolean)
  }, [])

  const getItem = useCallback((path: string): FileSystemItem | null => {
    const parts = normalizePath(path)
    let current: FileSystemItem = fileSystem['/']
    for (const part of parts) {
      if (current.type !== 'directory' || !current.children || !current.children[part]) {
        return null
      }
      current = current.children[part]
    }
    return current
  }, [fileSystem, normalizePath])

  const getDirectoryContents = useCallback((path: string): FileSystemItem[] => {
    const item = getItem(path)
    if (item && item.type === 'directory' && item.children) {
      const contents = Object.values(item.children)
      return contents
    }
    return []
  }, [getItem])

  const createDirectory = useCallback((path: string, name: string) => {
    updateFileSystem(prevFS => {
      const newFS = JSON.parse(JSON.stringify(prevFS)) // Deep clone
      const parts = normalizePath(path)
      let current = newFS['/']
      for (const part of parts) {
        if (!current.children[part]) {
          return prevFS // Path doesn't exist
        }
        current = current.children[part]
      }
      if (current.type !== 'directory') {
        return prevFS // Not a directory
      }
      if (!current.children) {
        current.children = {}
      }
      console.log('Creating directory:', path, name);
      console.log('Current file system:', JSON.stringify(newFS, null, 2));
      current.children[name] = { name, type: 'directory', children: {} }
      console.log('Updated file system:', JSON.stringify(newFS, null, 2));
      return newFS
    })
  }, [normalizePath, updateFileSystem])

  const createFile = useCallback((path: string, name: string, content: string = '') => {
    updateFileSystem(prevFS => {
      const newFS = JSON.parse(JSON.stringify(prevFS)) // Deep clone
      const parts = normalizePath(path)
      let current = newFS['/']
      for (const part of parts) {
        if (!current.children[part]) {
          return prevFS // Path doesn't exist
        }
        current = current.children[part]
      }
      if (current.type !== 'directory') {
        return prevFS // Not a directory
      }
      if (!current.children) {
        current.children = {}
      }
      console.log('Creating file:', path, name);
      console.log('Current file system:', JSON.stringify(newFS, null, 2));
      current.children[name] = { name, type: 'file', content }
      console.log('Updated file system:', JSON.stringify(newFS, null, 2));
      return newFS
    })
  }, [normalizePath, updateFileSystem])

  const updateFileContent = useCallback((path: string, name: string, content: string) => {
    updateFileSystem(prevFS => {
      const newFS = JSON.parse(JSON.stringify(prevFS)) // Deep clone
      const parts = normalizePath(path)
      let current = newFS['/']
      for (const part of parts) {
        if (!current.children[part]) {
          return prevFS // Path doesn't exist
        }
        current = current.children[part]
      }
      if (current.type !== 'directory' || !current.children[name] || current.children[name].type !== 'file') {
        return prevFS // Not a file
      }
      console.log('Updating file content:', path, name);
      console.log('Current file system:', JSON.stringify(newFS, null, 2));
      current.children[name].content = content
      console.log('Updated file system:', JSON.stringify(newFS, null, 2));
      return newFS
    })
  }, [normalizePath, updateFileSystem])

  const removeItem = useCallback((path: string, name: string) => {
    updateFileSystem(prevFS => {
      const newFS = JSON.parse(JSON.stringify(prevFS)) // Deep clone
      const parts = normalizePath(path)
      let current = newFS['/']
      for (const part of parts) {
        if (!current.children[part]) {
          return prevFS // Path doesn't exist
        }
        current = current.children[part]
      }
      if (current.type !== 'directory' || !current.children[name]) {
        return prevFS // Not a directory or item doesn't exist
      }
      delete current.children[name]
      return newFS
    })
  }, [normalizePath, updateFileSystem])

  const getFileContent = useCallback((path: string, name: string): string | undefined => {
    const item = getItem(`${path}/${name}`)
    return item && item.type === 'file' ? item.content : undefined
  }, [getItem])

  const directoryExists = useCallback((path: string): boolean => {
    const item = getItem(path)
    const exists = item !== null && item.type === 'directory'
    return exists
  }, [getItem])

  const moveItem = useCallback((sourcePath: string, destinationPath: string) => {
    updateFileSystem(prevFS => {
      const newFS = JSON.parse(JSON.stringify(prevFS)) // Deep clone
      const sourcePathParts = normalizePath(sourcePath)
      const destPathParts = normalizePath(destinationPath)
      const sourceFileName = sourcePathParts.pop()
      const sourceDir = sourcePathParts.join('/')
      const destDir = destPathParts.join('/')

      if (!sourceFileName) {
        return prevFS
      }

      let current = newFS['/']
      for (const part of sourcePathParts) {
        if (!current.children[part]) {
          return prevFS
        }
        current = current.children[part]
      }

      if (!current.children[sourceFileName]) {
        return prevFS
      }

      const item = current.children[sourceFileName]
      delete current.children[sourceFileName]

      current = newFS['/']
      for (const part of destPathParts) {
        if (!current.children[part]) {
          current.children[part] = { name: part, type: 'directory', children: {} }
        }
        current = current.children[part]
      }

      if (current.type !== 'directory') {
        return prevFS
      }

      current.children[item.name] = item

      return newFS
    })
  }, [normalizePath, updateFileSystem])

  return {
    getDirectoryContents,
    createDirectory,
    createFile,
    updateFileContent,
    removeItem,
    getFileContent,
    directoryExists,
    normalizePath,
    fileSystem,
    moveItem,
  }
}

