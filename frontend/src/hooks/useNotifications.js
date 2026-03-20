import { useEffect, useRef, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook SSE — écoute les notifications temps réel du serveur.
 * Se connecte au stream /api/notifications/stream quand l'user est connecté.
 * Affiche des toasts automatiquement.
 */
export function useNotifications(user) {
  const esRef = useRef(null)

  const connect = useCallback(() => {
    if (!user) return
    const token = localStorage.getItem('cap_token')
    if (!token) return

    if (esRef.current) esRef.current.close()

    const url = `/api/notifications/stream?token=${token}`
    const es = new EventSource(url)

    es.onmessage = (event) => {
      try {
        const notif = JSON.parse(event.data)
        showToast(notif)
      } catch {}
    }

    es.onerror = () => {
      es.close()
      setTimeout(() => connect(), 5000)
    }

    esRef.current = es
  }, [user])

  useEffect(() => {
    connect()
    return () => {
      if (esRef.current) esRef.current.close()
    }
  }, [connect])
}

function showToast(notif) {
  const icons = {
    registration_status: notif.data?.status === 'confirmed' ? '✅' : '❌',
    new_registration:    '📋',
    new_interest:        '📩',
    activity_created:    '🎿',
  }
  const icon = icons[notif.type] || '🔔'
  const message = `${icon} ${notif.title}\n${notif.message}`

  toast(message, {
    duration: 5000,
    style: {
      borderRadius: '12px',
      background: '#fff',
      color: '#111',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      padding: '12px 16px',
      fontSize: '0.88rem',
      whiteSpace: 'pre-line',
    },
  })
}

