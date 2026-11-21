// Coordonnées affichées sur le site public
export const WA_NUM = '33752096698'
export const TEL_AFFICHE = '+33 7 52 09 66 98'
export const TEL_LIEN = 'tel:+33752096698'
export const EMAIL = 'delfosseremi33@gmail.com'

export const waLink = (texte = "Bonjour Rémi, je souhaite échanger au sujet d'un relais pour mon enfant.") =>
  `https://wa.me/${WA_NUM}?text=${encodeURIComponent(texte)}`

export const IconeWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2-.1-.3 0-.5.1-.6.1-.1.3-.3.4-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.6-.9-2.2-.2-.5-.5-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3M12 2a10 10 0 00-8.6 15l-1.3 4.7L7 20.4A10 10 0 1012 2z" />
  </svg>
)
