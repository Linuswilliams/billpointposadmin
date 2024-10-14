'use client'

import { useState, useEffect } from 'react'

interface BackgroundLoaderProps {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  color?: string
  duration?: number
}

export default function BackgroundLoader({
  isLoading,
  setIsLoading,
  color = 'bg-blue-600',
  duration = 2000
}: BackgroundLoaderProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer)
            setIsLoading(false)
            return 100
          }
          const diff = Math.random() * 10
          return Math.min(oldProgress + diff, 100)
        })
      }, duration / 100)

      return () => {
        clearInterval(timer)
      }
    } else {
      setProgress(0)
    }
  }, [isLoading, setIsLoading, duration])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div
        className={`h-1 ${color} transition-all duration-200 ease-out`}
        style={{ width: `${progress}%` }}
      />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .${color} {
          background-image: linear-gradient(
            90deg,
            ${color} 0%,
            ${color}CC 50%,
            ${color} 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}