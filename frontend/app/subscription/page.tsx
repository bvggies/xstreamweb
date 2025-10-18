'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Crown, Check, Star, Zap, Shield, Clock, CreditCard } from 'lucide-react'
import { subscriptionApi, paystackApi } from '@/lib/api'
import { getUser, hasActiveSubscription } from '@/lib/auth'
import { User } from '@/types'
import toast from 'react-hot-toast'

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = getUser()
    setUser(userData)
    
    if (userData) {
      fetchSubscriptionStatus()
    } else {
      router.push('/login')
    }
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionApi.getStatus()
      setSubscription(response.subscription)
    } catch (error) {
      console.error('Error fetching subscription status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setProcessing(true)
    try {
      const response = await paystackApi.initializePayment({
        email: user.email,
        amount: 5000 // 50 NGN in kobo
      })
      
      // Redirect to Paystack payment page
      window.location.href = response.authorization_url
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment')
    } finally {
      setProcessing(false)
    }
  }

  const isActive = user && hasActiveSubscription(user)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Loading...</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-display mb-6">
            <span className="gradient-text">Choose Your Plan</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Unlock unlimited access to live football matches, HD streaming, and exclusive content
          </p>
        </div>

        {/* Current Status */}
        {user && (
          <div className="card mb-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isActive ? 'bg-accent-500/20' : 'bg-gray-500/20'
              }`}>
                <Crown className={`w-8 h-8 ${isActive ? 'text-accent-400' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {isActive ? 'Premium Active' : 'Free Plan'}
              </h3>
              <p className="text-gray-400 mb-4">
                {isActive 
                  ? 'You have unlimited access to all features'
                  : 'Upgrade to Premium for unlimited access'
                }
              </p>
              {isActive && subscription?.expiresAt && (
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Expires on {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="card">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <div className="text-4xl font-bold text-gray-400 mb-2">₦0</div>
              <p className="text-gray-500">Forever</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Access to match schedules</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Live scores and updates</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Match highlights</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-gray-500">Live streaming</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
                <span className="text-gray-500">HD quality</span>
              </li>
            </ul>

            <button 
              disabled
              className="w-full py-3 px-6 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Plan */}
          <div className="card border-2 border-primary-500 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Premium Plan</h3>
              <div className="text-4xl font-bold text-primary-400 mb-2">₦50</div>
              <p className="text-gray-500">per month</p>
            </div>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Everything in Free</span>
              </li>
              <li className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-accent-400" />
                <span className="text-white font-medium">Live HD streaming</span>
              </li>
              <li className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-accent-400" />
                <span className="text-white font-medium">All matches access</span>
              </li>
              <li className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-accent-400" />
                <span className="text-white font-medium">Ad-free experience</span>
              </li>
              <li className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-accent-400" />
                <span className="text-white font-medium">Priority support</span>
              </li>
            </ul>

            <button 
              onClick={handleSubscribe}
              disabled={processing || isActive}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : isActive ? (
                'Current Plan'
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Subscribe Now
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Choose Xstream Premium?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400">Stream matches with minimal buffering and instant loading</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">HD Quality</h3>
              <p className="text-gray-400">Watch matches in crystal clear HD quality</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
              <p className="text-gray-400">Your data is safe with our secure payment system</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-2">How does the subscription work?</h3>
              <p className="text-gray-400">
                Subscribe once and get unlimited access to all live matches for 30 days. 
                Your subscription will auto-renew unless cancelled.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have 
                access until the end of your current billing period.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-400">
                We accept all major credit cards, debit cards, and bank transfers through 
                our secure Paystack payment system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
