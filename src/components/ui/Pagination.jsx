export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-ink-600 border-cream-200">
      <span className="text-xs dark:text-gray-500 text-gray-400 font-mono">
        Página {page + 1} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button disabled={page === 0} onClick={() => onPageChange(page - 1)} className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
          ← Anterior
        </button>
        <button disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)} className="btn-ghost text-sm px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed">
          Siguiente →
        </button>
      </div>
    </div>
  )
}
