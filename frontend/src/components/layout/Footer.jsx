import { Link } from 'react-router-dom'
import Container from '../common/Container'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-2xl font-black">UrbanMart</div>
          <p className="mt-3 text-sm leading-6 text-slate-500">Modern essentials, thoughtfully curated for everyday life.</p>
        </div>
        <div><h3 className="font-bold">Shop</h3><div className="mt-4 grid gap-2 text-sm text-slate-500"><Link to="/products">All Products</Link><Link to="/products?category=fashion">Fashion</Link><Link to="/products?category=electronics">Electronics</Link></div></div>
        <div><h3 className="font-bold">Customer</h3><div className="mt-4 grid gap-2 text-sm text-slate-500"><Link to="/orders">Orders</Link><Link to="/cart">Cart</Link><Link to="/wishlist">Wishlist</Link></div></div>
        <div><h3 className="font-bold">Support</h3><p className="mt-4 text-sm leading-6 text-slate-500">Secure checkout, easy returns and responsive customer support.</p></div>
      </Container>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500 dark:border-slate-800">© {new Date().getFullYear()} Urban Mart. All rights reserved.</div>
    </footer>
  )
}
