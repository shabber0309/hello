import React, { useMemo } from 'react';
import { Bell, BellOff, Wrench, Truck, Radio, AlertTriangle, CheckCircle2, X, DollarSign, ShieldCheck, Database } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Modals.css';

export default function NotificationsModal({ isOpen, onClose, onActionClick, orders: propOrders }) {
  const { user } = useAuth();
  if (!isOpen) return null;

  const isTech = user?.role === 'technician';
  const isAdmin = user?.role === 'admin';

  // Read orders from prop, or fallback to localStorage
  const effectiveOrders = useMemo(() => {
    if (Array.isArray(propOrders) && propOrders.length > 0) return propOrders;
    try {
      const stored = localStorage.getItem('livefix_all_orders');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  }, [propOrders]);

  // Construct dynamic notifications strictly from real active events
  const notifications = useMemo(() => {
    const list = [];

    if (isTech) {
      // Technician events
      effectiveOrders.forEach(ord => {
        if (!ord) return;
        const ordNum = ord.order_number || ord.id || 'Order';
        const brandModel = `${ord.laptop_brand || 'Device'} ${ord.laptop_model || ''}`.trim();

        if (ord.stream_session?.is_live) {
          list.push({
            id: `stream-${ordNum}`,
            icon: Radio,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)',
            title: 'Bench 4K Broadcast Active',
            desc: `Station camera is currently live for ${brandModel} (#${ordNum}). Customer may be monitoring.`,
            time: 'Live Now',
            action: 'Join Live'
          });
        }

        if (ord.status === 'Diagnosis / Quoting' || ord.status === 'Pending') {
          list.push({
            id: `diag-${ordNum}`,
            icon: AlertTriangle,
            color: '#f97316',
            bg: 'rgba(249, 115, 22, 0.1)',
            title: 'Customer Request Awaiting Diagnosis',
            desc: `${brandModel} (#${ordNum}) — ${ord.issue_category || 'Hardware Issue'}. Ready for bench inspection.`,
            time: 'Action Required',
            action: 'Review Job'
          });
        }

        if (ord.status === 'Quote Approved' || ord.status === 'In Progress') {
          list.push({
            id: `prog-${ordNum}`,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            title: 'Repair Approved & In Progress',
            desc: `Repair quote approved for ${brandModel} (#${ordNum}). Escrow funds reserved.`,
            time: 'Active',
            action: 'Start Repair'
          });
        }
      });
    } else if (isAdmin) {
      // Admin events
      const liveOrders = effectiveOrders.filter(o => o?.stream_session?.is_live);
      if (liveOrders.length > 0) {
        list.push({
          id: 'admin-live-streams',
          icon: Radio,
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
          title: `${liveOrders.length} Bench Stream${liveOrders.length > 1 ? 's' : ''} Online`,
          desc: `Cleanroom stations are broadcasting active live diagnostics.`,
          time: 'Live',
          action: 'Join Live'
        });
      }
    } else {
      // Customer events
      effectiveOrders.forEach(ord => {
        if (!ord) return;
        const ordNum = ord.order_number || ord.id || 'Order';
        const brandModel = `${ord.laptop_brand || 'Device'} ${ord.laptop_model || ''}`.trim();

        if (ord.stream_session?.is_live) {
          list.push({
            id: `cust-stream-${ordNum}`,
            icon: Radio,
            color: '#ef4444',
            bg: 'rgba(239, 68, 68, 0.1)',
            title: 'Live Repair Session Started',
            desc: `Your technician is broadcasting live on the workbench camera for ${brandModel} (#${ordNum}).`,
            time: 'Live Now',
            action: 'Join Live'
          });
        }

        if (ord.status === 'Quote Pending' || (ord.quote_amount && !ord.quote_approved)) {
          list.push({
            id: `cust-quote-${ordNum}`,
            icon: AlertTriangle,
            color: '#f59e0b',
            bg: 'rgba(245, 158, 11, 0.1)',
            title: 'Repair Quote Awaiting Your Approval',
            desc: `Technician provided an estimate of ₹${ord.quote_amount || 0} for ${brandModel}. Please review to proceed.`,
            time: 'Action Required',
            action: 'Review Issue'
          });
        }

        if (ord.status === 'Ready for Delivery') {
          list.push({
            id: `cust-ready-${ordNum}`,
            icon: CheckCircle2,
            color: '#10b981',
            bg: 'rgba(16, 185, 129, 0.1)',
            title: 'Quality Check Passed — Ready for Dispatch',
            desc: `Your ${brandModel} (#${ordNum}) has passed all diagnostics and is prepared for delivery.`,
            time: 'Ready',
            action: 'Track Pickup'
          });
        }
      });
    }

    return list;
  }, [isTech, isAdmin, effectiveOrders]);

  const getActionBtnStyle = (action) => {
    switch (action) {
      case 'Review Issue':
      case 'Review Job':
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
      case 'Intake Device':
        return {
          background: 'linear-gradient(180deg, #f97316 0%, #ea580c 100%)',
          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)'
        };
      case 'View Report':
      case 'Start Repair':
      case 'View Ledger':
        return {
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
        };
      case 'Delivery OTP':
      case 'Review Tech':
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
              {notifications.length > 0 && (
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
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>Notifications</h2>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  background: notifications.length > 0 ? 'rgba(37, 99, 235, 0.14)' : 'rgba(148, 163, 184, 0.14)',
                  color: notifications.length > 0 ? '#2563eb' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: `1px solid ${notifications.length > 0 ? 'rgba(37, 99, 235, 0.3)' : 'rgba(148, 163, 184, 0.25)'}`
                }}>
                  {notifications.length > 0 ? `${notifications.length} Active` : 'All Caught Up'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isTech ? 'Live workbench alerts & customer repair updates' : (isAdmin ? 'Platform, verification & system health alerts' : 'Real-time updates on your active repairs')}
              </div>
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
          {notifications.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'rgba(37, 99, 235, 0.08)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(37, 99, 235, 0.2)'
              }}>
                <BellOff size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>
                No Notifications
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '340px', margin: '0 auto', lineHeight: 1.5 }}>
                You have no pending alerts or notifications. Updates on your repairs, live camera streams, and technician quotes will appear here automatically.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
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
            })
          )}
        </div>

        {/* Footer */}
        <div className="notifications-modal-footer">
          <span>Real-time cleanroom synchronization</span>
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
