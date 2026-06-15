import './preview.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AthenaApp } from '@cms/AthenaApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AthenaApp />
  </StrictMode>,
)
