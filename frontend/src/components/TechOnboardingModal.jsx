import React, { useState } from 'react';
import { 
  Wrench, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  Clock, 
  X, 
  ArrowRight, 
  Award, 
  FileText,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function TechOnboardingModal({ isOpen, onClose, onRegisterSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experienceYears: '5',
    specialization: 'Apple Silicon & Motherboard Micro-Soldering',
    city: 'Hyderabad',
    workbenchTools: 'ESD Mat, 100x Microscope, Thermal Camera, Oscilloscope'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      if (onRegisterSuccess) onRegisterSuccess();
    }, 1200);
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
        maxWidth: '720px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
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

        {!submitted ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                TECHNICIAN NETWORK
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Join FixConnect as a Certified Technician</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                Earn 85% of repair fees, get direct customer requests in your area, and broadcast your repairs live.
              </p>
            </div>

            {/* Benefits Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '24px'
            }}>
              <div style={{ padding: '14px', background: 'var(--bg-card-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                <DollarSign size={20} color="var(--success)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Daily Direct Payouts</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Zero middleman commission delays</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-card-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                <TrendingUp size={20} color="var(--primary)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Rapido-Style Nearby Jobs</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Accept or negotiate local repair leads</div>
              </div>

              <div style={{ padding: '14px', background: 'var(--bg-card-subtle)', borderRadius: '12px', textAlign: 'center' }}>
                <ShieldCheck size={20} color="var(--cta-orange)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Certified Hardware Badge</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>IPC-7711 Cleanroom verification</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Full Name / Workshop Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Vikram Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    placeholder="vikram@tech.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 98111 22334"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Years of Repair Experience
                  </label>
                  <select 
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="2">1-3 Years (Component Swapping)</option>
                    <option value="5">4-7 Years (Chip-Level Micro-Soldering)</option>
                    <option value="10">8+ Years (Master Level-4 BGA Reballing)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    City / Coverage Area
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Hyderabad / Hitec City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Primary Hardware Specialization
                </label>
                <input 
                  type="text" 
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <button type="submit" className="btn-cta" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
                Submit Application for Verification <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Technician Application Received!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0 20px' }}>
              Our cleanroom compliance team will review your workshop tools and reach out for verification within 24 hours.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
