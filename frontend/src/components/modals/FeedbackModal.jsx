import React, { useState } from 'react';
import { Star, CheckCircle2, X, Send } from 'lucide-react';
import './Modals.css';

export default function FeedbackModal({ isOpen, onClose }) {
  const [overallRating, setOverallRating] = useState(5);
  const [techRating, setTechRating] = useState(5);
  const [transparencyRating, setTransparencyRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const renderStars = (rating, setRating) => {
    return (
      <div style={{ display: 'flex', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            style={{ background: 'transparent', padding: '2px', cursor: 'pointer' }}
          >
            <Star 
              size={20} 
              fill={star <= rating ? '#f59e0b' : 'none'} 
              color={star <= rating ? '#f59e0b' : 'var(--text-dim)'} 
            />
          </button>
        ))}
      </div>
    );
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
        maxWidth: '560px',
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
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '8px' }}>
                COMMUNITY TRUST
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>How Was Your Repair Experience?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                Your feedback helps technicians build their reputation and helps customers choose confidently.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: 'var(--bg-card-subtle)',
                padding: '16px',
                borderRadius: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>How was the technician?</span>
                  {renderStars(techRating, setTechRating)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>How transparent was the repair?</span>
                  {renderStars(transparencyRating, setTransparencyRating)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>How was the pickup & delivery?</span>
                  {renderStars(deliveryRating, setDeliveryRating)}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Overall repair satisfaction?</span>
                  {renderStars(overallRating, setOverallRating)}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Tell us about your experience
                </label>
                <textarea 
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="e.g. Technician showed the repair process live under the microscope..."
                  style={{ width: '100%', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn-cta" style={{ width: '100%', justifyContent: 'center' }}>
                Submit Feedback <Send size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Thank you for your feedback!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '6px' }}>
              Your review has been verified and added to the technician's public profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
