import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import '../index.css'
import LiveApp from './LiveApp'

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('Failed to find root element');
} else {
    createRoot(rootElement).render(
        <StrictMode>
            <HelmetProvider>
                <LiveApp />
            </HelmetProvider>
        </StrictMode>,
    )
}
