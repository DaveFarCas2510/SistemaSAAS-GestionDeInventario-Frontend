import { useEffect, useState } from 'react'
import { getCategories, createCategory } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/ui/Modal'

export default function CategoriesPage() {
  const { isAdmin } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await getCategories()
      setCategories(res.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('El nombre es obligatorio.')
    setError('')
    setSaving(true)
    try {
      await createCategory({ name: name.trim() })
      setShowCreate(false)
      setName('')
      fetch()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear categoría.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Categorías</h2>
          <p className="text-sm text-gray-500">Organiza tus productos por categoría</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            + Nueva categoría
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="space-y-px">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-ink-700/30 animate-pulse2" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">No hay categorías.</p>
        ) : (
          <ul className="divide-y divide-ink-700">
            {categories.map((c, i) => (
              <li key={c.id} className="flex items-center gap-4 px-6 py-4 hover:bg-ink-700/30 transition-colors">
                <span className="w-8 h-8 rounded-lg bg-acid/10 flex items-center justify-center text-acid font-display font-bold text-xs">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-gray-200 font-500 capitalize">{c.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => { setShowCreate(false); setError('') }} title="Nueva categoría">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Nombre</label>
            <input
              className="input-field"
              placeholder="peripherals"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-ghost flex-1">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
