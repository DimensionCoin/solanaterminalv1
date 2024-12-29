import '@/styles/globals.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata = {
  title: 'Solana Termina; V1',
  description: 'Experience the nostalgia of an old computer interface while interacting with the solana blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="retro-screen">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

