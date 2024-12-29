import { useFileSystem } from './useFileSystem'

export function useMkdir() {
  const { createDirectory } = useFileSystem()

  return (currentDirectory: string, directoryName: string) => {
    createDirectory(currentDirectory, directoryName)
    return `Directory created: ${directoryName}`
  }
}

