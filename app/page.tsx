'use client'
import { axios } from '@/lib/axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    verifySession()
  }, [])

  const verifySession = async () => {
    try{
      const response = await axios.get(`admin/session/favoronyechere@gmail.com`)

      router.push('/dashboard')

      console.log(response.data)
    }
    catch(err){
      if(err.response.data.message === 'Session has expired'){
        router.push('/login')
      }
      console.log(err)
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 mb-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h1 className="mt-8 text-3xl font-bold text-gray-900 dark:text-white">Verifying Your Session</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Please wait while we ensure your security...</p>
      </div>
      <div className="mt-12 space-y-2">
        <div className="w-64 h-1 bg-blue-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-full h-full bg-blue-500 animate-load-bar"></div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">This may take a few moments</p>
      </div>
    </div>
  )
}