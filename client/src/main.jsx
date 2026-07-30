import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import './index.css'

// Import Clerk publishable key from environment variables
// Falls back to a default test key if not set in Vercel settings to prevent a blank screen
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_cHJpbWFyeS1jYXR0bGUtNy5jbGVyay5hY2NvdW50cy5kZXYk';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        variables: {
          colorPrimary: '#ff6b6b',
          colorText: '#4a2c2a',
          colorBackground: '#fff9f5',
          colorInputBackground: '#ffffff',
          colorInputText: '#4a2c2a',
          borderRadius: '16px',
          fontFamily: '"Inter", sans-serif',
        },
        elements: {
          card: 'shadow-2xl border-2 border-[#ffdbd6]',
          headerTitle: 'text-3xl font-extrabold text-[#ee5a24]',
          headerSubtitle: 'text-[#8b5a56] font-medium',
          socialButtonsBlockButton: 'border-2 border-[#ffdbd6] hover:bg-[#fff0ed] text-[#4a2c2a] transition-all rounded-xl shadow-sm',
          socialButtonsBlockButtonText: 'font-bold',
          dividerLine: 'bg-[#ffdbd6]',
          dividerText: 'text-[#8b5a56]',
          formFieldLabel: 'text-[#8b5a56] font-bold',
          formFieldInput: 'border-2 border-[#ffdbd6] focus:border-[#ff6b6b] focus:ring-[#ff6b6b] rounded-xl py-2',
          formButtonPrimary: 'bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] hover:opacity-90 shadow-lg transform transition-all hover:scale-[1.02] rounded-xl font-bold text-lg',
          footerActionText: 'text-[#8b5a56]',
          footerActionLink: 'text-[#ee5a24] hover:text-[#ff6b6b] font-bold',
          identityPreview: 'bg-[#fff0ed] border border-[#ffdbd6]',
          identityPreviewText: 'text-[#4a2c2a]',
          identityPreviewEditButtonIcon: 'text-[#ff6b6b]'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
