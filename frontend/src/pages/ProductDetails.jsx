import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import api from '../services/api'
import { products as fallbackProducts } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductDetails() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    Promise.all([api.get(`/products/${id}`), api.get('/reviews', { params: { product: id } })])
      .then(([p, r]) => { setProduct(p.data.product); setReviews(r.data.reviews || []) })
      .catch(() => setProduct(fallbackProducts.find(p => String(p.id) === String(id))))
  }, [id])

  if (!product) return <Container className="py-20 text-center">Loading product…</Container>
  const image = product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&q=80'
  const rating = Number(product.rating || 0)

  return <Container className="py-10">
    <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={16}/>Back to shop</Link>
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="overflow-hidden rounded-3xl border bg-slate-100 dark:border-slate-800 dark:bg-slate-900"><img src={image} alt={product.name} className="aspect-square w-full object-cover"/></div>
      <div className="py-2">
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">{product.category?.name || product.category}</p>
        <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2"><span className="flex items-center gap-1 text-amber-500"><Star size={17} fill="currentColor"/>{rating.toFixed(1)}</span><span className="text-sm text-slate-500">({product.reviewCount || reviews.length} reviews)</span></div>
        <p className="mt-6 text-3xl font-black">₹{Number(product.price).toLocaleString('en-IN')}</p>
        <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
        <p className={`mt-5 text-sm font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
        <div className="mt-7 flex gap-3"><Button disabled={!product.stock} onClick={() => addItem(product)}><ShoppingCart size={18}/>Add to cart</Button><button onClick={() => toggle(product)} className="grid h-12 w-12 place-items-center rounded-xl border dark:border-slate-800"><Heart size={20} fill={has(product) ? 'currentColor' : 'none'}/></button></div>
      </div>
    </div>
    <section className="mt-14"><h2 className="text-2xl font-black">Customer reviews</h2>{reviews.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{reviews.map(r => <article key={r._id} className="rounded-2xl border p-5 dark:border-slate-800"><div className="flex items-center gap-1 text-amber-500">{[1,2,3,4,5].map(n => <Star key={n} size={14} fill={n <= r.rating ? 'currentColor' : 'none'}/>)}</div><h3 className="mt-2 font-bold">{r.title || 'Review'}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{r.comment}</p></article>)}</div> : <p className="mt-4 text-slate-500">Be the first to review this product.</p>}</section>
  </Container>
}
