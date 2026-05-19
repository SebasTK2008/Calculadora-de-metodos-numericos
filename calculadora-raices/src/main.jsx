import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Footer from './components/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const footerNode = document.getElementById('footer-root')
if (footerNode) {
  createRoot(footerNode).render(
    <StrictMode>
      <Footer />
    </StrictMode>
  )
}
