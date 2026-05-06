import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 dark:bg-ink-950/80 bg-gray-900/40 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-md dark:bg-ink-800 bg-white
                   divider border
                   rounded-2xl p-6 shadow-2xl animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-heading text-base">{title}</h2>
          <button onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg
                       text-muted
                       dark:hover:text-body hover:text-gray-700
                       dark:hover:skeleton hover:bg-cream-100
                       transition-all duration-150">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
