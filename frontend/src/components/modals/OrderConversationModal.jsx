import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Video, 
  DollarSign, 
  AlertCircle, 
  Phone, 
  Wrench, 
  User 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './OrderConversationModal.css';

export default function OrderConversationModal({ isOpen, onClose, initialOrder, onOpenLiveStream }) {
  const { user, token } = useAuth();
  const [order, setOrder] = useState(initialOrder || null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isApprovingQuote, setIsApprovingQuote] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
    }
  }, [initialOrder]);

  const getActiveToken = () => {
    return token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || '';
  };

  // Fetch messages from backend API with localStorage backup
  const fetchConversation = async (silent = false) => {
    if (!order?.id) {
      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const current = localSaved.find(o => String(o.order_number || o.id) === String(order?.order_number || order?.id));
        if (current && current.messages) {
          setMessages(current.messages);
        }
      } catch (e) {}
      return;
    }

    if (!silent) setLoading(true);
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${order.id}/conversation`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setOrder(data.order);
        setMessages(data.messages || []);
      } else {
        // Fallback to local storage if API call fails
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const current = localSaved.find(o => String(o.order_number || o.id) === String(order.order_number || order.id));
        if (current && current.messages) {
          setMessages(current.messages);
        }
      }
    } catch (err) {
      // Offline fallback
      try {
        const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
        const current = localSaved.find(o => String(o.order_number || o.id) === String(order.order_number || order.id));
        if (current && current.messages) {
          setMessages(current.messages);
        }
      } catch (e) {}
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Polling every 3 seconds for WhatsApp-style live responsiveness
  useEffect(() => {
    if (!isOpen || !order) return;
    fetchConversation(false);

    const interval = setInterval(() => {
      fetchConversation(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen, order?.id]);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send pure WhatsApp text message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const content = newText.trim();
    if (!content || !order) return;

    setNewText('');

    const senderRole = user?.role || 'customer';
    const senderName = user?.name || (senderRole === 'technician' ? 'Technician' : 'Customer');

    const optimisticMsg = {
      id: Date.now(),
      order_id: order.id,
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
        if (String(o.order_number || o.id) === String(order.order_number || order.id)) {
          return {
            ...o,
            messages: [...(o.messages || []), optimisticMsg]
          };
        }
        return o;
      });
      localStorage.setItem('livefix_all_orders', JSON.stringify(updated));
    } catch (e) {}

    // Send to backend
    if (order.id) {
      try {
        const activeToken = getActiveToken();
        const res = await fetch(`/api/repairs/${order.id}/conversation`, {
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
          if (data.order) setOrder(data.order);
        }
      } catch (err) {
        console.warn('Network message send error, kept local copy:', err);
      }
    }
  };

  // Customer Approves Technician Quote
  const handleApproveQuote = async () => {
    if (!order?.id) return;
    setIsApprovingQuote(true);
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${order.id}/approve-quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ approved: true })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setOrder(data.order);
        if (data.chat_message) setMessages(prev => [...prev, data.chat_message]);
        fetchConversation(true);
      }
    } catch (err) {
      console.error('Failed to approve quote:', err);
    } finally {
      setIsApprovingQuote(false);
    }
  };

  if (!isOpen || !order) return null;

  const userRole = user?.role || 'customer';
  const isCustomer = userRole === 'customer';
  const isTechnician = userRole === 'technician';

  // Contact person details for WhatsApp header
  let contactName = '';
  let contactRole = '';
  let contactInitial = '';

  if (isCustomer) {
    contactName = order.technician_name || order.technician?.name || 'Verified Technician';
    contactRole = 'Technician';
    contactInitial = contactName.charAt(0).toUpperCase() || 'T';
  } else if (isTechnician) {
    contactName = order.customer_name || order.customer?.name || 'Customer';
    contactRole = 'Customer';
    contactInitial = contactName.charAt(0).toUpperCase() || 'C';
  } else {
    contactName = `${order.customer_name || 'Customer'} & ${order.technician_name || 'Technician'}`;
    contactRole = 'Live Channel';
    contactInitial = 'A';
  }

  const formatMsgTime = (isoString) => {
    if (!isoString) return '';
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="wa-chat-backdrop" onClick={onClose}>
      <div className="wa-chat-card" onClick={e => e.stopPropagation()}>
        
        {/* WhatsApp Header */}
        <header className="wa-chat-header">
          <div className="wa-header-contact">
            <div className="wa-avatar-wrap">
              <div className="wa-avatar">
                {contactInitial}
              </div>
              <span className="wa-online-dot" />
            </div>

            <div className="wa-header-meta">
              <div className="wa-header-title-row">
                <h3 className="wa-contact-name">{contactName}</h3>
                <span className="wa-role-tag">{contactRole}</span>
              </div>
              <div className="wa-contact-sub">
                Online • {order.laptop_brand} {order.laptop_model} • #{order.order_number}
              </div>
            </div>
          </div>

          <div className="wa-header-actions">
            {order.stream_session?.is_live && (
              <button 
                type="button" 
                className="wa-header-btn" 
                onClick={() => onOpenLiveStream && onOpenLiveStream(order)}
                title="Join Live Cleanroom Video Meet"
              >
                <Video size={20} />
              </button>
            )}
            <button 
              type="button" 
              className="wa-header-btn" 
              onClick={onClose}
              title="Close Chat"
            >
              <X size={22} />
            </button>
          </div>
        </header>

        {/* Compact Repair Context Bar */}
        <div className="wa-repair-bar">
          <div>
            <strong>Issue:</strong> {order.issue_category || 'Hardware Inspection'}
          </div>
          <div>
            <strong>Target Budget:</strong> <span className="wa-price-pill">₹{order.quote_amount || order.customer_selected_price || 300}</span>
          </div>
          <div>
            <strong>Status:</strong> {order.status || 'Active'}
          </div>
        </div>

        {/* WhatsApp Message Body */}
        <div className="wa-chat-body">
          {/* Security & Transparency Pill */}
          <div className="wa-encryption-pill">
            🔒 Direct transparent chat for Order #{order.order_number}. Messages are sent with names by default.
          </div>

          {loading && messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.88rem' }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.88rem' }}>
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map((m) => {
              const isOutgoing = m.sender_id === user?.id || (m.sender_role === userRole && m.sender_role !== 'system');
              const isSystemPill = m.sender_role === 'system';
              const isPriceNegotiation = m.message_type === 'price_negotiation' || m.message_type === 'price_proposed';

              // System Notice Pill
              if (isSystemPill) {
                return (
                  <div key={m.id} className="wa-system-pill">
                    <ShieldCheck size={14} color="#008069" />
                    <span>{m.content}</span>
                  </div>
                );
              }

              // Diagnostic Quote Update Message (sent by technician)
              if (isPriceNegotiation) {
                const quoteAmt = m.metadata?.quote_amount || order.quote_amount || 500;
                const quoteNotes = m.metadata?.technician_notes || order.technician_notes || m.content;
                const isQuoteApproved = order.quote_approved;

                return (
                  <div 
                    key={m.id} 
                    className={`wa-msg-row ${isOutgoing ? 'wa-outgoing' : 'wa-incoming'}`}
                  >
                    <div className="wa-quote-card-bubble">
                      <div className="wa-quote-badge-row">
                        <span className="wa-quote-label">💰 Diagnostic Repair Quote</span>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {formatMsgTime(m.created_at)}
                        </span>
                      </div>

                      <div className="wa-quote-amount-display">
                        ₹{quoteAmt}
                      </div>

                      <div className="wa-quote-note-box">
                        <strong>{m.sender_name || 'Technician'}:</strong> {quoteNotes}
                      </div>

                      {/* Approval Action for Customer */}
                      {isCustomer && !isQuoteApproved && (
                        <button 
                          type="button" 
                          className="wa-approve-btn"
                          disabled={isApprovingQuote}
                          onClick={handleApproveQuote}
                        >
                          <CheckCircle2 size={16} /> Approve ₹{quoteAmt} Quote
                        </button>
                      )}

                      {isQuoteApproved && (
                        <div className="wa-approved-badge">
                          <CheckCircle2 size={16} /> Quote Approved by Customer
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Standard WhatsApp Chat Bubble
              const senderDisplayName = isOutgoing ? 'You' : (m.sender_name || (m.sender_role === 'technician' ? 'Technician' : 'Customer'));
              const senderClass = m.sender_role === 'technician' ? 'wa-sender-tech' : m.sender_role === 'customer' ? 'wa-sender-customer' : 'wa-sender-you';

              return (
                <div 
                  key={m.id} 
                  className={`wa-msg-row ${isOutgoing ? 'wa-outgoing' : 'wa-incoming'}`}
                >
                  <div className="wa-bubble">
                    <div className={`wa-bubble-sender ${senderClass}`}>
                      {senderDisplayName}
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Footer Input Bar (Pure message input - NO photos) */}
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

      </div>
    </div>
  );
}
