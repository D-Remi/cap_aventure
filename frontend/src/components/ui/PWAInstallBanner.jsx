import { usePWA } from '../../hooks/usePWA'
import './PWAInstallBanner.css'

export default function PWAInstallBanner() {
  const { installPrompt, isInstalled, isOnline, promptInstall } = usePWA()

  return (
    <>
      {/* Bannière hors ligne */}
      {!isOnline && (
        <div className="offline-banner">
          <span>📡</span>
          <span>Vous êtes hors ligne — certaines fonctionnalités peuvent être indisponibles</span>
        </div>
      )}

      {/* Bouton d'installation PWA */}
      {installPrompt && !isInstalled && (
        <div className="pwa-install-banner">
          <div className="pwa-install-banner__left">
            <img src="/icons/icon-72.png" alt="CapAventure" className="pwa-install-banner__icon" />
            <div>
              <strong>Installer CapAventure</strong>
              <p>Accédez rapidement depuis votre écran d'accueil</p>
            </div>
          </div>
          <div className="pwa-install-banner__actions">
            <button className="pwa-install-banner__btn pwa-install-banner__btn--install" onClick={promptInstall}>
              Installer
            </button>
            <button
              className="pwa-install-banner__btn pwa-install-banner__btn--dismiss"
              onClick={() => window.localStorage.setItem('pwa-dismissed', '1')}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}
