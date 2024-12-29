import { useCallback } from 'react'
import { useJsonFileSystem } from './useJsonFileSystem'

export function useCd() {
  const { directoryExists, normalizePath } = useJsonFileSystem()

  return useCallback((currentDirectory: string, targetDirectory: string): string => {
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
  }, [directoryExists, normalizePath])
}

