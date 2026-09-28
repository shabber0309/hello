import React, { useState } from 'react';
import { 
  Wrench, 
  Home, 
  Video, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Award, 
  Radio, 
  LogOut, 
  Settings, 
  MessageSquare, 
  RefreshCw,
  Plus,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import StreamModal from '../components/StreamModal';

export default function TechDashboard() {
  const { user, logout } = useAuth();
  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);

  // Dynamic Requests & Repairs from API
  const [nearbyRequests, setNearbyRequests] = useState([]);
  const [activeRepairs, setActiveRepairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechJobs = async () => {
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
          const orders = data.orders || [];
          setNearbyRequests(orders.filter(o => o.status === 'Order Placed'));
          setActiveRepairs(orders.filter(o => o.status === 'In Repair' || o.status === 'Picked Up'));
        }
      } catch (err) {
        console.error('Failed to fetch tech jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTechJobs();
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 84px)', background: 'var(--bg-deep)' }}>
      {/* Technician Sidebar (Section 10 Specification) */}
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
          Technician Workbench
        </div>

        {[
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'requests', label: 'Repair Requests', icon: Wrench, count: nearbyRequests.filter(r => r.status === 'pending').length },
          { id: 'active', label: 'Active Repairs', icon: Radio, count: 1, isLive: true },
          { id: 'my-jobs', label: 'My Jobs', icon: CheckCircle2 },
          { id: 'earnings', label: 'Earnings', icon: DollarSign },
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'verification', label: 'Verification', icon: Award },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSidebarNav(item.id)}
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
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} />
                <span>{item.label}</span>
              </div>
              {item.count && (
                <span className={`badge ${item.isLive ? 'badge-live' : 'badge-orange'}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                  {item.count}
                </span>
              )}
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
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Welcome, {user?.name || 'Technician'} 👋</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                Hardware Specialist • Workbench Console
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> Certified Technician
              </span>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div className="tech-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>NEW REQUESTS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--cta-orange)' }}>
                {nearbyRequests.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Open customer leads</div>
            </div>

            <div className="tech-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>ACTIVE REPAIRS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                {activeRepairs.length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>On bench or transit</div>
            </div>

            <div className="tech-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>IN PROGRESS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: '#ef4444' }}>
                {activeRepairs.filter(r => r.status === 'In Repair').length}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Live broadcast active</div>
            </div>

            <div className="tech-card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>COMPLETED</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '4px', color: 'var(--success)' }}>
                0
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Verified handoffs</div>
            </div>
          </div>

          {/* Active Repair Workbench Broadcast Box */}
          {activeRepairs.length > 0 ? (
            <div className="tech-card" style={{ padding: '24px', border: '2px solid var(--border-glow)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-live">
                    <Radio size={12} className="pulse-dot" /> ACTIVE ON WORKBENCH
                  </span>
                  <span style={{ fontWeight: 800 }}>
                    {activeRepairs[0].laptop_brand} {activeRepairs[0].laptop_model} — {activeRepairs[0].issue_category}
                  </span>
                </div>

                <button className="btn-cta" onClick={() => setIsLiveStreamOpen(true)} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                  <Video size={14} /> Open Live Broadcast Console
                </button>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Order: <strong>{activeRepairs[0].order_number}</strong> • Status: <strong>{activeRepairs[0].status}</strong>
                {activeRepairs[0].tamper_seal_code && (
                  <span> • Tamper seal: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>{activeRepairs[0].tamper_seal_code}</span></span>
                )}
              </div>
            </div>
          ) : (
            <div className="tech-card" style={{ padding: '24px', textAlign: 'center', marginBottom: '32px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                No active device currently on your cleanroom bench. Accept a customer request below to begin live diagnostics.
              </p>
            </div>
          )}

          {/* Nearby Requests Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Nearby Repair Requests</h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-time open customer requests in your service radius</div>
              </div>
            </div>

            {nearbyRequests.length === 0 ? (
              <div className="tech-card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Wrench size={30} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  No Open Repair Requests Right Now
                </h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto' }}>
                  New incoming requests from nearby customers will automatically appear here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {nearbyRequests.map((req) => (
                  <div key={req.id || req.order_number} className="tech-card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{req.laptop_brand} {req.laptop_model}</h3>
                          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>📍 {req.pickup_city || 'Nearby'}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Issue: {req.issue_category}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ESTIMATE</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cta-orange)', fontFamily: 'var(--font-mono)' }}>
                          ₹{req.quote_amount || 0}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Address: {req.pickup_address}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-primary"
                          style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                          onClick={() => alert(`Accepted repair order ${req.order_number}!`)}
                        >
                          Accept Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <StreamModal isOpen={isLiveStreamOpen} onClose={() => setIsLiveStreamOpen(false)} />
    </div>
  );
}
