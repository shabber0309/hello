import React from 'react';
import { CreditCard, Wallet, ShieldCheck, CheckCircle2, Clock, RotateCcw, X, ArrowUpRight } from 'lucide-react';

export default function PaymentsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const transactions = [
    { title: 'Repair Payment (Dell Inspiron 15)', amount: '₹1,500', date: 'Today, 02:45 PM', status: 'Payment Authorized (In Escrow)', badge: 'badge-primary' },
    { title: 'Doorstep Tamper Pickup Fee', amount: '₹100', date: 'Today, 09:15 AM', status: 'Payment Released', badge: 'badge-verified' },
    { title: 'Diagnosis Adjustment Refund', amount: '+₹500', date: 'Yesterday', status: 'Refunded', badge: 'badge-verified', isRefund: true }
  ];

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
        maxWidth: '680px',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>ESCROW PROTECTION</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Wallet & Payments</h2>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '18px',
          padding: '24px',
          color: '#ffffff',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Available Escrow Wallet Balance</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
              ₹2,340
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>
              ✓ 100% Protected until you verify laptop pass & unseal device
            </div>
          </div>

          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
            + Add Funds
          </button>
        </div>

        {/* Escrow Workflow States */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
            Payment Escrow Lifecycle:
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            textAlign: 'center',
            fontSize: '0.75rem'
          }}>
            <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: '8px', fontWeight: 600 }}>
              1. Authorized
            </div>
            <div style={{ padding: '10px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 700 }}>
              2. Held in Escrow
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: '8px', fontWeight: 600 }}>
              3. QA Verified
            </div>
            <div style={{ padding: '10px', background: 'var(--bg-card-subtle)', borderRadius: '8px', fontWeight: 600 }}>
              4. Released
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '12px' }}>
            Recent Transactions:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transactions.map((tx, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{tx.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{tx.date}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: tx.isRefund ? 'var(--success)' : 'var(--text-main)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {tx.amount}
                  </div>
                  <span className={`badge ${tx.badge}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px',
          borderRadius: '10px',
          background: 'var(--primary-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-main)'
        }}>
          <ShieldCheck size={18} color="var(--primary)" />
          <span>Payment policy: Funds are released to the technician only after you confirm the repair passed and enter the return OTP.</span>
        </div>
      </div>
    </div>
  );
}
