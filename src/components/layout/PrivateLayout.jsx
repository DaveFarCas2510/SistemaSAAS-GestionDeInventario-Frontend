import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function PrivateLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden dark:bg-ink-950 bg-cream-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
  <Topbar onMenuClick={() => setSidebarOpen(true)} />
  <main className="main-bg flex-1 overflow-y-auto">
    <Outlet />
  </main>
</div>
    </div>
  )
}
