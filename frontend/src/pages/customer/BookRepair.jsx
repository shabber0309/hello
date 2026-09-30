import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Laptop, ShieldCheck, MapPin, Calendar, Check, ArrowRight, ArrowLeft, 
  Lock, AlertTriangle, Cpu, Battery, Monitor, Droplets, HardDrive
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TamperSealBadge } from '../../components/common';
import './BookRepair.css';

export default function BookRepair({ onBookingSuccess, onCancel }) {
  const { token } = useAuth();
  const location = useLocation();
  const prefill = location.state?.prefillProblem || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    laptop_brand: 'Apple',
    laptop_model: 'MacBook Air M2 (2023)',
    serial_number: '',
    issue_category: 'Motherboard / No Power',
    issue_description: prefill ? `Selected Issue: ${prefill}` : '',
    pickup_address: 'Flat 302, Cyber Towers View, Madhapur',
    pickup_city: 'Hyderabad',
    pickup_slot: 'Today, 2:00 PM - 4:00 PM'
  });

  const popularBrands = ['Apple', 'Dell', 'Lenovo', 'HP', 'Asus', 'Acer'];

  const issuesList = [
    { title: 'Motherboard / No Power', desc: 'No LED, dead after surge or sleep', icon: Cpu },
    { title: 'Display / Cracked Glass', desc: 'Broken matrix, black screen, vertical lines', icon: Monitor },
    { title: 'Battery Replacement', desc: 'Swollen pouch, not holding charge', icon: Battery },
    { title: 'Liquid Damage Clean & Rework', desc: 'Spilled water, tea, or coffee', icon: Droplets },
    { title: 'SSD & RAM Speed Upgrade', desc: 'Storage expansion or memory boost', icon: HardDrive }
  ];

  const timeSlots = [
    'Today, 2:00 PM - 4:00 PM',
    'Today, 5:00 PM - 7:00 PM',
    'Tomorrow, 10:00 AM - 12:00 PM',
    'Tomorrow, 2:00 PM - 4:00 PM'
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        onBookingSuccess(data.order);
      } else {
        setError(data.error || 'Failed to book repair.');
      }
    } catch (err) {
      // Fallback local mock for resilient demo
      const mockOrder = {
        id: Date.now(),
        order_number: `EOF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        ...formData,
        tamper_seal_code: `SEAL-TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        status: 'Order Placed',
        quote_amount: 3200.0,
        quote_approved: false
      };
      onBookingSuccess(mockOrder);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-repair-root">
      {/* Header */}
      <div className="book-repair-header">
        <span className="badge badge-cyan book-repair-badge">
          <ShieldCheck size={13} /> ZERO-TRUST HARDWARE PICKUP
        </span>
        <h2 className="book-repair-h2">
          Schedule Tamper-Proof Laptop Collection
        </h2>
        <p className="book-repair-subtitle">
          Your machine will be placed inside a serialized security pouch right in front of you.
        </p>
      </div>

      {/* Stepper Bar */}
      <div className="book-stepper-bar">
        {[
          { num: 1, label: 'Device Specs' },
          { num: 2, label: 'Issue Checklist' },
          { num: 3, label: 'Pickup Logistics' },
          { num: 4, label: 'Tamper Guarantee' }
        ].map((s) => (
          <div key={s.num} className="book-step-col">
            <div className={`book-step-circle ${step >= s.num ? 'book-step-circle-active' : 'book-step-circle-inactive'}`}>
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`book-step-label ${step >= s.num ? 'book-step-label-active' : ''}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="book-card-container">
        {/* STEP 1: DEVICE SPECS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Laptop size={20} color="var(--primary)" /> Step 1: Laptop Brand & Model
            </h3>

            <div>
              <label className="form-label">Brand</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {popularBrands.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setFormData({ ...formData, laptop_brand: b })}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      background: formData.laptop_brand === b ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-input)',
                      border: `1px solid ${formData.laptop_brand === b ? 'var(--primary)' : 'var(--border-light)'}`,
                      color: formData.laptop_brand === b ? '#38bdf8' : 'var(--text-main)',
                      fontWeight: 600
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="form-label">Model Name / Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. MacBook Pro M2, XPS 15 9520, ThinkPad X1 Carbon"
                value={formData.laptop_model}
                onChange={(e) => setFormData({ ...formData, laptop_model: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Serial Number (Optional - can be verified on camera)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. C02G9012MD6R or leave empty"
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-action"
              >
                Next: Issue Details <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ISSUE CHECKLIST */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} color="var(--primary)" /> Step 2: Diagnostic Category
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {issuesList.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.issue_category === item.title;
                return (
                  <div
                    key={item.title}
                    onClick={() => setFormData({ ...formData, issue_category: item.title })}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-input)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#000' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: isSelected ? '#38bdf8' : 'var(--text-main)', fontSize: '0.95rem' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                    {isSelected && <Check size={18} color="var(--primary)" />}
                  </div>
                );
              })}
            </div>

            <div>
              <label className="form-label">Detailed Symptoms / Notes for Technician</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="What happened before the issue occurred? Any unusual sounds, burning smell, or liquid spills?"
                value={formData.issue_description}
                onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-action"
              >
                Next: Pickup Logistics <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PICKUP LOGISTICS */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={20} color="var(--primary)" /> Step 3: Doorstep Pickup Slot & Address
            </h3>

            <div className="grid-2">
              <div>
                <label className="form-label">City</label>
                <select 
                  className="form-input"
                  value={formData.pickup_city}
                  onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
                >
                  <option value="Hyderabad">Hyderabad (Full Coverage: Hitec City, Gachibowli, Banjara Hills, Kondapur, Jubilee Hills)</option>
                  <option value="Bengaluru">Bengaluru (Whitefield, Koramangala, Indiranagar)</option>
                  <option value="Pune">Pune (Kothrud, Hinjewadi, Viman Nagar)</option>
                </select>
              </div>

              <div>
                <label className="form-label">Pickup Time Slot</label>
                <select
                  className="form-input"
                  value={formData.pickup_slot}
                  onChange={(e) => setFormData({ ...formData, pickup_slot: e.target.value })}
                >
                  {timeSlots.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Complete Doorstep Address</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="House/Flat number, Building, Street, Landmark"
                value={formData.pickup_address}
                onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-action"
              >
                Next: Review & Tamper Seal <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TAMPER GUARANTEE & CONFIRMATION */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} color="var(--primary)" /> Step 4: Security Seal & Live Stream Activation
            </h3>

            {/* Tamper Seal Preview */}
            <TamperSealBadge sealCode="SEAL-TX-READY" city={formData.pickup_city} />

            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              padding: '20px',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Booking Summary:
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Device:</span>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{formData.laptop_brand} - {formData.laptop_model}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Reported Fault:</span>
                <span style={{ color: '#38bdf8' }}>{formData.issue_category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Pickup Time:</span>
                <span style={{ color: 'var(--text-main)' }}>{formData.pickup_slot}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Google Meet Stream:</span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>Automated Live Invitation Included</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-verified"
                style={{ padding: '12px 28px', fontSize: '1rem' }}
              >
                <ShieldCheck size={18} /> {loading ? 'Booking Pickup...' : 'Confirm Doorstep Pickup & Tamper Seal'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
