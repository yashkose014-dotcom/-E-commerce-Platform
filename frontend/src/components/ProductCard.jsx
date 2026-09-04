import { Heart, ShoppingBag, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { items, toggleWishlist } = useWishlist()
  const saved = items.some((item) => item.id === product.id)

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to={`/products/${product.id}`}><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
        <button onClick={() => toggleWishlist(product)} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow dark:bg-slate-950/90" aria-label="Wishlist">
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-1 text-xs text-slate-500"><Star size={14} fill="currentColor" /> {product.rating}</div>
        <Link to={`/products/${product.id}`} className="font-bold hover:underline">{product.name}</Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-lg font-black">₹{product.price.toLocaleString('en-IN')}</span>
          <button onClick={() => addToCart(product)} className="rounded-xl bg-slate-950 p-2 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950" aria-label="Add to cart"><ShoppingBag size={18} /></button>
        </div>
      </div>
    </article>
  )
}
