import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('Main.tsx loading...');
window.addEventListener('error', (e) => console.error('GLOBAL ERROR:', e.message, e.filename, e.lineno));
window.addEventListener('unhandledrejection', (e) => console.error('UNHANDLED REJECTION:', e.reason));

const rootElement = document.getElementById('root');
console.log('Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Failed to find root element');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
