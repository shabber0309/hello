import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Truck, 
  Lock, 
  Unlock, 
  Video, 
  Package, 
  CheckCircle2, 
  Clock, 
  Star, 
  Mail, 
  DollarSign, 
  AlertCircle, 
  Radio, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './OrderConversationModal.css';

export default function OrderConversationModal({ isOpen, onClose, initialOrder, onOpenLiveStream }) {
  const { user, token } = useAuth();
  const [order, setOrder] = useState(initialOrder || null);
  const [messages, setMessages] = useState([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  // Interactive Action Form States
  const [proposedPrice, setProposedPrice] = useState(
    initialOrder?.customer_selected_price || initialOrder?.quote_amount || initialOrder?.base_price_min || 2000
  );
  const [pickupSlot, setPickupSlot] = useState('Today, 2:00 PM - 4:00 PM');
  const [resealTag, setResealTag] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('Device received in pristine sealed condition. Screen replaced and tested!');

  const messagesEndRef = useRef(null);

  const getActiveToken = () => {
    return token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || '';
  };

  const fetchConversation = async (silent = false) => {
    if (!order?.id) return;
    if (!silent) setLoading(true);
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${order.id}/conversation`, {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setMessages(data.messages || []);
        if (data.order?.customer_selected_price && !proposedPrice) {
          setProposedPrice(data.order.customer_selected_price);
        }
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Poll conversation updates every 3.5 seconds
  useEffect(() => {
    if (!isOpen || !order?.id) return;
    fetchConversation(false);

    const interval = setInterval(() => {
      fetchConversation(true);
    }, 3500);

    return () => clearInterval(interval);
  }, [isOpen, order?.id]);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send regular text message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const content = newText.trim();
    if (!content || !order?.id) return;

    setNewText('');
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
        setMessages(prev => [...prev, data.chat_message]);
        if (data.order) setOrder(data.order);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // Generic Workflow Action Dispatcher
  const executeWorkflowAction = async (endpoint, payload = {}, successMessage = '') => {
    if (!order?.id) return;
    setSubmittingAction(true);
    setActionNotice('');
    try {
      const activeToken = getActiveToken();
      const res = await fetch(`/api/repairs/${order.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setOrder(data.order);
        if (data.chat_message) setMessages(prev => [...prev, data.chat_message]);
        setActionNotice(successMessage || data.message || 'Action executed successfully');
      } else {
        const errData = await res.json().catch(() => ({}));
        setActionNotice(errData.error || 'Failed to complete action');
      }
    } catch (err) {
      console.error(`Workflow action error on ${endpoint}:`, err);
      setActionNotice('Connection error while executing action');
    } finally {
      setSubmittingAction(false);
    }
  };

  if (!isOpen || !order) return null;

  const userRole = user?.role || 'customer';
  const isCustomer = userRole === 'customer';
  const isTechnician = userRole === 'technician';
  const isAdmin = userRole === 'admin';

  // Determine stage flags
  const isPriceAgreed = order.price_status === 'price_agreed';
  const isPickupRaised = order.pickup_status === 'pickup_raised';
  const isPickupAccepted = ['pickup_accepted', 'collected'].includes(order.pickup_status);
  const isCollected = order.pickup_status === 'collected';
  const isUnsealRequested = order.unseal_status === 'unseal_requested';
  const isUnsealApproved = ['unseal_approved', 'unsealed'].includes(order.unseal_status);
  const isResealNotified = ['reseal_notified', 'resealed', 'dispatched'].includes(order.reseal_status);
  const isDispatched = order.reseal_status === 'dispatched' || order.status === 'Return Pickup';
  const isDelivered = order.status === 'Delivered';
  const isRecordingDelivered = order.meet_recording_sent_to_email;

  // Active step calculation (1 to 9)
  let currentStep = 1;
  if (isPriceAgreed) currentStep = 2;
  if (isPickupAccepted) currentStep = 3;
  if (isCollected) currentStep = 4;
  if (isUnsealApproved) currentStep = 5;
  if (isResealNotified) currentStep = 6;
  if (isDispatched) currentStep = 7;
  if (isDelivered) currentStep = 8;
  if (isRecordingDelivered) currentStep = 9;

  const stepsList = [
    { num: 1, label: 'Price Range' },
    { num: 2, label: 'Pickup Schedule' },
    { num: 3, label: 'Collected at Bench' },
    { num: 4, label: 'Unseal Approval' },
    { num: 5, label: 'Live Video Meet' },
    { num: 6, label: 'Re-sealing' },
    { num: 7, label: 'Dispatched' },
    { num: 8, label: 'Final Review' },
    { num: 9, label: 'Recording Sent' },
  ];

  return (
    <div className="order-conversation-backdrop" onClick={onClose}>
      <div className="order-conversation-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="order-conv-header">
          <div className="order-conv-header-title">
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2>{order.laptop_brand} {order.laptop_model}</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-dim, #64748b)' }}>
                <span>Order: <strong style={{ color: 'var(--primary, #2563eb)' }}>#{order.order_number}</strong></span>
                <span>•</span>
                <span>Tamper Seal: <strong style={{ fontFamily: 'var(--font-mono)' }}>{order.tamper_seal_code}</strong></span>
                <span>•</span>
                <span className="badge badge-verified" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{order.status}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="order-conv-close-btn" 
              onClick={() => fetchConversation(false)}
              title="Refresh conversation"
            >
              <RefreshCw size={18} />
            </button>
            <button className="order-conv-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </header>

        {/* 9-Stage Progress Stepper */}
        <div className="order-conv-stepper">
          {stepsList.map(s => {
            const isDone = currentStep > s.num;
            const isActive = currentStep === s.num;
            return (
              <div 
                key={s.num} 
                className={`order-conv-step ${isDone ? 'step-completed' : isActive ? 'step-active' : ''}`}
              >
                {isDone ? <CheckCircle2 size={13} /> : <span style={{ width: '13px', textAlign: 'center' }}>{s.num}</span>}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>

        {/* Action Notice feedback if any */}
        {actionNotice && (
          <div style={{
            background: 'rgba(37, 99, 235, 0.12)',
            color: 'var(--primary, #2563eb)',
            padding: '8px 24px',
            fontSize: '0.84rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={15} /> {actionNotice}
          </div>
        )}

        {/* Dynamic Action Bay (Current Stage Controls) */}
        <div className="order-conv-action-bay">
          {/* STAGE 1: PRICE NEGOTIATION */}
          {!isPriceAgreed && (
            <div className="action-card action-card-primary">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="#2563eb" />
                  Base Price Range & Final Price Agreement
                </span>
                <span className="badge badge-primary">
                  Base Range: ₹{order.base_price_min || 1500} – ₹{order.base_price_max || 3500}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-dim, #64748b)', marginBottom: '6px' }}>
                    Select target price within base range (₹{order.base_price_min} - ₹{order.base_price_max}):
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="range"
                      min={order.base_price_min || 1200}
                      max={order.base_price_max || 4500}
                      step="100"
                      value={proposedPrice}
                      onChange={e => setProposedPrice(Number(e.target.value))}
                      style={{ flex: 1, accentColor: '#2563eb' }}
                    />
                    <strong style={{ fontSize: '1.2rem', color: '#2563eb', minWidth: '90px' }}>
                      ₹{Number(proposedPrice).toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {(isCustomer || isAdmin) && (
                    <button 
                      className="btn-primary"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('propose-price', { price: proposedPrice }, `Price proposal of ₹${proposedPrice} sent to technician`)}
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      Propose Target Price
                    </button>
                  )}

                  {(isTechnician || isAdmin) && (
                    <button 
                      className="btn-cta"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('accept-price', { agreed_price: proposedPrice }, `Agreed final price locked at ₹${proposedPrice}`)}
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      Accept Agreed Price (₹{proposedPrice})
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: PICKUP SCHEDULING */}
          {isPriceAgreed && !isPickupAccepted && (
            <div className="action-card action-card-warning">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="#d97706" />
                  Step 2: Doorstep Courier Pickup Scheduling
                </span>
                <span className="badge badge-verified">
                  Locked Price: ₹{order.final_agreed_price || order.quote_amount}
                </span>
              </div>

              {!isPickupRaised ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    {isTechnician || isAdmin 
                      ? 'Select pickup slot and raise pickup request to customer:' 
                      : 'Waiting for technician to schedule your doorstep courier pickup...'}
                  </p>
                  {(isTechnician || isAdmin) && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <select 
                        value={pickupSlot} 
                        onChange={e => setPickupSlot(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      >
                        <option value="Today, 2:00 PM - 4:00 PM">Today, 2:00 PM - 4:00 PM</option>
                        <option value="Today, 4:00 PM - 6:00 PM">Today, 4:00 PM - 6:00 PM</option>
                        <option value="Tomorrow, 10:00 AM - 1:00 PM">Tomorrow, 10:00 AM - 1:00 PM</option>
                      </select>
                      <button 
                        className="btn-primary"
                        disabled={submittingAction}
                        onClick={() => executeWorkflowAction('raise-pickup', { pickup_slot: pickupSlot }, 'Pickup request raised')}
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        Raise Pickup Request
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      Pickup Scheduled: {order.pickup_scheduled_time}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Tamper-evident Pouch: <strong>{order.tamper_seal_code}</strong> • Address: {order.pickup_address}
                    </div>
                  </div>
                  {(isCustomer || isAdmin) && (
                    <button 
                      className="btn-cta"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('accept-pickup', {}, 'Pickup accepted! Courier dispatched')}
                      style={{ padding: '8px 20px', fontSize: '0.86rem' }}
                    >
                      Accept Pickup Request
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: COLLECTION AT BENCH */}
          {isPickupAccepted && !isCollected && (
            <div className="action-card action-card-primary">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color="#2563eb" />
                  Step 3: Device Courier Transit & Cleanroom Delivery
                </span>
                <span className="badge badge-live">In Transit with Courier</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  The laptop is sealed inside tamper pouch <strong>{order.tamper_seal_code}</strong>.
                  {isTechnician || isAdmin ? ' Once the courier hands over the parcel at your workbench, confirm collection below:' : ' Courier is en route to cleanroom bench.'}
                </p>
                {(isTechnician || isAdmin) && (
                  <button 
                    className="btn-primary"
                    disabled={submittingAction}
                    onClick={() => executeWorkflowAction('mark-collected', {}, 'Device marked as collected at bench')}
                    style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                  >
                    Mark Device Collected at Workbench
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 4: UNSEAL AUTHORIZATION */}
          {isCollected && !isUnsealApproved && (
            <div className="action-card action-card-warning">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={18} color="#d97706" />
                  Step 4: Tamper Seal Verification & Opening Authorization
                </span>
                <span className="badge badge-warning">Seal Intact: {order.tamper_seal_code}</span>
              </div>

              {!isUnsealRequested ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem' }}>
                    {isTechnician || isAdmin 
                      ? 'The device is securely sealed. Request customer authorization to cut the tamper seal:' 
                      : 'Laptop is at technician bench. Waiting for technician to request unsealing.'}
                  </p>
                  {(isTechnician || isAdmin) && (
                    <button 
                      className="btn-primary"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('request-unseal', {}, 'Unseal authorization requested')}
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      Request Seal Opening Authorization
                    </button>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#b45309' }}>
                      Authorization Request: Technician is ready to cut Tamper Seal {order.tamper_seal_code}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                      Authorizing will automatically activate the Google Meet live repair camera session.
                    </div>
                  </div>
                  {(isCustomer || isAdmin) && (
                    <button 
                      className="btn-cta"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('accept-unseal', {}, 'Seal opening authorized! Live Google Meet stream launched')}
                      style={{ padding: '10px 22px', fontSize: '0.88rem' }}
                    >
                      <Unlock size={16} /> Approve Unseal & Launch Live Stream
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STAGE 5: LIVE VIDEO MEET & REPAIR */}
          {isUnsealApproved && !isResealNotified && (
            <div className="action-card action-card-success">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={18} color="#10b981" />
                  Step 5: Live Cleanroom Video Stream Active
                </span>
                <span className="badge badge-live">
                  <Radio size={12} className="pulse-dot" /> LIVE REPAIR SESSION
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    Google Meet Workbench Room is Live
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Watch the technician perform hardware diagnostics and component rework in real-time.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn-cta"
                    onClick={() => {
                      if (onOpenLiveStream) onOpenLiveStream(order);
                      else if (order.meet_recording_url || order.stream_session?.meet_url) {
                        window.open(order.meet_recording_url || order.stream_session?.meet_url, '_blank');
                      }
                    }}
                    style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                  >
                    <Video size={15} /> Join Live Video Meet
                  </button>

                  {(isTechnician || isAdmin) && (
                    <button 
                      className="btn-primary"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('notify-reseal', { reseal_code: resealTag }, 'Customer notified: Ready to re-seal')}
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      <ShieldCheck size={15} /> Notify Customer: Ready to Re-Seal
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 6: RE-SEALING & DISPATCH */}
          {isResealNotified && !isDispatched && (
            <div className="action-card action-card-primary">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2563eb" />
                  Step 6: Repair Complete & Device Re-Sealed
                </span>
                <span className="badge badge-verified">
                  Warranty Seal: {order.reseal_tamper_code}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '0.88rem' }}>
                  Hardware repair completed. Device has been packed with high-security return seal <strong>{order.reseal_tamper_code}</strong>.
                </p>
                {(isTechnician || isAdmin) && (
                  <button 
                    className="btn-cta"
                    disabled={submittingAction}
                    onClick={() => executeWorkflowAction('dispatch', {}, 'Device marked as dispatched to customer')}
                    style={{ padding: '8px 20px', fontSize: '0.86rem' }}
                  >
                    <Truck size={15} /> Dispatch Sealed Device to Customer
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STAGE 7: DISPATCHED & CUSTOMER FINAL REVIEW */}
          {isDispatched && !isDelivered && (
            <div className="action-card action-card-warning">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={18} color="#d97706" />
                  Step 7: Sealed Parcel In Transit to Customer
                </span>
                <span className="badge badge-warning">Verify Seal on Delivery</span>
              </div>
              {(isCustomer || isAdmin) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.86rem' }}>
                    Once you receive the package, inspect Tamper Seal <strong>{order.reseal_tamper_code}</strong>, test your laptop, and submit your final review:
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setReviewRating(star)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                        >
                          <Star size={20} fill={star <= reviewRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                        </button>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={reviewText} 
                      onChange={e => setReviewText(e.target.value)}
                      placeholder="Write your review..."
                      style={{ flex: 1, minWidth: '220px', padding: '8px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                    <button 
                      className="btn-cta"
                      disabled={submittingAction}
                      onClick={() => executeWorkflowAction('submit-review', { rating: reviewRating, review: reviewText }, 'Final review submitted! Repair completed')}
                      style={{ padding: '8px 18px', fontSize: '0.86rem' }}
                    >
                      Submit Final Review & Close Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.86rem' }}>
                  Courier is delivering sealed laptop to customer. Customer will test and submit final review.
                </div>
              )}
            </div>
          )}

          {/* STAGE 8 & 9: COMPLETED, REVIEWED & RECORDING DELIVERY */}
          {isDelivered && (
            <div className="action-card action-card-success">
              <div className="action-card-title">
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  Repair Verified, Delivered & Closed Successfully!
                </span>
                <span className="badge badge-verified">⭐ {order.final_rating || 5}/5 Stars</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    Google Meet Cleanroom Video Archive
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {order.meet_recording_sent_to_email 
                      ? `Delivered to customer email: ${order.customer_email || 'Registered Email'}` 
                      : 'Recording link ready for email dispatch.'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {order.meet_recording_url && (
                    <a 
                      href={order.meet_recording_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.84rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Video size={14} /> Watch Recording
                    </a>
                  )}

                  <button 
                    className="btn-primary"
                    disabled={submittingAction}
                    onClick={() => executeWorkflowAction('deliver-recording', {}, 'Video recording delivered to customer email!')}
                    style={{ padding: '8px 18px', fontSize: '0.84rem' }}
                  >
                    <Mail size={14} /> {order.meet_recording_sent_to_email ? 'Resend to Customer Email' : 'Send Recording to Customer Email'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Thread Scroll Area */}
        <div className="order-conv-messages">
          {loading && messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
              Loading conversation and custody ledger...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
              No messages in this repair thread yet. Propose a price or start typing below.
            </div>
          ) : (
            messages.map((m) => {
              const isOutgoing = m.sender_id === user?.id || (m.sender_role === userRole && m.sender_role !== 'system');
              const isSystem = m.sender_role === 'system' || m.message_type !== 'text';

              if (isSystem) {
                // Render System Milestone Card
                let icon = <Clock size={16} color="#2563eb" />;
                let bgColor = 'rgba(37, 99, 235, 0.1)';

                if (m.message_type === 'price_agreed' || m.message_type === 'unseal_approved') {
                  icon = <CheckCircle2 size={16} color="#10b981" />;
                  bgColor = 'rgba(16, 185, 129, 0.12)';
                } else if (m.message_type === 'pickup_raised' || m.message_type === 'dispatched') {
                  icon = <Truck size={16} color="#d97706" />;
                  bgColor = 'rgba(245, 158, 11, 0.12)';
                } else if (m.message_type === 'unseal_requested') {
                  icon = <Lock size={16} color="#ef4444" />;
                  bgColor = 'rgba(239, 68, 68, 0.12)';
                } else if (m.message_type === 'reseal_notified') {
                  icon = <ShieldCheck size={16} color="#3b82f6" />;
                  bgColor = 'rgba(59, 130, 246, 0.12)';
                } else if (m.message_type === 'final_review') {
                  icon = <Star size={16} color="#f59e0b" />;
                  bgColor = 'rgba(245, 158, 11, 0.12)';
                } else if (m.message_type === 'recording_delivered') {
                  icon = <Mail size={16} color="#8b5cf6" />;
                  bgColor = 'rgba(139, 92, 246, 0.12)';
                }

                return (
                  <div key={m.id} className="chat-system-card">
                    <div className="chat-system-icon" style={{ background: bgColor }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--text-main, #0f172a)' }}>
                          {m.sender_name || 'Live Fix System'}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-dim, #64748b)' }}>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-muted, #334155)', lineHeight: 1.5 }}>
                        {m.content}
                      </div>

                      {/* Special Action Links inside system cards */}
                      {m.metadata?.meet_url && (
                        <div style={{ marginTop: '8px' }}>
                          <a 
                            href={m.metadata.meet_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '6px', 
                              fontSize: '0.82rem', 
                              color: '#2563eb', 
                              fontWeight: 700,
                              textDecoration: 'none' 
                            }}
                          >
                            <Video size={14} /> Open Google Meet Session <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // Standard User Chat Bubble
              return (
                <div key={m.id} className={`chat-msg-row ${isOutgoing ? 'msg-outgoing' : 'msg-incoming'}`}>
                  <div 
                    className="chat-msg-avatar"
                    style={{
                      background: m.sender_role === 'technician' ? '#0f172a' : m.sender_role === 'admin' ? '#7c3aed' : '#2563eb'
                    }}
                  >
                    {(m.sender_name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="chat-msg-bubble">
                      {m.content}
                    </div>
                    <div className="chat-msg-meta" style={{ justifyContent: isOutgoing ? 'flex-end' : 'flex-start' }}>
                      <span>{m.sender_name} ({m.sender_role})</span>
                      <span>•</span>
                      <span>{m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form className="order-conv-footer" onSubmit={handleSendMessage}>
          <input 
            type="text"
            className="order-conv-input"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder={`Message ${isCustomer ? 'your assigned technician' : 'the customer'}...`}
          />
          <button 
            type="submit" 
            className="order-conv-send-btn"
            disabled={!newText.trim()}
          >
            <Send size={16} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
