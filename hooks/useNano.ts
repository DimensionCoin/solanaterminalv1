import { useFileSystem } from './useFileSystem'

export function useNano() {
  const { getFileContent, updateFileContent } = useFileSystem()

  return {
    getContent: (currentDirectory: string, fileName: string): string => {
      const content = getFileContent(currentDirectory, fileName)
      if (content === undefined) {
        throw new Error(`nano: ${fileName}: No such file`)
      }
      return content
    },
    saveContent: (currentDirectory: string, fileName: string, content: string): void => {
      updateFileContent(currentDirectory, fileName, content)
    }
  }
}

