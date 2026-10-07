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
  Info,
  Key,
  Bell
} from 'lucide-react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StreamModal, OrderConversationModal, NotificationsModal } from '../../components/modals';
import './TechDashboard.css';

export default function TechDashboard() {
  const { user, logout, token, login, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Technician auth guard states
  const [techIdentifier, setTechIdentifier] = useState('tech@livefix.com');
  const [techPassword, setTechPassword] = useState('tech123');
  const [techAuthError, setTechAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showSwitchLoginForm, setShowSwitchLoginForm] = useState(false);

  const handleTechLogin = async (e) => {
    if (e) e.preventDefault();
    setTechAuthError('');
    setIsAuthenticating(true);
    try {
      const res = await login(techIdentifier, techPassword);
      if (res.success) {
        if (res.user?.role !== 'technician') {
          setTechAuthError(`Account "${res.user?.name}" is a ${res.user?.role}. Technician authorization required.`);
          return;
        }
        setShowSwitchLoginForm(false);
        fetchTechJobs();
      } else {
        setTechAuthError(res.error || 'Invalid credentials. Please verify your technician login.');
      }
    } catch {
      setTechAuthError('Network error while authenticating technician.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [activeSidebarNav, setActiveSidebarNav] = useState('dashboard');
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);
  const [streamOrder, setStreamOrder] = useState(null);
  const [activeConversationOrder, setActiveConversationOrder] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleSidebarChange = (tabId) => {
    setActiveSidebarNav(tabId);
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

  // On-demand credential request state
  const [isCredentialReqModalOpen, setIsCredentialReqModalOpen] = useState(false);
  const [credentialReqNote, setCredentialReqNote] = useState('Technician requires temporary OS login PIN or guest account access to test audio, Wi-Fi, and graphics drivers under live cleanroom camera.');

  // Photo viewer lightbox modal state
  const [activePhotoModalUrl, setActivePhotoModalUrl] = useState(null);

  const fetchTechJobs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const headers = activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {};
      
      const res = await fetch('/api/repairs', { headers });
      let apiOrders = [];
      if (res.ok) {
        const data = await res.json();
        apiOrders = data.orders || [];
      }

      // Merge local fallback / offline orders so no customer request is ever dropped
      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const existingKeys = new Set(apiOrders.map(o => String(o.order_number || o.id)));
        const missingLocal = localSaved.filter(o => !existingKeys.has(String(o.order_number || o.id)));
        setOrders([...missingLocal, ...apiOrders]);
      } catch {
        setOrders(apiOrders);
      }
    } catch (err) {
      console.error('Failed to fetch tech jobs:', err);
      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        setOrders(localSaved);
      } catch {}
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'technician') {
      fetchTechJobs();

      // 4-second real-time polling so customer requests appear immediately
      const interval = setInterval(() => {
        fetchTechJobs(true);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [token, user]);

  // Sync tab search param to automatically open WhatsApp chat modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'messages' || tab === 'chat') {
      if (orders.length > 0) {
        setActiveConversationOrder(orders[0]);
      } else {
        try {
          const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
          if (localSaved.length > 0) setActiveConversationOrder(localSaved[0]);
        } catch {}
      }
    }
  }, [location.search, orders.length]);

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

      const quoteAmt = parseFloat(quoteForm.quote_amount);
      const quoteNotes = quoteForm.technician_notes;

      // Update local storage order cache with the new quote and chat message
      const quoteChatMsg = {
        id: Date.now(),
        order_id: selectedOrderForAction.id,
        sender_id: user?.id,
        sender_name: user?.name || 'Technician',
        sender_role: 'technician',
        message_type: 'price_negotiation',
        content: `Diagnostic Quote Updated to ₹${quoteAmt}.${quoteNotes ? `\nNote: ${quoteNotes}` : ''}`,
        metadata: { quote_amount: quoteAmt, technician_notes: quoteNotes },
        created_at: new Date().toISOString()
      };

      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const updated = localSaved.map(o => {
          if (String(o.order_number || o.id) === String(selectedOrderForAction.order_number || selectedOrderForAction.id)) {
            return {
              ...o,
              quote_amount: quoteAmt,
              technician_notes: quoteNotes,
              messages: [...(o.messages || []), quoteChatMsg]
            };
          }
          return o;
        });
        localStorage.setItem('livefix_all_orders', JSON.stringify(updated));
      } catch (e) {}

      if (res.ok) {
        const data = await res.json();
        setFeedbackMsg(`Quote of ₹${quoteForm.quote_amount} submitted as message to customer!`);
        setIsQuoteModalOpen(false);
        fetchTechJobs();
        // Immediately open WhatsApp chat for this order
        const updatedOrder = data.order || {
          ...selectedOrderForAction,
          quote_amount: quoteAmt,
          technician_notes: quoteNotes
        };
        setActiveConversationOrder(updatedOrder);
      } else {
        // Fallback for demo: still open chat so technician can communicate
        setFeedbackMsg(`Quote of ₹${quoteForm.quote_amount} updated!`);
        setIsQuoteModalOpen(false);
        setActiveConversationOrder({
          ...selectedOrderForAction,
          quote_amount: quoteAmt,
          technician_notes: quoteNotes
        });
        fetchTechJobs();
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

  // Open & send on-demand credential request
  const handleOpenRequestCredentials = (ord) => {
    setSelectedOrderForAction(ord);
    setCredentialReqNote('Technician requires temporary OS login PIN or guest account access to test audio, Wi-Fi, and graphics drivers under live cleanroom camera.');
    setIsCredentialReqModalOpen(true);
  };

  const handleSendCredentialRequest = async (e) => {
    e.preventDefault();
    if (!selectedOrderForAction) return;

    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${selectedOrderForAction.id}/request-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ note: credentialReqNote })
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`Diagnostic credential request dispatched to customer for order #${selectedOrderForAction.order_number}!`);
        setIsCredentialReqModalOpen(false);
        fetchTechJobs();
      } else {
        setErrorMsg(data.error || 'Failed to request credentials');
      }
    } catch (err) {
      setErrorMsg('Network error requesting credentials');
    }
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

  // Protected Technician Route: If not logged in or not technician, redirect to /login
  if (!user || user.role !== 'technician') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="tech-dashboard-root">
      {/* Main Content Area */}
      <main className="tech-main-content">
        <div className="tech-content-container">
          
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

          {/* Master Technician Header */}
          <div className="tech-bench-header">
            <div className="tech-bench-title-group">
              <div className="tech-bench-badge-row">
                <span className="badge badge-primary">
                  <ShieldCheck size={13} /> CLEANROOM WORKBENCH
                </span>
                <span className="tech-bench-station-chip">
                  <Radio size={12} className="pulse-dot" /> Bench #4 Online
                </span>
              </div>
              <h1 className="tech-bench-h1">Welcome, {user?.name || "Technician"} 👋</h1>
              <p className="tech-bench-sub">
                Live ESD diagnostics, customer request marketplace & transparent 4K cleanroom broadcast
              </p>
            </div>

            <div className="tech-header-actions">
              <button 
                type="button" 
                className="btn-secondary tech-header-btn" 
                onClick={() => setIsNotificationsOpen(true)}
                title="View bench notifications and alerts"
                style={{ position: 'relative' }}
              >
                <Bell size={14} /> Alerts
                {orders.some(o => o.status === 'Diagnosis / Quoting' || o.stream_session?.is_live) && (
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
              <button 
                type="button" 
                className="btn-secondary tech-header-btn" 
                onClick={() => fetchTechJobs(false)}
                title="Sync with central repair order database"
              >
                <RefreshCw size={14} /> Refresh Jobs
              </button>
              <button 
                type="button" 
                className="btn-cta tech-header-btn" 
                onClick={() => handleLaunchLiveStream(activeRepairs[0])}
              >
                <Video size={15} /> Launch Live 4K Stream
              </button>
            </div>
          </div>

            
          {/* ========================================================
              MODULE 1: DASHBOARD OVERVIEW
              ======================================================== */}
          {activeSidebarNav === 'dashboard' && (
            <div>
              {/* 4 Responsive Stats Cards */}
              <div className="tech-stats-grid">
                <div className="tech-stat-card">
                  <div className="tech-stat-label">OPEN REQUESTS</div>
                  <div className="tech-stat-value tech-stat-value-orange">
                    {nearbyRequests.length}
                  </div>
                  <div className="tech-stat-desc">Customer repair leads waiting</div>
                </div>

                <div className="tech-stat-card">
                  <div className="tech-stat-label">ACTIVE REPAIRS</div>
                  <div className="tech-stat-value tech-stat-value-cyan">
                    {activeRepairs.length}
                  </div>
                  <div className="tech-stat-desc">Assigned or on bench</div>
                </div>

                <div className="tech-stat-card">
                  <div className="tech-stat-label">LIVE STREAMING</div>
                  <div className="tech-stat-value tech-stat-value-red">
                    {activeRepairs.filter(r => r.status === 'In Repair').length}
                  </div>
                  <div className="tech-stat-desc">Active camera broadcast</div>
                </div>

                <div className="tech-stat-card">
                  <div className="tech-stat-label">COMPLETED JOBS</div>
                  <div className="tech-stat-value tech-stat-value-green">
                    {completedRepairs.length}
                  </div>
                  <div className="tech-stat-desc">Quality tested & returned</div>
                </div>
              </div>

              {/* Active Cleanroom Workbench Broadcast Box */}
              {activeRepairs.length > 0 ? (
                <div className="tech-workbench-card">
                  <div className="tech-workbench-header">
                    <div className="tech-workbench-title-left">
                      <span className="badge badge-live">
                        <Radio size={12} className="pulse-dot" /> ACTIVE ON BENCH
                      </span>
                      <h2 className="tech-workbench-h2">
                        {activeRepairs[0].laptop_brand} {activeRepairs[0].laptop_model}
                      </h2>
                    </div>

                    <div className="tech-workbench-actions">
                      <button 
                        type="button"
                        className="btn-cta" 
                        onClick={() => handleLaunchLiveStream(activeRepairs[0])} 
                        style={{ fontSize: '0.82rem', padding: '7px 16px' }}
                      >
                        <Video size={14} /> Open Live Broadcast
                      </button>

                      <button
                        type="button"
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
                        type="button"
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

                  <div className="tech-workbench-meta-grid">
                    <div>
                      <div className="tech-meta-label">ORDER NUMBER</div>
                      <div className="tech-meta-val" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{activeRepairs[0].order_number}</div>
                    </div>

                    <div>
                      <div className="tech-meta-label">DEVICE STATUS</div>
                      <div className="tech-meta-val" style={{ color: '#10b981', fontFamily: 'var(--font-mono)' }}>Cleanroom Active</div>
                    </div>

                    <div>
                      <div className="tech-meta-label">CURRENT MILESTONE</div>
                      <div className="tech-meta-val" style={{ color: 'var(--cta-orange)' }}>{activeRepairs[0].status}</div>
                    </div>

                    <div>
                      <div className="tech-meta-label">APPROVED QUOTE</div>
                      <div className="tech-meta-val" style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>₹{activeRepairs[0].quote_amount || 0}</div>
                    </div>
                  </div>

                  {/* 1-Click Milestone Advancement */}
                  {nextMilestoneMap[activeRepairs[0].status] && (
                    <div className="tech-milestones-row">
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Next Protocol Step: <strong>{nextMilestoneMap[activeRepairs[0].status]}</strong>
                      </div>

                      <button
                        type="button"
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Incoming Customer Requests</h2>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Customer repair leads matching your hardware skills</div>
                  </div>
                  <button className="btn-secondary" onClick={() => handleSidebarChange('requests')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                    View All ({nearbyRequests.length})
                  </button>
                </div>

                {nearbyRequests.length === 0 ? (
                  <div className="tech-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No pending customer leads right now. All requests have been assigned.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {nearbyRequests.slice(0, 3).map((req) => (
                      <div key={req.id || req.order_number} className="tech-request-card">
                        <div className="tech-request-header-row">
                          <div className="tech-request-title-area">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span className="badge badge-orange">{req.order_number}</span>
                              <h3 className="tech-request-h3">{req.laptop_brand} {req.laptop_model}</h3>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                                📍 {req.pickup_city || 'Hyderabad'}{req.pickup_area ? ` (${req.pickup_area})` : ''}
                              </span>
                            </div>
                            <div className="tech-request-issue-line">
                              Issue: <span style={{ color: 'var(--primary)' }}>{req.issue_category}</span>
                            </div>
                            {req.issue_description && (
                              <p className="tech-request-desc">"{req.issue_description}"</p>
                            )}
                          </div>

                          <div className="tech-request-price-box">
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>CUSTOMER BUDGET</div>
                            <div className="tech-request-price-val">₹{req.quote_amount || req.customer_selected_price || 0}</div>
                            <div className="tech-request-payout-tag">90% Payout: ₹{Math.round((req.quote_amount || req.customer_selected_price || 0) * 0.9)}</div>
                          </div>
                        </div>

                        {/* Customer photo preview if present */}
                        {((req.problem_photos && req.problem_photos.length > 0) || (req.charger_photos && req.charger_photos.length > 0)) && (
                          <div className="tech-photo-strip">
                            <span className="tech-photo-badge">
                              <Camera size={13} color="var(--primary)" /> Photos:
                            </span>
                            {(req.problem_photos || []).map((img, pIdx) => (
                              <img
                                key={`p-${pIdx}`}
                                src={img}
                                alt="Problem proof"
                                className="tech-photo-thumb"
                                title="Click to enlarge"
                                onClick={() => setActivePhotoModalUrl(img)}
                              />
                            ))}
                            {(req.charger_photos || []).map((img, cIdx) => (
                              <img
                                key={`c-${cIdx}`}
                                src={img}
                                alt="Charger proof"
                                className="tech-photo-thumb"
                                title="Click to enlarge"
                                onClick={() => setActivePhotoModalUrl(img)}
                              />
                            ))}
                          </div>
                        )}

                        <div className="tech-request-actions-row" style={{ paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', flex: 1, minWidth: '200px' }}>
                            📍 Pickup: {req.pickup_address}{req.pickup_pincode ? ` (${req.pickup_pincode})` : ''}
                          </div>

                          <button 
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                            onClick={() => {
                              setSelectedOrderForAction(req);
                              setQuoteForm({ quote_amount: req.quote_amount || '', technician_notes: '' });
                              setIsQuoteModalOpen(true);
                            }}
                          >
                            Send Quote
                          </button>

                          <button 
                            type="button"
                            className="btn-secondary"
                            style={{ padding: '7px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 128, 105, 0.1)', color: '#008069', borderColor: '#008069' }}
                            onClick={() => setActiveConversationOrder(req)}
                          >
                            <MessageSquare size={14} color="#008069" /> 💬 Chat with Customer
                          </button>

                          <button 
                            type="button"
                            className="btn-primary"
                            style={{ padding: '7px 20px', fontSize: '0.82rem', fontWeight: 800 }}
                            onClick={() => handleAcceptRequest(req.id, req.quote_amount)}
                          >
                            <Check size={14} /> Accept Job
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
                    Browse all incoming laptop repair requests submitted by customers
                  </p>
                </div>

                <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder="Search brand, issue, location..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    style={{ width: '100%', paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {nearbyRequests.length === 0 ? (
                <div className="tech-card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <Wrench size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>No Open Requests in Queue</h3>
                  <p style={{ fontSize: '0.88rem' }}>When customers book a repair online, orders will automatically pop up here in real time.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {nearbyRequests
                    .filter(r => !requestSearch || 
                      r.laptop_brand?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.laptop_model?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.issue_category?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.pickup_city?.toLowerCase().includes(requestSearch.toLowerCase()) ||
                      r.pickup_area?.toLowerCase().includes(requestSearch.toLowerCase())
                    )
                    .map((req) => (
                      <div key={req.id || req.order_number} className="tech-request-card">
                        <div className="tech-request-header-row">
                          <div className="tech-request-title-area">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                              <span className="badge badge-orange">{req.order_number}</span>
                              <h3 className="tech-request-h3">{req.laptop_brand} {req.laptop_model}</h3>
                              {req.pickup_city && (
                                <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                                  📍 {req.pickup_city}{req.pickup_area ? ` • ${req.pickup_area}` : ''}
                                </span>
                              )}
                            </div>
                            <div className="tech-request-issue-line">
                              Reported Issue: <span style={{ color: 'var(--primary)' }}>{req.issue_category}</span>
                            </div>
                            {req.issue_description && (
                              <p className="tech-request-desc">"{req.issue_description}"</p>
                            )}
                          </div>

                          <div className="tech-request-price-box">
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>CUSTOMER BUDGET TARGET</div>
                            <div className="tech-request-price-val">₹{req.quote_amount || req.customer_selected_price || 0}</div>
                            <div className="tech-request-payout-tag">90% Tech Payout: ₹{Math.round((req.quote_amount || req.customer_selected_price || 0) * 0.9)}</div>
                          </div>
                        </div>

                        {/* Customer Intake & Logistics Specs Grid */}
                        <div className="tech-request-specs-grid">
                          <div className="tech-spec-item">
                            <strong>Pickup Location</strong>
                            {req.pickup_address}
                            {req.pickup_area ? `, ${req.pickup_area}` : ''}
                            {req.pickup_city ? `, ${req.pickup_city}` : ''}
                            {req.pickup_pincode ? ` (${req.pickup_pincode})` : ''}
                            {req.pickup_landmark ? ` [Near ${req.pickup_landmark}]` : ''}
                          </div>

                          <div className="tech-spec-item">
                            <strong>Customer Details</strong>
                            {req.customer_name || 'Customer'}
                            {(req.customer_phone || req.customer_whatsapp) && (
                              <div style={{ marginTop: '2px' }}>
                                <a 
                                  href={`tel:${req.customer_phone || req.customer_whatsapp}`}
                                  style={{ color: '#10b981', fontWeight: 700, textDecoration: 'none', marginRight: '8px' }}
                                >
                                  📞 {req.customer_phone || req.customer_whatsapp}
                                </a>
                              </div>
                            )}
                          </div>

                          <div className="tech-spec-item">
                            <strong>Device Serial Number</strong>
                            {req.serial_number || 'To Be Verified on Bench'}
                          </div>

                          <div className="tech-spec-item">
                            <strong>Charger Intake</strong>
                            {req.charger_included ? (req.charger_details || 'Yes (Original Charger Included)') : 'No Charger Handed Over'}
                          </div>

                          <div className="tech-spec-item">
                            <strong>Included Accessories</strong>
                            {Array.isArray(req.included_accessories) ? req.included_accessories.join(', ') : (req.included_accessories || 'None')}
                          </div>

                          <div className="tech-spec-item">
                            <strong>Pre-existing Flaws</strong>
                            <span style={{ color: '#d97706', fontWeight: 600 }}>
                              {Array.isArray(req.pre_existing_damage) ? req.pre_existing_damage.join(', ') : (req.pre_existing_damage || 'None declared')}
                            </span>
                          </div>
                        </div>

                        {/* Customer Uploaded Photo Proofs */}
                        {((req.problem_photos && req.problem_photos.length > 0) || (req.charger_photos && req.charger_photos.length > 0)) && (
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                              <Camera size={14} color="var(--primary)" />
                              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                Customer Photo Proofs ({ (req.problem_photos?.length || 0) + (req.charger_photos?.length || 0) }) — Click to zoom
                              </span>
                            </div>
                            <div className="tech-photo-strip">
                              {(req.problem_photos || []).map((img, pIdx) => (
                                <img
                                  key={`prob-${pIdx}`}
                                  src={img}
                                  alt={`Problem Proof ${pIdx + 1}`}
                                  className="tech-photo-thumb"
                                  title="Click to view full photo"
                                  onClick={() => setActivePhotoModalUrl(img)}
                                />
                              ))}
                              {(req.charger_photos || []).map((img, cIdx) => (
                                <img
                                  key={`chg-${cIdx}`}
                                  src={img}
                                  alt={`Charger Proof ${cIdx + 1}`}
                                  className="tech-photo-thumb"
                                  title="Click to view full photo"
                                  onClick={() => setActivePhotoModalUrl(img)}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="tech-request-actions-row">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => setActiveConversationOrder(req)}
                            style={{ padding: '8px 14px', fontSize: '0.84rem' }}
                          >
                            <MessageSquare size={14} /> Open Chat & Custody
                          </button>

                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setSelectedOrderForAction(req);
                              setQuoteForm({ quote_amount: req.quote_amount || '', technician_notes: '' });
                              setIsQuoteModalOpen(true);
                            }}
                            style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                          >
                            <DollarSign size={14} /> Send Custom Quote
                          </button>

                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleAcceptRequest(req.id, req.quote_amount)}
                            style={{ padding: '8px 24px', fontSize: '0.84rem', fontWeight: 800 }}
                          >
                            <Check size={15} /> Accept Request
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
                              <ShieldCheck size={12} /> Verified Intake
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

                          <button
                            className="btn-secondary"
                            onClick={() => handleOpenRequestCredentials(ord)}
                            style={{
                              padding: '7px 14px',
                              fontSize: '0.82rem',
                              border: ord.credentials_requested && !ord.credentials_provided ? '1px solid #d97706' : '1px solid var(--border-light)'
                            }}
                            title="Request temporary OS PIN or guest account access from customer for hardware testing"
                          >
                            <Key size={14} color={ord.credentials_provided ? '#16a34a' : (ord.credentials_requested ? '#d97706' : 'currentColor')} />
                            {ord.credentials_provided ? 'PIN Verified' : (ord.credentials_requested ? 'Re-request PIN' : 'Request OS PIN')}
                          </button>
                        </div>
                      </div>

                      {/* Milestone progression selector */}
                      <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-dim)', marginBottom: '10px', textTransform: 'uppercase' }}>
                          Repair Milestones Progression
                        </div>
                        <div className="tech-milestone-pills-container">
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
                                type="button"
                                onClick={() => handleUpdateStatus(ord.id, stepName)}
                                className={`tech-milestone-pill ${isCurrent ? 'tech-milestone-pill-active' : ''}`}
                              >
                                {isCurrent ? '✓ ' : ''}{stepName}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Hardware Intake & Security Credentials Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', padding: '12px 14px', background: 'var(--bg-main)', borderRadius: '10px', marginBottom: '14px', fontSize: '0.82rem' }}>
                        <div>
                          <strong>Device PIN / Access:</strong>{' '}
                          {ord.credentials_provided ? (
                            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#16a34a' }}>
                              🔑 {ord.device_pin} {ord.bitlocker_status ? `(BitLocker: ${ord.bitlocker_status})` : ''}
                            </span>
                          ) : ord.credentials_requested ? (
                            <span style={{ color: '#d97706', fontWeight: 700 }}>
                              ⏳ PIN Requested from Customer
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)' }}>
                              Not Requested (On-Demand)
                            </span>
                          )}
                        </div>
                        <div><strong>Charger Intake:</strong> {ord.charger_included ? (ord.charger_details || 'Yes (Charger Included)') : 'No Charger Handed Over'}</div>
                        <div><strong>Accessories:</strong> {Array.isArray(ord.included_accessories) ? ord.included_accessories.join(', ') : (ord.included_accessories || 'None')}</div>
                        <div><strong>Pre-Existing Flaws:</strong> <span style={{ color: '#d97706', fontWeight: 600 }}>{Array.isArray(ord.pre_existing_damage) ? ord.pre_existing_damage.join(', ') : (ord.pre_existing_damage || 'None')}</span></div>
                        <div><strong>Customer WhatsApp:</strong> {ord.customer_whatsapp || ord.customer_phone || 'N/A'}</div>
                        <div><strong>Data Backup Status:</strong> <span style={{ color: '#059669' }}>{ord.data_backup_status || 'Customer Confirmed'}</span></div>
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

              <div className="tech-table-container">
                <table className="tech-table">
                  <thead>
                    <tr>
                      <th className="tech-th">Order ID</th>
                      <th className="tech-th">Device</th>
                      <th className="tech-th">Issue Category</th>
                      <th className="tech-th">Status</th>
                      <th className="tech-th">Amount</th>
                      <th className="tech-th">Warranty</th>
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
                        <tr key={job.id}>
                          <td className="tech-td" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                            {job.order_number}
                          </td>
                          <td className="tech-td">
                            <div style={{ fontWeight: 800 }}>{job.laptop_brand} {job.laptop_model}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>SN: {job.serial_number || 'N/A'}</div>
                          </td>
                          <td className="tech-td" style={{ color: 'var(--text-muted)' }}>
                            {job.issue_category}
                          </td>
                          <td className="tech-td">
                            <span className={`badge ${job.status === 'Delivered' ? 'badge-verified' : 'badge-orange'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="tech-td" style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--success)' }}>
                            ₹{job.quote_amount || 0}
                          </td>
                          <td className="tech-td">
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
        <div className="tech-modal-overlay">
          <div className="tech-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="var(--primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Record Part Replacement</h3>
              </div>
              <button onClick={() => setIsPartLogOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
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
        <div className="tech-modal-overlay">
          <div className="tech-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--cta-orange)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Submit Diagnostic Quote</h3>
              </div>
              <button onClick={() => setIsQuoteModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
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
        <div className="tech-modal-overlay">
          <div className="tech-modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Request Bank Payout</h3>
              </div>
              <button onClick={() => { setIsPayoutModalOpen(false); setPayoutSuccess(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
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

      {/* Technician On-Demand Credential Request Modal */}
      {isCredentialReqModalOpen && selectedOrderForAction && (
        <div className="tech-modal-overlay">
          <div className="tech-modal-box" style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={20} color="var(--primary)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Request Diagnostic OS PIN</h3>
              </div>
              <button 
                onClick={() => setIsCredentialReqModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 16px' }}>
              Only request access if required to test hardware drivers, sound cards, displays, or thermal load. This will send a secure authorization request to <strong>{selectedOrderForAction.customer_name || 'the customer'}</strong> on Order <strong>#{selectedOrderForAction.order_number}</strong>.
            </p>

            <form onSubmit={handleSendCredentialRequest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                  REASON / BENCH TESTING NOTE
                </label>
                <textarea
                  rows="3"
                  required
                  value={credentialReqNote}
                  onChange={(e) => setCredentialReqNote(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}
                  placeholder="e.g. Technician needs temporary PIN or guest login to test audio output and Wi-Fi drivers..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsCredentialReqModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: '8px 20px', fontWeight: 800 }}
                >
                  Dispatch Request to Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Hardware Photo Lightbox Modal */}
      {activePhotoModalUrl && (
        <div className="tech-modal-overlay" onClick={() => setActivePhotoModalUrl(null)}>
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActivePhotoModalUrl(null)}
              style={{
                position: 'absolute',
                top: '-44px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
            <img
              src={activePhotoModalUrl}
              alt="Hardware inspection proof"
              className="tech-photo-lightbox"
            />
            <div style={{ color: '#fff', fontSize: '0.82rem', marginTop: '12px', background: 'rgba(0,0,0,0.65)', padding: '5px 16px', borderRadius: '20px' }}>
              Customer Hardware Photo Proof
            </div>
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

      {/* Technician Bench Alerts Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        orders={orders}
        onActionClick={(action) => {
          setIsNotificationsOpen(false);
          if (action === 'Join Live') handleLaunchLiveStream(activeRepairs[0]);
          else if (action === 'Review Job') handleSidebarChange('requests');
          else if (action === 'Start Repair') handleSidebarChange('active');
          else if (action === 'View Ledger') handleSidebarChange('earnings');
        }}
      />
    </div>
  );
}
