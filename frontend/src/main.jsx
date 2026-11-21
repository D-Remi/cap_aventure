import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Polices hébergées sur le site (pas d'appel à Google Fonts : rien n'est transmis à un tiers)
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/800.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
// Configure axios (baseURL + injection du token) avant tout rendu
import './services/api'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
