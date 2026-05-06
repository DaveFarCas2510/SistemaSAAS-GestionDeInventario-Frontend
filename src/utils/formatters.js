export const formatCurrency = (value) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(value)

export const formatDate = (dateString) => {
  if (!dateString) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export const stockStatusColor = (stock) => {
  if (stock === 0) return 'text-red-500 dark:text-red-400'
  if (stock <= 5) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-emerald-600 dark:text-emerald-400'
}