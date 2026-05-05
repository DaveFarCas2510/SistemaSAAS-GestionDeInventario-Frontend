import { useLocation } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'

const TITLES = {
  '/dashboard':  'Dashboard',
  '/products':   'Productos',
  '/categories': 'Categorías',
  '/users':      'Usuarios',
}

export default function Topbar({ onMenuClick }) {
  const location = useLocation()
  const { isDark, toggle } = useTheme()
  const title = TITLES[location.pathname] || 'Detalle'
  const now = new Date().toLocaleDateString('es-PE', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        {/* Hamburger — only mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg
                     dark:bg-ink-700 bg-cream-100 dark:text-gray-400 text-gray-500
                     hover:scale-105 transition-all duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
        <h1 className="font-display font-bold text-lg dark:text-white text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-mono capitalize dark:text-gray-500 text-gray-400 hidden sm:block">{now}</span>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
          className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200
                     dark:bg-ink-700 dark:hover:bg-ink-600 dark:text-gray-400 dark:hover:text-acid
                     bg-cream-100 hover:bg-cream-200 text-gray-500 hover:text-navy"
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
      </div>
    </header>
  )
}
