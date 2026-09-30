import React, { useState, useEffect } from 'react';
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
  FileCheck,
  Search,
  Check,
  X,
  AlertTriangle,
  Send,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
  Laptop,
  Truck,
  Package,
  Lock,
  ChevronRight,
  Info
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StreamModal, OrderConversationModal } from '../../components/modals';
import './TechDashboard.css';

export default function TechDashboard() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [streamOrder, setStreamOrder] = useState(null);
  const [activeConversationOrder, setActiveConversationOrder] = useState(null);

  // Sync activeSidebarNav with URL query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['dashboard', 'requests', 'active', 'my-jobs', 'earnings', 'messages', 'verification', 'settings'].includes(tabParam)) {
      setActiveSidebarNav(tabParam);
    }
  }, [location.search]);

  const handleSidebarChange = (tabId) => {
    setActiveSidebarNav(tabId);
    navigate(`/technician?tab=${tabId}`, { replace: true });
  };

  // Dynamic Requests & Repairs from API
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals inside tech dashboard
  const [isPartLogOpen, setIsPartLogOpen] = useState(false);
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null);
  const [partForm, setPartForm] = useState({ part_name: '', old_serial_no: '', new_serial_no: '', cost: '' });
  
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ quote_amount: '', technician_notes: '' });

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_no: '', ifsc: '', amount: '' });
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Chat message state
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newChatText, setNewChatText] = useState('');

  // Filter states
  const [requestSearch, setRequestSearch] = useState('');
  const [myJobsFilter, setMyJobsFilter] = useState('all');

  const fetchTechJobs = async () => {
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const headers = activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {};
      
      const res = await fetch('/api/repairs', { headers });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch tech jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechJobs();
  }, []);

  // Filtered order groups
  const nearbyRequests = orders.filter(o => o.status === 'Order Placed');
  const activeRepairs = orders.filter(o => 
    o.status !== 'Order Placed' && o.status !== 'Delivered'
  );
  const completedRepairs = orders.filter(o => o.status === 'Delivered');

  // Accept a repair request
  const handleAcceptRequest = async (orderId, targetQuote = 0) => {
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${orderId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          quote_amount: targetQuote,
          technician_notes: 'Accepted by Cleanroom Specialist. Scheduled for immediate workbench diagnostics.'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`Successfully accepted Order #${data.order?.order_number || orderId}! It is now on your active workbench.`);
        fetchTechJobs();
        setActiveSidebarNav('active');
      } else {
        setErrorMsg(data.error || 'Failed to accept request');
      }
    } catch (err) {
      setErrorMsg('Network error accepting request');
    }
  };

  // Update order milestone status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          status: newStatus,
          technician_notes: `Milestone advanced to ${newStatus} on cleanroom bench.`
        })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`Order #${data.order?.order_number || orderId} advanced to "${newStatus}"!`);
        fetchTechJobs();
      } else {
        setErrorMsg(data.error || 'Failed to update status');
      }
    } catch (err) {
      setErrorMsg('Network error updating status');
    }
  };

  // Submit quote
  const handleSaveQuote = async (e) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;

    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${selectedOrderForAction.id}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          quote_amount: parseFloat(quoteForm.quote_amount),
          technician_notes: quoteForm.technician_notes
        })
      });

      if (res.ok) {
        setFeedbackMsg(`Quote of ₹${quoteForm.quote_amount} submitted for customer approval!`);
        setIsQuoteModalOpen(false);
        fetchTechJobs();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to submit quote');
      }
    } catch (err) {
      setErrorMsg('Network error submitting quote');
    }
  };

  // Record Part Replacement
  const handleSavePart = async (e) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;

    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${selectedOrderForAction.id}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          part_name: partForm.part_name,
          old_serial_no: partForm.old_serial_no,
          new_serial_no: partForm.new_serial_no,
          cost: parseFloat(partForm.cost || 0)
        })
      });

      if (res.ok) {
        setFeedbackMsg(`Part "${partForm.part_name}" verified on camera and logged to chain of custody!`);
        setIsPartLogOpen(false);
        setPartForm({ part_name: '', old_serial_no: '', new_serial_no: '', cost: '' });
        fetchTechJobs();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || 'Failed to log part replacement');
      }
    } catch (err) {
      setErrorMsg('Network error logging part');
    }
  };

  // Launch live broadcast
  const handleLaunchLiveStream = (order) => {
    setStreamOrder(order || activeRepairs[0] || {
      order_number: 'BENCH-4K-LIVE',
      laptop_brand: 'Workbench Camera',
      laptop_model: 'Microscope Station 4',
      issue_category: 'Live Motherboard Micro-soldering'
    });
    setIsLiveStreamOpen(true);
  };

  // Send Chat message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'tech',
      text: newChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setNewChatText('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'customer',
        text: 'Thank you! Watching the stream right now, the display looks much clearer.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  // Milestone flow helper
  const nextMilestoneMap = {
    'Technician Accepted': 'Pickup Scheduled',
    'Pickup Scheduled': 'Picked Up',
    'Picked Up': 'Delivered to Bench',
    'Delivered to Bench': 'In Repair',
    'In Repair': 'Quality Check',
    'Quality Check': 'Repaired & Awaiting Payment',
    'Repaired & Awaiting Payment': 'Return Pickup',
    'Return Pickup': 'Delivered'
  };

  return (
    <div className="tech-dashboard-root">
      {/* Main Content Area */}
      <main className="tech-main-content">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Global Alert Messages */}
          {feedbackMsg && (
            <div className="tech-alert-success">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} /> {feedbackMsg}
              </div>
              <button onClick={() => setFeedbackMsg('')} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="tech-alert-error">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} /> {errorMsg}
              </div>
              <button onClick={() => setErrorMsg('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
          )}

          {/* ========================================================
              MODULE 1: DASHBOARD OVERVIEW
              ======================================================== */}
          {activeSidebarNav === 'dashboard' && (
            <div>
              {/* Header */}
              <div className="tech-bench-header">
                <div className="tech-bench-title-group">
                  <div className="tech-bench-badge-row">
                    <span className="badge badge-verified">
                      <ShieldCheck size={13} /> Certified Cleanroom Specialist
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>● Live Camera Online</span>
                  </div>
                  <h1 className="tech-bench-h1">Welcome, {user?.name || "Technician"} 👋</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                    Cleanroom Station #4 • Microscope 100x Stream • ESD Safe Bench
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={fetchTechJobs} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} /> Refresh Jobs
                  </button>
                  <button className="btn-cta" onClick={() => handleLaunchLiveStream(activeRepairs[0])} style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                    <Video size={15} /> Launch Live 4K Stream
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div className="tech-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>OPEN REQUESTS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--cta-orange)' }}>
                    {nearbyRequests.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Customer repair leads waiting</div>
                </div>

                <div className="tech-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>ACTIVE REPAIRS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary)' }}>
                    {activeRepairs.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Assigned or on bench</div>
                </div>

                <div className="tech-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>LIVE STREAMING</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: '#ef4444' }}>
                    {activeRepairs.filter(r => r.status === 'In Repair').length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Active camera broadcast</div>
                </div>

                <div className="tech-card" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase' }}>COMPLETED JOBS</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', color: 'var(--success)' }}>
                    {completedRepairs.length}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Tamper sealed & returned</div>
                </div>
              </div>

              {/* Active Cleanroom Workbench Broadcast Box */}
              {activeRepairs.length > 0 ? (
                <div className="tech-card" style={{ padding: '26px', border: '2px solid var(--border-glow)', marginBottom: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-live">
                        <Radio size={12} className="pulse-dot" /> ACTIVE ON BENCH
                      </span>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                        {activeRepairs[0].laptop_brand} {activeRepairs[0].laptop_model}
                      </h2>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn-cta" 
                        onClick={() => handleLaunchLiveStream(activeRepairs[0])} 
                        style={{ fontSize: '0.82rem', padding: '7px 16px' }}
                      >
                        <Video size={14} /> Open Live Broadcast
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedOrderForAction(activeRepairs[0]);
                          setIsPartLogOpen(true);
                        }}
                        style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                      >
                        <Layers size={14} /> Log Part
                      </button>

                      <button
                        className="btn-secondary"
                        onClick={() => {
                          setSelectedOrderForAction(activeRepairs[0]);
                          setQuoteForm({ quote_amount: activeRepairs[0].quote_amount || '', technician_notes: activeRepairs[0].technician_notes || '' });
                          setIsQuoteModalOpen(true);
                        }}
                        style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                      >
                        <DollarSign size={14} /> Edit Quote
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '18px', background: 'var(--bg-main)', padding: '14px 18px', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>ORDER NUMBER</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)' }}>{activeRepairs[0].order_number}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>TAMPER SEAL CODE</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981' }}>{activeRepairs[0].tamper_seal_code || 'VERIFIED'}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>CURRENT MILESTONE</div>
                      <div style={{ fontWeight: 800, color: 'var(--cta-orange)' }}>{activeRepairs[0].status}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>APPROVED QUOTE</div>
                      <div style={{ fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>₹{activeRepairs[0].quote_amount || 0}</div>
                    </div>
                  </div>

                  {/* 1-Click Milestone Advancement */}
                  {nextMilestoneMap[activeRepairs[0].status] && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Next Protocol Step: <strong>{nextMilestoneMap[activeRepairs[0].status]}</strong>
                      </div>

                      <button
                        className="btn-primary"
                        onClick={() => handleUpdateStatus(activeRepairs[0].id, nextMilestoneMap[activeRepairs[0].status])}
                        style={{ padding: '8px 18px', fontSize: '0.82rem', fontWeight: 800 }}
                      >
                        Advance Status to: {nextMilestoneMap[activeRepairs[0].status]} <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="tech-card" style={{ padding: '36px', textAlign: 'center', marginBottom: '32px' }}>
                  <Wrench size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>Cleanroom Bench is Currently Free</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 18px' }}>
                    Accept an incoming customer repair lead below to initiate pickup and camera diagnostics.
                  </p>
                </div>
              )}

              {/* Nearby Incoming Requests */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Incoming Customer Requests</h2>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Customer repair leads matching your hardware skills</div>
                  </div>
                  <button className="btn-secondary" onClick={() => setActiveSidebarNav('requests')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    View All ({nearbyRequests.length})
                  </button>
                </div>

                {nearbyRequests.length === 0 ? (
                  <div className="tech-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending customer leads right now. All requests have been assigned.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {nearbyRequests.slice(0, 3).map((req) => (
                      <div key={req.id || req.order_number} className="tech-card" style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>{req.laptop_brand} {req.laptop_model}</h3>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>📍 {req.pickup_city || 'Hyderabad'}</span>
                            </div>
                            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Issue: <strong>{req.issue_category}</strong></div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>ESTIMATE</div>
                            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--cta-orange)', fontFamily: 'var(--font-mono)' }}>
                              ₹{req.quote_amount || 0}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            Address: {req.pickup_address}
                          </div>

                          <button 
                            className="btn-primary"
                            style={{ padding: '7px 18px', fontSize: '0.82rem', fontWeight: 700 }}
                            onClick={() => handleAcceptRequest(req.id, req.quote_amount)}
                          >
                            Accept Job
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 2: REPAIR REQUESTS MARKETPLACE
             ======================================================== */}
          {activeSidebarNav === 'requests' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Open Customer Requests</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                    Browse all unassigned laptop repair leads in your radius
                  </p>
                </div>

                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder="Search brand, issue, city..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {nearbyRequests.length === 0 ? (
                <div className="tech-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Wrench size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>No Open Requests Available</h3>
                  <p style={{ fontSize: '0.88rem' }}>Check back soon as new customer orders are submitted regularly.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {nearbyRequests
                    .filter(r => !requestSearch || 
                      r.laptop_brand?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.issue_category?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.pickup_city?.toLowerCase().includes(requestSearch.toLowerCase())
                    )
                    .map((req) => (
                      <div key={req.id} className="tech-card" style={{ padding: '22px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                              <span className="badge badge-orange">{req.order_number}</span>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{req.laptop_brand} {req.laptop_model}</h3>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
                              Reported Issue: <span style={{ color: 'var(--primary)' }}>{req.issue_category}</span>
                            </div>
                            {req.issue_description && (
                              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0', maxWidth: '600px' }}>
                                "{req.issue_description}"
                              </p>
                            )}
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>ESTIMATED TARGET BUDGET</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>
                              ₹{req.quote_amount || 0}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>90% Technician Payout: ₹{Math.round((req.quote_amount || 0) * 0.9)}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', padding: '12px 14px', background: 'var(--bg-main)', borderRadius: '10px', marginBottom: '14px', fontSize: '0.82rem' }}>
                          <div><strong>Pickup Location:</strong> {req.pickup_address}, {req.pickup_city}</div>
                          <div><strong>Preferred Slot:</strong> {req.pickup_slot || 'ASAP'}</div>
                          <div><strong>Serial No:</strong> {req.serial_number || 'To Be Verified on Bench'}</div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            className="btn-secondary"
                            onClick={() => {
                              setSelectedOrderForAction(req);
                              setQuoteForm({ quote_amount: req.quote_amount || '', technician_notes: '' });
                              setIsQuoteModalOpen(true);
                            }}
                            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                          >
                            Send Custom Quote
                          </button>

                          <button
                            className="btn-primary"
                            onClick={() => handleAcceptRequest(req.id, req.quote_amount)}
                            style={{ padding: '8px 22px', fontSize: '0.84rem', fontWeight: 800 }}
                          >
                            Accept Request
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              MODULE 3: ACTIVE REPAIRS & WORKBENCH PROTOCOL
             ======================================================== */}
          {activeSidebarNav === 'active' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Active Repair Workbench</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                    Devices currently in transit, on cleanroom bench, or in quality testing
                  </p>
                </div>
              </div>

              {activeRepairs.length === 0 ? (
                <div className="tech-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Radio size={36} color="var(--primary)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>No Active Repairs In Progress</h3>
                  <p style={{ fontSize: '0.88rem' }}>Accept incoming repair requests to start workbench diagnostics.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {activeRepairs.map((ord) => (
                    <div key={ord.id} className="tech-card" style={{ padding: '24px', borderLeft: '5px solid var(--primary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span className="badge badge-primary">{ord.order_number}</span>
                            <span className="badge badge-verified">
                              <ShieldCheck size={12} /> Seal: {ord.tamper_seal_code || 'VERIFIED'}
                            </span>
                            <span className="badge badge-live">
                              <Radio size={11} className="pulse-dot" /> {ord.status}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '6px 0 2px' }}>
                            {ord.laptop_brand} {ord.laptop_model}
                          </h3>
                          <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                            Issue Category: <strong>{ord.issue_category}</strong> • Customer: {ord.customer_name || 'Customer'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="btn-cta"
                            onClick={() => handleLaunchLiveStream(ord)}
                            style={{ padding: '7px 16px', fontSize: '0.82rem' }}
                          >
                            <Video size={14} /> Start Broadcast
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => {
                              setSelectedOrderForAction(ord);
                              setIsPartLogOpen(true);
                            }}
                            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                          >
                            <Layers size={14} /> Log Part
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => {
                              setSelectedOrderForAction(ord);
                              setQuoteForm({ quote_amount: ord.quote_amount || '', technician_notes: ord.technician_notes || '' });
                              setIsQuoteModalOpen(true);
                            }}
                            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                          >
                            <DollarSign size={14} /> Update Quote
                          </button>
                        </div>
                      </div>

                      {/* Milestone progression selector */}
                      <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase' }}>
                          Repair Milestones Progression
                        </div>
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {[
                            'Technician Accepted',
                            'Pickup Scheduled',
                            'Picked Up',
                            'Delivered to Bench',
                            'In Repair',
                            'Quality Check',
                            'Repaired & Awaiting Payment',
                            'Return Pickup',
                            'Delivered'
                          ].map((stepName, sIdx) => {
                            const isCurrent = ord.status === stepName;
                            return (
                              <button
                                key={sIdx}
                                onClick={() => handleUpdateStatus(ord.id, stepName)}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap',
                                  cursor: 'pointer',
                                  border: isCurrent ? '1.5px solid var(--primary)' : '1px solid var(--border-light)',
                                  background: isCurrent ? 'var(--primary)' : 'var(--bg-surface)',
                                  color: isCurrent ? '#ffffff' : 'var(--text-muted)'
                                }}
                              >
                                {isCurrent ? '✓ ' : ''}{stepName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes & details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        <div>
                          <strong>Notes:</strong> {ord.technician_notes || 'Cleanroom inspection underway under 100x zoom.'}
                        </div>
                        <div>
                          <strong>Quote:</strong> ₹{ord.quote_amount || 0} ({ord.quote_approved ? 'Approved by Customer' : 'Pending Approval'})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              MODULE 4: MY JOBS (HISTORY & COMPLETED)
             ======================================================== */}
          {activeSidebarNav === 'my-jobs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Repair History & My Jobs</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                    Record of all repaired laptops, customer ratings, and warranty coverage
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'active', 'completed'].map(f => (
                    <button
                      key={f}
                      onClick={() => setMyJobsFilter(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        background: myJobsFilter === f ? 'var(--primary)' : 'var(--bg-surface)',
                        color: myJobsFilter === f ? '#fff' : 'var(--text-muted)'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tech-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '14px 18px' }}>Order ID</th>
                      <th style={{ padding: '14px 18px' }}>Device</th>
                      <th style={{ padding: '14px 18px' }}>Issue Category</th>
                      <th style={{ padding: '14px 18px' }}>Status</th>
                      <th style={{ padding: '14px 18px' }}>Amount</th>
                      <th style={{ padding: '14px 18px' }}>Warranty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders
                      .filter(o => {
                        if (myJobsFilter === 'completed') return o.status === 'Delivered';
                        if (myJobsFilter === 'active') return o.status !== 'Delivered' && o.status !== 'Order Placed';
                        return true;
                      })
                      .map((job) => (
                        <tr key={job.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                            {job.order_number}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 800 }}>{job.laptop_brand} {job.laptop_model}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SN: {job.serial_number || 'N/A'}</div>
                          </td>
                          <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>
                            {job.issue_category}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span className={`badge ${job.status === 'Delivered' ? 'badge-verified' : 'badge-orange'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--success)' }}>
                            ₹{job.quote_amount || 0}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                              90-Day Cleanroom Warranty
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 5: EARNINGS & ESCROW PAYOUTS
             ======================================================== */}
          {activeSidebarNav === 'earnings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Earnings & Escrow Payouts</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                    Transparent 90% technician revenue share. Instant direct bank payouts.
                  </p>
                </div>

                <button 
                  className="btn-cta" 
                  onClick={() => setIsPayoutModalOpen(true)}
                  style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                >
                  <DollarSign size={16} /> Request Bank Transfer
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div className="tech-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>TOTAL EARNED</div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹34,800
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Lifetime net technician earnings</div>
                </div>

                <div className="tech-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>ESCROW IN VAULT</div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--cta-orange)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹12,450
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Active repairs awaiting customer return</div>
                </div>

                <div className="tech-card" style={{ padding: '22px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>AVAILABLE TO WITHDRAW</div>
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    ₹16,200
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Verified delivered repairs ready for payout</div>
                </div>
              </div>

              {/* Commission model details */}
              <div className="tech-card" style={{ padding: '24px', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px' }}>Live Fix 90/10 Split Model</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Unlike traditional repair marketplaces that take 30% to 40%, Live Fix charges only a 10% platform facilitation fee. You retain 90% of every completed quote.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--bg-main)', padding: '12px 18px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>TECHNICIAN SHARE</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>90%</div>
                  </div>
                  <div style={{ background: 'var(--bg-main)', padding: '12px 18px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PLATFORM FACILITATION</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-muted)' }}>10%</div>
                  </div>
                  <div style={{ background: 'var(--bg-main)', padding: '12px 18px', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ESCROW SAFETY</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>100% Protected</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 6: CUSTOMER CHAT
             ======================================================== */}
          {activeSidebarNav === 'messages' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Customer Live Communications</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                  Direct chat thread with customer for active cleanroom diagnosis
                </p>
              </div>

              <div className="tech-card" style={{ height: '560px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                {/* Chat Header */}
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-main)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      {activeRepairs.length > 0 ? `${activeRepairs[0].customer_name} — ${activeRepairs[0].laptop_brand} ${activeRepairs[0].laptop_model}` : 'Cleanroom Diagnostic Communications'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>
                      {activeRepairs.length > 0 ? `Order: ${activeRepairs[0].order_number}` : 'Direct connection to active client'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className="btn-cta"
                      type="button"
                      onClick={() => setActiveConversationOrder(activeRepairs[0] || nearbyRequests[0])}
                      style={{ fontSize: '0.82rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ShieldCheck size={14} /> Open Negotiation & Custody Center
                    </button>
                    <span className="badge badge-verified">Live Chat Active</span>
                  </div>
                </div>

                {/* Messages Body */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatMessages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>No messages yet in this session.</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: 'var(--text-dim)' }}>Updates sent here appear directly to the customer in real-time.</p>
                    </div>
                  ) : (
                    chatMessages.map(m => {
                      const isTech = m.sender === 'tech';
                      return (
                        <div key={m.id} style={{ display: 'flex', justifyContent: isTech ? 'flex-end' : 'flex-start' }}>
                          <div style={{
                            maxWidth: '75%',
                            padding: '12px 16px',
                            borderRadius: '14px',
                            background: isTech ? 'var(--primary)' : 'var(--bg-main)',
                            color: isTech ? '#ffffff' : 'var(--text-main)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                          }}>
                            <div style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>{m.text}</div>
                            <div style={{ fontSize: '0.68rem', marginTop: '4px', textAlign: 'right', opacity: 0.75 }}>
                              {m.time}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendMessage} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '10px', background: 'var(--bg-main)' }}>
                  <input
                    type="text"
                    placeholder="Type diagnostic update to customer..."
                    value={newChatText}
                    onChange={(e) => setNewChatText(e.target.value)}
                    style={{ flex: 1, height: '42px', fontSize: '0.88rem', borderRadius: '10px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0 18px', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Send size={15} /> Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 7: CERTIFICATIONS & STANDARDS
             ======================================================== */}
          {activeSidebarNav === 'verification' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Technician Verification & Cleanroom Standards</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                  Cleanroom ISO 9001 compliance, background screening, and camera calibration
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div className="tech-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <ShieldCheck size={26} color="#10b981" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Aadhaar & Police Verification</h3>
                      <span className="badge badge-verified" style={{ fontSize: '0.68rem', marginTop: '2px' }}>APPROVED</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Identity verified with government records. Zero criminal background clearance verified for on-premises laptop servicing.
                  </p>
                </div>

                <div className="tech-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Camera size={26} color="var(--primary)" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>4K Microscope Calibration</h3>
                      <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginTop: '2px' }}>CALIBRATED</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Microscope lens zoom tested up to 100x magnification. Capable of displaying motherboard serial numbers, solder ball fractures, and trace jumpers.
                  </p>
                </div>

                <div className="tech-card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Wrench size={26} color="var(--cta-orange)" />
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>ESD-Safe Mat & Grounding</h3>
                      <span className="badge badge-orange" style={{ fontSize: '0.68rem', marginTop: '2px' }}>ACTIVE</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    Silicone workbench mat grounded with 1 Megaohm resistor. Anti-static wrist straps connected during all live teardowns.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              MODULE 8: STATION SETTINGS
             ======================================================== */}
          {activeSidebarNav === 'settings' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0 }}>Cleanroom Workbench Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>
                  Configure your hardware station ID, camera sources, and service radius
                </p>
              </div>

              <div className="tech-card" style={{ padding: '28px', maxWidth: '680px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                      WORKBENCH STATION NAME
                    </label>
                    <input
                      type="text"
                      defaultValue="Cleanroom Bench #4 (Micro-Soldering)"
                      style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                      PRIMARY WEBCAM RESOLUTION
                    </label>
                    <select style={{ width: '100%', height: '42px', fontSize: '0.9rem' }} defaultValue="4k">
                      <option value="4k">4K Ultra HD (3840x2160 @ 60fps) — Recommended</option>
                      <option value="1080p">1080p Full HD (1920x1080 @ 60fps)</option>
                      <option value="720p">720p HD (1280x720 @ 30fps)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                      SERVICE RADIUS (KM)
                    </label>
                    <input
                      type="number"
                      defaultValue={25}
                      style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                      PRIMARY SPECIALIZATION
                    </label>
                    <input
                      type="text"
                      defaultValue="Motherboard Micro-soldering, GPU Reballing, Liquid Damage Clean"
                      style={{ width: '100%', height: '42px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ paddingTop: '10px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => setFeedbackMsg('Workbench settings saved successfully!')}
                      style={{ padding: '10px 24px', fontSize: '0.88rem', fontWeight: 800 }}
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Live Stream 4K Broadcast Modal */}
      {isLiveStreamOpen && (
        <StreamModal
          order={streamOrder}
          onClose={() => setIsLiveStreamOpen(false)}
          onApproveQuote={() => {}}
        />
      )}

      {/* Part Replacement Logger Modal */}
      {isPartLogOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="tech-card" style={{ width: '100%', maxWidth: '520px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Record Part Replacement</h3>
              </div>
              <button onClick={() => setIsPartLogOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePart} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  PART NAME & SPECIFICATION *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15.6 FHD 144Hz IPS Screen, Samsung 980 1TB NVMe"
                  required
                  value={partForm.part_name}
                  onChange={(e) => setPartForm({ ...partForm, part_name: e.target.value })}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  DEFECTIVE PART SERIAL NUMBER (SHOWN ON CAMERA)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SN-OLD-91823"
                  value={partForm.old_serial_no}
                  onChange={(e) => setPartForm({ ...partForm, old_serial_no: e.target.value })}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  NEW REPLACEMENT PART SERIAL NUMBER
                </label>
                <input
                  type="text"
                  placeholder="e.g. SN-NEW-88412"
                  value={partForm.new_serial_no}
                  onChange={(e) => setPartForm({ ...partForm, new_serial_no: e.target.value })}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  PART COST (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4500"
                  value={partForm.cost}
                  onChange={(e) => setPartForm({ ...partForm, cost: e.target.value })}
                  style={{ width: '100%', height: '40px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsPartLogOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontWeight: 800 }}>
                  Save & Log to Chain of Custody
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Editor Modal */}
      {isQuoteModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="tech-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--cta-orange)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Submit Diagnostic Quote</h3>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveQuote} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  TOTAL REPAIR QUOTE AMOUNT (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={quoteForm.quote_amount}
                  onChange={(e) => setQuoteForm({ ...quoteForm, quote_amount: e.target.value })}
                  style={{ width: '100%', height: '42px', fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  TECHNICIAN DIAGNOSTIC NOTES FOR CUSTOMER
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the required part replacement, thermal rework, or micro-soldering..."
                  value={quoteForm.technician_notes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, technician_notes: e.target.value })}
                  style={{ width: '100%', padding: '10px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsQuoteModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-cta" style={{ padding: '8px 20px', fontWeight: 800 }}>
                  Send for Customer Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payout Transfer Modal */}
      {isPayoutModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="tech-card" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Request Bank Payout</h3>
              </div>
              <button onClick={() => { setIsPayoutModalOpen(false); setPayoutSuccess(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {payoutSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle2 size={46} color="#10b981" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Transfer Request Submitted!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  ₹{payoutForm.amount} will be credited to {payoutForm.bank_name} ending in {payoutForm.account_no.slice(-4)} via IMPS within 2 hours.
                </p>
                <button className="btn-primary" onClick={() => { setIsPayoutModalOpen(false); setPayoutSuccess(false); }}>
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setPayoutSuccess(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    TRANSFER AMOUNT (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={payoutForm.amount}
                    onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                    style={{ width: '100%', height: '42px', fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max available: ₹16,200</span>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    BANK NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutForm.bank_name}
                    onChange={(e) => setPayoutForm({ ...payoutForm, bank_name: e.target.value })}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    ACCOUNT NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutForm.account_no}
                    onChange={(e) => setPayoutForm({ ...payoutForm, account_no: e.target.value })}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    IFSC CODE
                  </label>
                  <input
                    type="text"
                    required
                    value={payoutForm.ifsc}
                    onChange={(e) => setPayoutForm({ ...payoutForm, ifsc: e.target.value })}
                    style={{ width: '100%', height: '38px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsPayoutModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-cta" style={{ padding: '8px 20px', fontWeight: 800 }}>
                    Confirm Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {activeConversationOrder && (
        <OrderConversationModal
          isOpen={Boolean(activeConversationOrder)}
          initialOrder={activeConversationOrder}
          onClose={() => setActiveConversationOrder(null)}
          onOpenLiveStream={(ord) => {
            setActiveConversationOrder(null);
            setStreamOrder(ord);
            setIsLiveStreamOpen(true);
          }}
        />
      )}
    </div>
  );
}
