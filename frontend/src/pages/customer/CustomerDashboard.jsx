import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [loading, setLoading] = useState(true);

  // Sync tab state with URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'repairs') {
      setActiveSidebarNav('my-repairs');
      const el = document.getElementById('customer-active-repairs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'track') {
      setIsTrackOpen(true);
    } else if (tab === 'messages') {
      setIsStreamOpen(true);
    } else if (tab === 'payments') {
      setIsPaymentsOpen(true);
    } else if (tab === 'notifications') {
      setIsNotificationsOpen(true);
    } else if (tab === 'help') {
      setIsHelpOpen(true);
    } else if (!tab || tab === 'dashboard') {
      setActiveSidebarNav('dashboard');
    }
  }, [location.search]);

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

  // 1. If NOT authenticated or user requested to switch accounts: Show Customer Authentication Gate
  if (!user || showSwitchLoginForm) {
    return (
      <div className="customer-dashboard-root" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'rgba(37, 99, 235, 0.12)',
              border: '1px solid rgba(37, 99, 235, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <User size={28} color="#2563eb" />
            </div>
            <div style={{
              display: 'inline-block',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.6px',
              color: '#2563eb',
              background: 'rgba(37, 99, 235, 0.1)',
              padding: '4px 10px',
              borderRadius: '20px',
              marginBottom: '8px'
            }}>
              CUSTOMER PORTAL • AUTH REQUIRED
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '6px 0 8px', color: 'var(--text-main)' }}>
              Sign in to Your Dashboard
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
              Track active hardware repairs, watch 4K workbench streams & approve quotes.
            </p>
          </div>

          {customerAuthError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '18px',
              fontSize: '0.84rem',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{customerAuthError}</span>
            </div>
          )}

          <form onSubmit={handleCustomerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Email or Mobile Number
              </label>
              <input
                type="text"
                value={customerIdentifier}
                onChange={(e) => setCustomerIdentifier(e.target.value)}
                placeholder="customer@livefix.com"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={customerPassword}
                onChange={(e) => setCustomerPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-light)',
                  background: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn-primary"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw size={16} className="spin" /> Signing in...
                </>
              ) : (
                <>
                  <Lock size={16} /> Sign in to Customer Dashboard
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Helper */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={async () => {
                setCustomerIdentifier('customer@livefix.com');
                setCustomerPassword('customer123');
                await switchRole('customer');
                setShowSwitchLoginForm(false);
                fetchRepairs();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ⚡ Quick Demo 1-Click: Sign in as Customer
            </button>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Create an account
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                ← Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. If signed in as non-customer (e.g. technician or admin), show Role Notice Gate
  if (user.role !== 'customer') {
    return (
      <div className="customer-dashboard-root" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          background: 'var(--bg-surface)',
          border: '1px solid rgba(37, 99, 235, 0.3)',
          borderRadius: '16px',
          padding: '36px 32px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'rgba(37, 99, 235, 0.12)',
            border: '1px solid rgba(37, 99, 235, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <User size={30} color="#2563eb" />
          </div>
          <div style={{
            display: 'inline-block',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.6px',
            color: '#2563eb',
            background: 'rgba(37, 99, 235, 0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            marginBottom: '10px'
          }}>
            PORTAL ROLE NOTICE
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 10px', color: 'var(--text-main)' }}>
            Signed in as {user.role?.toUpperCase()}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
            You are currently signed in as <strong>{user.name}</strong> ({user.role?.toUpperCase()}). To manage your repairs as a customer, please switch accounts or return to your dedicated portal.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowSwitchLoginForm(true)}
              style={{ padding: '12px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              👤 Sign in with Customer Account
            </button>
            {user.role === 'technician' && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/technician/dashboard')}
                style={{ padding: '11px', fontSize: '0.88rem', fontWeight: 600 }}
              >
                🔧 Go to Technician Workbench
              </button>
            )}
            {user.role === 'admin' && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate('/admin/dashboard')}
                style={{ padding: '11px', fontSize: '0.88rem', fontWeight: 600 }}
              >
                🛡️ Go to Admin Console
              </button>
            )}
            <button
              type="button"
              onClick={logout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                marginTop: '6px'
              }}
            >
              Sign out of current account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-dashboard-root">
      {/* Main Content Area */}
      <main className="customer-main-content">
        <div className="customer-content-container">
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
                      onClick={() => setConversationOrder(r)} 
                      style={{ fontSize: '0.85rem' }}
                    >
                      <MessageSquare size={16} /> Live Negotiation & Custody Thread
                    </button>
                    {r.stream_session?.is_live && (
                      <button className="btn-secondary" onClick={() => setIsStreamOpen(true)} style={{ fontSize: '0.85rem' }}>
                        <Video size={16} /> Join Live Repair
                      </button>
                    )}
                    <button className="btn-secondary" onClick={() => setIsTrackOpen(true)} style={{ fontSize: '0.85rem' }}>
                      Track Repair
                    </button>
                    <button className="btn-secondary" onClick={() => setIsReportOpen(true)} style={{ fontSize: '0.85rem' }}>
                      View Repair Report
                    </button>
                    <button className="btn-secondary" onClick={() => setIsFeedbackOpen(true)} style={{ fontSize: '0.85rem' }}>
                      Rate Repair
                    </button>
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
          onClose={() => setConversationOrder(null)}
          onOpenLiveStream={(ord) => {
            setConversationOrder(null);
            setIsStreamOpen(true);
          }}
        />
      )}
    </div>
  );
}
