'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function Relatorio() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId

  const [usuario, setUsuario] = useState(null)
  const [divulgacoes, setDivulgacoes] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [atualizando, setAtualizando] = useState(null)

  useEffect(() => {
    if (!userId) return
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }
      const { data: userData } = await supabase.from('profiles').select('*').eq('id', userId).single()
      const { data: divs } = await supabase.from('divulgacoes').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      setUsuario(userData)
     const [divulgacoes, setDivulgacoes] = useState<any[]>([])
      setLoading(false)
    }
    init()
  }, [userId])

  const atualizarStatus = async (id, novoStatus) => {
    setAtualizando(id)
    const { error } = await supabase.from('divulgacoes').update({ status: novoStatus }).eq('id', id)
    if (!error) {
      setDivulgacoes(prev => prev.map(d => d.id === id ? { ...d, status: novoStatus } : d))
    }
    setAtualizando(null)
  }

  const statusConfig = (status) => {
    if (status === 'aprovado') return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', dot: '#10b981', label: 'Aprovado' }
    if (status === 'reprovado') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', dot: '#ef4444', label: 'Reprovado' }
    return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', dot: '#f59e0b', label: 'Pendente' }
  }

  const divsFiltradas = filtroStatus ? divulgacoes.filter(d => d.status === filtroStatus) : divulgacoes

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/admin')} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer' }}>← Voltar</button>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Relatório de {usuario?.full_name}</p>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', margin: 0 }}>{usuario?.email}</p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total', value: divulgacoes.length, color: 'white' },
            { label: 'Aprovadas', value: divulgacoes.filter(d => d.status === 'aprovado').length, color: '#10b981' },
            { label: 'Pendentes', value: divulgacoes.filter(d => d.status === 'pendente').length, color: '#f59e0b' },
            { label: 'Reprovadas', value: divulgacoes.filter(d => d.status === 'reprovado').length, color: '#ef4444' },
          ].map((card, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '20px', backdropFilter: 'blur(10px)' }}>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{card.label}</p>
              <p style={{ fontSize: '30px', fontWeight: '700', color: card.color, margin: 0 }}>{card.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>
              Divulgações <span style={{ marginLeft: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>({divsFiltradas.length})</span>
            </h2>
            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '8px 12px', fontSize: '13px', color: 'white', outline: 'none' }}>
              <option value="" style={{ background: '#1e1b3a' }}>Todos os status</option>
              <option value="pendente" style={{ background: '#1e1b3a' }}>Pendente</option>
              <option value="aprovado" style={{ background: '#1e1b3a' }}>Aprovado</option>
              <option value="reprovado" style={{ background: '#1e1b3a' }}>Reprovado</option>
            </select>
          </div>

          {divsFiltradas.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Nenhuma divulgação encontrada.</p>
            </div>
          ) : (
            <div>
              {divsFiltradas.map((d, i) => {
                const { bg, color, dot, label } = statusConfig(d.status)
                return (
                  <div key={d.id} style={{ padding: '16px 28px', borderBottom: i < divsFiltradas.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                        <a href={d.link} target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', fontSize: '14px', textDecoration: 'none', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.link}</a>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>{d.plataforma} · {new Date(d.created_at).toLocaleDateString('pt-BR')}</p>
                        {d.descricao && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>{d.descricao}</p>}
                      </div>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: bg, color, border: '1px solid ' + color + '40', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '500', flexShrink: 0 }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, display: 'inline-block' }} />
                        {label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => atualizarStatus(d.id, 'aprovado')}
                        disabled={d.status === 'aprovado' || atualizando === d.id}
                        style={{ background: d.status === 'aprovado' ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: d.status === 'aprovado' ? 'default' : 'pointer', opacity: d.status === 'aprovado' ? 0.5 : 1 }}
                      >
                        {atualizando === d.id ? '...' : 'Aprovar'}
                      </button>
                      <button
                        onClick={() => atualizarStatus(d.id, 'reprovado')}
                        disabled={d.status === 'reprovado' || atualizando === d.id}
                        style={{ background: d.status === 'reprovado' ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: d.status === 'reprovado' ? 'default' : 'pointer', opacity: d.status === 'reprovado' ? 0.5 : 1 }}
                      >
                        {atualizando === d.id ? '...' : 'Reprovar'}
                      </button>
                      <button
                        onClick={() => atualizarStatus(d.id, 'pendente')}
                        disabled={d.status === 'pendente' || atualizando === d.id}
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: d.status === 'pendente' ? 'default' : 'pointer', opacity: d.status === 'pendente' ? 0.5 : 1 }}
                      >
                        Pendente
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}