import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import './Footer.css';

export default function Footer({ onOpenHelp }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="app-footer">
      <div className="container app-footer-inner">
        <div className="app-footer-top d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="app-footer-brand-wrap d-flex align-items-center gap-2">
            <span 
              onClick={() => navigate('/')} 
              className="app-footer-brand-title"
            >
              Live<span className="app-footer-brand-accent">Fix</span>
            </span>
            <span className="app-footer-tagline">Laptop Repair, Without the Guesswork.</span>
          </div>

          <nav className="app-footer-nav d-flex align-items-center flex-wrap gap-3" aria-label="Footer Navigation">
            <span className="app-footer-nav-link" onClick={() => navigate('/how-it-works')}>How It Works</span>
            <span className="app-footer-nav-link" onClick={() => navigate('/services')}>Services</span>
            <span className="app-footer-nav-link" onClick={() => navigate('/for-technicians')}>For Technicians</span>
            <span className="app-footer-nav-link" onClick={() => navigate('/pricing')}>Pricing</span>
            <span className="app-footer-nav-link" onClick={() => navigate('/track-repair')}>Track Repair</span>
            {user?.role === 'admin' && (
              <span className="app-footer-nav-link admin-link" onClick={() => navigate('/admin')}>
                Admin Console
              </span>
            )}
            {onOpenHelp && (
              <span className="app-footer-nav-link" onClick={onOpenHelp}>Help & Support</span>
            )}
          </nav>
        </div>

        <div className="app-footer-bottom d-flex justify-content-between align-items-center flex-wrap gap-2 pt-3 border-top border-light">
          <span className="app-footer-copy small text-muted">© 2026 Live Fix. All rights reserved.</span>
          <div className="app-footer-badges d-flex align-items-center flex-wrap gap-2 small text-muted">
            <span className="badge bg-primary-subtle text-primary">Verified Technician</span>
            <span className="app-footer-arrow">➔</span>
            <span className="badge bg-info-subtle text-info">Secure Pickup</span>
            <span className="app-footer-arrow">➔</span>
            <span className="badge bg-warning-subtle text-warning">Live Transparent Repair</span>
            <span className="app-footer-arrow">➔</span>
            <span className="badge bg-success-subtle text-success">Quality-Certified Return</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
