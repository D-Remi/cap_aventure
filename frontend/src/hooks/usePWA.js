import { useState, useEffect } from 'react'

/**
 * Hook PWA — gère l'enregistrement du service worker
 * et le prompt d'installation sur mobile/desktop.
 */
export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstalled, setIsInstalled]     = useState(false)
  const [isOnline, setIsOnline]           = useState(navigator.onLine)
  const [swReady, setSwReady]             = useState(false)

  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwReady(true)
          console.log('✅ Service Worker enregistré', reg.scope)
        })
        .catch((err) => console.warn('Service Worker non disponible', err))
    }

    // Détecter si déjà installée
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Écouter le prompt d'installation
    const onBeforeInstall = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // Écouter l'installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    })

    // Écouter la connexion réseau
    const onOnline  = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    window.addEventListener('online',  onOnline)
    window.addEventListener('offline', onOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('online',  onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  const promptInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setIsInstalled(true)
    setInstallPrompt(null)
  }

  return { installPrompt, isInstalled, isOnline, swReady, promptInstall }
}
