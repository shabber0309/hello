import React, { useState, useEffect } from 'react';
import { MapPin, ArrowLeft, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { getMandalsForPincode, getSavedAddress, saveCustomerAddress } from '../../../data/pincodeLocations';

export default function Step3({
  formData,
  setFormData,
  onBack,
  onNext,
  addressError = '',
  areaError = '',
  pincodeError = '',
  consentError = '',
  onClearError
}) {
  const [availableMandals, setAvailableMandals] = useState([]);
  const [isLoadingMandals, setIsLoadingMandals] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [saveAddressChecked, setSaveAddressChecked] = useState(true);

  // Auto-fill address for returning customers if saved address exists
  useEffect(() => {
    const saved = getSavedAddress();
    if (saved && saved.pickup_address) {
      setHasSavedAddress(true);
      // If form doesn't already have an address, auto-populate from saved
      if (!formData.pickup_address || !formData.pickup_address.trim()) {
        setFormData(prev => ({
          ...prev,
          pickup_address: saved.pickup_address || prev.pickup_address,
          pickup_pincode: saved.pickup_pincode || prev.pickup_pincode,
          pickup_area: saved.pickup_area || prev.pickup_area,
          pickup_city: saved.pickup_city || prev.pickup_city || 'Hyderabad',
          pickup_landmark: saved.pickup_landmark || prev.pickup_landmark || ''
        }));
      }
    }
  }, []);

  // Auto-fetch ONLY the specific Mandal(s) for the entered Pincode
  useEffect(() => {
    let isCancelled = false;
    const pin = (formData.pickup_pincode || '').toString().trim();

    if (pin.length === 6 && /^[1-9]\d{5}$/.test(pin)) {
      setIsLoadingMandals(true);
      getMandalsForPincode(pin)
        .then((res) => {
          if (isCancelled) return;
          setIsLoadingMandals(false);

          if (res && res.mandals && res.mandals.length > 0) {
            setAvailableMandals(res.mandals);

            // Auto-select first matching mandal for this pincode
            const firstMandal = res.mandals[0];
            setFormData(prev => ({
              ...prev,
              pickup_area: res.mandals.includes(prev.pickup_area) ? prev.pickup_area : firstMandal,
              pickup_city: res.city || prev.pickup_city || 'Hyderabad'
            }));

            if (onClearError) onClearError('pickup_area');
          } else {
            setAvailableMandals([]);
          }
        })
        .catch(() => {
          if (!isCancelled) {
            setIsLoadingMandals(false);
            setAvailableMandals([]);
          }
        });
    } else {
      setAvailableMandals([]);
      setIsLoadingMandals(false);
      setFormData(prev => (prev.pickup_area ? { ...prev, pickup_area: '' } : prev));
    }

    return () => {
      isCancelled = true;
    };
  }, [formData.pickup_pincode]);

  const handlePincodeChange = (e) => {
    if (onClearError) onClearError('pickup_pincode');
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ 
      ...prev, 
      pickup_pincode: cleanDigits,
      pickup_area: cleanDigits.length === 6 ? prev.pickup_area : ''
    }));
  };

  const handleMandalChange = (e) => {
    const val = e.target.value;
    if (onClearError) onClearError('pickup_area');
    setFormData(prev => ({ ...prev, pickup_area: val }));
  };

  const handleClearAddress = () => {
    setFormData(prev => ({
      ...prev,
      pickup_address: '',
      pickup_pincode: '',
      pickup_area: '',
      pickup_landmark: ''
    }));
    setAvailableMandals([]);
  };

  const handleNext = () => {
    if (saveAddressChecked && formData.pickup_address) {
      saveCustomerAddress(formData);
    }
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 className="book-step-title">
        <MapPin size={20} color="var(--primary)" className="book-step-title-icon" /> Step 3: Doorstep Pickup Address & Logistics
      </h3>



      {/* Auto-filled saved address notification */}
      {hasSavedAddress && formData.pickup_address && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'rgba(37, 99, 235, 0.06)',
          border: '1px solid rgba(37, 99, 235, 0.22)',
          borderRadius: '8px',
          fontSize: '0.78rem',
          color: 'var(--primary)',
          fontWeight: 600
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={15} color="#2563eb" /> Auto-filled from your saved doorstep address
          </span>
          <button
            type="button"
            onClick={handleClearAddress}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.74rem',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0
            }}
          >
            Enter different address
          </button>
        </div>
      )}

      {/* 1. Complete Doorstep Address */}
      <div id="field-pickup_address">
        <label className="form-label">
          Complete Address<span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.pickup_address}
          onChange={(e) => {
            if (onClearError) onClearError('pickup_address');
            setFormData({ ...formData, pickup_address: e.target.value });
          }}
          style={addressError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)' } : undefined}
        />
        {addressError && (
          <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
            <AlertCircle size={13} /> {addressError}
          </span>
        )}
      </div>
      
        
      {/* 2. Pincode, Mandal (Based strictly on Pincode), and City Grid */}
      <div className="book-form-grid-3">
        {/* Pincode Input */}
        <div id="field-pickup_pincode" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Pincode <span style={{ color: '#ef4444' }}>*</span>
            </label>
            {isLoadingMandals && (
              <span style={{ fontSize: '0.74rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Finding mandal...
              </span>
            )}
            {!isLoadingMandals && availableMandals.length > 0 && (
              <span style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                ✓ {availableMandals.length === 1 ? '1 mandal' : `${availableMandals.length} mandals`}
              </span>
            )}
          </div>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="form-input"
            value={formData.pickup_pincode}
            onChange={handlePincodeChange}
            style={pincodeError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)' } : undefined}
          />
          {pincodeError && (
            <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <AlertCircle size={13} /> {pincodeError}
            </span>
          )}
        </div>

        {/* Mandal Dropdown - Shows ONLY the Mandal(s) for the entered Pincode */}
        <div id="field-pickup_area" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
            <label className="form-label" style={{ margin: 0 }}>
              Mandal <span style={{ color: '#ef4444' }}>*</span>
            </label>
          </div>

          <select
            className="form-input"
            value={formData.pickup_area}
            onChange={handleMandalChange}
            style={{
              cursor: availableMandals.length > 0 ? 'pointer' : 'default',
              fontWeight: 600,
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              borderColor: areaError ? '#ef4444' : undefined,
              boxShadow: areaError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined
            }}
          >
            {availableMandals.length === 0 ? (
              <option value="">
                {formData.pickup_pincode?.length === 6 ? 'No mandal found for this pincode' : 'Enter pincode first'}
              </option>
            ) : (
              <>
                <option value="">Select Mandal</option>
                {availableMandals.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </>
            )}
          </select>

          {areaError && (
            <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
              <AlertCircle size={13} /> {areaError}
            </span>
          )}
        </div>

        {/* City Dropdown */}
        <div id="field-pickup_city" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
            <label className="form-label" style={{ margin: 0 }}>City</label>
          </div>
          <select
            className="form-input"
            value={formData.pickup_city}
            onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
            style={{ 
              cursor: 'pointer', 
              fontWeight: 600,
              width: '100%',
              maxWidth: '100%',
              minWidth: 0,
              boxSizing: 'border-box',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap'
            }}
          >
            <option value="Hyderabad">Hyderabad (All Zones)</option>
            <option value="Secunderabad">Secunderabad</option>
            <option value="Rangareddy">Rangareddy</option>
            <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Pune">Pune</option>
            {formData.pickup_city && !['Hyderabad', 'Secunderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Bengaluru', 'Pune'].includes(formData.pickup_city) && (
              <option value={formData.pickup_city}>{formData.pickup_city}</option>
            )}
          </select>
        </div>
      </div>

      {/* Landmark / Gate Pass (Optional) */}
      <div>
        <label className="form-label">
          Landmark / Gated Community Gate Pass <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span>
        </label>
        <input
          type="text"
          className="form-input"
          value={formData.pickup_landmark}
          onChange={(e) => setFormData({ ...formData, pickup_landmark: e.target.value })}
        />
      </div>

      {/* Save Address Toggle for Future Bookings */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer', marginTop: '-4px' }}>
        <input
          type="checkbox"
          checked={saveAddressChecked}
          onChange={(e) => setSaveAddressChecked(e.target.checked)}
          style={{ width: '15px', height: '15px', accentColor: '#2563eb', cursor: 'pointer', flexShrink: 0 }}
        />
        <span>Save this address for future bookings (auto-fill next time)</span>
      </label>

      {/* Data Backup Waiver & Chassis Open Authorization */}
      <div id="field-chassis_open_consent">
        <label
          className="book-consent-card"
          style={consentError ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)' } : undefined}
        >
          <input
            type="checkbox"
            checked={formData.chassis_open_consent}
            onChange={(e) => {
              if (onClearError) onClearError('chassis_open_consent');
              setFormData({ ...formData, chassis_open_consent: e.target.checked });
            }}
            style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
          />
          <div className="book-consent-text">
            <strong>Data Backup & Diagnostic Authorization:</strong>{' '}
            <span>
              I confirm that critical files have been backed up (or data is non-critical). I authorize Live Fix verified cleanroom technicians to unseal screws and open the chassis under live camera monitoring for hardware diagnostics.
            </span>
          </div>
        </label>
        {consentError && (
          <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
            <AlertCircle size={13} /> {consentError}
          </span>
        )}
      </div>

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
          onClick={handleNext}
          className="btn-action"
        >
          Next: Confirm <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
