import React from 'react';
import { Bell, Wrench, Truck, Radio, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import './Modals.css';

export default function NotificationsModal({ isOpen, onClose, onActionClick }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 1,
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      title: 'Additional Issue Found — Approval Required',
      desc: 'Your technician found a damaged display connector (₹450). Please approve to proceed.',
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
      desc: 'A verified technician offered an estimate (within your expected budget) for your device.',
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

  const getActionBtnStyle = (action) => {
    switch (action) {
      case 'Review Issue':
        return {
          background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)'
        };
      case 'Join Live':
        return {
          background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
        };
      case 'Track Pickup':
        return {
          background: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)'
        };
      case 'View Report':
        return {
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
        };
      case 'Delivery OTP':
        return {
          background: 'linear-gradient(180deg, #0284c7 0%, #0369a1 100%)',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)'
        };
      default:
        return {
          background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
        };
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      backgroundColor: 'rgba(11, 17, 32, 0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="notifications-modal-card">
        {/* Sticky Header */}
        <div className="notifications-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(37, 99, 235, 0.12)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid var(--bg-surface)'
              }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Notifications</h2>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  background: 'rgba(37, 99, 235, 0.14)',
                  color: '#2563eb',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(37, 99, 235, 0.3)'
                }}>
                  6 Active
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Real-time updates on your active repairs</div>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Inner Scrollable Notifications Area */}
        <div className="notifications-scroll-area">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="notification-item-card">
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  background: n.bg,
                  color: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '3px' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                      {n.title}
                    </div>
                    <span style={{ 
                      fontSize: '0.70rem', 
                      fontWeight: 600,
                      color: 'var(--text-dim)', 
                      whiteSpace: 'nowrap',
                      padding: '2px 6px',
                      background: 'rgba(148, 163, 184, 0.1)',
                      borderRadius: '6px'
                    }}>
                      {n.time}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.45 }}>
                    {n.desc}
                  </p>

                  <button 
                    className="notification-action-btn"
                    style={getActionBtnStyle(n.action)}
                    onClick={() => {
                      onClose();
                      if (onActionClick) onActionClick(n.action);
                    }}
                  >
                    {n.action === 'Join Live' && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#ffffff',
                        display: 'inline-block'
                      }} />
                    )}
                    <span>{n.action}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="notifications-modal-footer">
          <span>All timestamps verified by cleanroom audit</span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
