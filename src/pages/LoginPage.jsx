import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return setError('Completa todos los campos.')
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen dark:bg-ink-950 bg-cream-50 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px),
                            linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Theme toggle top right */}
      <button
        onClick={toggle}
        className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-lg
                   dark:bg-ink-800 bg-white border divider
                   dark:text-gray-400 text-subtle hover:scale-110 transition-all duration-200"
      >
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
          </svg>
        )}
      </button>

      <div className="relative w-full max-w-sm animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-14 h-14 dark:bg-acid bg-navy rounded-2xl flex items-center justify-center">
  <span className="dark:text-ink-950 text-white font-display font-extrabold text-sm">IN</span>
</div>
<div>
  <p className="font-display font-bold text-2xl text-heading">Inventario</p>
  <p className="text-sm dark:text-gray-600 text-subtle font-mono">Sistema de Gestión</p>
</div>
        </div>

        <div className="card">
          <h2 className="font-display font-bold text-xl text-heading mb-1">Iniciar sesión</h2>
          <p className="text-sm text-muted mb-6">Ingresa tus credenciales para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Usuario</label>
              <input className="input-field" placeholder="username" value={username}
                onChange={(e) => setUsername(e.target.value)} autoFocus />
            </div>
            <div>
              <label className="label">Contraseña</label>
              <input type="password" className="input-field" placeholder="••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Verificando...</>
              ) : 'Entrar al sistema'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs dark:text-gray-600 text-subtle font-mono mt-6">
          David Eduardo Farfán · Ingeniería de Sistemas
        </p>
      </div>
    </div>
  )
}
