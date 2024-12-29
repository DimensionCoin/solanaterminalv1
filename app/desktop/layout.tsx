import { Topmenu } from '@/components/Topmenu'
import { Dock } from '@/components/Dock'

export default function DesktopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col bg-gray-800 text-white">
      <Topmenu />
      <div className="flex-grow relative overflow-hidden">
        {children}
      </div>
      <Dock />
    </div>
  )
}

