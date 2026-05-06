import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductsPaged } from '../api/productsApi'
import { getCategories } from '../api/categoriesApi'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, stockStatusColor } from '../utils/formatters'

function StatCard({ label, value, sub, accent, valueColor }) {
  return (
    <div className="card relative overflow-hidden animate-fade-up">
      <p className="label">{label}</p>
      <p className={`font-display font-extrabold text-3xl mt-1 ${valueColor || 'text-heading'}`}>{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
const [totalProducts, setTotalProducts] = useState(0)
const [categories, setCategories] = useState([])
const [lowStock, setLowStock] = useState(0)
const [loading, setLoading] = useState(true)

useEffect(() => {
  Promise.all([getProductsPaged(0, 5), getProductsPaged(0, 9999), getCategories()])
    .then(([prodRes, allRes, catRes]) => {
      setProducts(prodRes.data.content || [])
      setTotalProducts(prodRes.data.totalElements || 0)
      setCategories(catRes.data || [])
      const all = allRes.data.content || []
      setLowStock(all.filter(p => p.stock <= 5).length)
    })
    .catch(console.error)
    .finally(() => setLoading(false))
}, [])

  //const lowStock = products.filter((p) => p.stock <= 5).length
  const username = user?.sub || user?.username || 'usuario'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h2 className="font-display font-bold text-2xl text-heading">
          Bienvenido, <span className="text-acid">{username}</span> 👋
        </h2>
        <p className="text-sm text-subtle mt-1">
          Aquí tienes un resumen del estado actual del inventario.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
  label="Total de productos"
  value={loading ? '—' : totalProducts}
  sub="en el sistema"
  accent
  valueColor="text-navy dark:text-acid"
/>
<StatCard
  label="Categorías"
  value={loading ? '—' : categories.length}
  sub="registradas"
/>
<StatCard
  label="Stock crítico"
  value={loading ? '—' : lowStock}
  sub="productos con stock ≤ 5"
  valueColor={lowStock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-heading'}
/>
      </div>

      {/* Recent products */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-heading">Últimos productos</h3>
          <button
            onClick={() => navigate('/products')}
            className="text-xs text-acid hover:underline font-mono"
          >
            Ver todos →
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 skeleton rounded-lg animate-pulse2" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-subtle text-center py-8">No hay productos aún.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b divider">
                <th className="table-header text-left pb-2">Producto</th>
                <th className="table-header text-right pb-2">Precio</th>
                <th className="table-header text-right pb-2">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rows">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="bg-subtle-hover cursor-pointer transition-colors duration-100"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <td className="py-3 text-sm text-body">{p.name}</td>
                  <td className="py-3 text-sm text-right text-subtle font-mono">
                    {formatCurrency(p.price)}
                  </td>
                  <td className={`py-3 text-sm text-right font-mono font-500 ${stockStatusColor(p.stock)}`}>
                    {p.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
