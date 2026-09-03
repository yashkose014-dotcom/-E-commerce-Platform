import Container from '../components/common/Container'
import ProductCard from '../components/ProductCard'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist() {
  const { items } = useWishlist()
  return <Container className="py-12"><h1 className="text-4xl font-black">Wishlist</h1>{items.length ? <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div> : <p className="py-20 text-center text-slate-500">Nothing saved yet.</p>}</Container>
}
