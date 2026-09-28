import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, X, MessageSquare, Phone } from 'lucide-react';

export default function HelpSupportModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('before');

  if (!isOpen) return null;

  const faqs = {
    before: [
      { q: 'How does FixConnect work?', a: 'You submit a repair request with your laptop model and target budget. Nearby verified technicians submit competitive offers. You choose your technician, your laptop is collected in a serialized tamper bag, repaired live on camera, and returned to your doorstep.' },
      { q: 'How are technicians verified?', a: 'Every technician undergoes government ID verification, workshop tool inspection (ESD protection, 100x microscope, oscilloscope), and must hold certified hardware credentials (IPC-7711 or Level-4 BGA).' },
      { q: 'How are prices decided?', a: 'You set your target price range. Technicians can accept your budget or send counter-offers. You compare offers based on price, reviews, distance, and completion time before paying anything.' }
    ],
    during: [
      { q: 'How do I join the live repair session?', a: 'Once the technician unseals your tamper bag on camera, click "Watch Live Repair" from your dashboard or tracking link to join via our integrated Google Meet video stream.' },
      { q: 'What happens if another issue is found?', a: 'No work is done without your approval. The technician will show the damaged part live on video, submit an updated quote, and wait for your digital approval before proceeding.' },
      { q: 'What happens if the tamper seal is damaged?', a: 'All serialized seals are verified on camera before opening. If a seal is broken during courier transit, FixConnect provides immediate 100% insurance and investigation.' }
    ],
    after: [
      { q: 'How do I get my repair report?', a: 'Upon repair completion and quality testing, a downloadable PDF Repair Report with tests checklist and technician notes is available in your dashboard.' },
      { q: 'What if my laptop still has the problem?', a: 'All repairs include our 6-Month Comprehensive Warranty. If the issue persists, we arrange a free doorstep pickup and re-service at zero cost.' },
      { q: 'How do I request support?', a: 'Our 24/7 dedicated support team is available via live chat, WhatsApp, or phone assistance for any questions.' }
    ],
    payments: [
      { q: 'How do payments work?', a: 'Your payment is held in safe escrow when you accept a quote. Funds are only released to the technician after your laptop passes quality check and you unseal it at delivery.' },
      { q: 'How do refunds work?', a: 'If a repair cannot be completed or is rejected before parts are purchased, your payment is refunded immediately back to your original source.' },
      { q: 'What happens if a repair is cancelled?', a: 'You can cancel free of charge anytime before the courier collects your device.' }
    ]
  };

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <HelpCircle size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>FixConnect Help Center</h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Frequently asked questions & live support</div>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '24px'
        }}>
          {[
            { id: 'before', label: 'Before Repair' },
            { id: 'during', label: 'During Repair' },
            { id: 'after', label: 'After Repair' },
            { id: 'payments', label: 'Payments' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
              style={{
                padding: '8px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeCategory === cat.id ? 'var(--primary)' : 'var(--bg-card-subtle)',
                color: activeCategory === cat.id ? '#ffffff' : 'var(--text-muted)',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
          {faqs[activeCategory].map((faq, idx) => (
            <div 
              key={idx}
              style={{
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                overflow: 'hidden',
                background: 'var(--bg-card-subtle)'
              }}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'transparent',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textAlign: 'left'
                }}
              >
                <span>{faq.q}</span>
                {openIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {openIndex === idx && (
                <div style={{ padding: '0 16px 14px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          borderRadius: '12px',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-light)'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Need immediate assistance?</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Talk to our hardware support engineers</div>
          </div>
          <button className="btn-primary" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            <Phone size={14} /> +91 800-FIX-CONNECT
          </button>
        </div>
      </div>
    </div>
  );
}
