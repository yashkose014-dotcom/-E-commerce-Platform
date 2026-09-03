import { Link } from 'react-router-dom'
import Container from '../components/common/Container'
export default function NotFound() { return <Container className="py-24 text-center"><h1 className="text-6xl font-black">404</h1><p className="mt-4 text-slate-500">Page not found.</p><Link className="mt-6 inline-block font-bold underline" to="/">Return home</Link></Container> }
