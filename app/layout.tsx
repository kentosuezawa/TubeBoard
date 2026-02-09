import type { Metadata } from 'next'
import { Suspense } from 'react'
import { AuthProvider } from '@/lib/auth/provider'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'TubeBoard - YouTube探索支援サービス',
  description: '新しい発見を取り戻すための、YouTube探索支援Webサービス',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
