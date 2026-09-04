import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()
  return <Container className="py-12">
    <h1 className="text-4xl font-black">Your cart</h1>
    {!items.length ? <div className="py-20 text-center"><p className="text-slate-500">Your cart is empty.</p><Link to="/products" className="mt-5 inline-block font-bold underline">Continue shopping</Link></div> :
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">{items.map((item) => <div key={item.id} className="flex gap-4 rounded-2xl border p-4 dark:border-slate-800"><img src={item.image} className="h-24 w-24 rounded-xl object-cover" /><div className="flex-1"><h3 className="font-bold">{item.name}</h3><p className="mt-1">₹{item.price.toLocaleString('en-IN')}</p><div className="mt-3 flex items-center gap-3"><input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 rounded-lg border p-2 dark:border-slate-700 dark:bg-slate-900" /><button onClick={() => removeFromCart(item.id)} className="text-sm font-semibold text-red-500">Remove</button></div></div></div>)}</div>
        <div className="h-fit rounded-2xl border p-6 dark:border-slate-800"><h2 className="text-xl font-black">Summary</h2><div className="mt-5 flex justify-between"><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><div className="mt-2 flex justify-between text-sm text-slate-500"><span>Shipping</span><span>Calculated at checkout</span></div><Link to="/checkout"><Button className="mt-6 w-full">Checkout</Button></Link></div>
      </div>}
  </Container>
}
