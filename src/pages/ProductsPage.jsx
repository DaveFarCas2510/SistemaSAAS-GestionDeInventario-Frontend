import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductsPaged, searchProducts, createProduct, deleteProduct } from '../api/productsApi'
import { getCategories } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { formatCurrency, stockStatusColor } from '../utils/formatters'
import Modal from '../components/ui/Modal'
import Pagination from '../components/ui/Pagination'

const EMPTY_FORM = { name: '', price: '', stock: '', categoryId: '' }

export default function ProductsPage() {
  const { isAdmin } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  // BUG 3 FIX: store categories and build a lookup map
  const [categories, setCategories] = useState([])
  const [categoryMap, setCategoryMap] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // BUG 2 FIX: always use paginación, search resets to page 0
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      if (search.trim()) {
        const res = await searchProducts(search.trim())
        const data = res.data || []
        setProducts(data)
        setTotalPages(0)
        setTotalElements(data.length)
      } else {
        const res = await getProductsPaged(page, 10)
        setProducts(res.data.content || [])
        setTotalPages(res.data.totalPages || 0)
        setTotalElements(res.data.totalElements || 0)
      }
    } catch {
      addToast('Error al cargar productos', 'error')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // BUG 3 FIX: load categories and build id→name map
  useEffect(() => {
    getCategories().then((r) => {
      const cats = r.data || []
      setCategories(cats)
      const map = {}
      cats.forEach((c) => { map[c.id] = c.name })
      setCategoryMap(map)
    })
  }, [])


  useEffect(() => {
  if (categories.length > 0) fetchProducts()
  }, [categories])

  // Helper: resolve category name from product (handles both object and flat id)
  const getCategoryName = (product) => {
  const id = product.category?.id || product.categoryId
  return categoryMap[id] || product.category?.name || '—'
}

  const validateForm = (f) => {
    if (!f.name.trim()) return 'El nombre es obligatorio.'
    if (!f.price || Number(f.price) <= 0) return 'El precio debe ser mayor a 0.'
    if (!f.categoryId) return 'Selecciona una categoría.'
    if (f.stock !== '' && Number(f.stock) < 0) return 'El stock no puede ser negativo.'
    return null
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    const err = validateForm(form)
    if (err) return setFormError(err)
    setFormError(''); setSaving(true)
    try {
      await createProduct({
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock || 0),
        categoryId: Number(form.categoryId),
      })
      addToast('Producto creado exitosamente ✓', 'success')
      setShowCreate(false)
      setForm(EMPTY_FORM)
      fetchProducts()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error al crear producto.')
    } finally { setSaving(false) }
  }

  const openEdit = (p, e) => {
    e.stopPropagation()
    setEditTarget(p)
    setForm({
      name: p.name,
      price: p.price,
      stock: p.stock,
      categoryId: p.category?.id || p.categoryId || '',
    })
    setFormError('')
    setShowEdit(true)
  }

  const handleEdit = async (e) => {
    e.preventDefault()
    const err = validateForm(form)
    if (err) return setFormError(err)
    setFormError(''); setSaving(true)
    try {
      const { updateProduct } = await import('../api/productsApi')
      await updateProduct(editTarget.id, {
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      })
      addToast('Producto actualizado ✓', 'success')
      setShowEdit(false)
      fetchProducts()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Endpoint de edición no disponible en el backend.')
    } finally { setSaving(false) }
  }

  // BUG 4 FIX: use confirmation modal instead of window.confirm, show real error
  const openDelete = (p, e) => {
    e.stopPropagation()
    setDeleteTarget(p)
    setShowDeleteModal(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeletingId(deleteTarget.id)
    try {
      await deleteProduct(deleteTarget.id)
      addToast(`"${deleteTarget.name}" eliminado`, 'success')
      setShowDeleteModal(false)
      setDeleteTarget(null)
      fetchProducts()
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Error al eliminar.'
      addToast(typeof msg === 'string' ? msg : 'No se pudo eliminar el producto.', 'error')
      setShowDeleteModal(false)
    } finally { setDeletingId(null) }
  }

  const ProductForm = ({ onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="label">Nombre</label>
        <input className="input-field" placeholder="Mouse gamer" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Precio (S/.)</label>
          <input type="number" step="0.01" min="0.01" className="input-field" placeholder="50.00"
            value={form.price ?? ''} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div>
          <label className="label">Stock</label>
          <input type="number" min="0" className="input-field" placeholder="10"
            value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="label">Categoría</label>
        <select className="input-field" value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
          <option value="">Seleccionar...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {formError && (
        <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{formError}</p>
      )}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => { setShowCreate(false); setShowEdit(false) }} className="btn-ghost flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={saving} className="btn-primary flex-1">
          {saving ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl dark:text-white text-gray-800">Productos</h2>
          <p className="text-sm dark:text-gray-500 text-gray-400">
            {totalElements > 0 ? `${totalElements} productos en total` : 'Gestiona el catálogo'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => { setForm(EMPTY_FORM); setFormError(''); setShowCreate(true) }} className="btn-primary">
            + Nuevo
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400 pointer-events-none">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          className="input-field pl-9"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
        {search && (
          <button onClick={() => { setSearch(''); setPage(0) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-500 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead className="border-b dark:border-ink-600 border-cream-200">
              <tr>
                <th className="table-header text-left px-6 py-4">Producto</th>
                <th className="table-header text-left px-4 py-4 hidden sm:table-cell">Categoría</th>
                <th className="table-header text-right px-4 py-4">Precio</th>
                <th className="table-header text-right px-4 py-4">Stock</th>
                {isAdmin && <th className="table-header px-6 py-4" />}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-ink-700 divide-cream-200">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[...Array(isAdmin ? 5 : 4)].map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 dark:bg-ink-700 bg-cream-200 rounded animate-pulse2" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="text-center dark:text-gray-500 text-gray-400 text-sm py-12">
                    {search ? `Sin resultados para "${search}"` : 'No hay productos aún.'}
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id}
                    className="dark:hover:bg-ink-700/40 hover:bg-cream-50 transition-colors duration-100 cursor-pointer"
                    onClick={() => navigate(`/products/${p.id}`)}>
                    <td className="px-6 py-4 text-sm dark:text-gray-200 text-gray-700 font-medium">{p.name}</td>
                    {/* BUG 3 FIX: use helper */}
                    <td className="px-4 py-4 text-sm dark:text-gray-500 text-gray-400 hidden sm:table-cell">
                      {getCategoryName(p)}
                    </td>
                    <td className="px-4 py-4 text-sm text-right dark:text-gray-400 text-gray-500 font-mono">
                      {formatCurrency(p.price)}
                    </td>
                    <td className={`px-4 py-4 text-sm text-right font-mono font-semibold ${stockStatusColor(p.stock)}`}>
                      {p.stock}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => openEdit(p, e)} className="btn-ghost text-xs px-3 py-1">
                            Editar
                          </button>
                          <button onClick={(e) => openDelete(p, e)} className="btn-danger text-xs px-3 py-1">
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BUG 2 FIX: always show pagination when not searching */}
        {!search && totalPages > 1 && (
          <div className="px-6 pb-4">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setFormError('') }} title="Nuevo producto">
        <ProductForm onSubmit={handleCreate} submitLabel="Crear producto" />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={showEdit} onClose={() => { setShowEdit(false); setFormError('') }} title={`Editar: ${editTarget?.name || ''}`}>
        <ProductForm onSubmit={handleEdit} submitLabel="Guardar cambios" />
      </Modal>

      {/* BUG 4 FIX: Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirmar eliminación">
        <div className="space-y-4">
          <p className="text-sm dark:text-gray-300 text-gray-600">
            ¿Estás seguro que quieres eliminar{' '}
            <span className="font-semibold dark:text-white text-gray-800">"{deleteTarget?.name}"</span>?
            Esta acción no se puede deshacer.
          </p>
          <div className="dark:bg-ink-700/50 bg-cream-100 rounded-lg px-4 py-3 text-xs dark:text-gray-400 text-gray-500">
            ⚠️ Si el producto tiene movimientos de stock registrados, el backend puede rechazar la eliminación.
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowDeleteModal(false)} className="btn-ghost flex-1">
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={!!deletingId}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-display font-semibold
                         px-5 py-2.5 rounded-lg text-sm transition-all duration-200 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deletingId ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
