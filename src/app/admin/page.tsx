'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }

      const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsuarios(users || [])
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Arial, sans-serif' }}>

      <header style={{
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10
      }}>
        <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Painel Admin</p>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.6)', borderRadius: '10px',
          padding: '8px 14px', fontSize: '13px', cursor: 'pointer'
        }}>Sair</button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
        <h2 style={{ color: 'white', fontWeight: '600', fontSize: '18px', marginBottom: '24px' }}>
          Usuários <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>({usuarios.length})</span>
        </h2>

        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}>
          {usuarios.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div>
              {usuarios.map((u, i) => (
                <div key={u.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 28px',
                  borderBottom: i < usuarios.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}>
                  <div>
                    <p style={{ color: 'white', fontSize: '14px', fontWeight: '500', margin: '0 0 4px' }}>{u.full_name || 'Sem nome'}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>{u.email}</p>
                  </div>
                  <button onClick={() => router.push(`/admin/relatorio/${u.id}`)} style={{
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                    border: 'none', color: 'white', borderRadius: '10px',
                    padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '500'
                  }}>Ver Relatório</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}