import React from 'react';
import { ShieldCheck, ArrowLeft, Laptop, FileText, CheckCircle2, MapPin } from 'lucide-react';

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

  // Format pickup location cleanly
  const formattedAddress = [
    formData.pickup_address,
    formData.pickup_area,
    formData.pickup_city ? `${formData.pickup_city}${formData.pickup_pincode ? ` - ${formData.pickup_pincode}` : ''}` : ''
  ].filter(Boolean).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <h3 className="book-step-title">
        <ShieldCheck size={20} color="var(--primary)" className="book-step-title-icon" /> Step 4: Review Order & Confirm Pickup
      </h3>

      

      {/* Modern Grouped Repair Order Summary Card */}
      <div className="order-summary-card">
        <div className="order-summary-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Repair Order Preview
            </h4>
          </div>
          <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem' }}>
            <CheckCircle2 size={13} /> Verified Intake Manifest
          </span>
        </div>

        <div className="order-summary-grid">
          {/* Column 1: Device & Problem Details */}
          <div className="order-summary-section">
            <div className="order-summary-section-title">
              <Laptop size={14} color="var(--primary)" /> Device & Issue Details
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Laptop:</span>
              <span className="order-summary-value" style={{ fontWeight: 700 }}>
                {formData.laptop_brand} {formData.laptop_model || 'Standard Laptop'}
              </span>
            </div>
            {formData.serial_number && (
              <div className="order-summary-item">
                <span className="order-summary-label">Serial Number:</span>
                <span className="order-summary-value mono">
                  {formData.serial_number}
                </span>
              </div>
            )}
            <div className="order-summary-item">
              <span className="order-summary-label">Problem Category:</span>
              <span className="order-summary-value highlight-blue">
                {currentCategory ? currentCategory.shortName : 'General'}: {problemDisplayName}
              </span>
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Pre-Existing Condition:</span>
              <span className="order-summary-value highlight-amber">
                {formData.pre_existing_damage && formData.pre_existing_damage.length > 0 ? formData.pre_existing_damage.join(', ') : 'None / Mint Condition'}
              </span>
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Photo Proof:</span>
              <span className="order-summary-value highlight-green">
                {photos.length > 0 ? `${photos.length} photo(s) attached` : 'None attached'}
              </span>
            </div>
          </div>

          {/* Column 2: Handover & Coordination */}
          <div className="order-summary-section">
            <div className="order-summary-section-title">
              <ShieldCheck size={14} color="var(--primary)" /> Handover & Coordination
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Charger Handover:</span>
              <span className="order-summary-value">
                {formData.charger_included ? (formData.charger_details || 'Original Charger Handed Over') : 'No Charger Included'}
              </span>
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Included Accessories:</span>
              <span className="order-summary-value">
                {formData.included_accessories && formData.included_accessories.length > 0 ? formData.included_accessories.join(', ') : 'None'}
              </span>
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Chassis Consent:</span>
              <span className="order-summary-value highlight-green">
                {formData.chassis_open_consent ? 'Authorized for Bench Diagnostic' : 'Standard Intake'}
              </span>
            </div>
          </div>
        </div>

        {/* Pickup Logistics Full Row */}
        <div className="order-summary-logistics">
          <div className="order-summary-section-title">
            <MapPin size={14} color="var(--primary)" /> Doorstep Pickup Location
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span className="order-summary-label" style={{ display: 'block', fontSize: '0.72rem', marginBottom: '1px' }}>Address</span>
                <span style={{ color: 'var(--text-main)', fontSize: '0.86rem', lineHeight: '1.4', fontWeight: 600 }}>
                  {formattedAddress || 'Address will be confirmed upon pickup'}
                </span>
              </div>
            </div>
            {formData.pickup_landmark && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', paddingLeft: '23px' }}>
                <strong>Landmark:</strong> {formData.pickup_landmark}
              </div>
            )}
          </div>
        </div>

        {/* Target Budget Footer Bar */}
        <div className="order-summary-budget-footer">
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', fontWeight: 800 }}>
              Customer Target Budget
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Final technician quote will be confirmed live before work starts
            </div>
          </div>
          <div className="order-summary-budget-amount">
            ₹{formData.customer_selected_price.toLocaleString()}
          </div>
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
