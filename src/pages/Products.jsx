import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import Container from '../components/common/Container'
import ProductCard from '../components/ProductCard'
import api from '../services/api'
import { products as fallbackProducts } from '../data/products'

export default function Products() {
  const [params, setParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const search = params.get('search') || ''
  const category = params.get('category') || ''
  const sort = params.get('sort') || '-createdAt'

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([
      api.get('/products', { params: { search, category, sort, limit: 24 } }),
      api.get('/categories'),
    ]).then(([p, c]) => {
      if (!active) return
      setItems(p.data.products)
      setCategories(c.data.categories)
    }).catch(() => {
      if (active) setItems(fallbackProducts.filter(p => !category || p.category === category))
    }).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [search, category, sort])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next)
  }

  const displayItems = useMemo(() => items.map(p => ({
    ...p,
    category: p.category?.name || p.category,
  })), [items])

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Shop</p><h1 className="mt-2 text-4xl font-black">Everything you need</h1></div>
        <div className="flex w-full gap-2 md:w-auto">
          <label className="flex flex-1 items-center gap-2 rounded-xl border bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
            <Search size={18} className="text-slate-400" />
            <input value={search} onChange={e => setParam('search', e.target.value)} className="w-full bg-transparent py-3 outline-none" placeholder="Search products..." />
          </label>
          <select value={sort} onChange={e => setParam('sort', e.target.value)} className="rounded-xl border bg-white px-3 dark:border-slate-800 dark:bg-slate-900">
            <option value="-createdAt">Newest</option><option value="price">Price: Low</option><option value="-price">Price: High</option><option value="-rating">Top Rated</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <button onClick={() => setParam('category','')} className={`rounded-full px-4 py-2 text-sm font-bold ${!category ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'border'}`}><SlidersHorizontal size={15} className="mr-1 inline" />All</button>
        {categories.map(c => <button key={c._id} onClick={() => setParam('category', c._id)} className={`rounded-full px-4 py-2 text-sm font-bold ${category === c._id ? 'bg-indigo-600 text-white' : 'border'}`}>{c.name}</button>)}
      </div>
      {loading ? <div className="py-20 text-center text-slate-500">Loading products…</div> :
        displayItems.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{displayItems.map(p => <ProductCard key={p._id || p.id} product={p} />)}</div> :
        <div className="py-20 text-center"><h2 className="text-2xl font-black">No products found</h2><Link to="/products" className="mt-3 inline-block font-bold text-indigo-600">Clear filters</Link></div>}
    </Container>
  )
}
