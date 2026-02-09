/**
 * AuthForm.tsx
 * 
 * ログイン・サインアップフォーム
 * emailとpasswordでSupabase Authに接続
 */

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/provider'

interface AuthFormProps {
  mode: 'login' | 'signup'
  onSuccess?: () => void
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push('/feed')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Authentication failed'
      setError(errorMessage)
      console.error('Auth error:', err)
    } finally {
      setLoading(false)
    }
  }

  const title = mode === 'login' ? 'ログイン' : 'サインアップ'
  const submitText = mode === 'login' ? 'ログイン' : 'アカウント作成'
  const altText =
    mode === 'login' ? 'アカウントがない？' : 'すでにアカウントがある？'
  const altLink = mode === 'login' ? '/auth/signup' : '/auth/login'
  const altLinkText = mode === 'login' ? 'サインアップ' : 'ログイン'

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-800 p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-900 border border-red-600 rounded text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              メールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary hover:bg-red-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition"
          >
            {loading ? '処理中...' : submitText}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          {altText}{' '}
          <a
            href={altLink}
            className="text-primary hover:underline font-semibold"
          >
            {altLinkText}
          </a>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            デモアカウント:
            <br />
            email: demo@example.com
            <br />
            password: demo123456
          </p>
        </div>
      </div>
    </div>
  )
}
