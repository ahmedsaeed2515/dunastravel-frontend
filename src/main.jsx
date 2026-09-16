import { StrictMode, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import { initI18n } from './i18n'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'

// Auto-recover if browser tries to load old chunk after a new deployment
window.addEventListener('vite:preloadError', (event) => {
  event?.preventDefault?.();
  const pageAlreadyRefreshed = window.sessionStorage.getItem('chunk_reload_attempted');
  if (!pageAlreadyRefreshed) {
    window.sessionStorage.setItem('chunk_reload_attempted', 'true');
    window.location.reload();
  }
});

// Initiate background core and catalogue translation hydration
initI18n().catch((err) => console.warn('i18n init error:', err));

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <CurrencyProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </CurrencyProvider>
        </HelmetProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
