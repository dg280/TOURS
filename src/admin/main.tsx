import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp'
import '../index.css'

console.log('Admin Main.tsx loading...');
window.addEventListener('error', (e) => console.error('ADMIN GLOBAL ERROR:', e.message, e.filename, e.lineno));
window.addEventListener('unhandledrejection', (e) => console.error('ADMIN UNHANDLED REJECTION:', e.reason));

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Admin: Failed to find root element');
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  )
}
