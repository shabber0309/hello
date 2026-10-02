import React from 'react';
import { Sliders, ShieldCheck, ArrowLeft } from 'lucide-react';
import { TamperSealBadge } from '../../../components/common';

export default function Step4({
  formData,
  setFormData,
  currentCategory,
  currentProblem,
  photos,
  loading,
  onBack,
  onSubmit
}) {
  const problemDisplayName = currentProblem?.name || formData.issue_name || 'Hardware Diagnostic';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h3 className="book-step-title">
        <Sliders size={20} color="var(--primary)" className="book-step-title-icon" /> Step 4: Budget Range & Security Confirmation
      </h3>

      {/* E-Commerce Price Range Slider Box */}
      <div className="price-slider-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Indicative Price Range for: {problemDisplayName}
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{formData.base_price_min.toLocaleString()} — ₹{formData.base_price_max.toLocaleString()}
            </div>
          </div>

          <div className="customer-budget-tag">
            Your Target Budget: <span className="budget-val">₹{formData.customer_selected_price.toLocaleString()}</span>
          </div>
        </div>

        {/* Slider Input */}
        <div style={{ margin: '18px 0 8px' }}>
          <input
            type="range"
            min={formData.base_price_min}
            max={formData.base_price_max}
            step={50}
            value={formData.customer_selected_price}
            onChange={(e) => setFormData({ ...formData, customer_selected_price: Number(e.target.value) })}
            className="ecommerce-range-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Fixed Base Price: ₹{formData.base_price_min.toLocaleString()}</span>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Selected: ₹{formData.customer_selected_price.toLocaleString()}</span>
            <span>Highest Benchmark: ₹{formData.base_price_max.toLocaleString()}</span>
          </div>
        </div>

        {/* Transparent Disclaimer */}
        <div className="price-transparency-disclaimer">
          <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Estimated Repair Cost: ₹{formData.base_price_min.toLocaleString()} – ₹{formData.base_price_max.toLocaleString()}</strong>.
            <div style={{ marginTop: '2px' }}>
              Final price depends on laptop brand, model, part availability (OEM vs compatible parts), and technician diagnosis during the live workbench video stream. You will approve the final quote before any repair proceeds.
            </div>
          </div>
        </div>
      </div>

      {/* Tamper Seal Badge */}
      <TamperSealBadge sealCode="SEAL-TX-READY" city={formData.pickup_city} />

      {/* Booking Summary Card */}
      <div className="booking-summary-card">
        <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', fontSize: '0.95rem' }}>
          Repair Order Preview:
        </div>

        <div className="summary-row">
          <span>Laptop:</span>
          <strong>{formData.laptop_brand} {formData.laptop_model}</strong>
        </div>

        <div className="summary-row">
          <span>Diagnostic Credentials:</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>On-Demand (Requested only if required on bench)</span>
        </div>

        <div className="summary-row">
          <span>Charger Handover:</span>
          <span>{formData.charger_included ? (formData.charger_details || 'Yes (Charger Handed Over)') : 'No Charger Included'}</span>
        </div>

        <div className="summary-row">
          <span>Included Accessories:</span>
          <span>{formData.included_accessories.join(', ') || 'None'}</span>
        </div>

        <div className="summary-row">
          <span>Declared Pre-Existing Condition:</span>
          <span style={{ color: '#d97706', fontWeight: 600 }}>{formData.pre_existing_damage.join(', ')}</span>
        </div>

        <div className="summary-row">
          <span>Part Tier Preference:</span>
          <span>{formData.part_preference}</span>
        </div>

        <div className="summary-row">
          <span>Problem Category:</span>
          <span style={{ color: '#2563eb', fontWeight: 600 }}>
            {currentCategory ? currentCategory.shortName : 'General'}: {problemDisplayName}
          </span>
        </div>

        <div className="summary-row">
          <span>Photo Proof:</span>
          <span style={{ color: '#059669', fontWeight: 600 }}>{photos.length} photo(s) attached</span>
        </div>

        <div className="summary-row">
          <span>WhatsApp Contact:</span>
          <span>{formData.whatsapp_number || 'Direct Call Phone'}</span>
        </div>

        <div className="summary-row">
          <span>Pickup Address:</span>
          <span>{formData.pickup_address}, {formData.pickup_area}, {formData.pickup_city} - {formData.pickup_pincode} ({formData.pickup_landmark})</span>
        </div>

        <div className="summary-row">
          <span>Pickup Slot:</span>
          <span>{formData.pickup_slot}</span>
        </div>

        <div className="summary-row">
          <span>Customer Target Budget:</span>
          <strong style={{ color: '#059669', fontSize: '1rem' }}>₹{formData.customer_selected_price.toLocaleString()}</strong>
        </div>
      </div>

      {/* Step 4 Actions Footer */}
      <div className="book-actions-footer">
        <button
          type="button"
          onClick={onBack}
          className="btn-neutral"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="btn-verified"
          style={{ padding: '12px 28px', fontSize: '1rem' }}
        >
          <ShieldCheck size={18} /> {loading ? 'Posting Repair Request...' : 'Post Problem Online & Confirm Pickup'}
        </button>
      </div>
    </div>
  );
}
