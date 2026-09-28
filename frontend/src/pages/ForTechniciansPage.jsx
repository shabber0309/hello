import React from 'react';
import { 
  Wrench, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Users, 
  Clock, 
  Video
} from 'lucide-react';

export default function ForTechniciansPage({ onRegisterClick, onLoginClick }) {
  const steps = [
    {
      num: '01',
      title: 'Register & Verify Skills',
      desc: 'Submit your ID and workshop details to join our verified technician network.'
    },
    {
      num: '02',
      title: 'Receive Nearby Requests',
      desc: 'Get notified when customers near you request repairs matching your expertise.'
    },
    {
      num: '03',
      title: 'Quote & Repair on Camera',
      desc: 'Inspect devices on live camera, send itemized quotes, and complete repairs transparently.'
    },
    {
      num: '04',
      title: 'Guaranteed Payouts',
      desc: 'Receive 85% of repair fees directly to your bank account upon customer delivery.'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Consistent Customers',
      desc: 'Connect with local customers without spending money on ads.'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      desc: 'Accept only the jobs you want and set your own repair turnaround.'
    },
    {
      icon: Video,
      title: 'Trust with Live Video',
      desc: 'On-camera repairs eliminate customer disputes and build strong ratings.'
    },
    {
      icon: DollarSign,
      title: 'Escrow Protection',
      desc: 'Customer funds are secured upfront so you always get paid.'
    }
  ];

  return (
    <div style={{ padding: '36px 0 70px' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            For Repair Technicians
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 24px' }}>
            Join FixConnect to receive nearby repair requests, broadcast live repairs, and grow your business.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-cta" onClick={onRegisterClick} style={{ padding: '10px 22px', fontSize: '0.88rem' }}>
              Become a Technician <ArrowRight size={15} />
            </button>
            <button className="btn-secondary" onClick={onLoginClick} style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
              Technician Login
            </button>
          </div>
        </div>

        {/* 4 Steps */}
        <div style={{ marginBottom: '44px' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', marginBottom: '20px' }}>
            How It Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {steps.map((st, i) => (
              <div key={i} className="tech-card" style={{ padding: '18px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>
                  STEP {st.num}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{st.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, textAlign: 'center', marginBottom: '20px' }}>
            Why Join FixConnect
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="tech-card" style={{ padding: '20px', borderRadius: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--primary-subtle)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
