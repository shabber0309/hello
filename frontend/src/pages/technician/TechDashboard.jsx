import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Home, 
  Video, 
  IndianRupee, 
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
  Bell,
  Maximize2
} from 'lucide-react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { StreamModal, OrderConversationModal, NotificationsModal } from '../../components/modals';
import { getStoredUnreadCount } from '../../utils/notificationManager';
import { getCloudImageUrl } from '../../utils/cloudImages';
import './TechDashboard.css';

export default function TechDashboard({ initialTab }) {
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
    if (tabId === 'dashboard') {
      navigate('/technician/dashboard');
    } else {
      navigate(`/technician/${tabId}`);
    }
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

  // Live Cleanroom Broadcast Studio state
  const [liveCamSource, setLiveCamSource] = useState('bench'); // 'bench', 'microscope', 'pcb'
  const [liveMicEnabled, setLiveMicEnabled] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(true);
  const [streamResolution, setStreamResolution] = useState('4K');
  const [selectedLiveOrder, setSelectedLiveOrder] = useState(null);
  const [liveChatMessages, setLiveChatMessages] = useState([
    { id: 1, sender: 'Customer (Rahul)', text: 'Hello! Watching the cleanroom unboxing on camera now.', time: '10:14 AM' },
    { id: 2, sender: 'Technician (SHABBER)', text: 'Welcome to Station 4! Tamper seal verified intact. Inspecting motherboard traces now.', time: '10:15 AM' }
  ]);
  const [liveChatInput, setLiveChatInput] = useState('');

  // Zero-Trust OTP inputs and action loading state
  const [otpInputs, setOtpInputs] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const handleOtpInputChange = (orderRef, field, val) => {
    setOtpInputs(prev => ({
      ...prev,
      [`${orderRef}_${field}`]: val
    }));
  };

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

  // Sync tab pathname / search param to switch workbench view or open chat modal
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    const subRoute = pathParts[pathParts.length - 1];
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    const validTabs = ['active', 'active-jobs', 'chat', 'messages', 'live', 'live-stream', 'earnings', 'requests', 'workbench', 'dashboard'];
    
    let targetTab = null;
    if (validTabs.includes(subRoute)) {
      targetTab = subRoute;
    } else if (initialTab && validTabs.includes(initialTab)) {
      targetTab = initialTab;
    } else if (tabParam && validTabs.includes(tabParam)) {
      targetTab = tabParam;
    }

    if (targetTab === 'messages' || targetTab === 'chat') {
      if (orders.length > 0) {
        setActiveConversationOrder(orders[0]);
      } else {
        try {
          const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
          if (localSaved.length > 0) setActiveConversationOrder(localSaved[0]);
        } catch {}
      }
    } else if (targetTab === 'active' || targetTab === 'active-jobs') {
      setActiveSidebarNav('active');
    } else if (targetTab === 'earnings') {
      setActiveSidebarNav('earnings');
    } else if (targetTab === 'requests') {
      setActiveSidebarNav('requests');
    } else if (targetTab === 'live' || targetTab === 'live-stream') {
      setActiveSidebarNav('live');
    } else if (targetTab === 'dashboard' || targetTab === 'workbench' || location.pathname === '/technician' || location.pathname === '/technician/dashboard') {
      setActiveSidebarNav('dashboard');
    }
  }, [location.pathname, location.search, orders.length, initialTab]);

  // Filtered order groups
  const nearbyRequests = orders.filter(o => o.status === 'Order Placed');
  const activeRepairs = orders.filter(o => 
    o.status !== 'Order Placed' && o.status !== 'Delivered'
  );
  const completedRepairs = orders.filter(o => o.status === 'Delivered');

  const currentLiveOrder = selectedLiveOrder || activeRepairs[0] || orders[0] || {
    id: 1,
    order_number: 'EOF-2026-07350',
    customer_name: 'Rahul (Customer)',
    laptop_brand: 'Asus TUF Gaming A15',
    laptop_model: '(FA506 / FA507)',
    issue_category: 'Hinge & Chassis: Broken hinge',
    status: 'In Repair',
    quote_amount: 1800,
    quote_approved: true,
    stream_session: {
      meet_url: 'https://meet.google.com/eof-live-bench',
      is_live: true
    }
  };

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

  // Zero-Trust Protocol Handlers for Active Repairs
  const handleConfirmTimingSlot = async (orderRef) => {
    try {
      setActionLoading(prev => ({ ...prev, [orderRef]: true }));
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token');
      const res = await fetch(`/api/repairs/${orderRef}/confirm-timing-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        setFeedbackMsg(`Pickup timing slot locked! Status updated to Scheduled for Pickup.`);
        fetchTechJobs();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Failed to lock timing slot');
      }
    } catch {
      setErrorMsg('Failed to lock timing slot');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderRef]: false }));
    }
  };

  const handleVerifyPickupOtp = async (orderRef) => {
    const otpVal = otpInputs[`${orderRef}_pickup`] || '';
    if (!otpVal.trim()) {
      setErrorMsg('Please enter the 6-digit Customer Pickup OTP');
      return;
    }
    try {
      setActionLoading(prev => ({ ...prev, [orderRef]: true }));
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token');
      const res = await fetch(`/api/repairs/${orderRef}/verify-pickup-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ otp: otpVal.trim() })
      });
      if (res.ok) {
        setFeedbackMsg(`Pickup OTP Verified! Custody transferred to technician.`);
        fetchTechJobs();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Invalid Pickup OTP');
      }
    } catch {
      setErrorMsg('Failed to verify Pickup OTP');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderRef]: false }));
    }
  };

  const handleVerifyUnboxOtp = async (orderRef) => {
    const otpVal = otpInputs[`${orderRef}_unbox`] || '';
    if (!otpVal.trim()) {
      setErrorMsg('Please enter the 6-digit Customer Unbox OTP');
      return;
    }
    try {
      setActionLoading(prev => ({ ...prev, [orderRef]: true }));
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token');
      const res = await fetch(`/api/repairs/${orderRef}/verify-unbox-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ otp: otpVal.trim() })
      });
      if (res.ok) {
        setFeedbackMsg(`Unbox OTP Verified! Tamper seal officially authorized to be opened.`);
        fetchTechJobs();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Invalid Unbox OTP');
      }
    } catch {
      setErrorMsg('Failed to verify Unbox OTP');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderRef]: false }));
    }
  };

  const handleNotifyPackingReady = async (orderRef) => {
    try {
      setActionLoading(prev => ({ ...prev, [orderRef]: true }));
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token');
      const res = await fetch(`/api/repairs/${orderRef}/notify-packing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({})
      });
      if (res.ok) {
        setFeedbackMsg('Customer notified for live functional test demo & Packing OTP generated!');
        fetchTechJobs();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Failed to notify packing');
      }
    } catch {
      setErrorMsg('Failed to notify packing');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderRef]: false }));
    }
  };

  const handleVerifyPackingOtp = async (orderRef) => {
    const otpVal = otpInputs[`${orderRef}_packing`] || '';
    if (!otpVal.trim()) {
      setErrorMsg('Please enter the 6-digit Customer Packing OTP');
      return;
    }
    try {
      setActionLoading(prev => ({ ...prev, [orderRef]: true }));
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token');
      const res = await fetch(`/api/repairs/${orderRef}/verify-packing-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ otp: otpVal.trim() })
      });
      if (res.ok) {
        setFeedbackMsg(`Packing OTP Verified! Device sealed with Tamper Seal Tag.`);
        fetchTechJobs();
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Invalid Packing OTP');
      }
    } catch {
      setErrorMsg('Failed to verify Packing OTP');
    } finally {
      setActionLoading(prev => ({ ...prev, [orderRef]: false }));
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

  // Protected Technician Route: If not logged in or not technician, show clean access panel
  if (!user || user.role !== 'technician') {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card p-4 p-md-5 shadow-sm" style={{ maxWidth: '520px', width: '100%' }}>
          <div className="mb-3">
            <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2 fs-6">
              <ShieldCheck size={18} className="me-1" /> Technician Authorization Required
            </span>
          </div>
          <h2 className="h4 mb-3">Cleanroom Workbench Access</h2>
          <p className="text-muted small mb-4">
            {user ? (
              <>You are currently signed in as <strong>{user.name}</strong> ({user.role}). Switch to the Technician account to manage bench repairs and customer messages.</>
            ) : (
              <>Please sign in as a verified technician to access the Cleanroom Workbench and customer communications.</>
            )}
          </p>
          <div className="d-flex flex-column gap-2">
            <button
              onClick={() => {
                switchRole('technician');
              }}
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
            >
              <Wrench size={16} />
              <span>Continue as Technician (SHABBER HUSSAIN)</span>
            </button>
            <button
              onClick={() => navigate('/login', { state: { role: 'technician' } })}
              className="btn btn-outline-secondary"
            >
              Sign In with Other Technician Credentials
            </button>
          </div>
        </div>
      </div>
    );
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

          {/* Master Technician Header - Displayed only on Workbench Dashboard */}
          {activeSidebarNav === 'dashboard' && (
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
                  {getStoredUnreadCount(user) > 0 && (
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
          )}

            
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
                        <IndianRupee size={14} /> Edit Quote
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
                      <div className="tech-meta-val" style={{ color: 'var(--success, #059669)', fontFamily: 'var(--font-mono)' }}>Cleanroom Active</div>
                    </div>

                    <div>
                      <div className="tech-meta-label">CURRENT MILESTONE</div>
                      <div className="tech-meta-val" style={{ color: 'var(--cta-orange)' }}>{activeRepairs[0].status}</div>
                    </div>

                    <div>
                      <div className="tech-meta-label">APPROVED QUOTE</div>
                      <div className="tech-meta-val" style={{ color: 'var(--success, #059669)', fontFamily: 'var(--font-mono)' }}>₹{activeRepairs[0].quote_amount || 0}</div>
                    </div>
                  </div>

                  {/* 1-Click Milestone Advancement */}
                  {nextMilestoneMap[activeRepairs[0].status] && (
                    <div className="tech-milestones-row">
                      <div className="tech-milestone-step-info">
                        <span className="tech-milestone-label">Next Protocol Step:</span>
                        <span className="tech-milestone-target-badge">
                          <CheckCircle2 size={13} />
                          {nextMilestoneMap[activeRepairs[0].status]}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn-primary tech-milestone-advance-btn"
                        onClick={() => handleUpdateStatus(activeRepairs[0].id, nextMilestoneMap[activeRepairs[0].status])}
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
                            <IndianRupee size={14} /> Send Custom Quote
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
                            <IndianRupee size={14} /> Update Quote
                          </button>

                          <button
                            className="btn-secondary"
                            onClick={() => setActiveConversationOrder(ord)}
                            style={{
                              padding: '7px 14px',
                              fontSize: '0.82rem'
                            }}
                          >
                            <MessageSquare size={14} /> Open Chat & Protocol
                          </button>
                        </div>
                      </div>

                      {/* UNIFIED ZERO-TRUST COMMAND CENTER & INTERACTIVE STEPPER */}
                      <div className="tech-zt-command-center">
                        <div className="tech-zt-header">
                          <div className="tech-zt-title-badge">
                            <ShieldCheck size={18} color="var(--primary)" />
                            Zero-Trust Chain of Custody
                          </div>
                          <span className="tech-zt-stage-tag">
                            Current Stage: <strong>{ord.status}</strong>
                          </span>
                        </div>

                        {/* Horizontal Connected Stepper */}
                        {(() => {
                          const currentStageIdx = (() => {
                            if (ord.status === 'Delivered') return 6;
                            if (ord.packing_otp_verified) return 5;
                            if (ord.packing_otp) return 5;
                            if (ord.unbox_otp_verified) return 4;
                            if (ord.pickup_otp_verified) return 3;
                            if (ord.timing_slot_status === 'confirmed' || ord.timing_slot_status === 'slot_confirmed' || ord.status === 'Pickup Scheduled') return 2;
                            if (ord.quote_approved || ord.price_status === 'price_agreed') return 1;
                            return 0;
                          })();

                          const STAGES = [
                            { name: '1. Quote Agreed', targetStatus: 'Technician Accepted' },
                            { name: '2. Pickup Window', targetStatus: 'Pickup Scheduled' },
                            { name: '3. Handover OTP', targetStatus: 'Pickup Scheduled' },
                            { name: '4. Live Unbox (Meet)', targetStatus: 'Delivered to Bench' },
                            { name: '5. Cleanroom Repair', targetStatus: 'In Repair' },
                            { name: '6. Packing & Seal', targetStatus: 'Repaired & Awaiting Payment' },
                            { name: '7. Delivered', targetStatus: 'Delivered' }
                          ];

                          const orderRef = ord.order_number || ord.id;

                          return (
                            <>
                              <div className="tech-zt-stepper-container">
                                {STAGES.map((st, sIdx) => {
                                  const isDone = sIdx < currentStageIdx;
                                  const isCurrent = sIdx === currentStageIdx;
                                  let nodeClass = 'tech-zt-step-node';
                                  if (isDone) nodeClass += ' tech-zt-step-node-completed';
                                  else if (isCurrent) nodeClass += ' tech-zt-step-node-active';

                                  return (
                                    <button
                                      key={sIdx}
                                      type="button"
                                      className={nodeClass}
                                      onClick={() => {
                                        if (sIdx > currentStageIdx) {
                                          setErrorMsg(`Zero-Trust Security Gate: Stage "${st.name}" is locked. Complete the OTP verification below to advance.`);
                                        } else if (sIdx < currentStageIdx) {
                                          setFeedbackMsg(`Stage "${st.name}" has already been verified and locked into the ledger.`);
                                        } else {
                                          setFeedbackMsg(`Stage "${st.name}" is currently active. Complete the required verification below.`);
                                        }
                                      }}
                                      style={{ cursor: sIdx === currentStageIdx ? 'default' : 'pointer' }}
                                      title={sIdx > currentStageIdx ? `Locked: Must verify previous stage OTP first` : `Stage: ${st.name}`}
                                    >
                                      {isDone ? <Check size={13} /> : isCurrent ? <Radio size={12} className="pulse-dot" /> : <Lock size={12} style={{ opacity: 0.5 }} />}
                                      <span>{st.name}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* DYNAMIC ACTIVE ACTION STATION (Current Stage Spotlight Box) */}
                              <div className="tech-zt-action-station">
                                {currentStageIdx === 0 ? (
                                  /* Phase 0: Price Quote Discussion */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        <Clock size={16} color="var(--primary)" />
                                        Stage 1: Diagnostic Quote Proposed (₹{ord.quote_amount || 0})
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        Waiting for customer to accept quote in chat or dashboard. You can update the quote or discuss diagnostic findings with customer.
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      <button
                                        type="button"
                                        className="tech-zt-btn-action"
                                        onClick={() => {
                                          setSelectedOrderForAction(ord);
                                          setQuoteForm({
                                            quote_amount: ord.quote_amount || '',
                                            technician_notes: ord.technician_notes || ''
                                          });
                                          setIsQuoteModalOpen(true);
                                        }}
                                      >
                                        Update Quote
                                      </button>
                                      <button
                                        type="button"
                                        className="tech-zt-btn-outline"
                                        onClick={() => setActiveConversationOrder(ord)}
                                      >
                                        <MessageSquare size={14} /> Open Chat
                                      </button>
                                    </div>
                                  </>
                                ) : currentStageIdx === 1 ? (
                                  /* Phase 1: Timing Slot Booking */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        <Clock size={16} color="var(--primary)" />
                                        Action Required: Confirm Doorstep Pickup Window
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        Customer requested timing slot: <strong>{ord.pickup_slot || 'On-Demand Dispatch'}</strong>. Lock this slot to dispatch courier and generate customer's 6-digit Pickup OTP.
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      <button
                                        type="button"
                                        className="tech-zt-btn-action"
                                        onClick={() => handleConfirmTimingSlot(orderRef)}
                                        disabled={actionLoading[orderRef]}
                                      >
                                        <Check size={15} /> Approve & Lock Pickup Window
                                      </button>
                                      <button
                                        type="button"
                                        className="tech-zt-btn-outline"
                                        onClick={() => setActiveConversationOrder(ord)}
                                      >
                                        <MessageSquare size={14} /> Discuss in Chat
                                      </button>
                                    </div>
                                  </>
                                ) : currentStageIdx === 2 ? (
                                  /* Phase 2: Doorstep Handover (1st OTP) */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        <ShieldCheck size={16} color="var(--success)" />
                                        Action Required: Doorstep Handover (1st OTP)
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        Technician arrived at doorstep. Ask customer for their private 6-digit Pickup OTP upon physical collection.
                                        {ord.pickup_otp && (
                                          <span 
                                            onClick={() => handleOtpInputChange(orderRef, 'pickup', ord.pickup_otp)}
                                            title="Click to auto-fill OTP"
                                            style={{ color: 'var(--primary)', fontWeight: 800, marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }}
                                          >
                                            (Customer OTP: {ord.pickup_otp})
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      <input
                                        type="text"
                                        className="tech-zt-otp-input"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otpInputs[`${orderRef}_pickup`] || ''}
                                        onChange={(e) => handleOtpInputChange(orderRef, 'pickup', e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        className="tech-zt-btn-action"
                                        onClick={() => handleVerifyPickupOtp(orderRef)}
                                        disabled={actionLoading[orderRef]}
                                      >
                                        <Check size={15} /> Verify & Accept Custody
                                      </button>
                                    </div>
                                  </>
                                ) : currentStageIdx === 3 ? (
                                  /* Phase 3: Google Meet Live Unboxing (2nd OTP) */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        <Video size={16} color="#ea4335" />
                                        Action Required: Google Meet Live Unboxing (2nd OTP)
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        Device placed on ESD cleanroom bench. Join Google Meet and verify customer's Unbox OTP before breaking the intake tamper seal.
                                        {ord.unbox_otp && (
                                          <span 
                                            onClick={() => handleOtpInputChange(orderRef, 'unbox', ord.unbox_otp)}
                                            title="Click to auto-fill OTP"
                                            style={{ color: 'var(--primary)', fontWeight: 800, marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }}
                                          >
                                            (Customer Unbox OTP: {ord.unbox_otp})
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      <a
                                        href={ord.stream_session?.google_meet_link || `https://meet.google.com/live-cleanroom-EOF-${ord.order_number}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="tech-zt-btn-meet"
                                      >
                                        <Video size={15} /> Launch Google Meet
                                      </a>
                                      <input
                                        type="text"
                                        className="tech-zt-otp-input"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otpInputs[`${orderRef}_unbox`] || ''}
                                        onChange={(e) => handleOtpInputChange(orderRef, 'unbox', e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        className="tech-zt-btn-action"
                                        onClick={() => handleVerifyUnboxOtp(orderRef)}
                                        disabled={actionLoading[orderRef]}
                                      >
                                        <Check size={15} /> Authorize & Unbox Live
                                      </button>
                                    </div>
                                  </>
                                ) : currentStageIdx === 4 ? (
                                  /* Phase 4: Cleanroom Repair & Diagnostics */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        <Wrench size={16} color="var(--primary)" />
                                        Active: Cleanroom Micro-Soldering & Component Diagnostics
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        Perform board-level repairs under 100x magnification. Log genuine OEM parts below. When finished, notify customer for live functional demo.
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      <button
                                        type="button"
                                        className="tech-zt-btn-outline"
                                        onClick={() => {
                                          setSelectedOrderForAction(ord);
                                          setIsPartLogOpen(true);
                                        }}
                                      >
                                        <Layers size={14} /> Log OEM Part
                                      </button>
                                      <button
                                        type="button"
                                        className="tech-zt-btn-action"
                                        onClick={() => handleNotifyPackingReady(orderRef)}
                                        disabled={actionLoading[orderRef]}
                                      >
                                        <Package size={15} /> Ready for Live Packing (Generate OTP)
                                      </button>
                                    </div>
                                  </>
                                ) : currentStageIdx === 5 ? (
                                  /* Phase 5: Live Packing OTP or Tamper Sealed */
                                  <>
                                    <div className="tech-zt-action-info">
                                      <div className="tech-zt-action-headline">
                                        {ord.packing_otp && !ord.packing_otp_verified ? (
                                          <><Wrench size={16} color="var(--primary)" /> Action Required: Live Functional Demo & Return Seal (3rd OTP)</>
                                        ) : (
                                          <><ShieldCheck size={16} color="var(--success)" /> Device Tamper Sealed (#{ord.reseal_tamper_code || 'SEAL-TX-849102'})</>
                                        )}
                                      </div>
                                      <div className="tech-zt-action-desc">
                                        {ord.packing_otp && !ord.packing_otp_verified ? (
                                          <>
                                            Demonstrate all working laptop functions live in Google Meet, then enter customer's Packing OTP to seal device with Return Tamper Tag.
                                            {ord.packing_otp && (
                                              <span 
                                                onClick={() => handleOtpInputChange(orderRef, 'packing', ord.packing_otp)}
                                                title="Click to auto-fill OTP"
                                                style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: '6px', cursor: 'pointer', textDecoration: 'underline' }}
                                              >
                                                (Customer Packing OTP: {ord.packing_otp})
                                              </span>
                                            )}
                                          </>
                                        ) : (
                                          'All functional tests passed and device sealed with official security tag. Awaiting customer escrow payment release before dispatch.'
                                        )}
                                      </div>
                                    </div>
                                    <div className="tech-zt-action-controls">
                                      {ord.packing_otp && !ord.packing_otp_verified ? (
                                        <>
                                          <a
                                            href={ord.stream_session?.google_meet_link || `https://meet.google.com/live-cleanroom-EOF-${ord.order_number}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="tech-zt-btn-meet"
                                          >
                                            <Video size={15} /> Join Google Meet
                                          </a>
                                          <input
                                            type="text"
                                            className="tech-zt-otp-input"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={otpInputs[`${orderRef}_packing`] || ''}
                                            onChange={(e) => handleOtpInputChange(orderRef, 'packing', e.target.value)}
                                          />
                                          <button
                                            type="button"
                                            className="tech-zt-btn-action"
                                            onClick={() => handleVerifyPackingOtp(orderRef)}
                                            disabled={actionLoading[orderRef]}
                                          >
                                            <Package size={15} /> Apply Return Seal Tag
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            type="button"
                                            className="tech-zt-btn-action"
                                            onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                                          >
                                            <Check size={15} /> Complete Delivery
                                          </button>
                                          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--success)' }}>
                                            Quote: ₹{ord.quote_amount || 1500}
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  /* Phase 6: Delivered */
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', color: 'var(--success)', fontWeight: 800, fontSize: '0.92rem' }}>
                                    <CheckCircle2 size={20} />
                                    <span>Zero-Trust Repair Lifecycle Completed & Delivered • 6-Month Warranty Active</span>
                                  </div>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      {/* Notes & details */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '8px' }}>
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
                  <IndianRupee size={16} /> Request Bank Transfer
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
              MODULE 5.5: LIVE CLEANROOM 4K BROADCAST STUDIO & FEEDS
             ======================================================== */}
          {activeSidebarNav === 'live' && (
            <div className="tech-studio-root">
              {/* Studio Header */}
              <div className="tech-studio-header-wrap">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-live">
                      <Radio size={12} className="pulse-dot" /> LIVE BROADCAST ({streamResolution} 60FPS)
                    </span>
                    <span className="tech-bench-station-chip">
                      <ShieldCheck size={13} color="#06b6d4" /> Station #4 Cleanroom Class 100
                    </span>
                    <span className="badge badge-verified">
                      <CheckCircle2 size={12} /> ESD Safe Bench Active
                    </span>
                  </div>
                  <h1 className="tech-studio-h1">Cleanroom 4K Broadcast Studio</h1>
                  <p className="tech-studio-sub">
                    Ultra-low latency cleanroom broadcasting. Stream live motherboard diagnostics, microscope solder work, and tamper seal verification directly to the customer.
                  </p>
                </div>

                <div className="tech-studio-header-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleLaunchLiveStream(currentLiveOrder)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.85rem' }}
                  >
                    <Maximize2 size={16} /> Fullscreen Studio Modal
                  </button>
                  <a
                    href={currentLiveOrder.stream_session?.meet_url || currentLiveOrder.meet_url || "https://meet.google.com/eof-live-bench"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-cta"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.85rem', textDecoration: 'none' }}
                  >
                    <ExternalLink size={15} /> Join Google Meet Session
                  </a>
                </div>
              </div>

              {/* Main Studio Grid */}
              <div className="tech-studio-main-grid">
                {/* Left Column: 4K Stage Player */}
                <div className="tech-studio-stage-card">
                  <div className="tech-studio-viewport">
                    {/* Live Image Feed */}
                    <img
                      src={
                        liveCamSource === 'microscope' ? getCloudImageUrl('/microscope_chip.jpg') :
                        liveCamSource === 'pcb' ? getCloudImageUrl('/pcb_repair_chip.jpg') :
                        getCloudImageUrl('/tech_bench_live.jpg')
                      }
                      alt="Cleanroom Live Video Feed"
                      className="tech-studio-feed-img"
                    />

                    {/* HUD Top Bar */}
                    <div className="tech-studio-hud-top">
                      <div className="tech-studio-hud-rec">
                        <span className="tech-studio-hud-rec-dot" />
                        <span>{isBroadcasting ? `LIVE • ${streamResolution} ULTRA HD • 60 FPS` : 'STANDBY • READY'}</span>
                      </div>
                      <div className="tech-studio-hud-info">
                        <span>ESD GROUND: 0.08Ω</span>
                        <span>TEMP: 21.4°C</span>
                        <span>RH: 44%</span>
                      </div>
                    </div>

                    {/* Reticle for Microscope Mode */}
                    {liveCamSource === 'microscope' && (
                      <div className="tech-studio-reticle">
                        <span className="tech-studio-reticle-label">100X MACRO OPTICAL</span>
                      </div>
                    )}

                    {/* HUD Bottom Bar with Target Order and Camera Switcher */}
                    <div className="tech-studio-hud-bottom">
                      <div className="tech-studio-hud-target">
                        <div style={{ fontWeight: 800 }}>{currentLiveOrder.laptop_brand} {currentLiveOrder.laptop_model}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Order #{currentLiveOrder.order_number} • Customer: {currentLiveOrder.customer_name || 'Rahul'}
                        </div>
                      </div>

                      {/* In-Player Camera Switcher Tabs */}
                      <div className="tech-studio-cam-tabs">
                        <button
                          type="button"
                          className={`tech-studio-cam-btn ${liveCamSource === 'bench' ? 'tech-studio-cam-btn--active' : ''}`}
                          onClick={() => setLiveCamSource('bench')}
                        >
                          <Camera size={13} /> Overhead Bench
                        </button>
                        <button
                          type="button"
                          className={`tech-studio-cam-btn ${liveCamSource === 'microscope' ? 'tech-studio-cam-btn--active' : ''}`}
                          onClick={() => setLiveCamSource('microscope')}
                        >
                          <Radio size={13} /> 100x Microscope
                        </button>
                        <button
                          type="button"
                          className={`tech-studio-cam-btn ${liveCamSource === 'pcb' ? 'tech-studio-cam-btn--active' : ''}`}
                          onClick={() => setLiveCamSource('pcb')}
                        >
                          <Layers size={13} /> PCB Diagnostics
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Studio Deck Bar Controls */}
                  <div className="tech-studio-deck-bar">
                    <div className="tech-studio-control-group">
                      <button
                        type="button"
                        className={`tech-studio-tool-btn ${liveMicEnabled ? 'tech-studio-tool-btn--active' : ''}`}
                        onClick={() => setLiveMicEnabled(!liveMicEnabled)}
                      >
                        {liveMicEnabled ? <Radio size={14} color="#10b981" /> : <X size={14} color="#ef4444" />}
                        <span>{liveMicEnabled ? 'Cleanroom Mic: ON' : 'Cleanroom Mic: MUTED'}</span>
                      </button>

                      <button
                        type="button"
                        className={`tech-studio-tool-btn ${isBroadcasting ? 'tech-studio-tool-btn--active' : ''}`}
                        onClick={() => setIsBroadcasting(!isBroadcasting)}
                      >
                        <Radio size={14} className={isBroadcasting ? "pulse-dot" : ""} />
                        <span>{isBroadcasting ? 'Broadcast: LIVE' : 'Broadcast: PAUSED'}</span>
                      </button>

                      <button
                        type="button"
                        className="tech-studio-tool-btn"
                        onClick={() => setStreamResolution(streamResolution === '4K' ? '1080p' : '4K')}
                      >
                        <Settings size={14} />
                        <span>Stream Quality: {streamResolution} 60fps</span>
                      </button>
                    </div>

                    <div className="tech-studio-control-group">
                      <button
                        type="button"
                        className="tech-studio-tool-btn"
                        onClick={() => {
                          setFeedbackMsg('Camera frame captured & saved to chain of custody audit log!');
                        }}
                      >
                        <Camera size={14} />
                        <span>Snap Proof Evidence</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Studio Control Deck */}
                <div className="tech-studio-sidebar-col">
                  {/* Card 1: Active Broadcast Job Selection */}
                  <div className="tech-studio-card">
                    <h3 className="tech-studio-card-title">
                      <Laptop size={18} color="var(--primary)" />
                      <span>Broadcasting Device</span>
                    </h3>

                    {/* Job Select Dropdown */}
                    <div style={{ marginBottom: '14px' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                        SELECT ACTIVE REPAIR TO BROADCAST:
                      </label>
                      <select
                        className="form-select"
                        value={currentLiveOrder.id || currentLiveOrder.order_number}
                        onChange={(e) => {
                          const found = orders.find(o => String(o.id || o.order_number) === String(e.target.value));
                          if (found) setSelectedLiveOrder(found);
                        }}
                        style={{ width: '100%', fontSize: '0.85rem', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-light)' }}
                      >
                        {orders.length > 0 ? (
                          orders.map((ord) => (
                            <option key={ord.id || ord.order_number} value={ord.id || ord.order_number}>
                              #{ord.order_number || ord.id} — {ord.laptop_brand} ({ord.customer_name || 'Customer'})
                            </option>
                          ))
                        ) : (
                          <option value={currentLiveOrder.id || currentLiveOrder.order_number}>
                            #{currentLiveOrder.order_number} — {currentLiveOrder.laptop_brand} ({currentLiveOrder.customer_name || 'Customer'})
                          </option>
                        )}
                      </select>
                    </div>

                    <div style={{ background: 'var(--bg-main)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong>Device:</strong> {currentLiveOrder.laptop_brand} {currentLiveOrder.laptop_model}</div>
                      <div><strong>Issue:</strong> {currentLiveOrder.issue_category}</div>
                      <div><strong>Status:</strong> <span className="badge badge-primary">{currentLiveOrder.status}</span></div>
                      <div><strong>Quote:</strong> ₹{currentLiveOrder.quote_amount || 1800}</div>
                    </div>

                    <button
                      type="button"
                      className="btn-cta"
                      onClick={() => setActiveConversationOrder(currentLiveOrder)}
                      style={{ width: '100%', marginTop: '14px', padding: '9px', fontSize: '0.82rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                    >
                      <MessageSquare size={14} /> Open Customer WhatsApp Chat
                    </button>
                  </div>

                  {/* Card 2: Live Cleanroom Testing Checklist */}
                  <div className="tech-studio-card">
                    <h3 className="tech-studio-card-title">
                      <ShieldCheck size={18} color="#10b981" />
                      <span>Cleanroom Verification Steps</span>
                    </h3>
                    <div className="tech-studio-checklist">
                      <div className="tech-studio-check-item tech-studio-check-item--done">
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>Intake Tamper Seal Verified on Camera</span>
                      </div>
                      <div className="tech-studio-check-item tech-studio-check-item--done">
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>Customer Unbox OTP Verified</span>
                      </div>
                      <div className="tech-studio-check-item tech-studio-check-item--done">
                        <CheckCircle2 size={16} className="check-icon" />
                        <span>Microscope Motherboard Inspection</span>
                      </div>
                      <div className="tech-studio-check-item tech-studio-check-item--pending">
                        <Clock size={16} className="check-icon" />
                        <span>OEM Component Replacement / Soldering</span>
                      </div>
                      <div className="tech-studio-check-item tech-studio-check-item--pending">
                        <Clock size={16} className="check-icon" />
                        <span>Post-Repair Functional Testing</span>
                      </div>
                      <div className="tech-studio-check-item tech-studio-check-item--pending">
                        <Clock size={16} className="check-icon" />
                        <span>Reseal with Return Tamper Seal Tag</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Live Customer Session Chat */}
                  <div className="tech-studio-card">
                    <h3 className="tech-studio-card-title">
                      <MessageSquare size={18} color="var(--primary)" />
                      <span>Live Stream Session Chat</span>
                    </h3>
                    <div className="tech-studio-chat-box">
                      <div className="tech-studio-chat-msgs">
                        {liveChatMessages.map((msg) => (
                          <div key={msg.id} className="tech-studio-msg-row">
                            <span className={`tech-studio-msg-author ${msg.sender.includes('Technician') ? 'tech-studio-msg-author--tech' : 'tech-studio-msg-author--cust'}`}>
                              {msg.sender} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>• {msg.time}</span>
                            </span>
                            <span className="tech-studio-msg-body">{msg.text}</span>
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!liveChatInput.trim()) return;
                          const newMsg = {
                            id: Date.now(),
                            sender: `Technician (${user?.name || 'SHABBER'})`,
                            text: liveChatInput.trim(),
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          };
                          setLiveChatMessages(prev => [...prev, newMsg]);
                          setLiveChatInput('');
                        }}
                        className="tech-studio-chat-form"
                      >
                        <input
                          type="text"
                          placeholder="Type update to customer watching stream..."
                          className="tech-studio-chat-input"
                          value={liveChatInput}
                          onChange={(e) => setLiveChatInput(e.target.value)}
                        />
                        <button type="submit" className="tech-studio-chat-send">
                          <Send size={14} />
                        </button>
                      </form>
                    </div>
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
                <IndianRupee size={18} color="var(--cta-orange)" />
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
                <IndianRupee size={18} color="var(--success)" />
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
          onClose={() => {
            setActiveConversationOrder(null);
            if (location.pathname === '/technician/chat' || location.pathname === '/technician/messages') {
              navigate('/technician/dashboard');
            }
          }}
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
