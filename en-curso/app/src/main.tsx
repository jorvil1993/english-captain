import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { ProveedorSesion } from './estado/Sesion'
import { RedDeSeguridad } from './componentes/RedDeSeguridad'
import './estilos/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RedDeSeguridad>
      <ProveedorSesion>
        <App />
      </ProveedorSesion>
    </RedDeSeguridad>
  </StrictMode>,
)
