import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [form, setForm] = useState({ name: user?.name || '', phone: '', line1: '', city: '', state: '', postalCode: '', country: 'India' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const discount = 0
  const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal - discount + tax + shipping

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async e => {
    e.preventDefault()
    setError('')
    if (!items.length) return setError('Your cart is empty.')
    setLoading(true)
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i._id || i.id, quantity: i.quantity })),
        shippingAddress: form,
        couponCode: couponCode || undefined,
      })
      clearCart()
      navigate(`/orders?success=${data.order._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to place order. Please try again.')
    } finally { setLoading(false) }
  }

  return <Container className="py-10">
    <h1 className="text-4xl font-black">Checkout</h1>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <form onSubmit={submit} className="grid gap-4">
        {['name','phone','line1','city','state','postalCode'].map(name => <input key={name} required name={name} value={form[name]} onChange={update} className="rounded-xl border bg-white p-4 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900" placeholder={{name:'Full name',phone:'Phone',line1:'Address',city:'City',state:'State',postalCode:'PIN code'}[name]} />)}
        <input value="India" disabled className="rounded-xl border bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-800" />
        <div className="flex gap-2"><input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} className="flex-1 rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-900" placeholder="Coupon code (optional)" /><Button type="submit" disabled={loading}>{loading ? 'Placing…' : 'Place order'}</Button></div>
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/30">{error}</p>}
      </form>
      <div className="h-fit rounded-2xl border p-6 dark:border-slate-800"><h2 className="font-black">Order summary</h2><div className="mt-5 grid gap-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Tax (18%)</span><span>₹{tax.toFixed(2)}</span></div><div className="flex justify-between"><span>Shipping</span><span>{shipping ? `₹${shipping}` : 'Free'}</span></div><div className="mt-2 border-t pt-3 text-base font-black dark:border-slate-800"><div className="flex justify-between"><span>Total</span><span>₹{total.toFixed(2)}</span></div></div></div></div>
    </div>
  </Container>
}
