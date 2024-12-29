import { useFileSystem } from './useFileSystem'

export function useCat() {
  const { getFileContent } = useFileSystem()

  return (currentDirectory: string, fileName: string): string => {
    const content = getFileContent(currentDirectory, fileName)
    if (content === undefined) {
      throw new Error(`cat: ${fileName}: No such file`)
    }
    return content
  }
}

