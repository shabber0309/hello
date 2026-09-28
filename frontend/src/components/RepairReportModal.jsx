import React from 'react';
import { FileCheck, CheckCircle2, Download, X, Printer, ShieldCheck, Laptop } from 'lucide-react';

export default function RepairReportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const tests = [
    'Display test',
    'Keyboard test',
    'Touchpad test',
    'Wi-Fi test',
    'Charging test',
    'Battery test'
  ];

  const handleDownload = () => {
    window.print();
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
        maxHeight: '92vh',
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

        {/* Report Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>CERTIFIED QA CERTIFICATE</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Your Repair Report</h2>
          </div>
        </div>

        {/* Device & Diagnostics details */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: '14px',
          padding: '18px',
          border: '1px solid var(--border-light)',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Device:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Dell Inspiron 15</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Problem Reported:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Screen not working</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Diagnosis:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Damaged display cable</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Repair Performed:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Display cable replacement</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Parts Used:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Original OEM Display Cable (SN: FX-CBL-4412)</div>
          </div>
          <div>
            <span style={{ color: 'var(--text-dim)' }}>Technician:</span>
            <div style={{ fontWeight: 700, marginTop: '2px' }}>Ravi Sharma (Senior Specialist)</div>
          </div>
        </div>

        {/* Technician Notes */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Technician Notes:</div>
          <p style={{ color: 'var(--text-muted)' }}>
            "Display connector was damaged. Cable replaced and display tested successfully under 100% brightness and refresh rate cycle. All power rails verified stable."
          </p>
        </div>

        {/* Tests Performed */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '10px' }}>
            Multi-Point Quality Assurance Tests Performed:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {tests.map((t, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card-subtle)',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--text-main)',
                fontWeight: 600
              }}>
                <CheckCircle2 size={15} color="#10b981" />
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: '14px',
          padding: '16px',
          border: '1px solid var(--border-light)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem' }}>
            <span>Labor</span>
            <span style={{ fontWeight: 600 }}>₹800</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem' }}>
            <span>Parts</span>
            <span style={{ fontWeight: 600 }}>₹450</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem' }}>
            <span>Pickup & Return</span>
            <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹100</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-light)',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            <span>Total Settlement</span>
            <span style={{ color: 'var(--primary)' }}>₹1,350</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Includes 6-Month Anti-Tamper Hardware Warranty
          </div>

          <button className="btn-cta" onClick={handleDownload} style={{ fontSize: '0.85rem' }}>
            <Download size={15} /> Download Repair Report
          </button>
        </div>
      </div>
    </div>
  );
}
