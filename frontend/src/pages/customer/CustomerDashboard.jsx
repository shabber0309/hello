import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Laptop, 
  Video, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  ExternalLink, 
  ChevronRight, 
  AlertCircle, 
  Sparkles, 
  Check, 
  RefreshCw,
  Home,
  User,
  Settings,
  PlusCircle,
  Radio,
  FileCheck,
  Package,
  Lock,
  Layers,
  HelpCircle,
  Bell,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  StreamModal,
  TrackRepairModal,
  RepairReportModal,
  FeedbackModal,
  PaymentsModal,
  NotificationsModal,
  HelpSupportModal,
  OrderConversationModal
} from '../../components/modals';
import './CustomerDashboard.css';

export default function CustomerDashboard({ onNewBooking }) {
  const { user, logout, token, login, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Customer auth guard states
  const [customerIdentifier, setCustomerIdentifier] = useState('customer@livefix.com');
  const [customerPassword, setCustomerPassword] = useState('customer123');
  const [customerAuthError, setCustomerAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showSwitchLoginForm, setShowSwitchLoginForm] = useState(false);

  const handleCustomerLogin = async (e) => {
    if (e) e.preventDefault();
    setCustomerAuthError('');
    setIsAuthenticating(true);
    try {
      const res = await login(customerIdentifier, customerPassword);
      if (res.success) {
        if (res.user?.role !== 'customer') {
          setCustomerAuthError(`Account "${res.user?.name}" is a ${res.user?.role}. Customer credentials required.`);
          return;
        }
        setShowSwitchLoginForm(false);
        fetchRepairs();
      } else {
        setCustomerAuthError(res.error || 'Invalid credentials. Please verify your email or phone.');
      }
    } catch {
      setCustomerAuthError('Network error while logging in.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [conversationOrder, setConversationOrder] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [dismissedNoticeId, setDismissedNoticeId] = useState(() => {
    try {
      return sessionStorage.getItem('livefix_dismissed_notice') || null;
    } catch {
      return null;
    }
  });

  const handleDismissNotice = (id) => {
    const idStr = String(id);
    setDismissedNoticeId(idStr);
    try {
      sessionStorage.setItem('livefix_dismissed_notice', idStr);
    } catch {}
  };

  // Active flash notification when a technician wants to talk
  // Disappears immediately if conversationOrder is open, or if user opened the messages or dismissed
  const pendingTechNotice = !conversationOrder && repairs.find(r => 
    r.quote_amount > 0 && 
    !r.quote_approved && 
    String(r.id || r.order_number) !== String(dismissedNoticeId)
  );

  // Sync tab state with URL search params and routes (such as /customer/chat)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const isChatRoute = location.pathname === '/customer/chat' || location.pathname === '/customer/messages';

    // If accessed via /customer/dashboard?tab=chat, redirect to /customer/chat cleanly
    if (location.pathname === '/customer/dashboard' && (tab === 'chat' || tab === 'messages')) {
      navigate('/customer/chat', { replace: true });
      return;
    }

    if (isChatRoute || tab === 'messages' || tab === 'chat') {
      if (repairs.length > 0) {
        setConversationOrder(repairs[0]);
      } else {
        try {
          const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
          if (localSaved.length > 0) {
            setConversationOrder(localSaved[0]);
          } else {
            setConversationOrder({
              id: 1,
              order_number: 'EOF-2026-07350',
              customer_name: user?.name || 'Rahul',
              technician_name: 'Shabber Hussain',
              laptop_brand: 'Asus TUF Gaming',
              laptop_model: 'A15 (FA506 / FA507)',
              issue_category: 'Hinge & Chassis: Broken hinge',
              customer_selected_price: 800,
              quote_amount: 1800,
              technician_notes: 'hello',
              quote_approved: false
            });
          }
        } catch {}
      }
    } else if (tab === 'repairs') {
      setActiveSidebarNav('my-repairs');
      const el = document.getElementById('customer-active-repairs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'track') {
      setIsTrackOpen(true);
    } else if (tab === 'payments') {
      setIsPaymentsOpen(true);
    } else if (tab === 'notifications') {
      setIsNotificationsOpen(true);
    } else if (tab === 'help') {
      setIsHelpOpen(true);
    } else if (!tab || tab === 'dashboard') {
      setActiveSidebarNav('dashboard');
    }
  }, [location.pathname, location.search, repairs]);

  const fetchRepairs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      if (!activeToken) {
        setLoading(false);
        return;
      }
      const res = await fetch('/api/repairs', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRepairs(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch user repairs:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs(false);

    // Auto-refresh repairs every 4 seconds so created repairs and status updates appear live
    const interval = setInterval(() => {
      fetchRepairs(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [token, location.key]);

  const activeRepairs = repairs.filter(r => r.status !== 'Delivered');
  const pastRepairs = repairs.filter(r => r.status === 'Delivered');

  // Protected Customer Route: If not logged in or not customer, redirect to /login
  if (!user || user.role !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="customer-dashboard-root">
      {/* Main Content Area */}
      <main className="customer-main-content">
        <div className="customer-content-container">

          {/* Flash Notification: Technician wants to talk to you */}
          {pendingTechNotice && (() => {
            const rawTechName = pendingTechNotice.technician_name || pendingTechNotice.technician?.name || '';
            const techDisplayName = (!rawTechName || rawTechName.toLowerCase().includes('awaiting')) ? 'Shabber Hussain' : rawTechName;

            return (
              <div style={{
                background: 'linear-gradient(135deg, #075e54 0%, #128c7e 100%)',
                color: '#ffffff',
                borderRadius: '14px',
                padding: '14px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 8px 24px -4px rgba(7, 94, 84, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    flexShrink: 0
                  }}>
                    🔔
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span>Technician {techDisplayName} wants to talk to you</span>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}>
                        Quote: ₹{pendingTechNotice.quote_amount}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', opacity: 0.9, marginTop: '2px' }}>
                      "{pendingTechNotice.technician_notes || 'Technician submitted diagnostic repair estimate'}"
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      handleDismissNotice(pendingTechNotice.id || pendingTechNotice.order_number);
                      setConversationOrder(pendingTechNotice);
                      navigate('/customer/chat');
                    }}
                    style={{
                      background: '#ffffff',
                      color: '#075e54',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      fontSize: '0.86rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    💬 Open Messages
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDismissNotice(pendingTechNotice.id || pendingTechNotice.order_number)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: '6px',
                      opacity: 0.75,
                      fontSize: '1.1rem'
                    }}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Dashboard Heading (Section 9) */}
          <div className="customer-greeting-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <h1 className="customer-greeting-h1">
                Hello, {user?.name?.split(' ')[0] || 'User'} 👋
              </h1>
              <p className="customer-greeting-sub">
                What would you like to do today?
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsNotificationsOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                position: 'relative'
              }}
            >
              <Bell size={16} />
              <span>Notifications</span>
              {activeRepairs.some(r => r.stream_session?.is_live || r.status === 'Quote Pending') && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  boxShadow: '0 0 6px #ef4444'
                }} />
              )}
            </button>
          </div>

          {/* Large Card: Need a laptop repair? */}
          <div className="customer-hero-banner">
            <div>
              <h2 className="customer-hero-title">Need a laptop repair?</h2>
              <p className="customer-hero-desc">
                Tell us what's wrong and we'll connect you with nearby verified technicians in minutes.
              </p>
            </div>

            <button className="btn-cta" onClick={onNewBooking}>
              <PlusCircle size={16} /> Create Repair Request
            </button>
          </div>

          {/* Active Repairs Section */}
          <div id="customer-active-repairs" style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Active Repairs</h2>
                <button
                  type="button"
                  onClick={() => fetchRepairs(false)}
                  title="Refresh repairs"
                  style={{
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-subtle, rgba(226, 232, 240, 0.8))',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  <RefreshCw size={14} />
                </button>
              </div>
              {activeRepairs.some(r => r.stream_session?.is_live) && (
                <span className="badge badge-live">
                  <Radio size={12} className="pulse-dot" /> LIVE WORKBENCH SESSION
                </span>
              )}
            </div>

            {activeRepairs.length === 0 ? (
              <div className="tech-card" style={{ padding: '36px 24px', textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--primary-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: 'var(--primary)'
                }}>
                  <Laptop size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>No Active Repairs</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto 18px' }}>
                  You have not created any laptop repairs yet. When you request a repair, you will see its status and live camera bench right here.
                </p>
                <button className="btn-primary" onClick={onNewBooking} style={{ padding: '10px 20px', fontSize: '0.86rem' }}>
                  <PlusCircle size={15} /> Create Repair Request
                </button>
              </div>
            ) : (
              activeRepairs.map((r) => (
                <div key={r.id || r.order_number} className="tech-card" style={{ padding: '24px', border: '1px solid var(--border-glow)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{r.laptop_brand} {r.laptop_model}</h3>
                        <span className="badge badge-primary">{r.order_number}</span>
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        Issue: <strong>{r.issue_category}</strong>
                      </div>
                    </div>

                    <span className="badge badge-live" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                      {r.status}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    background: 'var(--bg-card-subtle)',
                    padding: '14px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    fontSize: '0.82rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Assigned Tech: </span>
                      <strong>{r.technician?.name || r.technician_name || 'Verified Specialist'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Pickup Slot: </span>
                      <strong style={{ color: 'var(--primary)' }}>{r.pickup_slot || 'Standard Pickup'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Target Budget: </span>
                      <strong style={{ color: '#059669' }}>₹{r.customer_selected_price || r.quote_amount || 0}</strong>
                      {r.base_price_min && (
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block' }}>
                          Range: ₹{r.base_price_min} - ₹{r.base_price_max}
                        </span>
                      )}
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Pickup Location: </span>
                      <strong>{r.pickup_area ? `${r.pickup_area}, ` : ''}{r.pickup_city || 'Hyderabad'}</strong>
                    </div>
                  </div>

                  {/* Photo Proof Thumbnails if attached */}
                  {Array.isArray(r.problem_photos) && r.problem_photos.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>Fault Photos:</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {r.problem_photos.slice(0, 5).map((imgUrl, pIdx) => (
                          <img
                            key={pIdx}
                            src={imgUrl}
                            alt={`Fault ${pIdx + 1}`}
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-light)'
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        ({r.problem_photos.length} photo proof attached)
                      </span>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button 
                      className="btn-cta" 
                      onClick={() => {
                        handleDismissNotice(r.id || r.order_number);
                        setConversationOrder(r);
                        navigate('/customer/chat');
                      }} 
                      style={{ fontSize: '0.85rem', background: '#008069', borderColor: '#008069', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <MessageSquare size={16} /> 💬 Chat with Technician
                    </button>
                    {r.stream_session?.is_live && (
                      <button className="btn-secondary" onClick={() => setIsStreamOpen(true)} style={{ fontSize: '0.85rem' }}>
                        <Video size={16} /> Join Live Repair
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Past Repairs Section */}
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px' }}>Past Repairs</h3>
            {pastRepairs.length === 0 ? (
              <div className="tech-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
                No completed repairs on record yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {pastRepairs.map((r, i) => (
                  <div key={i} className="tech-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.laptop_brand} {r.laptop_model}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.issue_category} • {r.order_number}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--success)', fontSize: '0.9rem' }}>₹{r.quote_amount || 0}</span>
                      <button className="btn-secondary" onClick={() => setIsReportOpen(true)} style={{ fontSize: '0.78rem', padding: '6px 12px' }}>
                        Invoice & Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {isStreamOpen && (
        <StreamModal
          isOpen={isStreamOpen}
          order={activeRepairs[0] || repairs[0] || {
            order_number: 'EOF-LIVE-BENCH',
            laptop_brand: 'Workbench',
            laptop_model: 'Cleanroom Station 4',
            issue_category: 'Diagnostic Video Stream',
            status: 'In Progress'
          }}
          onClose={() => setIsStreamOpen(false)}
        />
      )}
      <TrackRepairModal isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} initialId="" onOpenLiveStream={() => setIsStreamOpen(true)} />
      <RepairReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <PaymentsModal isOpen={isPaymentsOpen} onClose={() => setIsPaymentsOpen(false)} />
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        orders={repairs}
        onActionClick={(action) => {
          if (action === 'Join Live') setIsStreamOpen(true);
          else if (action === 'Review Issue' || action === 'Track Pickup') setIsTrackOpen(true);
        }} 
      />
      <HelpSupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      {conversationOrder && (
        <OrderConversationModal
          isOpen={Boolean(conversationOrder)}
          initialOrder={conversationOrder}
          onClose={() => {
            setConversationOrder(null);
            if (location.pathname === '/customer/chat' || location.pathname === '/customer/messages') {
              navigate('/customer/dashboard');
            }
          }}
          onOpenLiveStream={(ord) => {
            setConversationOrder(null);
            setIsStreamOpen(true);
          }}
        />
      )}
    </div>
  );
}
