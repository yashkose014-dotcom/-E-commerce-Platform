import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (e) => {
    e.preventDefault(); setError('')
    try { await login(email, password); navigate(location.state?.from || '/') }
    catch (err) { setError(err.response?.data?.message || 'Unable to sign in') }
  }

  return <Container className="max-w-lg py-16"><h1 className="text-4xl font-black">Welcome back</h1><p className="mt-2 text-slate-500">Sign in to your Urban Mart account.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<form onSubmit={submit} className="mt-8 grid gap-4"><input value={email} onChange={e=>setEmail(e.target.value)} className="rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-900" type="email" placeholder="Email" required /><input value={password} onChange={e=>setPassword(e.target.value)} className="rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-900" type="password" placeholder="Password" required /><Button>Sign in</Button></form><p className="mt-6 text-sm text-slate-500">New here? <Link className="font-bold underline" to="/register">Create an account</Link></p></Container>
}
