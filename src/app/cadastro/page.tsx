'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Cadastro() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setErro(error.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, full_name: nome, email, role: 'user' })
    }
    router.push('/dashboard')
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Arial, sans-serif', padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 'bold', color: 'white', margin: '0 auto 16px'
          }}>D</div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'white', margin: '0 0 6px' }}>Criar conta</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Preencha os dados para se cadastrar</p>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '32px',
          backdropFilter: 'blur(10px)'
        }}>
          <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>Nome completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" required style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px', color: 'white',
                outline: 'none', boxSizing: 'border-box'
              }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px', color: 'white',
                outline: 'none', boxSizing: 'border-box'
              }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '8px' }}>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px', color: 'white',
                outline: 'none', boxSizing: 'border-box'
              }} />
            </div>
            {erro && <p style={{ fontSize: '13px', color: '#f87171', margin: 0 }}>{erro}</p>}
            <button type="submit" disabled={loading} style={{
              width: '100%',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '14px', fontSize: '15px', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px'
            }}>{loading ? 'Criando conta...' : 'Criar conta'}</button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: '600' }}>Entrar</Link>
        </p>
      </div>
    </main>
  )
}