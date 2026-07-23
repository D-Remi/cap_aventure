import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Configure axios (baseURL + injection du token) avant tout rendu
import './services/api'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
