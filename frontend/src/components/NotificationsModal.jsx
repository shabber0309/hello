import React from 'react';
import { Bell, Wrench, Truck, Radio, AlertTriangle, CheckCircle2, X } from 'lucide-react';

export default function NotificationsModal({ isOpen, onClose, onActionClick }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      title: 'Additional Issue Found — Approval Required',
      desc: 'Technician Ravi Sharma found a damaged display connector (₹450). Please approve to proceed.',
      time: '10 mins ago',
      action: 'Review Issue'
    },
    {
      id: 2,
      icon: Radio,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      title: 'Live Repair Session Started',
      desc: 'Your technician is live on the 4K bench camera. Click to watch unboxing and micro-soldering.',
      time: '25 mins ago',
      action: 'Join Live'
    },
    {
      id: 3,
      icon: Wrench,
      color: 'var(--primary)',
      bg: 'var(--primary-subtle)',
      title: 'New Repair Offer Received',
      desc: 'Ravi Sharma offered ₹1,500 (within your ₹1,200 – ₹2,000 budget) for your Dell Inspiron 15.',
      time: '1 hour ago',
      action: 'View Offer'
    },
    {
      id: 4,
      icon: Truck,
      color: 'var(--cta-orange)',
      bg: 'rgba(255, 107, 53, 0.1)',
      title: 'Doorstep Pickup Scheduled',
      desc: 'Courier assigned. Serialized tamper bag SEAL-TX-7842B reserved for 4:30 PM pickup.',
      time: '2 hours ago',
      action: 'Track Pickup'
    },
    {
      id: 5,
      icon: CheckCircle2,
      color: 'var(--success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      title: 'Quality Check Passed',
      desc: 'Your laptop has passed display, thermal, and keyboard tests. Resealed for delivery.',
      time: 'Yesterday',
      action: 'View Report'
    },
    {
      id: 6,
      icon: Truck,
      color: 'var(--primary)',
      bg: 'var(--primary-subtle)',
      title: 'Return Pickup Scheduled',
      desc: 'Your repaired laptop is on its way back with courier Kishore. Share secret OTP 8492 upon unsealing.',
      time: 'Yesterday',
      action: 'Delivery OTP'
    }
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
        maxWidth: '600px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bell size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Notifications</h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real-time updates on your active repairs</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} style={{
                display: 'flex',
                gap: '14px',
                padding: '14px',
                borderRadius: '14px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: n.bg,
                  color: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{n.title}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{n.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    {n.desc}
                  </p>
                  <button 
                    className="btn-primary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    onClick={() => {
                      onClose();
                      if (onActionClick) onActionClick(n.action);
                    }}
                  >
                    {n.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
