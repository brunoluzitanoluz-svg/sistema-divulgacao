'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setErro('Email ou senha incorretos.'); setLoading(false); return }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setErro('Erro ao obter usuário.'); setLoading(false); return }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    console.log('profile:', profile, 'error:', profileError)
    if (profile?.role === 'admin') router.push('/admin')
    else router.push('/dashboard')
  }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: 'white', margin: '0 auto 16px' }}>D</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: '0 0 6px' }}>Bem-vindo de volta</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: '0' }}>Entre com sua conta para continuar</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', backdropFilter: 'blur(10px)' }}>
          {erro && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
              <p style={{ color: '#f87171', fontSize: '13px', margin: '0' }}>{erro}</p>
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Email</label>
              <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '6px' }}>Senha</label>
              <input type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: 'white', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '4px', background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: '20px 0 0' }}>
            Nao tem conta?{' '}
            <a href="/cadastro" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '500' }}>Criar conta</a>
          </p>
        </div>
      </div>
    </main>
  )
}