import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../components/common/Container'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [error, setError] = useState('')
  const { register } = useAuth(); const navigate = useNavigate()
  const submit = async (e) => { e.preventDefault(); setError(''); try { await register(form.name, form.email, form.password); navigate('/') } catch(err) { setError(err.response?.data?.message || 'Unable to create account') } }
  return <Container className="max-w-lg py-16"><h1 className="text-4xl font-black">Create account</h1><p className="mt-2 text-slate-500">Join Urban Mart today.</p>{error && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<form onSubmit={submit} className="mt-8 grid gap-4">{[['name','Full name'],['email','Email'],['password','Password']].map(([key,placeholder])=><input key={key} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="rounded-xl border p-4 dark:border-slate-700 dark:bg-slate-900" type={key==='password'?'password':key==='email'?'email':'text'} placeholder={placeholder} required />)}<Button>Create account</Button></form><p className="mt-6 text-sm text-slate-500">Already registered? <Link className="font-bold underline" to="/login">Sign in</Link></p></Container>
}
