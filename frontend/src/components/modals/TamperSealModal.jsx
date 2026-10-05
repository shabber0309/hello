import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, X, Clock, QrCode } from 'lucide-react';
import './Modals.css';

export default function TamperSealModal({ isOpen, onClose, sealId = 'TC-FX-928341' }) {
  if (!isOpen) return null;

  const timeline = [
    { title: 'Seal Applied', time: '02:35 PM', desc: 'Applied by Doorstep Pickup Agent at customer residence' },
    { title: 'Device Picked Up', time: '02:40 PM', desc: 'Secured inside antistatic ESD foam sleeve' },
    { title: 'Delivered to Technician', time: '03:15 PM', desc: 'Received at Cleanroom Bench #4' },
    { title: 'Seal Verified', time: '03:18 PM', desc: 'Barcode matched on 4K camera; 100% unbroken hologram' },
    { title: 'Device Opened During Live Session', time: '03:22 PM', desc: 'Unsealed live under continuous customer video recording' },
    { title: 'Repaired', time: '04:10 PM', desc: 'Display cable replaced and tested' },
    { title: 'New Seal Applied', time: '04:30 PM', desc: 'Resealed with Return Code TC-FX-RETURN-9912' },
    { title: 'Returned to Customer', time: '05:45 PM', desc: 'Delivered with secret OTP handoff verification' }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Lock size={20} color="var(--primary)" />
            <span className="badge badge-primary">TAMPER PROTECTION PROTOCOL</span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Device Security & Tamper Protection</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Your device remained traceable and tamper-sealed throughout the repair process.
          </p>
        </div>

        {/* Seal Info Badge */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid var(--border-light)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>SEAL ID</div>
            <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
              {sealId}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>APPLIED</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>2:35 PM</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>APPLIED BY</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Pickup Agent (Authorized)</div>
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>STATUS</div>
            <div style={{ fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={15} /> Intact Verified
            </div>
          </div>
        </div>

        {/* Timeline */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px' }}>
          Tamper-Proof Custody Timeline
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {timeline.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-light)',
              fontSize: '0.82rem'
            }}>
              <div>
                <span style={{ fontWeight: 700, color: 'var(--text-main)', marginRight: '8px' }}>
                  {item.title}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 600 }}>
                {item.time}
              </span>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: '24px',
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={18} />
          <span>Notice: If a tamper seal is damaged upon return, Live Fix provides immediate 100% hardware insurance coverage.</span>
        </div>
      </div>
    </div>
  );
}
