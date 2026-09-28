import React from 'react';
import { CheckCircle2, ShieldCheck, Truck, FileText, QrCode, Lock, X, Download } from 'lucide-react';

export default function QualityCheckDeliveryModal({ isOpen, onClose, orderData }) {
  if (!isOpen) return null;

  const data = orderData || {
    orderNumber: 'EOF-2026-92809',
    laptopModel: 'Dell XPS 15 9520',
    serialNumber: 'D3X-99401',
    tamperSealOut: 'SEAL-TX-4411C-OUT',
    secretOtp: '7291',
    amountPaid: 5150,
    warrantyMonths: 6,
    qrCodeString: 'TS-WARRANTY-XPS-9520-CERTIFIED',
    courierName: 'Kishore M. (Live GPS Tracked)'
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
        maxWidth: '840px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Close Button */}
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

        {/* Top Celebration Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Quality Check Passed!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Your <strong>{data.laptopModel}</strong> has completed 100% stress testing and is securely sealed for return delivery.
          </p>
        </div>

        {/* 2-Column Split: Invoice + Out for Delivery */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Card 1: Invoice & Warranty Activated */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700 }}>Settlement & Warranty</span>
              </div>
              <span className="badge badge-verified">
                Warranty Activated
              </span>
            </div>

            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Original OEM Battery (86Wh)</span>
                <span style={{ fontWeight: 600 }}>₹3,400</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Precision Thermal Repasting & Labor</span>
                <span style={{ fontWeight: 600 }}>₹1,750</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-light)',
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                <span>Total Paid</span>
                <span style={{ color: 'var(--success)' }}>₹{data.amountPaid.toLocaleString()}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--border-glow)'
            }}>
              <ShieldCheck size={28} color="var(--primary)" />
              <div style={{ fontSize: '0.8rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>6 Months Anti-Tamper Warranty</div>
                <div style={{ color: 'var(--text-muted)' }}>Coverage valid until April 2027. Includes part swap protection.</div>
              </div>
            </div>
          </div>

          {/* Card 2: Out for Delivery & Tamper Seal */}
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} color="var(--cta-orange)" />
                <span style={{ fontWeight: 700 }}>Out for Delivery</span>
              </div>
              <span className="badge badge-orange">
                In Transit
              </span>
            </div>

            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '16px',
              height: '140px'
            }}>
              <img 
                src="/hero_laptop.jpg" 
                alt="Tamper Seal Out for home"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '12px',
                color: '#ffffff'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Security Seal Barcode:</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {data.tamperSealOut}
                  </div>
                </div>
              </div>
            </div>

            {/* Secret OTP Verification Box */}
            <div style={{
              background: 'var(--bg-surface)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px dashed var(--border-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  SECRET DELIVERY OTP (Share only upon unsealing):
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '4px', color: 'var(--primary)' }}>
                  {data.secretOtp}
                </div>
              </div>
              <Lock size={22} color="var(--primary)" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Courier Contact: <strong>{data.courierName}</strong>
          </div>
          <button 
            className="btn-cta"
            onClick={onClose}
          >
            Confirm & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}
