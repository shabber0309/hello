import React, { useState } from 'react';
import { 
  X, 
  Laptop, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Upload, 
  Camera, 
  Video, 
  Clock, 
  MapPin,
  Check
} from 'lucide-react';

export default function RepairRequestModal({ isOpen, onClose, onSubmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: 'Dell',
    model: 'Inspiron 15 3520',
    os: 'Windows 11',
    description: 'My laptop turns on but the screen remains black. Fan spins normally, keyboard backlight lights up, but zero display output.',
    photos: ['IMG_DisplayFault_01.jpg', 'IMG_DisplayCable_02.jpg'],
    budgetMin: 1200,
    budgetMax: 2000,
    address: 'Flat 402, Green Glen Heights, Hitec City',
    city: 'Hyderabad',
    preferredTime: 'Today, 4:00 PM – 6:00 PM',
    phone: '+91 98765 43210',
    name: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const randomSeal = Math.floor(100000 + Math.random() * 900000);
    const generatedOrder = {
      order_number: `FX-2026-${randomId}`,
      tamper_seal_code: `TC-FX-${randomSeal}`,
      laptop_brand: formData.brand,
      laptop_model: formData.model,
      serial_number: formData.serialNumber || `SN-${formData.brand.toUpperCase().slice(0, 3)}-${randomId}`,
      status: 'Request Created',
      price_range: `₹${formData.budgetMin} – ₹${formData.budgetMax}`,
      pickup_address: `${formData.address}, ${formData.city}`
    };

    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/repairs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            laptop_brand: formData.brand,
            laptop_model: formData.model,
            serial_number: formData.serialNumber,
            issue_category: formData.issue,
            issue_description: formData.description,
            pickup_address: `${formData.address}, ${formData.city}`,
            pickup_city: formData.city
          })
        });
      }
    } catch (err) {
      console.log('Error creating backend order:', err);
    }

    setIsSubmitting(false);
    setCreatedOrder(generatedOrder);
    if (onSubmitSuccess) onSubmitSuccess(generatedOrder);
  };

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
        maxWidth: '620px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
              STEP {currentStep} OF 5
            </span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Let's Get Your Laptop Fixed.</h2>
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

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginBottom: '24px' }}>
          <div style={{
            width: `${(currentStep / 5) * 100}%`,
            height: '100%',
            background: 'var(--primary)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {createdOrder ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Repair Request Broadcasted!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0 20px' }}>
              Your request is now live to nearby verified technicians. You will receive offers within minutes.
            </p>

            <div style={{
              background: 'var(--bg-card-subtle)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid var(--border-light)',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Repair ID:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{createdOrder.order_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Device:</span>
                <span style={{ fontWeight: 700 }}>{createdOrder.laptop_brand} {createdOrder.laptop_model}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Budget:</span>
                <span style={{ fontWeight: 700, color: 'var(--cta-orange)' }}>{createdOrder.price_range}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tamper Seal Reserved:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {createdOrder.tamper_seal_code}
                </span>
              </div>
            </div>

            <button 
              className="btn-cta"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Done & View In Dashboard
            </button>
          </div>
        ) : (
          <div>
            {/* Step 1: Device Details */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 1 — Device Details</h3>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Laptop Brand
                  </label>
                  <select 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Dell">Dell</option>
                    <option value="Apple">Apple MacBook</option>
                    <option value="Lenovo">Lenovo / ThinkPad</option>
                    <option value="HP">HP</option>
                    <option value="Asus">Asus / ROG</option>
                    <option value="Acer">Acer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Model Name / Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Inspiron 15 3520 or MacBook Pro 14"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Operating System
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {['Windows 11', 'macOS', 'Linux', 'Other'].map((os) => (
                      <button
                        key={os}
                        type="button"
                        onClick={() => setFormData({ ...formData, os })}
                        style={{
                          padding: '10px 6px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: formData.os === os ? 'var(--primary-subtle)' : 'var(--bg-card-subtle)',
                          border: formData.os === os ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                          color: formData.os === os ? 'var(--primary)' : 'var(--text-main)'
                        }}
                      >
                        {os}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-end', marginTop: '12px' }}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to Problem Description <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Step 2: Describe Your Problem */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 2 — Describe Your Problem</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  What is wrong with your laptop? Be as specific as possible so technicians can diagnose accurately.
                </p>

                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Example: My laptop turns on but the screen remains black. The fan spins but nothing appears."
                  style={{ width: '100%', fontSize: '0.9rem', lineHeight: 1.5 }}
                  required
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(1)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(3)}>
                    Upload Evidence <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Evidence */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 3 — Upload Evidence (Photos / Video)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Adding photos or short videos of the fault helps technicians offer more accurate quotes.
                </p>

                <div style={{
                  border: '2px dashed var(--border-glow)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  background: 'var(--bg-card-subtle)'
                }}>
                  <Upload size={28} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                    Drag & Drop or Click to Upload
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '16px' }}>
                    JPG, PNG, MP4 up to 50MB
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button type="button" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      <Camera size={14} /> Upload Photos
                    </button>
                    <button type="button" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      <Video size={14} /> Upload Video
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {formData.photos.map((p, i) => (
                    <span key={i} className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      ✓ {p}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(4)}>
                    Set Your Budget <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Your Budget */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 4 — Your Budget Range</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  What price range are you expecting? Technicians will compete within or around your target.
                </p>

                <div style={{
                  background: 'var(--bg-card-subtle)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Expected Budget:</span>
                    <span style={{ fontWeight: 800, color: 'var(--cta-orange)', fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
                      ₹{formData.budgetMin.toLocaleString()} – ₹{formData.budgetMax.toLocaleString()}
                    </span>
                  </div>

                  <input 
                    type="range"
                    min="1000"
                    max="6000"
                    step="200"
                    value={formData.budgetMax}
                    onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--cta-orange)', cursor: 'pointer' }}
                  />

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
                    Technicians can accept your budget directly or send competitive counter-offers.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(3)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(5)}>
                    Pickup Details <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Pickup & Final Review */}
            {currentStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 5 — Pickup Location & Preferred Time</h3>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Doorstep Pickup Address
                  </label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      City / Pin Code
                    </label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Preferred Pickup Time
                    </label>
                    <input 
                      type="text" 
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      style={{ width: '100%' }}
                      required
                    />
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={18} />
                  <span>Device will be sealed inside serialized tamper bag SEAL-TX-7842B at doorstep.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(4)}>
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn-cta"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? 'Broadcasting to Technicians...' : 'Send Repair Request'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
