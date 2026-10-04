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
  FileCheck, 
  Radio, 
  ExternalLink,
  MapPin,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  Key
} from 'lucide-react';
import './TrackRepairPage.css';

export default function TrackRepairPage({ onOpenLiveStream }) {
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // On-demand credentials state
  const [providedPin, setProvidedPin] = useState('');
  const [providedBitlocker, setProvidedBitlocker] = useState('Disabled / Not Applicable');
  const [submittingCreds, setSubmittingCreds] = useState(false);
  const [credsSuccessMsg, setCredsSuccessMsg] = useState('');

  const handleProvideCredentials = async (e) => {
    e.preventDefault();
    if (!searchedOrder || !providedPin) return;

    setSubmittingCreds(true);
    try {
      const activeToken = localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch(`/api/repairs/${searchedOrder.id}/provide-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({
          device_pin: providedPin,
          bitlocker_status: providedBitlocker,
          tamper_seal_code: searchedOrder.tamper_seal_code,
          order_number: searchedOrder.order_number
        })
      });

      const data = await res.json();
      if (res.ok) {
        setCredsSuccessMsg('Credentials submitted securely to technician!');
        setSearchedOrder(data.order);
      } else {
        alert(data.error || 'Failed to submit credentials');
      }
    } catch (err) {
      alert('Network error submitting credentials');
    } finally {
      setSubmittingCreds(false);
    }
  };

  const getStagesForStatus = (status = 'Order Placed') => {
    const statusMap = {
      'Order Placed': 1,
      'Technician Accepted': 2,
      'Pickup Scheduled': 3,
      'Picked Up': 4,
      'Delivered to Bench': 5,
      'In Repair': 6,
      'Quality Check': 7,
      'Return Pickup': 8,
      'Delivered': 9
    };
    const currentStepIndex = statusMap[status] || 1;

    const baseStages = [
      { id: 1, name: 'Repair Request Created', time: 'Completed', desc: 'Customer requested repair and target budget specified' },
      { id: 2, name: 'Technician Accepted', time: currentStepIndex >= 2 ? 'Completed' : 'Pending', desc: 'Verified hardware technician assigned to the repair job' },
      { id: 3, name: 'Pickup Scheduled', time: currentStepIndex >= 3 ? 'Completed' : 'Pending', desc: 'Doorstep pickup agent assigned with serialized tamper bag' },
      { id: 4, name: 'Laptop Picked Up', time: currentStepIndex >= 4 ? 'Completed' : 'Pending', desc: 'Device sealed with tamper-evident security barcode' },
      { id: 5, name: 'Delivered to Technician', time: currentStepIndex >= 5 ? 'Completed' : 'Pending', desc: 'Delivered to cleanroom bench; seal verified intact' },
      { id: 6, name: 'Repair In Progress', time: currentStepIndex >= 6 ? (currentStepIndex === 6 ? 'Live Now' : 'Completed') : 'Pending', desc: 'Technician diagnostic, micro-soldering, and part rework' },
      { id: 7, name: 'Quality Check', time: currentStepIndex >= 7 ? 'Completed' : 'Pending', desc: 'Stress test, thermal validation, and hardware calibration' },
      { id: 8, name: 'Return Pickup', time: currentStepIndex >= 8 ? 'Completed' : 'Pending', desc: 'Re-sealed with warranty tamper protection and dispatched' },
      { id: 9, name: 'Delivered', time: currentStepIndex >= 9 ? 'Completed' : 'Pending', desc: 'Doorstep return delivery verified with customer OTP handoff' }
    ];

    return baseStages.map(s => {
      if (s.id < currentStepIndex) return { ...s, status: 'done' };
      if (s.id === currentStepIndex) return { ...s, status: 'active' };
      return { ...s, status: 'upcoming' };
    });
  };

  const handleSearch = async (e) => {
    e?.preventDefault();
    const query = searchId.trim();
    if (!query) {
      setErrorMsg('Please enter a valid Repair ID or Serial Number');
      setSearchedOrder(null);
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch(`/api/repairs/track/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedOrder(data.order);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || `No active repair order found matching "${query}"`);
        setSearchedOrder(null);
      }
    } catch (err) {
      setErrorMsg('Network error. Could not connect to repair server.');
      setSearchedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-page-root">
      <div className="track-page-container">
        {/* Page Header */}
        <div className="track-header">
          <span className="badge badge-primary track-header-badge">
            CHAIN OF CUSTODY TRACKING
          </span>
          <h1 className="track-header-h1">
            Track Your Repair
          </h1>
          <p className="track-header-sub">
            Track pickup, cleanroom arrival, live workbench repair session, and tamper-sealed return delivery in real-time.
          </p>
        </div>

        {/* Search Bar */}
        <div className="track-search-card">
          <form onSubmit={handleSearch} className="track-search-form">
            <div className="track-search-input-wrap">
              <Search size={18} className="track-search-icon" />
              <input
                type="text"
                placeholder="Enter Repair ID, Serial Number, Seal Code, or Email/Phone..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="track-search-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary track-search-btn"
            >
              {loading && <Loader2 size={16} className="spin" />}
              <span>Track Status</span>
            </button>
          </form>

          {errorMsg && (
            <div style={{ color: '#ef4444', fontSize: '0.88rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Empty State when no order is searched */}
        {!searchedOrder && !loading && (
          <div className="tech-card" style={{ padding: '48px 24px', textAlign: 'center', borderRadius: '16px' }}>
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
              <Package size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
              Track Your Repair Without Logging In
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
              Enter your Repair ID (e.g., EOF-2026-XXXXX), laptop serial number, tamper seal code, or registered phone/email above.
            </p>
          </div>
        )}

        {/* Results when order is found */}
        {searchedOrder && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {/* Left: Device & Live Bench Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="tech-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>
                      ORDER #{searchedOrder.order_number}
                    </span>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {searchedOrder.laptop_brand} {searchedOrder.laptop_model}
                    </h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                      Serial: {searchedOrder.serial_number || 'N/A'}
                    </p>
                  </div>
                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    fontSize: '0.8rem',
                    fontWeight: 700
                  }}>
                    {searchedOrder.status?.toUpperCase() || 'ACTIVE'}
                  </div>
                </div>

                {/* On-Demand Diagnostic Credentials Request Alert */}
                {searchedOrder.credentials_requested && !searchedOrder.credentials_provided && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(249, 115, 22, 0.04) 100%)',
                    border: '1.5px solid #ea580c',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Key size={18} color="#ea580c" />
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>
                        Technician Diagnostic Access Requested
                      </strong>
                      <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>ACTION REQUIRED</span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 10px', lineHeight: 1.4 }}>
                      {searchedOrder.credentials_request_note || 'The technician is ready to test components on the workbench and requires temporary OS PIN or guest login.'}
                    </p>

                    <form onSubmit={handleProvideCredentials} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>
                            OS LOGIN PIN / PASSWORD
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1234 or 'Guest user created'"
                            value={providedPin}
                            onChange={(e) => setProvidedPin(e.target.value)}
                            style={{ width: '100%', height: '36px', borderRadius: '8px', padding: '0 10px', border: '1px solid var(--border-light)' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>
                            BITLOCKER STATUS
                          </label>
                          <select
                            value={providedBitlocker}
                            onChange={(e) => setProvidedBitlocker(e.target.value)}
                            style={{ width: '100%', height: '36px', borderRadius: '8px', padding: '0 8px', border: '1px solid var(--border-light)' }}
                          >
                            <option value="Disabled / Not Applicable">Disabled / Not Applicable</option>
                            <option value="BitLocker Active (Key Shared in Chat)">BitLocker Active (Key Shared in Chat)</option>
                            <option value="Apple FileVault">Apple FileVault</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <button
                          type="submit"
                          disabled={submittingCreds}
                          className="btn-primary"
                          style={{ padding: '7px 16px', fontSize: '0.82rem', fontWeight: 700 }}
                        >
                          {submittingCreds ? 'Submitting...' : '🔒 Submit Diagnostic Access Securely'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Credentials Successfully Provided Confirmation */}
                {searchedOrder.credentials_provided && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
                      Diagnostic access securely shared with workbench technician under active camera recording.
                    </span>
                  </div>
                )}

                <div style={{ background: 'var(--bg-main)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>
                    Issue Reported
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.92rem' }}>
                    {searchedOrder.issue_category}
                  </div>
                  {searchedOrder.issue_description && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {searchedOrder.issue_description}
                    </div>
                  )}

                  {/* Intake & Custody Specifications */}
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px', fontSize: '0.78rem' }}>
                    <div><span style={{ color: 'var(--text-dim)' }}>Charger:</span> <strong>{searchedOrder.charger_included ? (searchedOrder.charger_details || 'Included') : 'Not Included'}</strong></div>
                    <div><span style={{ color: 'var(--text-dim)' }}>Accessories:</span> <strong>{Array.isArray(searchedOrder.included_accessories) ? searchedOrder.included_accessories.join(', ') : (searchedOrder.included_accessories || 'None')}</strong></div>
                  </div>
                </div>

                {searchedOrder.tamper_seal_code && (
                  <div style={{ background: 'var(--bg-main)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Tamper-Seal Security
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>VERIFIED INTACT</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 800, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                      <Lock size={15} color="#10b981" />
                      <span>{searchedOrder.tamper_seal_code}</span>
                    </div>
                  </div>
                )}

                {searchedOrder.stream_session?.is_live && (
                  <button
                    onClick={() => onOpenLiveStream && onOpenLiveStream()}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: 700
                    }}
                  >
                    <Radio size={16} />
                    <span>Watch Live Bench Session</span>
                  </button>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="tech-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px' }}>Estimate & Billing</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Repair Estimate</span>
                  <span style={{ fontWeight: 700 }}>₹{searchedOrder.quote_amount || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Doorstep Pickup & Return</span>
                  <span style={{ fontWeight: 700, color: '#10b981' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontWeight: 800, fontSize: '1rem' }}>
                  <span>Status</span>
                  <span style={{ color: searchedOrder.quote_approved ? '#10b981' : 'var(--cta-orange)' }}>
                    {searchedOrder.quote_approved ? 'Approved' : 'Pending Customer Review'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: 9-Stage Custody Timeline */}
            <div className="tech-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Full 9-Stage Custody Timeline</h3>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                  Current: {searchedOrder.status}
                </span>
              </div>

              <div style={{ position: 'relative', paddingLeft: '28px' }}>
                <div style={{
                  position: 'absolute',
                  left: '11px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: 'var(--border-light)'
                }} />

                {getStagesForStatus(searchedOrder.status).map((stage) => {
                  const isDone = stage.status === 'done';
                  const isActive = stage.status === 'active';

                  return (
                    <div key={stage.id} style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{
                        position: 'absolute',
                        left: '-28px',
                        top: '2px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: isDone ? '#10b981' : isActive ? 'var(--primary)' : 'var(--bg-main)',
                        border: `2px solid ${isDone ? '#10b981' : isActive ? 'var(--primary)' : 'var(--border-light)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        zIndex: 2,
                        boxShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                      }}>
                        {isDone ? '✓' : stage.id}
                      </div>

                      <div style={{ paddingLeft: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            fontWeight: 800,
                            fontSize: '0.94rem',
                            color: isDone ? 'var(--text-main)' : isActive ? 'var(--primary)' : 'var(--text-muted)'
                          }}>
                            {stage.name}
                          </span>
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: isActive ? '#10b981' : 'var(--text-dim)'
                          }}>
                            {stage.time}
                          </span>
                        </div>
                        <p style={{
                          fontSize: '0.82rem',
                          color: isActive ? 'var(--text-main)' : 'var(--text-dim)',
                          lineHeight: 1.4,
                          margin: 0
                        }}>
                          {stage.desc}
                        </p>
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
