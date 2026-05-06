import { useState } from 'react'
import { createUser } from '../api/usersApi'

const ROLES = ['ADMIN', 'EMPLEADO']
const EMPTY = { username: '', password: '', email: '', role: 'EMPLEADO' }

export default function UsersPage() {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password || !form.email)
      return setError('Todos los campos son obligatorios.')
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await createUser(form)
      setSuccess(`Usuario "${form.username}" creado exitosamente.`)
      setForm(EMPTY)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      <div>
        <h2 className="font-display font-bold text-xl text-heading">Usuarios</h2>
        <p className="text-sm text-subtle">Crea nuevos usuarios del sistema</p>
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-heading mb-5">Crear usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nombre de usuario</label>
            <input className="input-field" placeholder="username" value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-field" placeholder="user@empresa.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" className="input-field" placeholder="••••••••" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">Rol</label>
            <select className="input-field" value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-lg px-3 py-2">
              ✓ {success}
            </p>
          )}

          <button type="submit" disabled={saving} className="btn-primary w-full mt-2">
            {saving ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      </div>

      {/* Info card */}
      <div className="rounded-xl border divider px-4 py-3 bg-subtle">
  <p className="text-xs text-subtle font-mono">
    <span className="text-acid">ADMIN</span> → acceso completo al sistema<br />
    <span className="text-blue-400">EMPLEADO</span> → solo lectura y ajuste de movimientos
  </p>
</div>
    </div>
  )
}
