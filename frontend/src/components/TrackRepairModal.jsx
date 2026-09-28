import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Video, 
  Truck, 
  Package, 
  Lock, 
  X, 
  FileCheck, 
  Radio, 
  ChevronRight,
  ExternalLink,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function TrackRepairModal({ isOpen, onClose, onOpenLiveStream, initialId = '' }) {
  const [searchId, setSearchId] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fullStages = [
    { id: 1, name: 'Repair Request Created', time: 'Today, 02:15 PM', status: 'done', desc: 'Customer requested repair for Dell Inspiron 15 (Screen not working)' },
    { id: 2, name: 'Technician Accepted', time: 'Today, 02:22 PM', status: 'done', desc: 'Accepted by Ravi Sharma (Senior Hardware Specialist)' },
    { id: 3, name: 'Pickup Scheduled', time: 'Today, 02:30 PM', status: 'done', desc: 'Doorstep pickup agent assigned with serialized tamper bag' },
    { id: 4, name: 'Laptop Picked Up', time: 'Today, 02:45 PM', status: 'done', desc: 'Device sealed with Tamper Seal TC-FX-928341 and collected' },
    { id: 5, name: 'Delivered to Technician', time: 'Today, 03:15 PM', status: 'done', desc: 'Delivered to Cleanroom Bench #4; seal verified intact' },
    { id: 6, name: 'Repair In Progress', time: 'Live Now', status: 'active', desc: 'Dell Inspiron 15 — Screen Replacement & eDP connector micro-soldering' },
    { id: 7, name: 'Quality Check', time: 'Estimated 05:45 PM', status: 'upcoming', desc: 'Display panel stress test, refresh rate calibration, keyboard & touchpad tests' },
    { id: 8, name: 'Return Pickup', time: 'Estimated 06:15 PM', status: 'upcoming', desc: 'Re-sealed with new warranty tamper seal and dispatched' },
    { id: 9, name: 'Delivered', time: 'Estimated 06:30 PM', status: 'upcoming', desc: 'Doorstep delivery with secret verification OTP handoff' }
  ];

  const handleSearch = async (e) => {
    e?.preventDefault();
    const query = searchId.trim();
    if (!query) {
      setErrorMsg('Please enter a valid Repair ID');
      return;
    }
    setErrorMsg('');
    try {
      const res = await fetch(`/api/repairs/track/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        const o = data.order;
        setSearchedOrder({
          id: o.order_number,
          laptop: `${o.laptop_brand} ${o.laptop_model}`,
          repairName: `${o.laptop_brand} ${o.laptop_model} — ${o.issue_category}`,
          serialNumber: o.serial_number || 'N/A',
          tamperSeal: o.tamper_seal_code || 'N/A',
          technician: o.technician?.name || 'Assigned Certified Specialist',
          currentMilestone: o.status,
          estimatedCompletion: 'Estimated within 24-48 hrs',
          estimate: `₹${o.quote_amount || 0}`,
          isLive: o.stream_session?.is_live || false,
          pickupAddress: o.pickup_address || 'Pickup on record'
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || `No repair found with ID "${query}"`);
        setSearchedOrder(null);
      }
    } catch (err) {
      setErrorMsg('Failed to reach tracking server');
      setSearchedOrder(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '920px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary">PUBLIC TRUST PROTOCOL</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No login required</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Track Live Repair & Chain of Custody</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Enter your serialized Repair ID to inspect live milestones, tamper seal verification, and workbench camera feed.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-dim)' }} />
            <input 
              type="text"
              placeholder="Enter your Repair ID or Serial Number..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '42px',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600
              }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '0 24px', fontSize: '0.9rem' }}>
            Track Now
          </button>
        </form>

        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px' }}>
            {errorMsg}
          </div>
        )}

        {searchedOrder && (
          <div>
            {/* Summary Card */}
            {/* Current Status Card (Section 6 Specification) */}
            <div style={{
              background: 'var(--bg-card-subtle)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid var(--border-glow)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Current Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <span className="badge badge-live" style={{ fontSize: '0.85rem', padding: '4px 12px' }}>
                      <Radio size={13} className="pulse-dot" /> 🔵 Repair In Progress
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                      Seal ID: {searchedOrder.tamperSeal}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ESTIMATED COMPLETION</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {searchedOrder.estimatedCompletion}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
                background: 'var(--bg-surface)',
                padding: '16px',
                borderRadius: '12px',
                marginBottom: '18px',
                fontSize: '0.85rem',
                border: '1px solid var(--border-light)'
              }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Technician: </span>
                  <strong>{searchedOrder.technician}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Repair: </span>
                  <strong>{searchedOrder.repairName}</strong>
                </div>
              </div>

              {/* 3 Buttons specified in Section 6 */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  className="btn-cta"
                  onClick={() => {
                    onClose();
                    if (onOpenLiveStream) onOpenLiveStream();
                  }}
                  style={{ fontSize: '0.85rem' }}
                >
                  <Video size={15} /> Join Live Repair
                </button>

                <button 
                  className="btn-secondary"
                  onClick={() => {
                    onClose();
                    if (onOpenLiveStream) onOpenLiveStream();
                  }}
                  style={{ fontSize: '0.85rem' }}
                >
                  Message Technician
                </button>

                <button 
                  className="btn-secondary"
                  onClick={() => {
                    alert(`Repair Details:\nDevice: ${searchedOrder.laptop}\nTask: ${searchedOrder.repairName}\nTechnician: ${searchedOrder.technician}\nTamper Seal: ${searchedOrder.tamperSeal}\nEstimated Cost: ${searchedOrder.estimate}`);
                  }}
                  style={{ fontSize: '0.85rem' }}
                >
                  View Repair Details
                </button>
              </div>
            </div>

            {/* 9-Stage Trust Timeline */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>
                Full Lifecycle Journey (9 Milestone Audit)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {fullStages.map((stg, idx) => {
                  const isDone = stg.status === 'done';
                  const isActive = stg.status === 'active';

                  return (
                    <div 
                      key={stg.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: isActive 
                          ? 'var(--primary-subtle)' 
                          : (isDone ? 'var(--bg-surface)' : 'var(--bg-card-subtle)'),
                        border: isActive 
                          ? '2px solid var(--primary)' 
                          : '1px solid var(--border-light)',
                        boxShadow: isActive ? '0 0 16px var(--primary-glow)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isDone ? '#10b981' : (isActive ? '#ef4444' : 'var(--border-light)'),
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }}>
                          {isDone ? <CheckCircle2 size={16} /> : (isActive ? <Radio size={14} className="pulse-dot" /> : stg.id)}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>
                              {stg.name}
                            </span>
                            {isActive && (
                              <span className="badge badge-live" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                                LIVE NOW
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {stg.desc}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                        {stg.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
