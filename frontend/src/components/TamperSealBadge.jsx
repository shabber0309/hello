import React from 'react';
import { ShieldCheck, QrCode, Lock } from 'lucide-react';

export default function TamperSealBadge({ sealCode, city = 'Hyderabad' }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
      border: '1px solid rgba(6, 182, 212, 0.3)',
      borderRadius: '12px',
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '60px',
        height: '60px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(6, 182, 212, 0.15)',
          border: '1px solid rgba(6, 182, 212, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)'
        }}>
          <Lock size={18} />
        </div>
        <div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            Tamper-Evident Security Seal
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
            {sealCode || 'SEAL-TX-8921B'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
          <ShieldCheck size={12} /> Bag Verified
        </span>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'rgba(255, 255, 255, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <QrCode size={16} />
        </div>
      </div>
    </div>
  );
}
