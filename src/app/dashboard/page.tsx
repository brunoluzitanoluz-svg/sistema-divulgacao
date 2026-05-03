'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [divulgacoes, setDivulgacoes] = useState<any[]>([])
  const [link, setLink] = useState('')
  const [plataforma, setPlataforma] = useState('')
  const [descricao, setDescricao] = useState('')
  const [loading, setLoading] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data } = await supabase.from('divulgacoes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setDivulgacoes(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    await supabase.from('divulgacoes').insert({ user_id: user.id, link, plataforma, descricao, status: 'pendente' })
    const { data } = await supabase.from('divulgacoes').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setDivulgacoes(data || [])
    setLink('')
    setPlataforma('')
    setDescricao('')
    setEnviando(false)
    setSucesso(true)
    setTimeout(() => setSucesso(false), 3000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const statusConfig = (status: string) => {
    if (status === 'aprovado') return { bg: 'rgba(16,185,129,0.1)', color: '#10b981', dot: '#10b981', label: 'Aprovado' }
    if (status === 'reprovado') return { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', dot: '#ef4444', label: 'Reprovado' }
    return { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', dot: '#f59e0b', label: 'Pendente' }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Carregando...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <header style={{
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 'bold', color: 'white'
          }}>D</div>
          <p style={{ color: 'white', fontWeight: '600', fontSize: '15px', margin: 0 }}>Meu Painel</p>
        </div>
        <button onClick={handleLogout} style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          color: '#f87171', borderRadius: '10px',
          padding: '8px 16px', fontSize: '13px',
          cursor: 'pointer', fontWeight: '500'
        }}>Sair</button>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Cards de resumo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total', value: divulgacoes.length, color: 'white' },
            { label: 'Aprovadas', value: divulgacoes.filter(d => d.status === 'aprovado').length, color: '#10b981' },
            { label: 'Pendentes', value: divulgacoes.filter(d => d.status === 'pendente').length, color: '#f59e0b' },
          ].map((card, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '20px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{card.label}</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: card.color, margin: 0 }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Mensagem de sucesso */}
        {sucesso && (
          <div style={{
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.3)',
            borderRadius: '14px', padding: '14px 20px',
            marginBottom: '20px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <span style={{ fontSize: '18px' }}>✅</span>
            <p style={{ color: '#10b981', fontSize: '14px', margin: 0, fontWeight: '500' }}>
              Divulgacao enviada com sucesso! Aguarde a aprovacao do admin.
            </p>
          </div>
        )}

        {/* Formulario */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '28px',
          backdropFilter: 'blur(10px)', marginBottom: '24px'
        }}>
          <h2 style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: '0 0 20px' }}>Nova divulgacao</h2>
          <form onSubmit={handleEnviar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="url"
              placeholder="Link da divulgacao"
              value={link}
              onChange={e => setLink(e.target.value)}
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px', color: 'white',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
            <select
              value={plataforma}
              onChange={e => setPlataforma(e.target.value)}
              required
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px',
                color: plataforma ? 'white' : 'rgba(255,255,255,0.4)',
                outline: 'none', boxSizing: 'border-box'
              }}
            >
              <option value="" style={{ background: '#1e1b3a' }}>Selecione a plataforma</option>
              <option value="Facebook" style={{ background: '#1e1b3a' }}>Facebook</option>
              <option value="Instagram" style={{ background: '#1e1b3a' }}>Instagram</option>
              <option value="YouTube" style={{ background: '#1e1b3a' }}>YouTube</option>
              <option value="TikTok" style={{ background: '#1e1b3a' }}>TikTok</option>
              <option value="Twitter" style={{ background: '#1e1b3a' }}>Twitter</option>
              <option value="WhatsApp" style={{ background: '#1e1b3a' }}>WhatsApp</option>
              <option value="Telegram" style={{ background: '#1e1b3a' }}>Telegram</option>
              <option value="Outro" style={{ background: '#1e1b3a' }}>Outro</option>
            </select>
            <textarea
              placeholder="Descricao (opcional)"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                padding: '12px 16px', fontSize: '14px', color: 'white',
                outline: 'none', boxSizing: 'border-box',
                resize: 'none', height: '88px'
              }}
            />
            <button type="submit" disabled={enviando} style={{
              width: '100%',
              background: enviando ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white', border: 'none', borderRadius: '12px',
              padding: '14px', fontSize: '15px', fontWeight: '600',
              cursor: enviando ? 'not-allowed' : 'pointer'
            }}>{enviando ? 'Enviando...' : 'Enviar divulgacao'}</button>
          </form>
        </div>

        {/* Lista */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>
              Minhas divulgacoes
              <span style={{ marginLeft: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.3)', fontWeight: '400' }}>({divulgacoes.length})</span>
            </h2>
          </div>

          {divulgacoes.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Nenhuma divulgacao enviada ainda.</p>
            </div>
          ) : (
            <div>
              {divulgacoes.map((d, i) => {
                const { bg, color, dot, label } = statusConfig(d.status)
                return (
                  <div key={d.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    padding: '16px 28px',
                    borderBottom: i < divulgacoes.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                  }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '16px' }}>
                      <a href={d.link} target="_blank" rel="noopener noreferrer" style={{
                        color: '#a78bfa', fontSize: '14px', textDecoration: 'none',
                        display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{d.link}</a>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>
                        {d.plataforma} · {new Date(d.created_at).toLocaleDateString('pt-BR')}
                      </p>
                      {d.descricao && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '6px 0 0' }}>{d.descricao}</p>}
                    </div>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      background: bg, color, border: `1px solid ${color}40`,
                      borderRadius: '20px', padding: '4px 12px',
                      fontSize: '12px', fontWeight: '500', flexShrink: 0
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: dot, display: 'inline-block' }} />
                      {label}
                    </span>
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