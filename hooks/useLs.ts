import { useFileSystem } from './useFileSystem'

export function useLs() {
  const { getDirectoryContents } = useFileSystem()

  return (currentDirectory: string) => {
    const contents = getDirectoryContents(currentDirectory)
    return contents.map(item => `${item.name}${item.type === 'directory' ? '/' : ''}`)
  }
}

