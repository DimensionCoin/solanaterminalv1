import { useState, useCallback } from 'react'

type FileType = 'file' | 'directory'

interface FileSystemItem {
  name: string
  type: FileType
  content?: string
}

interface FileSystem {
  [path: string]: FileSystemItem[]
}

export function useFileSystem() {
  const [fileSystem, setFileSystem] = useState<FileSystem>({
    '/': [
      { name: 'home', type: 'directory' },
    ],
    '/home': [
      { name: 'user', type: 'directory' },
    ],
    '/home/user': [
      { name: 'Documents', type: 'directory' },
      { name: 'Pictures', type: 'directory' },
      { name: 'Music', type: 'directory' },
      { name: 'Downloads', type: 'directory' },
      { name: 'hello.txt', type: 'file', content: 'Hello, World!' },
    ],
    '/home/user/Documents': [],
    '/home/user/Pictures': [],
    '/home/user/Music': [],
    '/home/user/Downloads': [],
  })

  const normalizePath = useCallback((path: string): string => {
    return ('/' + path).replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  }, [])

  const getDirectoryContents = useCallback((path: string): FileSystemItem[] => {
    const normalizedPath = normalizePath(path)
    return fileSystem[normalizedPath] || []
  }, [fileSystem, normalizePath])

  const createDirectory = useCallback((path: string, name: string) => {
    setFileSystem(prevFS => {
      const updatedFS = { ...prevFS }
      const normalizedPath = normalizePath(path)
      if (!updatedFS[normalizedPath]) {
        updatedFS[normalizedPath] = []
      }
      updatedFS[normalizedPath] = [...updatedFS[normalizedPath], { name, type: 'directory' }]
      updatedFS[`${normalizedPath}/${name}`] = []
      return updatedFS
    })
  }, [normalizePath])

  const createFile = useCallback((path: string, name: string, content: string = '') => {
    setFileSystem(prevFS => {
      const updatedFS = { ...prevFS }
      const normalizedPath = normalizePath(path)
      if (!updatedFS[normalizedPath]) {
        updatedFS[normalizedPath] = []
      }
      updatedFS[normalizedPath] = [...updatedFS[normalizedPath], { name, type: 'file', content }]
      return updatedFS
    })
  }, [normalizePath])

  const updateFileContent = useCallback((path: string, name: string, content: string) => {
    setFileSystem(prevFS => {
      const updatedFS = { ...prevFS }
      const normalizedPath = normalizePath(path)
      const fileIndex = updatedFS[normalizedPath].findIndex(item => item.name === name && item.type === 'file')
      if (fileIndex !== -1) {
        updatedFS[normalizedPath][fileIndex] = { ...updatedFS[normalizedPath][fileIndex], content }
      }
      return updatedFS
    })
  }, [normalizePath])

  const getFileContent = useCallback((path: string, name: string): string | undefined => {
    const normalizedPath = normalizePath(path)
    const file = fileSystem[normalizedPath]?.find(item => item.name === name && item.type === 'file')
    return file?.content
  }, [fileSystem, normalizePath])

  const directoryExists = useCallback((path: string): boolean => {
    const normalizedPath = normalizePath(path)
    return normalizedPath === '/' || normalizedPath in fileSystem
  }, [fileSystem, normalizePath])

  return {
    getDirectoryContents,
    createDirectory,
    createFile,
    updateFileContent,
    getFileContent,
    directoryExists,
    normalizePath,
  }
}

