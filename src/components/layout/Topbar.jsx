import { useLocation } from 'react-router-dom'

const TITLES = {
  '/dashboard': 'Dashboard',
  '/products': 'Productos',
  '/categories': 'Categorías',
  '/users': 'Usuarios',
}

export default function Topbar() {
  const location = useLocation()
  const title = TITLES[location.pathname] || 'Detalle'
  const now = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <header className="h-16 border-b border-ink-600 bg-ink-900/80 backdrop-blur-sm flex items-center px-8 justify-between sticky top-0 z-10">
      <h1 className="font-display font-bold text-white text-lg">{title}</h1>
      <span className="text-xs text-gray-500 font-mono capitalize">{now}</span>
    </header>
  )
}
