import React from 'react';
import { 
  Laptop, 
  Wrench, 
  Truck, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Star, 
  Clock, 
  DollarSign
} from 'lucide-react';

export default function HowItWorksPage({ onStartBooking, onWatchLiveDemo, onOpenTamperSeal }) {
  const steps = [
    {
      num: '1',
      title: 'Request a Repair',
      desc: 'Select your brand, model, symptom, and target budget in a simple 2-minute form.',
      action: 'Start Request',
      onClick: onStartBooking
    },
    {
      num: '2',
      title: 'Get Verified Quotes',
      desc: 'Local technicians review your issue and submit competitive, itemized repair quotes.',
      action: null
    },
    {
      num: '3',
      title: 'Compare & Accept',
      desc: 'Choose your technician based on quoted price, ratings, distance, and hardware expertise.',
      action: null
    },
    {
      num: '4',
      title: 'Tamper-Sealed Pickup',
      desc: 'Your laptop is collected in a serialized tamper-evident security bag and tracked to the bench.',
      action: 'Tamper Protection',
      onClick: onOpenTamperSeal
    },
    {
      num: '5',
      title: 'Watch the Repair Live',
      desc: 'Join a live camera session to watch the technician unseal, diagnose, and repair your laptop.',
      action: 'Watch Demo Stream',
      onClick: onWatchLiveDemo
    },
    {
      num: '6',
      title: 'Safe Return & Warranty',
      desc: 'Your laptop is re-sealed, delivered back with an OTP handoff, and backed by a 6-month warranty.',
      action: null
    }
  ];

  return (
    <div style={{ padding: '36px 0 70px' }}>
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            How FixConnect Works
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            A transparent 6-step process from booking to doorstep return.
          </p>
        </div>

        {/* Steps Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '36px' }}>
          {steps.map((s, idx) => (
            <div key={idx} className="tech-card" style={{ padding: '22px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  marginBottom: '12px'
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                  {s.desc}
                </p>
              </div>

              {s.action && (
                <button 
                  onClick={s.onClick}
                  style={{
                    alignSelf: 'flex-start',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: 0
                  }}
                >
                  {s.action} <ArrowRight size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Simple Bottom Action */}
        <div className="tech-card" style={{ padding: '28px', textAlign: 'center', borderRadius: '16px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
            Ready to repair your laptop?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Get verified quotes and track every step on live video.
          </p>
          <button 
            className="btn-cta"
            onClick={onStartBooking}
            style={{ padding: '10px 24px', fontSize: '0.88rem' }}
          >
            Book a Repair <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
