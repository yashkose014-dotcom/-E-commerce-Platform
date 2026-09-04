import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import Container from '../common/Container'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { count } = useCart()
  const { items: wishlist } = useWishlist()
  const { theme, toggleTheme } = useTheme()

  const submit = (e) => {
    e.preventDefault()
    navigate(`/products?search=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <Container>
        <div className="flex h-[72px] items-center gap-4">
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>

          <Link to="/" className="shrink-0 text-2xl font-black tracking-tight">
            Urban<span className="text-slate-500">Mart</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <Link to="/">Home</Link>
            <Link to="/products">Shop</Link>
            <Link to="/products?category=electronics">Electronics</Link>
            <Link to="/products?category=fashion">Fashion</Link>
          </nav>

          <form onSubmit={submit} className="ml-auto hidden max-w-md flex-1 md:block">
            <div className="flex items-center rounded-xl bg-slate-100 px-3 dark:bg-slate-900">
              <Search size={18} className="text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent px-3 py-3 outline-none" />
            </div>
          </form>

          <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link to="/login" className="hidden rounded-xl p-2 hover:bg-slate-100 sm:block dark:hover:bg-slate-900" aria-label="Account"><UserRound size={20} /></Link>
            <Link to="/wishlist" className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-red-500 px-1.5 text-[10px] text-white">{wishlist.length}</span>}
            </Link>
            <Link to="/cart" className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-900" aria-label="Cart">
              <ShoppingBag size={20} />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 rounded-full bg-slate-950 px-1.5 text-[10px] text-white dark:bg-white dark:text-slate-950">{count}</span>}
            </Link>
          </div>
        </div>

        {open && (
          <div className="border-t border-slate-200 py-4 dark:border-slate-800 md:hidden">
            <div className="mb-3 flex items-center rounded-xl bg-slate-100 px-3 dark:bg-slate-900">
              <Search size={18} className="text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit(e)} placeholder="Search products..." className="w-full bg-transparent px-3 py-3 outline-none" />
            </div>
            <div className="grid gap-3 text-sm font-semibold">
              <Link onClick={() => setOpen(false)} to="/">Home</Link>
              <Link onClick={() => setOpen(false)} to="/products">Shop</Link>
              <Link onClick={() => setOpen(false)} to="/login">Account</Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}
