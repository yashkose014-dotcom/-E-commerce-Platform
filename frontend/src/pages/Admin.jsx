import { useEffect, useState } from 'react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../services/api'

export default function Admin() {
  const [tab, setTab] = useState('overview')
  const [data, setData] = useState({ summary: null, products: [], orders: [], users: [], categories: [], coupons: [] })
  const [message, setMessage] = useState('')

  const load = async () => {
    const [summary, products, orders, users, categories, coupons] = await Promise.all([
      api.get('/admin/summary'), api.get('/admin/products'), api.get('/admin/orders'),
      api.get('/admin/users'), api.get('/admin/categories'), api.get('/admin/coupons')
    ])
    setData({ summary: summary.data, products: products.data.products, orders: orders.data.orders, users: users.data.users, categories: categories.data.categories, coupons: coupons.data.coupons })
  }
  useEffect(() => { load().catch(e => setMessage(e.response?.data?.message || 'Could not load admin data')) }, [])

  const status = async (id, value) => { await api.patch(`/admin/orders/${id}/status`, { status: value }); await load() }
  const deleteProduct = async id => { if (confirm('Delete this product?')) { await api.delete(`/admin/products/${id}`); await load() } }

  const s = data.summary
  const tabs = ['overview','products','orders','users','categories','coupons']
  return <Container className="py-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Admin</p><h1 className="mt-2 text-4xl font-black">Urban Mart Dashboard</h1></div><Button onClick={() => load()}>Refresh</Button></div>
    {message && <p className="mt-5 rounded-xl bg-red-50 p-4 text-red-600">{message}</p>}
    <div className="mt-8 flex flex-wrap gap-2">{tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`rounded-xl px-4 py-2 text-sm font-bold capitalize ${tab === t ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'border'}`}>{t}</button>)}</div>
    {tab === 'overview' && s && <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Revenue',`₹${Number(s.revenue).toLocaleString('en-IN')}`],['Orders',s.orders],['Customers',s.users],['Low stock',s.lowStock]].map(([a,b]) => <div key={a} className="rounded-2xl border p-6 dark:border-slate-800"><p className="text-sm text-slate-500">{a}</p><p className="mt-3 text-2xl font-black">{b}</p></div>)}</div>}
    {tab === 'products' && <div className="mt-6 overflow-x-auto rounded-2xl border dark:border-slate-800"><table className="w-full text-left text-sm"><thead><tr className="border-b dark:border-slate-800"><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Action</th></tr></thead><tbody>{data.products.map(p => <tr key={p._id} className="border-b last:border-0 dark:border-slate-800"><td className="p-4 font-bold">{p.name}</td><td className="p-4">₹{p.price}</td><td className="p-4">{p.stock}</td><td className="p-4"><button onClick={() => deleteProduct(p._id)} className="font-bold text-red-500">Delete</button></td></tr>)}</tbody></table></div>}
    {tab === 'orders' && <div className="mt-6 grid gap-3">{data.orders.map(o => <div key={o._id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5 dark:border-slate-800"><div><b>#{o._id.slice(-8).toUpperCase()}</b><p className="text-sm text-slate-500">{o.user?.email} · ₹{o.total}</p></div><select value={o.status} onChange={e => status(o._id, e.target.value)} className="rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900">{['pending','confirmed','packed','shipped','delivered','cancelled'].map(x => <option key={x}>{x}</option>)}</select></div>)}</div>}
    {tab === 'users' && <div className="mt-6 grid gap-3">{data.users.map(u => <div key={u._id} className="flex justify-between rounded-2xl border p-4 dark:border-slate-800"><span><b>{u.name}</b><br/><small>{u.email}</small></span><span className="font-bold capitalize">{u.role}</span></div>)}</div>}
    {tab === 'categories' && <div className="mt-6 grid gap-3">{data.categories.map(c => <div key={c._id} className="flex justify-between rounded-2xl border p-4 dark:border-slate-800"><b>{c.name}</b><span className="text-sm text-slate-500">{c.slug}</span></div>)}</div>}
    {tab === 'coupons' && <div className="mt-6 grid gap-3">{data.coupons.map(c => <div key={c._id} className="flex justify-between rounded-2xl border p-4 dark:border-slate-800"><b>{c.code}</b><span>{c.type} · {c.value}</span></div>)}</div>}
  </Container>
}
