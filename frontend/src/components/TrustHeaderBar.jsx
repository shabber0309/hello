import React from 'react';
import { ShieldCheck, Video, Lock, Award, EyeOff } from 'lucide-react';

export default function TrustHeaderBar() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      color: '#10b981',
      title: 'Tamper-Evident Bagging',
      sub: 'Serialized pouch sealed at your doorstep'
    },
    {
      icon: Video,
      color: '#ef4444',
      title: '100% Live Google Meet',
      sub: 'Watch technician open & test in real-time'
    },
    {
      icon: EyeOff,
      color: '#06b6d4',
      title: 'Zero Data Access Vault',
      sub: 'Customer storage never browsed or mounted'
    },
    {
      icon: Award,
      color: '#f59e0b',
      title: 'Post-Repair Payment',
      sub: 'Pay only after live stress test verification'
    }
  ];

  return (
    <div style={{
      background: 'rgba(6, 182, 212, 0.04)',
      borderBottom: '1px solid rgba(6, 182, 212, 0.15)',
      padding: '10px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {trustPillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                fontSize: '0.8rem'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: `rgba(${p.color === '#10b981' ? '16, 185, 129' : p.color === '#ef4444' ? '239, 68, 68' : p.color === '#06b6d4' ? '6, 182, 212' : '245, 158, 11'}, 0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: p.color
              }}>
                <Icon size={14} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.78rem' }}>
                  {p.title}
                </div>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                  {p.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
