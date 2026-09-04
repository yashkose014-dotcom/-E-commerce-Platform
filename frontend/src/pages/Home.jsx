import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

export default function Home() {
  return (
    <div>
      <section className="bg-slate-100 py-16 dark:bg-slate-900 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">The new everyday</p>
              <h1 className="max-w-xl text-5xl font-black tracking-tight sm:text-7xl">Shop smarter. Live better.</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Discover modern essentials across fashion, electronics and lifestyle — all in one place.</p>
              <Link to="/products" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-bold text-white dark:bg-white dark:text-slate-950">Explore collection <ArrowRight size={18} /></Link>
            </div>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=85" alt="Urban Mart storefront" className="h-[420px] w-full rounded-3xl object-cover shadow-2xl" />
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [Truck, 'Fast shipping', 'Reliable delivery'],
            [ShieldCheck, 'Secure checkout', 'Protected payments'],
            [Sparkles, 'Curated quality', 'Products we love'],
          ].map(([Icon, title, text]) => <div key={title} className="rounded-2xl border border-slate-200 p-5 dark:border-slate-800"><Icon /><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>)}
        </div>

        <div className="mt-16 flex items-end justify-between">
          <div><p className="text-sm font-bold uppercase tracking-widest text-slate-500">Trending now</p><h2 className="mt-2 text-3xl font-black">Featured products</h2></div>
          <Link to="/products" className="hidden text-sm font-bold sm:block">View all →</Link>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </Container>
    </div>
  )
}
