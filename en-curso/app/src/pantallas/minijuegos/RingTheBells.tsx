import { useEffect, useRef, useState } from 'react'
import { decir, esperar } from '../../audio/voz'
import { bien } from '../../audio/sonidos'
import { CAMPANAS, campanaTono, paz } from '../../audio/sonidos-extra'
import { Marco } from '../../componentes/Marco'
import { Tarjeta } from '../../componentes/Tarjeta'
import './motor/estilos.css'

/**
 * Una sola campana y una sola idea: el niño ya aprendió `church` y `bell`,
 * tira/toca la cuerda, oye la misma frase y luego vuelve al cuento. Antes el
 * juego introducía big/middle/little y series de memoria que nadie le había
 * enseñado; era divertido pero pedagógicamente desconectado.
 */
export function RingTheBells({ onVolver, onPanel, onInicio }: { onVolver: () => void; onPanel: () => void; onInicio?: () => void }) {
  const [sonando, setSonando] = useState(false)
  const [bloqueado, setBloqueado] = useState(true)
  const ayuda = useRef<number | null>(null)

  useEffect(() => {
    let cancelado = false
    void (async () => {
      await esperar(350)
      if (cancelado) return
      await decir('The church bell rings: ding-dong!')
      if (cancelado) return
      setBloqueado(false)
      ayuda.current = window.setTimeout(() => void decir('The church bell rings: ding-dong!'), 4200)
    })()
    return () => {
      cancelado = true
      if (ayuda.current) window.clearTimeout(ayuda.current)
    }
  }, [])

  const tocar = async () => {
    if (bloqueado) return
    if (ayuda.current) window.clearTimeout(ayuda.current)
    setBloqueado(true)
    setSonando(true)
    campanaTono(CAMPANAS.big)
    await decir('The church bell rings: ding-dong!')
    bien()
    await esperar(450)
    paz()
    await decir('This is the Church.')
    await esperar(850)
    onVolver()
  }

  return (
    <Marco paso={sonando ? 1 : 0} total={1} onPanel={onPanel} onInicio={onInicio}>
      <div className="mjx-pantalla">
        <p className="mjx-titulo">Ring the Church Bell</p>
        <div
          className="mjx-escena"
          onClick={() => void tocar()}
          style={{ cursor: bloqueado ? 'default' : 'pointer', touchAction: 'manipulation' }}
        >
          <div className="mjx-campanario" />
          <div style={{ position: 'absolute', top: '18%', left: '50%', transform: `translateX(-50%) rotate(${sonando ? '-12deg' : '0deg'})`, transition: 'transform 300ms ease' }}>
            <div style={{ width: 132, height: 132 }}>
              <Tarjeta img="u6-bell" emoji="🔔" grande audio="The church bell rings: ding-dong!" />
            </div>
          </div>
          <div style={{ position: 'absolute', top: '66%', left: '50%', width: 4, height: 88, background: '#c6a55b', transform: 'translateX(-50%)', borderRadius: 4 }} />
          {sonando && <div className="mjx-final"><span>🔔</span><span className="leyenda">Ding-dong!</span></div>}
        </div>
        <p className="mjx-pie">🔊 The church bell rings: ding-dong!</p>
      </div>
    </Marco>
  )
}
