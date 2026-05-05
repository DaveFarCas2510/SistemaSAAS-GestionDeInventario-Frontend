export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-600">
      <span className="text-xs text-gray-500 font-mono">
        Página {page + 1} de {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg text-sm bg-ink-700 text-gray-400
                     hover:bg-ink-600 hover:text-white disabled:opacity-30
                     disabled:cursor-not-allowed transition-all duration-150"
        >
          ← Anterior
        </button>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg text-sm bg-ink-700 text-gray-400
                     hover:bg-ink-600 hover:text-white disabled:opacity-30
                     disabled:cursor-not-allowed transition-all duration-150"
        >
          Siguiente →
        </button>
      </div>
    </div>
  )
}
