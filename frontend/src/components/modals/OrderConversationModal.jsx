import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Video, 
  Search, 
  Wrench, 
  Laptop, 
  Clock, 
  CheckCheck, 
  ShieldCheck,
  Minus,
  ChevronUp,
  Paperclip,
  Image as ImageIcon,
  IndianRupee,
  Tag,
  Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './OrderConversationModal.css';

export default function OrderConversationModal({ isOpen, onClose, initialOrder, onOpenLiveStream }) {
  const { user, token } = useAuth();
  const [activeOrder, setActiveOrder] = useState(initialOrder || null);
  const [allOrdersList, setAllOrdersList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTech, setSearchTech] = useState('');
  const [isApprovingQuote, setIsApprovingQuote] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Attachment states for photo uploading and price quoting
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [quotePriceInput, setQuotePriceInput] = useState('');
  const [quoteNoteInput, setQuoteNoteInput] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachMenuRef = useRef(null);

  // Sync initial order
  useEffect(() => {
    if (initialOrder) {
      setActiveOrder(initialOrder);
    }
  }, [initialOrder]);

  const getActiveToken = () => {
    return token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || '';
  };

  // Load all user orders for the left sidebar
  useEffect(() => {
    if (!isOpen) return;

    let orders = [];
    try {
      const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
      if (Array.isArray(localSaved) && localSaved.length > 0) {
        orders = localSaved;
      }
    } catch {}

    if (initialOrder && !orders.some(o => String(o.order_number || o.id) === String(initialOrder.order_number || initialOrder.id))) {
      orders = [initialOrder, ...orders];
    }

    // If still empty or only 1, supply realistic active technician conversation so multiple technicians are available in the sidebar
    if (orders.length <= 1) {
      const demoOrder1 = initialOrder || {
        id: 1,
        order_number: 'EOF-2026-91889',
        customer_name: user?.role === 'customer' ? (user?.name || 'Customer') : 'Rahul (Customer)',
        technician_name: 'Shabber Hussain',
        laptop_brand: 'Dell XPS 13',
        laptop_model: '9315 / 9310',
        issue_category: 'Keyboard: Keyboard stuck',
        issue_description: 'Keys are unresponsive after liquid spill. Power button working.',
        customer_selected_price: 300,
        quote_amount: 550,
        technician_notes: 'i can fix this for this price because its takes too much time to repair',
        quote_approved: false,
        pickup_address: 'Medchal-Malkajgiri (Owk Mandal)',
        pickup_pincode: '518122',
        pickup_slot: 'Today, 2:00 PM - 4:00 PM',
        power_state: 'Turns On & Boots into OS',
        charger_included: true
      };

      const demoOrder2 = {
        id: 2,
        order_number: 'EOF-2026-44210',
        customer_name: user?.role === 'customer' ? (user?.name || 'Customer') : 'Rahul (Customer)',
        technician_name: 'Ramesh Verma',
        laptop_brand: 'Lenovo ThinkPad',
        laptop_model: 'X1 Carbon Gen 9',
        issue_category: 'Display / Screen Flickering',
        issue_description: 'Screen starts flickering after 15 minutes of use.',
        customer_selected_price: 1200,
        quote_amount: 1400,
        technician_notes: 'OEM replacement display ribbon cable required and tested.',
        quote_approved: false,
        pickup_address: 'Hitech City, Madhapur',
        pickup_pincode: '500081',
        pickup_slot: 'Tomorrow, 11:00 AM - 1:00 PM',
        power_state: 'Turns On',
        charger_included: false
      };

      orders = [demoOrder1, demoOrder2];
    }

    setAllOrdersList(orders);
    if (!activeOrder && orders.length > 0) {
      setActiveOrder(orders[0]);
    }
  }, [isOpen, initialOrder]);

  // Fetch conversation messages for active order
  const fetchConversation = async (silent = false) => {
    if (!activeOrder?.id) return;
    if (!silent) setLoading(true);

    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${activeOrder.id}/conversation`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setActiveOrder(data.order);
        setMessages(data.messages || []);
      } else {
        // Fallback to local storage order messages
        try {
          const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
          const current = localSaved.find(o => String(o.order_number || o.id) === String(activeOrder.order_number || activeOrder.id));
          if (current && current.messages) {
            setMessages(current.messages);
          }
        } catch {}
      }
    } catch {
      // Local fallback
      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const current = localSaved.find(o => String(o.order_number || o.id) === String(activeOrder.order_number || activeOrder.id));
        if (current && current.messages) {
          setMessages(current.messages);
        }
      } catch {}
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll conversation updates every 3 seconds
  useEffect(() => {
    if (!isOpen || !activeOrder) return;
    fetchConversation(false);

    const interval = setInterval(() => {
      fetchConversation(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, activeOrder?.id]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send regular WhatsApp message (pure text only)
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const content = newText.trim();
    if (!content || !activeOrder) return;

    setNewText('');

    const senderRole = user?.role || 'customer';
    const senderName = user?.name || (senderRole === 'technician' ? 'Technician' : 'Customer');

    const optimisticMsg = {
      id: Date.now(),
      order_id: activeOrder.id,
      sender_id: user?.id,
      sender_name: senderName,
      sender_role: senderRole,
      message_type: 'text',
      content: content,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    // Save into localStorage order cache
    try {
      const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
      const updated = localSaved.map(o => {
        if (String(o.order_number || o.id) === String(activeOrder.order_number || activeOrder.id)) {
          return {
            ...o,
            messages: [...(o.messages || []), optimisticMsg]
          };
        }
        return o;
      });
      localStorage.setItem('livefix_all_orders', JSON.stringify(updated));
    } catch {}

    // Send to backend
    if (activeOrder.id) {
      try {
        const activeToken = getActiveToken();
        const res = await fetch(`/api/repairs/${activeOrder.id}/conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({ content })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.chat_message) {
            setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.chat_message : m));
          }
          if (data.order) setActiveOrder(data.order);
        }
      } catch (err) {
        console.warn('Network message sent locally:', err);
      }
    }
  };

  // Close attachment popover when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(e.target)) {
        setShowAttachMenu(false);
      }
    };
    if (showAttachMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showAttachMenu]);

  // Handle Photo selection from device
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedPhoto({
        dataUrl: event.target.result,
        name: file.name
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Send photo attachment into conversation
  const handleSendPhoto = async () => {
    if (!selectedPhoto || !activeOrder) return;
    const caption = photoCaption.trim();
    const photoData = selectedPhoto.dataUrl;
    setSelectedPhoto(null);
    setPhotoCaption('');

    const senderRole = user?.role || 'customer';
    const senderName = user?.name || (senderRole === 'technician' ? 'Technician' : 'Customer');

    const optimisticMsg = {
      id: Date.now(),
      order_id: activeOrder.id,
      sender_id: user?.id,
      sender_name: senderName,
      sender_role: senderRole,
      message_type: 'image',
      content: caption || 'Photo attachment',
      metadata: { image_url: photoData },
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    // Save to local cache
    try {
      const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
      const updated = localSaved.map(o => {
        if (String(o.order_number || o.id) === String(activeOrder.order_number || activeOrder.id)) {
          return {
            ...o,
            messages: [...(o.messages || []), optimisticMsg]
          };
        }
        return o;
      });
      localStorage.setItem('livefix_all_orders', JSON.stringify(updated));
    } catch {}

    // Send to backend
    if (activeOrder.id) {
      try {
        const activeToken = getActiveToken();
        const res = await fetch(`/api/repairs/${activeOrder.id}/conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            message_type: 'image',
            content: caption,
            metadata: { image_url: photoData }
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.chat_message) {
            setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.chat_message : m));
          }
        }
      } catch (err) {
        console.warn('Photo message sent locally:', err);
      }
    }
  };

  // Send Price Quote / Offer into conversation
  const handleSendPriceQuote = async (e) => {
    e?.preventDefault();
    const priceNum = parseFloat(quotePriceInput);
    if (!priceNum || priceNum <= 0 || !activeOrder) return;

    const note = quoteNoteInput.trim() || (user?.role === 'technician' ? 'Diagnostics & repair estimate' : 'Customer target budget');
    setShowPriceModal(false);
    setQuotePriceInput('');
    setQuoteNoteInput('');

    const senderRole = user?.role || 'customer';
    const senderName = user?.name || (senderRole === 'technician' ? 'Technician' : 'Customer');

    const optimisticMsg = {
      id: Date.now(),
      order_id: activeOrder.id,
      sender_id: user?.id,
      sender_name: senderName,
      sender_role: senderRole,
      message_type: 'price_quote',
      content: note,
      metadata: {
        amount: priceNum,
        quote_amount: priceNum,
        notes: note,
        approved: false
      },
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    // Update active order state
    setActiveOrder(prev => ({
      ...prev,
      quote_amount: priceNum,
      technician_notes: note,
      quote_approved: false
    }));

    // Save to local cache
    try {
      const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
      const updated = localSaved.map(o => {
        if (String(o.order_number || o.id) === String(activeOrder.order_number || activeOrder.id)) {
          return {
            ...o,
            quote_amount: priceNum,
            technician_notes: note,
            quote_approved: false,
            messages: [...(o.messages || []), optimisticMsg]
          };
        }
        return o;
      });
      localStorage.setItem('livefix_all_orders', JSON.stringify(updated));
    } catch {}

    // Send to backend
    if (activeOrder.id) {
      try {
        const activeToken = getActiveToken();
        const res = await fetch(`/api/repairs/${activeOrder.id}/conversation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeToken}`
          },
          body: JSON.stringify({
            message_type: 'price_quote',
            content: note,
            metadata: {
              amount: priceNum,
              quote_amount: priceNum,
              notes: note
            }
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.chat_message) {
            setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data.chat_message : m));
          }
          if (data.order) setActiveOrder(data.order);
        }
      } catch (err) {
        console.warn('Price quote sent locally:', err);
      }
    }
  };

  // Customer Approves Technician Quote
  const handleApproveQuote = async () => {
    if (!activeOrder?.id) return;
    setIsApprovingQuote(true);
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${activeOrder.id}/approve-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ approved: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setActiveOrder(data.order);
        if (data.chat_message) setMessages(prev => [...prev, data.chat_message]);
        fetchConversation(true);
      } else {
        // Local approval fallback
        setActiveOrder(prev => ({ ...prev, quote_approved: true }));
      }
    } catch (err) {
      setActiveOrder(prev => ({ ...prev, quote_approved: true }));
    } finally {
      setIsApprovingQuote(false);
    }
  };

  if (!isOpen || !activeOrder) return null;

  const isCustomer = user?.role === 'customer';
  const isTechnician = user?.role === 'technician';

  // Sanitized technician name helper - ensures 'Awaiting Assignment' is never displayed as technician name
  const cleanTechName = (name) => {
    if (!name || typeof name !== 'string') return 'Shabber Hussain';
    const trimmed = name.trim();
    if (!trimmed || trimmed.toLowerCase().includes('awaiting') || trimmed.toLowerCase() === 'pending' || trimmed.toLowerCase() === 'null') {
      return 'Shabber Hussain';
    }
    return trimmed;
  };

  // Active contact details on the right
  const activeTechName = cleanTechName(activeOrder.technician_name || activeOrder.technician?.name);
  const activeCustomerName = activeOrder.customer_name || activeOrder.customer?.name || 'Customer';

  // Filter technicians on left sidebar
  const filteredOrders = allOrdersList.filter(o => {
    const q = searchTech.toLowerCase();
    const tech = cleanTechName(o.technician_name || o.technician?.name).toLowerCase();
    const dev = (o.laptop_brand + ' ' + o.laptop_model).toLowerCase();
    return !q || tech.includes(q) || dev.includes(q);
  });

  const formatMsgTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="wa-chat-backdrop" onClick={onClose}>
      <div 
        className={`wa-chat-card ${isMinimized ? 'minimized' : ''}`} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* =============================================================
            MINIMIZED STATE: LINKEDIN-STYLE DOCKED BOTTOM-RIGHT BAR
            ============================================================= */}
        {isMinimized ? (
          <div className="wa-minimized-bar" onClick={() => setIsMinimized(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div className="wa-minimized-avatar">
                {(isCustomer ? activeTechName : activeCustomerName).charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2, color: '#ffffff' }}>
                  {isCustomer ? `${activeTechName} (technician)` : `${activeCustomerName} (customer)`}
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 500, color: '#ffffff' }}>
                  Online • #{activeOrder.order_number}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button 
                type="button" 
                className="wa-header-btn" 
                onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
                title="Expand Chat"
              >
                <ChevronUp size={18} />
              </button>
              <button 
                type="button" 
                className="wa-header-btn" 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                title="Close Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* =============================================================
                LEFT SIDEBAR: ALL TECHNICIANS LIST (Beside (Technician))
                ============================================================= */}
            <aside className="wa-sidebar">
              <div className="wa-sidebar-header">
                <h2 className="wa-sidebar-title">
                  <span>Chats</span>
                  <span className="wa-sidebar-badge">
                    {isCustomer ? `${allOrdersList.length} Technicians` : `${allOrdersList.length} Customers`}
                  </span>
                </h2>
              </div>

              <div className="wa-search-wrap">
                <input 
                  type="text" 
                  className="wa-search-input"
                  placeholder={isCustomer ? "Search technicians..." : "Search repairs..."}
                  value={searchTech}
                  onChange={e => setSearchTech(e.target.value)}
                />
              </div>

              <div className="wa-chat-list">
                {filteredOrders.map(item => {
                  const itemTech = cleanTechName(item.technician_name || item.technician?.name);
                  const itemCust = item.customer_name || 'Customer';
                  const techDisplayName = `${itemTech} (technician)`;
                  const custDisplayName = `${itemCust} (customer)`;
                  const displayName = isCustomer ? techDisplayName : custDisplayName;
                  const isActive = String(item.order_number || item.id) === String(activeOrder.order_number || activeOrder.id);
                  const initialLetter = (isCustomer ? itemTech : itemCust).charAt(0).toUpperCase();

                  return (
                    <div 
                      key={item.id || item.order_number}
                      className={`wa-chat-item ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveOrder(item)}
                    >
                      <div className="wa-chat-item-avatar">
                        {initialLetter}
                        <span className="wa-chat-item-dot" />
                      </div>

                      <div className="wa-chat-item-info">
                        <div className="wa-chat-item-top">
                          <span className="wa-chat-item-name">{displayName}</span>
                          <span className="wa-chat-item-time">
                            {formatMsgTime(item.created_at)}
                          </span>
                        </div>

                        <div className="wa-chat-item-snippet">
                          <span>{item.laptop_brand} {item.laptop_model}</span>
                          {item.quote_amount ? (
                            <span className="wa-quote-badge-chip">
                              ₹{item.quote_amount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* =============================================================
                RIGHT SIDE: ACTIVE CHAT WINDOW
                ============================================================= */}
            <main className="wa-chat-window">
              
              {/* LinkedIn/WhatsApp Style Window Header */}
              <header className="wa-window-header">
                <div className="wa-header-contact">
                  <div className="wa-header-avatar">
                    {(isCustomer ? activeTechName : activeCustomerName).charAt(0).toUpperCase()}
                    <span className="wa-header-online-dot" />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 className="wa-contact-name">
                      {isCustomer ? `${activeTechName} (technician)` : `${activeCustomerName} (customer)`}
                    </h3>
                    <div className="wa-contact-sub">
                      Online • {activeOrder.laptop_brand} {activeOrder.laptop_model} • Order #{activeOrder.order_number}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {activeOrder.stream_session?.is_live && (
                    <button 
                      type="button" 
                      className="wa-header-btn" 
                      onClick={() => onOpenLiveStream && onOpenLiveStream(activeOrder)}
                      title="Join Cleanroom Video Meet"
                    >
                      <Video size={19} />
                    </button>
                  )}
                  <button 
                    type="button" 
                    className="wa-header-btn" 
                    onClick={() => setIsMinimized(true)}
                    title="Minimize Chat"
                  >
                    <Minus size={18} />
                  </button>
                  <button 
                    type="button" 
                    className="wa-header-btn" 
                    onClick={onClose}
                    title="Close Chat"
                  >
                    <X size={20} />
                  </button>
                </div>
              </header>

          {/* Messages Scroll Area */}
          <div className="wa-window-body">
            
            {/* Security Notice Pill */}
            <div className="wa-encryption-pill">
              🔒 Messages are direct and transparent between customer & {activeTechName} (technician) for Order #{activeOrder.order_number}.
            </div>

            {/* ===========================================================
                MESSAGE 1: CUSTOMER'S ORIGINAL POST WITH ALL DETAILS
                =========================================================== */}
            <div className="wa-first-post-card">
              <div className="wa-first-post-badge">
                <span>📋 Repair Request Posted by {activeCustomerName}</span>
                <span>#{activeOrder.order_number}</span>
              </div>

              <div className="wa-first-post-title">
                {activeOrder.laptop_brand} {activeOrder.laptop_model}
              </div>

              <div className="wa-details-grid">
                <div className="wa-detail-item">
                  <strong>Issue:</strong> {activeOrder.issue_category || 'Hardware Repair'}
                </div>
                <div className="wa-detail-item">
                  <strong>Customer Budget:</strong> <span style={{ color: '#008069', fontWeight: 800 }}>₹{activeOrder.customer_selected_price || 300}</span>
                </div>
                <div className="wa-detail-item">
                  <strong>Pickup Address:</strong> {activeOrder.pickup_address} {activeOrder.pickup_pincode ? `(${activeOrder.pickup_pincode})` : ''}
                </div>
                <div className="wa-detail-item">
                  <strong>Pickup Slot:</strong> {activeOrder.pickup_slot || 'Today'}
                </div>
                <div className="wa-detail-item">
                  <strong>Power State:</strong> {activeOrder.power_state || 'Turns On'}
                </div>
                <div className="wa-detail-item">
                  <strong>Charger Intake:</strong> {activeOrder.charger_included ? 'Included with laptop' : 'No charger handed over'}
                </div>
              </div>

              {activeOrder.issue_description && (
                <div style={{ fontSize: '0.84rem', color: '#475569', fontStyle: 'italic', marginTop: '4px' }}>
                  "{activeOrder.issue_description}"
                </div>
              )}
            </div>

            {/* ===========================================================
                MESSAGE 2: TECHNICIAN'S REPLY WITH THEIR PRICE
                =========================================================== */}
            <div className="wa-tech-reply-card">
              <div className="wa-tech-reply-header">
                <span className="wa-tech-reply-name">
                  💬 {activeTechName} (technician)
                </span>
                <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                  Reply to Request
                </span>
              </div>

              <div className="wa-tech-quote-amount">
                Quote: ₹{activeOrder.quote_amount || 550}
              </div>

              <div className="wa-tech-note-text">
                "{activeOrder.technician_notes || 'i can fix this for this price because its takes too much time to repair'}"
              </div>

              {/* Customer Approve Action */}
              {isCustomer && !activeOrder.quote_approved && (
                <button 
                  type="button" 
                  className="wa-approve-quote-btn"
                  disabled={isApprovingQuote}
                  onClick={handleApproveQuote}
                >
                  <CheckCircle2 size={16} /> Approve ₹{activeOrder.quote_amount || 550} Quote
                </button>
              )}

              {activeOrder.quote_approved && (
                <div className="wa-approved-tag">
                  <CheckCircle2 size={16} /> Quote Approved by Customer
                </div>
              )}
            </div>

            {/* ===========================================================
                SUBSEQUENT CHAT MESSAGES (Text, Photos, and Price Quotes)
                =========================================================== */}
            {messages.map((m) => {
              const isOutgoing = m.sender_id === user?.id || (m.sender_role === user?.role && m.sender_role !== 'system');
              if (m.message_type === 'price_negotiation' && !m.metadata?.amount && (m.metadata?.quote_amount || m.content?.includes('Quote'))) {
                // Already represented by Message 2 above unless additional negotiation happens
                return null;
              }

              const senderLabel = isOutgoing 
                ? 'You' 
                : (m.sender_role === 'technician' ? `${cleanTechName(m.sender_name)} (technician)` : `${m.sender_name || 'Customer'} (customer)`);

              const hasImage = m.message_type === 'image' || Boolean(m.metadata?.image_url);
              const isQuoteMsg = m.message_type === 'price_quote' || (Boolean(m.metadata?.amount || m.metadata?.quote_amount) && m.message_type !== 'text');
              const quoteAmt = m.metadata?.amount || m.metadata?.quote_amount;

              return (
                <div 
                  key={m.id} 
                  className={`wa-msg-row ${isOutgoing ? 'wa-outgoing' : 'wa-incoming'}`}
                >
                  <div className="wa-bubble">
                    <div className={`wa-bubble-sender ${m.sender_role === 'customer' ? 'wa-customer-sender' : ''}`}>
                      {senderLabel}
                    </div>

                    {/* PHOTO ATTACHMENT */}
                    {hasImage && (
                      <div className="wa-bubble-img-wrap">
                        <img 
                          src={m.metadata?.image_url} 
                          alt="Photo attachment" 
                          className="wa-bubble-image" 
                          onClick={() => setLightboxImage(m.metadata?.image_url)}
                          title="Click to view full photo"
                        />
                      </div>
                    )}

                    {/* PRICE QUOTE ATTACHMENT CARD */}
                    {isQuoteMsg ? (
                      <div className="wa-bubble-quote-card">
                        <div className="wa-bubble-quote-header">
                          <span className="wa-bubble-quote-badge">
                            🏷️ {m.sender_role === 'technician' ? 'Price Quote' : 'Price Proposal'}
                          </span>
                          <span className="wa-bubble-quote-price">
                            ₹{quoteAmt}
                          </span>
                        </div>

                        {m.content && m.content !== 'Price proposal' && !m.content.startsWith('Price Quote: ₹') && (
                          <div className="wa-bubble-quote-note">
                            "{m.content || m.metadata?.notes}"
                          </div>
                        )}

                        {isCustomer && m.sender_role === 'technician' && !activeOrder.quote_approved && (
                          <button 
                            type="button" 
                            className="wa-approve-quote-btn"
                            style={{ marginTop: '8px', padding: '6px 12px', fontSize: '0.8rem' }}
                            disabled={isApprovingQuote}
                            onClick={handleApproveQuote}
                          >
                            <CheckCircle2 size={15} /> Approve ₹{quoteAmt} Quote
                          </button>
                        )}

                        {activeOrder.quote_approved && (
                          <div className="wa-approved-tag" style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                            <CheckCircle2 size={14} /> Quote Approved
                          </div>
                        )}
                      </div>
                    ) : (
                      m.content && (!hasImage || m.content !== 'Photo attachment') && (
                        <div className="wa-bubble-text">
                          {m.content}
                        </div>
                      )
                    )}

                    <div className="wa-bubble-meta">
                      <span>{formatMsgTime(m.created_at)}</span>
                      {isOutgoing && (
                        <span className="wa-double-check">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Text Input Bar with Paperclip Attachments */}
          <div className="wa-footer-wrapper">
            
            {/* Attachment Menu Popover (WhatsApp Style) */}
            {showAttachMenu && (
              <div className="wa-attach-popover" ref={attachMenuRef}>
                <button 
                  type="button" 
                  className="wa-attach-option-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="wa-attach-icon-circle media">
                    <ImageIcon size={20} />
                  </div>
                  <div className="wa-attach-option-text">
                    <span className="wa-attach-option-title">Photos & Media</span>
                    <span className="wa-attach-option-sub">Upload laptop fault photos or proof</span>
                  </div>
                </button>

                <button 
                  type="button" 
                  className="wa-attach-option-btn"
                  onClick={() => {
                    setShowAttachMenu(false);
                    setQuotePriceInput(activeOrder.quote_amount || activeOrder.customer_selected_price || '');
                    setQuoteNoteInput(activeOrder.technician_notes || '');
                    setShowPriceModal(true);
                  }}
                >
                  <div className="wa-attach-icon-circle price">
                    <IndianRupee size={20} />
                  </div>
                  <div className="wa-attach-option-text">
                    <span className="wa-attach-option-title">
                      {isCustomer ? 'Propose Price / Offer' : 'Submit Price Quote'}
                    </span>
                    <span className="wa-attach-option-sub">
                      {isCustomer ? 'Propose your target repair budget' : 'Send diagnostic estimate & notes'}
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Hidden File Input for Photos */}
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              style={{ display: 'none' }} 
              onChange={handlePhotoSelect} 
            />

            <form className="wa-chat-footer" onSubmit={handleSendMessage}>
              <button 
                type="button" 
                className={`wa-attach-btn ${showAttachMenu ? 'active' : ''}`}
                onClick={() => setShowAttachMenu(prev => !prev)}
                title="Attach photo or propose price"
              >
                <Paperclip size={20} />
              </button>

              <input 
                type="text" 
                className="wa-chat-input" 
                value={newText} 
                onChange={e => setNewText(e.target.value)} 
                placeholder="Type a message..." 
                autoFocus 
              />

              <button 
                type="submit" 
                className="wa-send-btn" 
                disabled={!newText.trim()} 
                title="Send Message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

        </main>
        </>
        )}

        {/* PHOTO PREVIEW MODAL */}
        {selectedPhoto && (
          <div className="wa-modal-suboverlay" onClick={() => setSelectedPhoto(null)}>
            <div className="wa-photo-preview-card" onClick={e => e.stopPropagation()}>
              <div className="wa-submodal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.96rem' }}>
                  <ImageIcon size={18} color="#008069" />
                  <span>Send Photo Attachment</span>
                </div>
                <button type="button" className="wa-submodal-close" onClick={() => setSelectedPhoto(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="wa-photo-preview-body">
                <img src={selectedPhoto.dataUrl} alt="Preview" className="wa-preview-img" />
                <div className="wa-photo-filename">{selectedPhoto.name}</div>
              </div>

              <div className="wa-photo-preview-footer">
                <input 
                  type="text"
                  className="wa-caption-input"
                  placeholder="Add a caption... (optional)"
                  value={photoCaption}
                  onChange={e => setPhotoCaption(e.target.value)}
                  autoFocus
                  onKeyDown={e => { if (e.key === 'Enter') handleSendPhoto(); }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="wa-cancel-btn" onClick={() => setSelectedPhoto(null)}>
                    Cancel
                  </button>
                  <button type="button" className="wa-send-photo-btn" onClick={handleSendPhoto}>
                    <Send size={16} /> Send Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRICE QUOTE MODAL */}
        {showPriceModal && (
          <div className="wa-modal-suboverlay" onClick={() => setShowPriceModal(false)}>
            <div className="wa-price-quote-card" onClick={e => e.stopPropagation()}>
              <div className="wa-submodal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.96rem' }}>
                  <Tag size={18} color="#008069" />
                  <span>{isCustomer ? 'Propose Target Budget' : 'Send Repair Price Quote'}</span>
                </div>
                <button type="button" className="wa-submodal-close" onClick={() => setShowPriceModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSendPriceQuote} className="wa-price-form">
                <div className="wa-form-group">
                  <label className="wa-form-label">
                    {isCustomer ? 'Your Proposed Budget (₹)' : 'Diagnostic Estimate / Quote Amount (₹)'}
                  </label>
                  <div className="wa-input-with-symbol">
                    <span className="wa-rupee-symbol">₹</span>
                    <input 
                      type="number"
                      min="50"
                      step="50"
                      required
                      className="wa-price-number-input"
                      value={quotePriceInput}
                      onChange={e => setQuotePriceInput(e.target.value)}
                      placeholder="e.g. 1800"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="wa-form-group">
                  <label className="wa-form-label">
                    {isCustomer ? 'Notes / Condition (optional)' : 'Diagnostics & Repair Scope Note'}
                  </label>
                  <textarea 
                    rows="3"
                    className="wa-price-notes-input"
                    value={quoteNoteInput}
                    onChange={e => setQuoteNoteInput(e.target.value)}
                    placeholder={isCustomer ? "e.g. Can proceed if screen replacement is included" : "e.g. OEM Hinge replacement + thermal repaste included"}
                  />
                </div>

                <div className="wa-price-form-actions">
                  <button type="button" className="wa-cancel-btn" onClick={() => setShowPriceModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="wa-send-quote-submit-btn">
                    <CheckCircle2 size={16} /> 
                    {isCustomer ? `Propose ₹${quotePriceInput || '0'}` : `Send ₹${quotePriceInput || '0'} Quote`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* LIGHTBOX FULL VIEW */}
        {lightboxImage && (
          <div className="wa-lightbox-overlay" onClick={() => setLightboxImage(null)}>
            <div className="wa-lightbox-content" onClick={e => e.stopPropagation()}>
              <button type="button" className="wa-lightbox-close" onClick={() => setLightboxImage(null)} title="Close image">
                <X size={24} />
              </button>
              <img src={lightboxImage} alt="Attachment full view" className="wa-lightbox-img" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
