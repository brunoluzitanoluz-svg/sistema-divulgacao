import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '560px', width: '100%' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 'bold', color: 'white',
          margin: '0 auto 24px'
        }}>D</div>

        <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'white', margin: '0 0 12px', lineHeight: 1.2 }}>
          Controle de<br />Divulgacao
        </h1>

        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', margin: '0 0 40px', lineHeight: 1.6 }}>
          Gerencie e acompanhe suas divulgacoes em todas as plataformas em um so lugar.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/login" style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color: 'white', padding: '14px 36px', borderRadius: '14px',
            fontWeight: '600', fontSize: '15px', textDecoration: 'none'
          }}>Entrar</Link>
          <Link href="/cadastro" style={{
            background: 'rgba(255,255,255,0.08)', color: 'white',
            padding: '14px 36px', borderRadius: '14px', fontWeight: '600',
            fontSize: '15px', textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>Criar conta</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '64px' }}>
          {[
            { icon: '📢', title: 'Registre', desc: 'Adicione links de divulgacao facilmente' },
            { icon: '📊', title: 'Acompanhe', desc: 'Veja o status de cada divulgacao' },
            { icon: '✅', title: 'Gerencie', desc: 'Aprove ou reprove como admin' },
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px', padding: '24px 16px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '28px', margin: '0 0 10px' }}>{item.icon}</p>
              <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', margin: '0 0 6px' }}>{item.title}</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}