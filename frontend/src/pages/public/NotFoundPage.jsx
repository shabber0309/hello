import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Home, LogIn } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="livefix-notfound-container">
      <div className="livefix-notfound-card">
        <div className="livefix-notfound-badge">
          <AlertCircle size={15} />
          <span>Error 404 - Not Found</span>
        </div>

        <div className="livefix-notfound-code">404</div>

        <h1 className="livefix-notfound-title">Page Not Found</h1>

        <p className="livefix-notfound-desc">
          The link you entered is not recognized or does not exist on this platform.
          Your browser is currently staying on this URL as requested.
        </p>

        <div className="livefix-notfound-path-box">
          <span className="livefix-notfound-path-label">Requested URL:</span>
          <span className="livefix-notfound-path-val">{location.pathname}</span>
        </div>

        <div className="livefix-notfound-actions">
          <button 
            type="button"
            className="livefix-notfound-btn livefix-notfound-btn-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <button 
            type="button"
            className="livefix-notfound-btn livefix-notfound-btn-primary"
            onClick={() => navigate('/')}
          >
            <Home size={16} />
            <span>Return to Home</span>
          </button>

          <button 
            type="button"
            className="livefix-notfound-btn livefix-notfound-btn-secondary"
            onClick={() => navigate('/login')}
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
}
