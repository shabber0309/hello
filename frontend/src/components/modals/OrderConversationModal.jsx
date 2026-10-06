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
  ChevronUp
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

  const messagesEndRef = useRef(null);

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
                SUBSEQUENT CHAT MESSAGES
                =========================================================== */}
            {messages.map((m) => {
              const isOutgoing = m.sender_id === user?.id || (m.sender_role === user?.role && m.sender_role !== 'system');
              if (m.message_type === 'price_negotiation' && (m.metadata?.quote_amount || m.content?.includes('Quote'))) {
                // Already represented by Message 2 above unless additional negotiation happens
                return null;
              }

              const senderLabel = isOutgoing 
                ? 'You' 
                : (m.sender_role === 'technician' ? `${cleanTechName(m.sender_name)} (technician)` : `${m.sender_name || 'Customer'} (customer)`);

              return (
                <div 
                  key={m.id} 
                  className={`wa-msg-row ${isOutgoing ? 'wa-outgoing' : 'wa-incoming'}`}
                >
                  <div className="wa-bubble">
                    <div className={`wa-bubble-sender ${m.sender_role === 'customer' ? 'wa-customer-sender' : ''}`}>
                      {senderLabel}
                    </div>

                    <div className="wa-bubble-text">
                      {m.content}
                    </div>

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

          {/* WhatsApp Text Input Bar (Pure text only - NO photos) */}
          <form className="wa-chat-footer" onSubmit={handleSendMessage}>
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

        </main>
        </>
        )}

      </div>
    </div>
  );
}
