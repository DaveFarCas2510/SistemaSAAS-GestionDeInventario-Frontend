import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/products',
    label: 'Productos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    to: '/categories',
    label: 'Categorías',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M4 6h16M4 12h10M4 18h6" />
      </svg>
    ),
  },
]

const ADMIN_ITEMS = [
  {
    to: '/users',
    label: 'Usuarios',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group
     ${isActive
      ? 'bg-acid/10 text-acid border border-acid/20'
      : 'text-gray-500 hover:text-gray-200 hover:bg-ink-700'
    }`

  return (
    <aside className="w-60 min-h-screen bg-ink-900 border-r border-ink-600 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-ink-600">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-acid rounded-md flex items-center justify-center">
            <span className="text-ink-950 font-display font-extrabold text-xs">IN</span>
          </div>
          <span className="font-display font-bold text-white text-sm tracking-tight">Inventario</span>
        </div>
        <p className="text-xs text-gray-600 mt-1 font-mono">v1.0 · Sistema SaaS</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs font-display font-semibold text-gray-600 uppercase tracking-widest px-3 mb-3">
          General
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <p className="text-xs font-display font-semibold text-gray-600 uppercase tracking-widest px-3 mt-6 mb-3">
              Administración
            </p>
            {ADMIN_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-ink-600">
        <div className="px-3 py-3 rounded-lg bg-ink-800 mb-2">
          <p className="text-xs text-gray-400 font-mono truncate">{user?.sub || user?.username || 'usuario'}</p>
          <span className={isAdmin ? 'badge-admin mt-1' : 'badge-empleado mt-1'}>
            {isAdmin ? 'ADMIN' : 'EMPLEADO'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500
                     hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
