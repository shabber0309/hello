import React from 'react';
import { ShieldCheck, ArrowLeft, Laptop, FileText, MapPin, Wrench, Camera } from 'lucide-react';

export default function Step4({
  formData,
  currentCategory,
  currentProblem,
  photos = [],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 className="book-step-title">
        <ShieldCheck size={20} color="var(--primary)" className="book-step-title-icon" /> Step 4: Review Order & Confirm Pickup
      </h3>

      {/* Clean Repair Order Summary Card */}
      <div className="order-summary-card">
        <div className="order-summary-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Repair Order Summary
            </h4>
          </div>
        </div>

        <div className="order-summary-grid">
          {/* Section 1: Laptop Details */}
          <div className="order-summary-section">
            <div className="order-summary-section-title">
              <Laptop size={14} color="var(--primary)" /> Laptop Details
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Brand & Model:</span>
              <span className="order-summary-value" style={{ fontWeight: 700 }}>
                {formData.laptop_brand} {formData.laptop_model || ''}
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
            {photos && photos.length > 0 && (
              <div className="order-summary-item">
                <span className="order-summary-label">Photos:</span>
                <span className="order-summary-value highlight-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Camera size={13} /> {photos.length} attached
                </span>
              </div>
            )}
          </div>

          {/* Section 2: Reported Issue */}
          <div className="order-summary-section">
            <div className="order-summary-section-title">
              <Wrench size={14} color="var(--primary)" /> Reported Issue
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Category:</span>
              <span className="order-summary-value highlight-blue">
                {currentCategory ? currentCategory.shortName : 'General'}
              </span>
            </div>
            <div className="order-summary-item">
              <span className="order-summary-label">Service:</span>
              <span className="order-summary-value" style={{ fontWeight: 600 }}>
                {problemDisplayName}
              </span>
            </div>
            {formData.issue_description && (
              <div className="order-summary-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                <span className="order-summary-label">Description:</span>
                <span className="order-summary-desc-box">
                  "{formData.issue_description}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Doorstep Pickup Location */}
        <div className="order-summary-logistics">
          <div className="order-summary-section-title">
            <MapPin size={14} color="var(--primary)" /> Doorstep Pickup Location
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <span style={{ color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.45', fontWeight: 600, display: 'block', wordBreak: 'break-word' }}>
                {formattedAddress || 'Address will be confirmed upon pickup'}
              </span>
              {formData.pickup_landmark && (
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                  <strong>Landmark:</strong> {formData.pickup_landmark}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Target Budget Footer */}
        {formData.customer_selected_price > 0 && (
          <div className="order-summary-budget-footer">
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--text-muted)', fontWeight: 800 }}>
                Target Estimated Budget
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Live camera inspection & exact quote confirmed before repair starts
              </div>
            </div>
            <div className="order-summary-budget-amount">
              ₹{Number(formData.customer_selected_price).toLocaleString('en-IN')}
            </div>
          </div>
        )}
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
        >
          <ShieldCheck size={18} /> {loading ? 'Confirming...' : 'Book Repair'}
        </button>
      </div>
    </div>
  );
}
