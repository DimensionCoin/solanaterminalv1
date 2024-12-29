import { useFileSystem } from './useFileSystem'

export function useTouch() {
  const { createFile } = useFileSystem()

  return (currentDirectory: string, fileName: string) => {
    createFile(currentDirectory, fileName)
    return `File created: ${fileName}`
  }
}

