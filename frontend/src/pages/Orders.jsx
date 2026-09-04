import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import api from '../services/api'

const statusStyle = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700', packed: 'bg-violet-100 text-violet-700', shipped: 'bg-indigo-100 text-indigo-700', delivered: 'bg-emerald-100 text-emerald-700', cancelled: 'bg-red-100 text-red-700' }

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { api.get('/orders').then(r => setOrders(r.data.orders)).finally(() => setLoading(false)) }, [])
  return <Container className="py-10"><h1 className="text-4xl font-black">My Orders</h1>{loading ? <p className="py-16 text-center text-slate-500">Loading orders…</p> : !orders.length ? <div className="py-16 text-center"><p className="text-xl font-bold">No orders yet.</p><Link to="/products" className="mt-3 inline-block font-bold text-indigo-600">Start shopping</Link></div> : <div className="mt-8 grid gap-4">{orders.map(o => <article key={o._id} className="rounded-2xl border p-5 dark:border-slate-800"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-black">Order #{o._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-sm text-slate-500">{new Date(o.createdAt).toLocaleString()}</p></div><span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusStyle[o.status] || ''}`}>{o.status}</span></div><div className="mt-4 flex flex-wrap justify-between gap-3 text-sm"><span>{o.items.length} product line(s)</span><strong>₹{Number(o.total).toLocaleString('en-IN')}</strong></div></article>)}</div>}</Container>
}
