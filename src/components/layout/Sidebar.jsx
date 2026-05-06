import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/dashboard', label: 'Dashboard',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/products', label: 'Productos',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0"><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  },
  {
    to: '/categories', label: 'Categorías',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0"><path d="M4 6h16M4 12h10M4 18h6"/></svg>,
  },
]

const ADMIN_ITEMS = [
  {
    to: '/users', label: 'Usuarios',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login'); onClose?.() }

  const linkClass = ({ isActive }) =>
    isActive ? 'nav-link-active' : 'nav-link-inactive'

  const handleNavClick = () => onClose?.()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={[
        'sidebar fixed lg:static inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}>
        {/* Logo */}
        <div className="px-6 py-6 border-b divider">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 dark:bg-acid bg-navy rounded-lg flex items-center justify-center">
                <span className="dark:text-ink-950 text-white font-display font-extrabold text-xs">IN</span>
              </div>
              <div>
                <span className="font-display font-bold text-heading text-sm tracking-tight">Inventario</span>
                <p className="text-xs dark:text-gray-600 text-subtle font-mono leading-none">Sistema SaaS</p>
              </div>
            </div>
            {/* Close button mobile */}
            <button onClick={onClose} className="lg:hidden text-muted hover:text-gray-700 dark:hover:text-heading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-xs font-display font-semibold dark:text-gray-600 text-gray-400 uppercase tracking-widest px-3 mb-3">
            General
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={handleNavClick}>
              {item.icon}{item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <>
              <p className="text-xs font-display font-semibold dark:text-gray-600 text-gray-400 uppercase tracking-widest px-3 mt-6 mb-3">
                Administración
              </p>
              {ADMIN_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} className={linkClass} onClick={handleNavClick}>
                  {item.icon}{item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t divider">
          <div className="px-3 py-3 rounded-lg dark:bg-ink-800 bg-cream-100 mb-2">
            <p className="text-xs dark:text-gray-400 text-subtle font-mono truncate">
              {user?.sub || user?.username || 'usuario'}
            </p>
            <span className={isAdmin ? 'badge-admin mt-1' : 'badge-empleado mt-1'}>
              {isAdmin ? 'ADMIN' : 'EMPLEADO'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                       text-muted
                       hover:text-red-500 dark:hover:bg-red-500/5 hover:bg-red-50
                       transition-all duration-150"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
