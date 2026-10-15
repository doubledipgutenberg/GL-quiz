import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Offline-Nutzung (iPad): Service Worker nur im echten Build registrieren (sw.js entsteht in npm run build).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {});
    // Fehlende Aufnahmen bei jedem Start nachladen (iOS beendet den Service Worker manchmal mittendrin).
    navigator.serviceWorker.ready.then((reg) => reg.active?.postMessage('fill'));
  });
}
