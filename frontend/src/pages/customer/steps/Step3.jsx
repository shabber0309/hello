import React from 'react';
import { MapPin, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';

export default function Step3({
  formData,
  setFormData,
  onBack,
  onNext
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <h3 className="book-step-title">
        <MapPin size={20} color="var(--primary)" className="book-step-title-icon" /> Step 3: Doorstep Pickup Address & Contact Details
      </h3>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
        Our verified courier arrives with a tamper-evident pouch and seals your machine directly in front of you.
      </p>

      <div>
        <label className="form-label">Complete Doorstep Address (Flat, House No., Building, Street)</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Flat 302, Cyber Towers View, Hitec City Road"
          value={formData.pickup_address}
          onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
        />
      </div>

      <div className="book-form-grid-3">
        <div>
          <label className="form-label">Area / Locality</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Madhapur, Gachibowli, Kondapur"
            value={formData.pickup_area}
            onChange={(e) => setFormData({ ...formData, pickup_area: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label">City</label>
          <select
            className="form-input"
            value={formData.pickup_city}
            onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
          >
            <option value="Hyderabad">Hyderabad (All Zones)</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Pune">Pune</option>
          </select>
        </div>

        <div>
          <label className="form-label">Pincode</label>
          <input
            type="text"
            maxLength={6}
            className="form-input"
            placeholder="e.g. 500081"
            value={formData.pickup_pincode}
            onChange={(e) => setFormData({ ...formData, pickup_pincode: e.target.value })}
          />
        </div>
      </div>

      

      {/* WhatsApp Contact & Security Landmark */}
      <div className="book-intake-card">
        <div className="book-intake-title">
          <MessageCircle size={17} color="#2563eb" /> WhatsApp Coordination & Gate Pass
        </div>
        <div className="book-form-grid-2">
          <div>
            <label className="form-label">WhatsApp Number (For live stream link & OTP)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. +91 98765 43210"
              value={formData.whatsapp_number}
              onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
            />
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
              We send the technician bench stream link and OTP directly to your WhatsApp.
            </span>
          </div>

          <div>
            <label className="form-label">Landmark / Gated Community Gate Pass</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Opposite Cyber Gateway, Tower B, MyGate OTP"
              value={formData.pickup_landmark}
              onChange={(e) => setFormData({ ...formData, pickup_landmark: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Data Backup Waiver & Chassis Open Authorization */}
      <label className="book-consent-card">
        <input
          type="checkbox"
          checked={formData.chassis_open_consent}
          onChange={(e) => setFormData({ ...formData, chassis_open_consent: e.target.checked })}
          style={{ width: '20px', height: '20px', accentColor: '#2563eb', cursor: 'pointer', marginTop: '2px' }}
        />
        <div className="book-consent-text">
          <strong>Data Backup & Diagnostic Authorization:</strong>
          <div>
            I confirm that critical files have been backed up (or data is non-critical). I authorize Live Fix verified cleanroom technicians to unseal screws and open the chassis under live camera monitoring for hardware diagnostics.
          </div>
        </div>
      </label>

      {/* Step 3 Actions Footer */}
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
          onClick={onNext}
          className="btn-action"
        >
          Next: Price Range & Confirmation <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
