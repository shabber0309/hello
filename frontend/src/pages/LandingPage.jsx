import React from 'react';
import { 
  ShieldCheck, 
  Video, 
  Lock, 
  Wrench, 
  ArrowRight, 
  Radio, 
  DollarSign
} from 'lucide-react';

export default function LandingPage({ 
  onStartBooking, 
  onBecomeTechnician,
  onSeeHowItWorks
}) {
  const trustIndicators = [
    {
      icon: ShieldCheck,
      title: 'Verified Technicians',
      desc: 'Background and skill verification',
      bgGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      topBorder: '#10b981',
      glow: '0 4px 14px rgba(16, 185, 129, 0.4)'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      desc: 'Compare offers before accepting',
      bgGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      topBorder: '#2563eb',
      glow: '0 4px 14px rgba(37, 99, 235, 0.4)'
    },
    {
      icon: Video,
      title: 'Live Repair Sessions',
      desc: 'Watch the repair through video',
      bgGrad: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      topBorder: '#8b5cf6',
      glow: '0 4px 14px rgba(139, 92, 246, 0.4)'
    },
    {
      icon: Lock,
      title: 'Tamper-Seal Protection',
      desc: 'Know when your device is opened',
      bgGrad: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      topBorder: '#0284c7',
      glow: '0 4px 14px rgba(6, 182, 212, 0.4)'
    }
  ];

  const sixSteps = [
    { num: '1', title: 'Describe Your Problem', desc: 'Tell us your laptop brand, model, issue, and expected repair budget.', grad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { num: '2', title: 'Get Matched With Technicians', desc: 'Your request is shared with verified technicians who can service your device.', grad: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
    { num: '3', title: 'Compare & Accept Offers', desc: 'Technicians can accept your budget or send their own repair quote.', grad: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    { num: '4', title: 'Secure Pickup', desc: 'Your laptop is collected, sealed, and tracked during transportation.', grad: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { num: '5', title: 'Watch the Repair Live', desc: 'Join a video session and watch the technician diagnose and repair your laptop.', grad: 'linear-gradient(135deg, #10b981, #059669)' },
    { num: '6', title: 'Get It Back Safely', desc: 'Your repaired laptop is sealed again and delivered back to you.', grad: 'linear-gradient(135deg, #6366f1, #4338ca)' }
  ];

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* 1. Hero Section */}
      <section style={{ padding: '40px 0 30px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '36px',
            alignItems: 'center'
          }}>
            {/* Left Headline Column */}
            <div>
              <h1 style={{
                fontSize: 'clamp(2.3rem, 4.2vw, 3.2rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '16px',
                letterSpacing: '-0.03em',
                color: 'var(--text-main)'
              }}>
                Laptop Repair, <br />
                <span style={{
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #0284c7 45%, #059669 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>
                  Without the Guesswork.
                </span>
              </h1>

              <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                marginBottom: '24px',
                maxWidth: '520px'
              }}>
                Connect with verified technicians, get transparent repair estimates, track your device at every step, and watch your repair happen live on camera.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button 
                  className="btn-cta"
                  onClick={onStartBooking}
                  style={{ padding: '12px 24px', fontSize: '0.92rem', fontWeight: 700 }}
                >
                  Get Your Laptop Repaired
                  <ArrowRight size={16} />
                </button>

                <button 
                  className="btn-secondary"
                  onClick={onBecomeTechnician}
                  style={{ padding: '12px 20px', fontSize: '0.92rem', fontWeight: 700, background: 'rgba(255, 255, 255, 0.95)' }}
                >
                  <Wrench size={15} color="var(--primary)" />
                  Become a Technician
                </button>
              </div>
            </div>

            {/* Right Column: Exploded Laptop Graphic */}
            <div>
              <div className="tech-card" style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 16px 36px -6px rgba(30, 64, 175, 0.2)'
              }}>
                <img 
                  src="/hero_laptop.jpg" 
                  alt="Laptop Diagnostics"
                  style={{ width: '100%', height: '320px', objectFit: 'cover', display: 'block' }}
                />

                <div style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(15, 23, 42, 0.88)',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <Radio size={12} color="#ef4444" />
                  <span>Live Microscope Stream</span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  background: 'rgba(15, 23, 42, 0.92)',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                  <ShieldCheck size={14} /> Serial Numbers Matched Live on Camera
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators with Rich Colors */}
      <section style={{ padding: '32px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px'
          }}>
            {trustIndicators.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div 
                  key={idx} 
                  className="tech-card" 
                  style={{ 
                    padding: '24px 20px', 
                    textAlign: 'center', 
                    borderRadius: '16px',
                    borderTop: `4px solid ${t.topBorder}`,
                    background: 'rgba(255, 255, 255, 0.92)'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: t.bgGrad,
                    color: '#ffffff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: t.glow
                  }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>{t.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How FixConnect Works (6 Steps with Colored Badges) */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>How FixConnect Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
              6 transparent steps from request to delivery.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {sixSteps.map((s, idx) => (
              <div key={idx} className="tech-card" style={{ padding: '22px', borderRadius: '16px', background: 'rgba(255, 255, 255, 0.92)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: s.grad,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '12px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '4px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom Trust Callout */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '32px 28px',
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.92)',
            boxShadow: '0 12px 32px -4px rgba(30, 64, 175, 0.15)',
            border: '2px solid rgba(147, 197, 253, 0.6)'
          }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
              Your Device. Your Control.
            </h2>
            <p style={{ fontSize: '0.94rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              No hidden repairs, unexpected charges, or opening your laptop without your approval.
            </p>
            <button 
              className="btn-primary" 
              onClick={onSeeHowItWorks}
              style={{ padding: '10px 24px', fontSize: '0.88rem' }}
            >
              See How It Works <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
