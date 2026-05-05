import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getProductsPaged,
  searchProducts,
  createProduct,
  deleteProduct,
} from '../api/productsApi'
import { getCategories } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, stockStatusColor } from '../utils/formatters'
import Modal from '../components/ui/Modal'
import Pagination from '../components/ui/Pagination'

const EMPTY_FORM = { name: '', price: '', stock: '', categoryId: '' }

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const [deletingId, setDeletingId] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const res = search
        ? await searchProducts(search)
        : await getProductsPaged(page, 10)

      if (search) {
        setProducts(res.data || [])
        setTotalPages(0)
      } else {
        setProducts(res.data.content || [])
        setTotalPages(res.data.totalPages || 0)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data || [])).catch(console.error)
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.stock || !form.categoryId)
      return setFormError('Todos los campos son obligatorios.')
    if (Number(form.price) <= 0) return setFormError('El precio debe ser mayor a 0.')
    if (Number(form.stock) < 0) return setFormError('El stock no puede ser negativo.')
    setFormError('')
    setSaving(true)
    try {
      await createProduct({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      })
      setShowCreate(false)
      setForm(EMPTY_FORM)
      fetchProducts()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al crear producto.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    setDeletingId(id)
    try {
      await deleteProduct(id)
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Productos</h2>
          <p className="text-sm text-gray-500">Gestiona el catálogo de productos</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            + Nuevo producto
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          className="input-field pl-9"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-ink-600">
            <tr>
              <th className="table-header text-left px-6 py-4">Producto</th>
              <th className="table-header text-left px-4 py-4">Categoría</th>
              <th className="table-header text-right px-4 py-4">Precio</th>
              <th className="table-header text-right px-4 py-4">Stock</th>
              {isAdmin && <th className="table-header px-6 py-4" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-700">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {[...Array(isAdmin ? 5 : 4)].map((__, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-ink-700 rounded animate-pulse2" />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="text-center text-gray-500 text-sm py-12">
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-ink-700/40 transition-colors duration-100 cursor-pointer"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="px-6 py-4 text-sm text-gray-200 font-500">{p.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {p.category?.name || '—'}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-gray-400 font-mono">
                    {formatCurrency(p.price)}
                  </td>
                  <td className={`px-4 py-4 text-sm text-right font-mono font-semibold ${stockStatusColor(p.stock)}`}>
                    {p.stock}
                  </td>
                  {isAdmin && (
                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="btn-danger text-xs px-3 py-1"
                      >
                        {deletingId === p.id ? '...' : 'Eliminar'}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {!search && (
          <div className="px-6 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setFormError('') }} title="Nuevo producto">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input className="input-field" placeholder="Mouse gamer" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Precio (S/.)</label>
              <input type="number" step="0.01" className="input-field" placeholder="50.00" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label">Stock inicial</label>
              <input type="number" className="input-field" placeholder="10" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Categoría</label>
            <select className="input-field" value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Seleccionar...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {formError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Guardando...' : 'Crear producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
