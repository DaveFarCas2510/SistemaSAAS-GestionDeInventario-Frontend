import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById, adjustStock, getMovements } from '../api/productsApi'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, stockStatusColor } from '../utils/formatters'
import Modal from '../components/ui/Modal'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()

  const [product, setProduct] = useState(null)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAdjust, setShowAdjust] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [adjustError, setAdjustError] = useState('')
  const [adjusting, setAdjusting] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [prodRes, movRes] = await Promise.all([
        getProductById(id),
        getMovements(id),
      ])
      setProduct(prodRes.data)
      setMovements(movRes.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleAdjust = async (e) => {
    e.preventDefault()
    const qty = Number(quantity)
    if (!quantity || qty === 0) return setAdjustError('Ingresa una cantidad distinta de 0.')
    setAdjustError('')
    setAdjusting(true)
    try {
      await adjustStock(id, qty)
      setShowAdjust(false)
      setQuantity('')
      fetchAll()
    } catch (err) {
      setAdjustError(err.response?.data?.message || 'No se puede ajustar el stock.')
    } finally {
      setAdjusting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse2">
        <div className="h-8 w-48 bg-ink-700 rounded" />
        <div className="card h-40 bg-ink-700" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Producto no encontrado.</p>
        <button onClick={() => navigate('/products')} className="btn-ghost mt-4">← Volver</button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Back */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Volver a productos
      </button>

      {/* Product info */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1 font-mono">
              ID #{product.id} · {product.category?.name || 'Sin categoría'}
            </p>
          </div>
          <button onClick={() => setShowAdjust(true)} className="btn-primary">
            Ajustar stock
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-ink-600">
          <div>
            <p className="label">Precio</p>
            <p className="font-display font-bold text-xl text-white">{formatCurrency(product.price)}</p>
          </div>
          <div>
            <p className="label">Stock actual</p>
            <p className={`font-display font-bold text-xl ${stockStatusColor(product.stock)}`}>
              {product.stock}
            </p>
          </div>
          <div>
            <p className="label">Estado</p>
            <span className={
              product.stock === 0
                ? 'badge-exit'
                : product.stock <= 5
                  ? 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'badge-entry'
            }>
              {product.stock === 0 ? 'Sin stock' : product.stock <= 5 ? 'Stock crítico' : 'Disponible'}
            </span>
          </div>
        </div>
      </div>

      {/* Movement history */}
      <div className="card">
        <h3 className="font-display font-bold text-white mb-4">Historial de movimientos</h3>
        {movements.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Sin movimientos registrados.</p>
        ) : (
          <div className="space-y-2">
            {movements.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-ink-700/50 border border-ink-600"
              >
                <div className="flex items-center gap-3">
                  <span className={m.type === 'ENTRY' ? 'badge-entry' : 'badge-exit'}>
                    {m.type === 'ENTRY' ? '↑ Entrada' : '↓ Salida'}
                  </span>
                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-mono text-acid">
                        {m.type === 'ENTRY' ? '+' : ''}{m.quantity}
                      </span>
                      {' '}unidades
                    </p>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">
                      por {m.username}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-mono">
                    {m.previousStock} → {m.newStock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      <Modal isOpen={showAdjust} onClose={() => { setShowAdjust(false); setAdjustError('') }} title="Ajustar stock">
        <form onSubmit={handleAdjust} className="space-y-4">
          <div className="bg-ink-700/50 rounded-lg px-4 py-3 text-sm">
            <span className="text-gray-400">Stock actual: </span>
            <span className={`font-mono font-semibold ${stockStatusColor(product.stock)}`}>{product.stock}</span>
          </div>
          <div>
            <label className="label">Cantidad (+entrada / −salida)</label>
            <input
              type="number"
              className="input-field"
              placeholder="ej: 5 o -3"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-gray-600 mt-1">
              Positivo para entrada, negativo para salida.
            </p>
          </div>

          {adjustError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {adjustError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowAdjust(false)} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={adjusting} className="btn-primary flex-1">
              {adjusting ? 'Aplicando...' : 'Confirmar ajuste'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
