'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebugInfo = (info: string) => {
    console.log('PWA Debug:', info)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`])
  }

  useEffect(() => {
    addDebugInfo('PWA Install component mounted')

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      addDebugInfo('App is already installed')
      return
    }

    // Check if service worker is supported
    if ('serviceWorker' in navigator) {
      addDebugInfo('Service Worker supported')
    } else {
      addDebugInfo('Service Worker NOT supported')
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      addDebugInfo('beforeinstallprompt event fired')
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    const handleAppInstalled = () => {
      addDebugInfo('App installed successfully')
      setInstallPrompt(null)
      setIsInstallable(false)
    }

    window.addEventListener('beforeinstallprompt', handler as EventListener)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Debug: Check manifest
    fetch('/manifest.json')
      .then(response => {
        if (response.ok) {
          addDebugInfo('Manifest.json loaded successfully')
          return response.json()
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      })
      .then(manifest => {
        addDebugInfo(`Manifest parsed: ${manifest.name}`)
      })
      .catch(error => {
        addDebugInfo(`Manifest error: ${error.message}`)
      })

    // Timeout to check if event fires
    const timeout = setTimeout(() => {
      if (!isInstallable) {
        addDebugInfo('No install prompt after 5 seconds - check PWA criteria')
      }
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timeout)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    try {
      addDebugInfo('Showing install prompt')
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      addDebugInfo(`Install prompt result: ${outcome}`)
      
      if (outcome === 'accepted') {
        setInstallPrompt(null)
        setIsInstallable(false)
      }
    } catch (error) {
      addDebugInfo(`Install error: ${error}`)
      console.error('Error during installation:', error)
    }
  }

  // Show debug info in development
  const showDebug = process.env.NODE_ENV === 'development'

  return (
    <>
      {showDebug && (
        <div className="fixed top-4 right-4 hidden bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 max-w-md max-h-40 overflow-y-auto text-xs">
          <h4 className="font-bold mb-2">PWA Debug Info:</h4>
          {debugInfo.map((info, index) => (
            <div key={index} className="mb-1">{info}</div>
          ))}
        </div>
      )}
      
      {isInstallable && (
        <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:w-80">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Install App</h3>
              <p className="text-sm opacity-90">
                Install this app for a better experience
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setIsInstallable(false)}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 text-sm bg-white text-blue-600 rounded hover:bg-gray-100 transition-colors"
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}