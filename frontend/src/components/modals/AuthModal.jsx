import React, { useState } from 'react';
import { 
  X, Mail, Lock, ShieldCheck, Wrench, UserCheck, 
  ArrowRight, CheckCircle2, RefreshCw, KeyRound, AlertCircle, 
  Shield, Eye, EyeOff, User, Phone, Sparkles, HelpCircle, RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, initialRole = 'customer', onSuccess }) {
  const { login, register, forgotPassword, resetPassword } = useAuth();
  
  const [role, setRole] = useState(initialRole); // 'customer' | 'technician' | 'admin'
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  
  // Login form state (initialized clean/empty so no account is logged in by default)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState('customer');

  // Forgot Password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1 = request otp, 2 = enter otp & new pass
  const [forgotDevOtp, setForgotDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formFieldErrors, setFormFieldErrors] = useState({});

  const clearFormFieldError = (field) => {
    setFormFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  React.useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Role metadata styling inspired by E-Commerce project
  const roleMeta = {
    customer: {
      title: 'Customer Portal',
      subtitle: 'Manage your laptop repairs, live streams, and escrow payments',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeBorder: 'rgba(37, 99, 235, 0.3)',
      badgeColor: '#3b82f6',
      dotColor: '#2563eb',
      iconWrapBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(30, 64, 175, 0.25) 100%)',
      topStripe: 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
      icon: <UserCheck size={26} color="#3b82f6" />
    },
    technician: {
      title: 'Technician Portal',
      subtitle: 'Workbench, component diagnostics, micro-soldering & live camera bench',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeBorder: 'rgba(234, 88, 12, 0.3)',
      badgeColor: '#f97316',
      dotColor: '#ea580c',
      iconWrapBg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.15) 0%, rgba(194, 65, 12, 0.25) 100%)',
      topStripe: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)',
      icon: <Wrench size={26} color="#f97316" />
    },
    admin: {
      title: 'Administrator Console',
      subtitle: 'Full database control, user management, order audits & platform security',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      badgeColor: '#10b981',
      dotColor: '#059669',
      iconWrapBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.25) 100%)',
      topStripe: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
      icon: <Shield size={26} color="#10b981" />
    }
  }[role];

  // Role select helper
  const handleFillPreset = (presetRole) => {
    setError('');
    setSuccessMsg('');
    setFormFieldErrors({});
    setRole(presetRole);
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Please enter your email or phone number';
    }
    if (!password) {
      errors.password = 'Please enter your password';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await login(identifier.trim(), password);
    setLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Invalid credentials. Check your email/phone and password.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    const errors = {};
    if (!regName.trim()) {
      errors.regName = 'Please enter your full name';
    }
    if (!regEmail.trim()) {
      errors.regEmail = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errors.regEmail = 'Please enter a valid email address';
    }
    if (!regPassword) {
      errors.regPassword = 'Password is required';
    } else if (regPassword.length < 6) {
      errors.regPassword = 'Password must be at least 6 characters long';
    }
    if (!regConfirmPassword) {
      errors.regConfirmPassword = 'Please confirm your password';
    } else if (regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match. Please verify your confirm password.';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      role: regRole
    });

    setLoading(false);
    if (res.success) {
      if (onSuccess) onSuccess(res.user);
      onClose();
    } else {
      setError(res.error || 'Failed to create account');
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    const errors = {};
    if (!forgotIdentifier.trim()) {
      errors.forgotIdentifier = 'Please provide your registered email or phone number';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await forgotPassword(forgotIdentifier.trim());
    setLoading(false);
    if (res.success) {
      setForgotStep(2);
      setResendCooldown(60);
      setSuccessMsg(`Verification code sent to ${res.data?.email || forgotIdentifier}`);
      if (res.data?.dev_otp) {
        setForgotDevOtp(res.data.dev_otp);
      }
    } else {
      setError(res.error || 'Could not find an account with that email or phone number');
    }
  };

  const handleResendForgotOtp = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    const res = await forgotPassword(forgotIdentifier.trim());
    setLoading(false);
    if (res.success) {
      setResendCooldown(60);
      setSuccessMsg(`New verification code sent to ${res.data?.email || forgotIdentifier}`);
      if (res.data?.dev_otp) {
        setForgotDevOtp(res.data.dev_otp);
      }
    } else {
      setError(res.error || 'Failed to resend code');
    }
  };

  const handleResetSubmit = async (e) => {
    e?.preventDefault();
    const errors = {};
    if (!forgotOtp.trim()) {
      errors.forgotOtp = '6-digit OTP code is required';
    } else if (forgotOtp.trim().length !== 6) {
      errors.forgotOtp = 'Please enter the complete 6-digit OTP code';
    }
    if (!forgotNewPassword) {
      errors.forgotNewPassword = 'New password is required';
    } else if (forgotNewPassword.length < 6) {
      errors.forgotNewPassword = 'New password must be at least 6 characters long';
    }
    if (!forgotConfirmPassword) {
      errors.forgotConfirmPassword = 'Please confirm your new password';
    } else if (forgotNewPassword !== forgotConfirmPassword) {
      errors.forgotConfirmPassword = 'New password and confirmation do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await resetPassword(forgotIdentifier.trim(), forgotOtp.trim(), forgotNewPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password updated successfully! Please sign in with your new password.');
      setMode('login');
      setPassword(forgotNewPassword);
      setIdentifier(forgotIdentifier);
      setForgotStep(1);
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setFormFieldErrors({});
    } else {
      setError(res.error || 'Invalid or expired OTP code');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(3, 7, 18, 0.88)',
      backdropFilter: 'blur(20px)',
      zIndex: 2200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '470px',
          width: '100%',
          padding: '34px 32px 28px',
          position: 'relative',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 45px -10px var(--primary-glow)',
          border: '1px solid var(--border-light)'
        }}
      >
        {/* Top Accent Gradient Stripe (Style rule from E-Commerce project) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: roleMeta.topStripe
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '9px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <X size={16} />
        </button>

        {/* Portal Role Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => { setRole('customer'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              background: role === 'customer' ? 'var(--primary)' : 'transparent',
              color: role === 'customer' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <UserCheck size={14} /> Customer
          </button>

          <button
            type="button"
            onClick={() => { setRole('technician'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              background: role === 'technician' ? 'var(--cta-orange)' : 'transparent',
              color: role === 'technician' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Wrench size={14} /> Technician
          </button>

          <button
            type="button"
            onClick={() => { setRole('admin'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
            style={{
              flex: 1,
              padding: '8px 6px',
              borderRadius: '8px',
              background: role === 'admin' ? '#10b981' : 'transparent',
              color: role === 'admin' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Shield size={14} /> Admin
          </button>
        </div>

        {/* Auth Header with Icon Wrap */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          {/* Icon Wrap */}
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: roleMeta.iconWrapBg,
            border: `1px solid ${roleMeta.badgeBorder}`
          }}>
            {roleMeta.icon}
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
            {mode === 'login' && 'Sign In to Account'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.45 }}>
            {mode === 'login' && roleMeta.subtitle}
            {mode === 'register' && 'Join the transparent laptop repair marketplace'}
            {mode === 'forgot' && 'Enter your registered email or phone number to receive a secure recovery code'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.14)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#f87171',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.14)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#34d399',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            MODE 1: SIGN IN (LOGIN)
           ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Email Address or Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    clearFormFieldError('identifier');
                    setIdentifier(e.target.value);
                  }}
                  placeholder="Enter registered email or phone"
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                    border: formFieldErrors.identifier ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.identifier ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                  autoFocus
                />
                <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
              {formFieldErrors.identifier && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.identifier}
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    fontSize: '0.78rem', 
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    clearFormFieldError('password');
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter account password"
                  style={{
                    width: '100%',
                    paddingLeft: '38px',
                    paddingRight: '40px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                    border: formFieldErrors.password ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
                <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                
                {/* Show/Hide Password Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '11px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {formFieldErrors.password && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.password}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cta"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                marginTop: '4px',
                borderRadius: '10px'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In</span> <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ========================================================
            MODE 2: REGISTER (CREATE ACCOUNT)
           ======================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    clearFormFieldError('regName');
                    setRegName(e.target.value);
                  }}
                  placeholder="e.g. Alex Johnson"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regName ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.regName ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
              {formFieldErrors.regName && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.regName}
                </span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => {
                    clearFormFieldError('regEmail');
                    setRegEmail(e.target.value);
                  }}
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regEmail ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.regEmail ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
              {formFieldErrors.regEmail && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.regEmail}
                </span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Phone Number (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => {
                    clearFormFieldError('regPhone');
                    setRegPhone(e.target.value);
                  }}
                  placeholder="+91 98765 43210"
                  style={{
                    width: '100%',
                    paddingLeft: '34px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regPhone ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.regPhone ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Phone size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '13px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Choose Password
                </label>
                {regPassword && regPassword.length < 6 && (
                  <span style={{ fontSize: '0.72rem', color: '#f87171' }}>Minimum 6 characters</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => {
                    clearFormFieldError('regPassword');
                    setRegPassword(e.target.value);
                  }}
                  placeholder="Create strong password"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regPassword ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.regPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formFieldErrors.regPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.regPassword}
                </span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Confirm Password
                </label>
                {regConfirmPassword && (
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: regPassword === regConfirmPassword ? '#10b981' : '#f87171'
                  }}>
                    {regPassword === regConfirmPassword ? (
                      <>
                        <CheckCircle2 size={12} /> Passwords match
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} /> Passwords do not match
                      </>
                    )}
                  </span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegConfirmPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => {
                    clearFormFieldError('regConfirmPassword');
                    setRegConfirmPassword(e.target.value);
                  }}
                  placeholder="Re-enter password to confirm"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regConfirmPassword 
                      ? '1.5px solid #ef4444' 
                      : (regConfirmPassword ? (regPassword === regConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'),
                    boxShadow: formFieldErrors.regConfirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formFieldErrors.regConfirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.regConfirmPassword}
                </span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Account Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setRegRole('customer')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: regRole === 'customer' ? 'var(--primary)' : 'var(--bg-card-subtle)',
                    color: regRole === 'customer' ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Laptop Owner
                </button>
                <button
                  type="button"
                  onClick={() => setRegRole('technician')}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: regRole === 'technician' ? 'var(--cta-orange)' : 'var(--bg-card-subtle)',
                    color: regRole === 'technician' ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Repair Technician
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '11px',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginTop: '6px',
                borderRadius: '10px'
              }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* ========================================================
            MODE 3: FORGOT / RESET PASSWORD
           ======================================================== */}
        {mode === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Registered Email or Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => {
                        clearFormFieldError('forgotIdentifier');
                        setForgotIdentifier(e.target.value);
                      }}
                      placeholder="Enter registered email or phone"
                      style={{
                        width: '100%',
                        paddingLeft: '38px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'var(--bg-input)',
                        border: formFieldErrors.forgotIdentifier ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                        boxShadow: formFieldErrors.forgotIdentifier ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                    <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                  {formFieldErrors.forgotIdentifier && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.forgotIdentifier}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                >
                  {loading ? 'Sending Code...' : 'Send Recovery OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {forgotDevOtp && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#60a5fa' }}>
                    Security Code: <strong>{forgotDevOtp}</strong> (or master <strong>123456</strong>)
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                      6-Digit OTP Code
                    </label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      Valid for 15 mins
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => {
                      clearFormFieldError('forgotOtp');
                      setForgotOtp(e.target.value);
                    }}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '0 14px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'var(--bg-input)',
                      border: formFieldErrors.forgotOtp ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                      boxShadow: formFieldErrors.forgotOtp ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                      color: '#38bdf8',
                      fontSize: '1.2rem',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700
                    }}
                    autoFocus
                  />
                  {formFieldErrors.forgotOtp && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.forgotOtp}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setError(''); setFormFieldErrors({}); }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.76rem', cursor: 'pointer', padding: 0 }}
                  >
                    &larr; Change Email
                  </button>
                  <button
                    type="button"
                    onClick={handleResendForgotOtp}
                    disabled={resendCooldown > 0 || loading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--primary)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: resendCooldown > 0 ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <RotateCcw size={12} />
                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                  </button>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => {
                        clearFormFieldError('forgotNewPassword');
                        setForgotNewPassword(e.target.value);
                      }}
                      placeholder="Enter new password (min 6 characters)"
                      style={{
                        width: '100%',
                        paddingLeft: '36px',
                        paddingRight: '36px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--bg-input)',
                        border: formFieldErrors.forgotNewPassword ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                        boxShadow: formFieldErrors.forgotNewPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formFieldErrors.forgotNewPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.forgotNewPassword}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                      Confirm New Password
                    </label>
                    {forgotConfirmPassword && (
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: forgotNewPassword === forgotConfirmPassword ? '#10b981' : '#f87171'
                      }}>
                        {forgotNewPassword === forgotConfirmPassword ? (
                          <>
                            <CheckCircle2 size={12} /> Match
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} /> Mismatch
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showForgotConfirmPassword ? 'text' : 'password'}
                      value={forgotConfirmPassword}
                      onChange={(e) => {
                        clearFormFieldError('forgotConfirmPassword');
                        setForgotConfirmPassword(e.target.value);
                      }}
                      placeholder="Confirm new password"
                      style={{
                        width: '100%',
                        paddingLeft: '36px',
                        paddingRight: '36px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--bg-input)',
                        border: formFieldErrors.forgotConfirmPassword 
                          ? '1.5px solid #ef4444' 
                          : (forgotConfirmPassword ? (forgotNewPassword === forgotConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'),
                        boxShadow: formFieldErrors.forgotConfirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showForgotConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formFieldErrors.forgotConfirmPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} style={{ flexShrink: 0 }} /> {formFieldErrors.forgotConfirmPassword}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700, marginTop: '4px' }}
                >
                  {loading ? 'Updating Password...' : 'Save New Password & Sign In'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Navigation (Create Account / Back to Sign In) */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.82rem' }}>
          {mode === 'login' ? (
            <p style={{ margin: '0 0 10px 0', color: 'var(--text-muted)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Create Free Account &rarr;
              </button>
            </p>
          ) : (
            <p style={{ margin: '0 0 10px 0', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg(''); setFormFieldErrors({}); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign In to Account &rarr;
              </button>
            </p>
          )}

          {/* SSL Trust Footer (Styled from E-Commerce project) */}
          <div style={{
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: 'var(--text-dim)'
          }}>
            <ShieldCheck size={13} color="#10b981" />
            <span>End-to-End Encrypted Authentication & Escrow Protection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
