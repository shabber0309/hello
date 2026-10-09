import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bell, 
  BellOff, 
  Wrench, 
  Truck, 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  IndianRupee, 
  ShieldCheck, 
  Database,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { generateSystemNotifications, emitNotificationsChanged } from '../../../utils/notificationManager';
import '../common/Modals.css';

export default function NotificationsModal({ isOpen, onClose, onActionClick, orders: propOrders }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [fetchedOrders, setFetchedOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('livefix_dismissed_notifications') || '[]');
    } catch {
      return [];
    }
  });

  const isTech = user?.role === 'technician';
  const isAdmin = user?.role === 'admin';

  // Fetch real orders from backend whenever modal opens, ensuring live synchronization
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || '';
        const headers = activeToken ? { Authorization: `Bearer ${activeToken}` } : {};
        const res = await fetch('/api/repairs', { headers });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.orders && Array.isArray(data.orders)) {
            setFetchedOrders(data.orders);
            try {
              localStorage.setItem('livefix_all_orders', JSON.stringify(data.orders));
            } catch {}
          }
        }
      } catch (err) {
        console.warn('NotificationsModal: unable to fetch API orders', err);
      } finally {
        if (isMounted) setLoadingOrders(false);
      }
    };

    fetchOrders();
    return () => { isMounted = false; };
  }, [isOpen, token]);

  // Read orders from props, API fetch, or localStorage fallback
  const effectiveOrders = useMemo(() => {
    if (Array.isArray(propOrders) && propOrders.length > 0) return propOrders;
    if (fetchedOrders.length > 0) return fetchedOrders;
    try {
      const stored = localStorage.getItem('livefix_all_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  }, [propOrders, fetchedOrders]);

  // Handle single notification dismiss
  const handleDismiss = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDismissedIds(prev => {
      const updated = [...prev, id];
      try {
        localStorage.setItem('livefix_dismissed_notifications', JSON.stringify(updated));
      } catch {}
      emitNotificationsChanged();
      return updated;
    });
  };

  // Handle clear all notifications
  const handleClearAll = (e) => {
    if (e) e.preventDefault();
    const allIds = notifications.map(n => n.id);
    setDismissedIds(prev => {
      const updated = Array.from(new Set([...prev, ...allIds]));
      try {
        localStorage.setItem('livefix_dismissed_notifications', JSON.stringify(updated));
      } catch {}
      emitNotificationsChanged();
      return updated;
    });
  };

  // Construct dynamic system notifications strictly from lifecycle events (NO chat messages)
  const notifications = useMemo(() => {
    return generateSystemNotifications(effectiveOrders, user, dismissedIds);
  }, [effectiveOrders, user, dismissedIds]);

  // Execute notification action button click
  const handleAction = (item) => {
    onClose();
    if (onActionClick) {
      onActionClick(item.action);
    }
    if (item.route) {
      navigate(item.route);
    }
  };

  const getActionBtnStyle = (action) => {
    switch (action) {
      case 'Review Quote':
      case 'Review Job':
        return {
          background: 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)'
        };
      case 'Join Live':
      case 'Watch Live':
      case 'Monitor Streams':
        return {
          background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)'
        };
      case 'Track Pickup':
      case 'Track Device':
        return {
          background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
        };
      case 'Start Repair':
      case 'View Warranty':
      case 'System Status':
        return {
          background: 'linear-gradient(180deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
        };
      default:
        return {
          background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.35)'
        };
    }
  };

  if (!isOpen) return null;

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
                  color: notifications.length > 0 ? 'var(--primary)' : 'var(--text-muted)',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  border: `1px solid ${notifications.length > 0 ? 'rgba(37, 99, 235, 0.3)' : 'rgba(148, 163, 184, 0.25)'}`
                }}>
                  {notifications.length > 0 ? `${notifications.length} Active` : 'All Caught Up'}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {isTech ? 'Live workbench alerts & repair progress updates' : (isAdmin ? 'Platform, verification & system health alerts' : 'Real-time updates on your active repair lifecycle')}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                title="Mark all notifications as read"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}
              >
                Clear All
              </button>
            )}

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
        </div>

        {/* Inner Scrollable Notifications Area */}
        <div className="notifications-scroll-area">
          {loadingOrders && notifications.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Syncing live repair events...
            </div>
          ) : notifications.length === 0 ? (
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
                <div key={n.id} className="notification-item-card" style={{ position: 'relative' }}>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

                        <button
                          type="button"
                          onClick={(e) => handleDismiss(n.id, e)}
                          title="Dismiss notification"
                          aria-label="Dismiss notification"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            opacity: 0.6,
                            transition: 'opacity 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.80rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: 1.45 }}>
                      {n.desc}
                    </p>

                    <button 
                      className="notification-action-btn"
                      style={getActionBtnStyle(n.action)}
                      onClick={() => handleAction(n)}
                    >
                      {n.action.includes('Live') && (
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#ffffff',
                          display: 'inline-block'
                        }} />
                      )}
                      <span>{n.action}</span>
                      <ArrowRight size={12} />
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
