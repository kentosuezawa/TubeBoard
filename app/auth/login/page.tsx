/**
 * app/auth/login/page.tsx
 * 
 * ログインページ
 */

import { AuthForm } from '@/components/AuthForm'

export const metadata = {
  title: 'ログイン - TubeBoard',
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-2">📺 TubeBoard</h1>
          <p className="text-gray-300">YouTube探索支援サービス</p>
        </div>

        <AuthForm mode="login" />
      </div>
    </main>
  )
}
