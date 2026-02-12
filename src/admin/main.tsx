import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminApp from './AdminApp'
import '../index.css'

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
