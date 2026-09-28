import React, { useState } from 'react';
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
import { useAuth } from '../context/AuthContext';
import StreamModal from '../components/StreamModal';
import TrackRepairModal from '../components/TrackRepairModal';
import RepairReportModal from '../components/RepairReportModal';
import FeedbackModal from '../components/FeedbackModal';
import PaymentsModal from '../components/PaymentsModal';
import NotificationsModal from '../components/NotificationsModal';
import HelpSupportModal from '../components/HelpSupportModal';

export default function UserDashboard({ onNewBooking }) {
  const { user, logout } = useAuth();
  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [isStreamOpen, setIsStreamOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch('/api/repairs', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRepairs(data.orders || []);
        }
      } catch (err) {
        console.error('Failed to fetch user repairs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepairs();
  }, []);

  const activeRepairs = repairs.filter(r => r.status !== 'Delivered');
  const pastRepairs = repairs.filter(r => r.status === 'Delivered');

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 84px)', background: 'var(--bg-deep)' }}>
      {/* Customer Sidebar (Section 9 Specification) */}
      <aside style={{
        width: '230px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ padding: '0 12px 14px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
          Customer Portal
        </div>

        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home, action: () => setActiveSidebarNav('dashboard') },
          { id: 'new', label: 'New Repair', icon: PlusCircle, action: onNewBooking },
          { id: 'my-repairs', label: 'My Repairs', icon: Laptop, action: () => setActiveSidebarNav('dashboard') },
          { id: 'track-pickup', label: 'Track Pickup', icon: Package, action: () => setIsTrackOpen(true) },
          { id: 'messages', label: 'Messages', icon: MessageSquare, action: () => setIsStreamOpen(true) },
          { id: 'payments', label: 'Payments', icon: CreditCard, action: () => setIsPaymentsOpen(true) },
          { id: 'notifications', label: 'Notifications', icon: Bell, action: () => setIsNotificationsOpen(true) },
          { id: 'help', label: 'Help & Support', icon: HelpCircle, action: () => setIsHelpOpen(true) }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarNav === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                background: isActive ? 'var(--primary-subtle)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={() => {
              logout();
              window.location.reload();
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'transparent',
              color: '#ef4444',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Dashboard Heading (Section 9) */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Hello, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
              What would you like to do today?
            </p>
          </div>

          {/* Large Card: Need a laptop repair? */}
          <div className="tech-card" style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255, 107, 53, 0.05) 100%)',
            border: '2px solid var(--border-glow)',
            padding: '28px',
            borderRadius: '20px',
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Need a laptop repair?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px' }}>
                Tell us what's wrong and we'll connect you with nearby verified technicians in minutes.
              </p>
            </div>

            <button className="btn-cta" onClick={onNewBooking} style={{ padding: '11px 22px', fontSize: '0.88rem' }}>
              <PlusCircle size={16} /> Create Repair Request
            </button>
          </div>

          {/* Active Repairs Section */}
          <div style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Active Repairs</h2>
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    background: 'var(--bg-card-subtle)',
                    padding: '14px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    fontSize: '0.82rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Assigned Tech: </span>
                      <strong>{r.technician?.name || 'Verified Specialist'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Tamper Seal: </span>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{r.tamper_seal_code || 'Pending'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Estimate: </span>
                      <strong>₹{r.quote_amount || 0}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {r.stream_session?.is_live && (
                      <button className="btn-cta" onClick={() => setIsStreamOpen(true)} style={{ fontSize: '0.85rem' }}>
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
      <StreamModal isOpen={isStreamOpen} onClose={() => setIsStreamOpen(false)} />
      <TrackRepairModal isOpen={isTrackOpen} onClose={() => setIsTrackOpen(false)} initialId="" onOpenLiveStream={() => setIsStreamOpen(true)} />
      <RepairReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <PaymentsModal isOpen={isPaymentsOpen} onClose={() => setIsPaymentsOpen(false)} />
      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onActionClick={() => setIsStreamOpen(true)} />
      <HelpSupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
