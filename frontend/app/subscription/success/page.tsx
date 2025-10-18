'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Loader2, Crown } from 'lucide-react'
import { paystackApi } from '@/lib/api'
import { getUser, setUser } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')

    if (reference || trxref) {
      verifyPayment(reference || trxref || '')
    } else {
      setStatus('error')
      setMessage('No payment reference found')
    }
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await paystackApi.verifyPayment(reference)
      
      if (response.subscription) {
        // Update user data
        const user = getUser()
        if (user) {
          const updatedUser = {
            ...user,
            subscription: {
              plan: 'premium' as 'free' | 'premium',
              expiresAt: response.subscription.expiresAt
            }
          }
          setUser(updatedUser)
        }
        
        setStatus('success')
        setMessage('Payment successful! Your subscription is now active.')
        toast.success('Subscription activated successfully!')
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setStatus('error')
        setMessage('Payment verification failed')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(error.response?.data?.message || 'Payment verification failed')
      toast.error('Payment verification failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="card">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Verifying Payment...</h1>
              <p className="text-gray-400">Please wait while we verify your payment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="flex items-center justify-center space-x-2 bg-accent-500/20 text-accent-400 px-4 py-2 rounded-lg mb-6">
                <Crown className="w-5 h-5" />
                <span className="font-semibold">Premium Active</span>
              </div>
              <p className="text-sm text-gray-500">Redirecting to home page...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-4">Payment Failed</h1>
              <p className="text-gray-400 mb-6">{message}</p>
              <button
                onClick={() => router.push('/subscription')}
                className="btn-primary w-full"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
