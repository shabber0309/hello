import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Wrench, 
  UserCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Shield, 
  Sparkles,
  Laptop,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

export default function AuthPage({ initialRole = 'customer', initialMode = 'login' }) {
  const { user, login, register, forgotPassword, resetPassword, sendOtp, loginWithOtp, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestedRole = location.state?.role || initialRole || 'customer';
  const [role, setRole] = useState(requestedRole); // 'customer' | 'technician' | 'admin'
  const [mode, setMode] = useState(
    location.pathname === '/register' ? 'register' : initialMode
  ); // 'login' | 'register' | 'forgot'

  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  // Login form state
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Login state
  const [otpEmail, setOtpEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1 = enter email, 2 = enter code
  const [otpDevCode, setOtpDevCode] = useState('');
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [regRole, setRegRole] = useState('customer');

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotDevOtp, setForgotDevOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Countdown timers for OTP resend
  useEffect(() => {
    let interval = null;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  useEffect(() => {
    let interval = null;
    if (otpCooldown > 0) {
      interval = setInterval(() => {
        setOtpCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpCooldown]);

  // Portal metadata styling
  const roleMeta = {
    admin: {
      title: 'Administrator Console',
      badgeText: 'Admin Portal',
      subtitle: 'Full database control, user management, and order audits',
      badgeBg: 'rgba(16, 185, 129, 0.12)',
      badgeBorder: 'rgba(16, 185, 129, 0.3)',
      badgeColor: '#10b981',
      dotColor: '#059669',
      iconWrapBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(5, 150, 105, 0.3) 100%)',
      topStripe: 'linear-gradient(90deg, #059669, #10b981, #34d399)',
      icon: <Shield size={28} color="#10b981" />
    },
    customer: {
      title: 'Customer Portal',
      badgeText: 'Customer Portal',
      subtitle: 'Manage repair requests, monitor live bench streams & escrow',
      badgeBg: 'rgba(37, 99, 235, 0.12)',
      badgeBorder: 'rgba(37, 99, 235, 0.3)',
      badgeColor: '#3b82f6',
      dotColor: '#2563eb',
      iconWrapBg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(30, 64, 175, 0.3) 100%)',
      topStripe: 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)',
      icon: <UserCheck size={28} color="#3b82f6" />
    },
    technician: {
      title: 'Technician Workbench',
      badgeText: 'Technician Portal',
      subtitle: 'Diagnostics bench, microscope streaming, and part logs',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeBorder: 'rgba(234, 88, 12, 0.3)',
      badgeColor: '#f97316',
      dotColor: '#ea580c',
      iconWrapBg: 'linear-gradient(135deg, rgba(234, 88, 12, 0.18) 0%, rgba(194, 65, 12, 0.3) 100%)',
      topStripe: 'linear-gradient(90deg, #ea580c, #f97316, #fb923c)',
      icon: <Wrench size={28} color="#f97316" />
    }
  }[role];

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setRegRole(selectedRole);
    setError('');
    setSuccessMsg('');
  };

  const handleLoginSubmit = async (e) => {
    e?.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Username/Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await login(identifier.trim(), password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    } else {
      const u = res.user;
      if (u?.role === 'customer') navigate('/dashboard');
      else if (u?.role === 'technician') navigate('/technician');
      else if (u?.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };

  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    if (!otpEmail.trim() || !otpEmail.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await sendOtp(otpEmail.trim(), role);
    setLoading(false);
    if (res.success) {
      setOtpStep(2);
      setOtpCooldown(60);
      setSuccessMsg(`Sign-in verification code sent to ${otpEmail.trim()}`);
      if (res.data?.dev_otp) {
        setOtpDevCode(res.data.dev_otp);
      }
    } else {
      setError(res.error || 'Failed to send OTP code');
    }
  };

  const handleVerifyLoginOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await loginWithOtp(otpEmail.trim(), otpCode.trim(), role);
    setLoading(false);
    if (res.success) {
      const u = res.user;
      if (u?.role === 'customer') navigate('/dashboard');
      else if (u?.role === 'technician') navigate('/technician');
      else if (u?.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      setError(res.error || 'Invalid or expired OTP code');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Name, email, and password are required');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (!regConfirmPassword) {
      setError('Please confirm your password');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await register({
      name: regName.trim(),
      username: regUsername.trim() || regEmail.split('@')[0],
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      role: regRole
    });

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed');
    } else {
      const u = res.user;
      if (u?.role === 'admin') navigate('/admin');
      else if (u?.role === 'technician') navigate('/technician');
      else navigate('/dashboard');
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!forgotIdentifier.trim()) {
      setError('Please provide your registered email or username');
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
      setSuccessMsg(`Password reset verification code sent to ${res.data?.email || forgotIdentifier}`);
      if (res.data?.dev_otp) {
        setForgotDevOtp(res.data.dev_otp);
      }
    } else {
      setError(res.error || 'Account not found. Please verify your email or username.');
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
    if (!forgotOtp.trim()) {
      setError('Please enter the 6-digit OTP code');
      return;
    }
    if (!forgotNewPassword) {
      setError('Please enter a new password');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (!forgotConfirmPassword) {
      setError('Please confirm your new password');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await resetPassword(forgotIdentifier.trim(), forgotOtp.trim(), forgotNewPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password updated successfully! You can now sign in with your new credentials.');
      setMode('login');
      setLoginMethod('password');
      setPassword(forgotNewPassword);
      setIdentifier(forgotIdentifier);
      setForgotStep(1);
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } else {
      setError(res.error || 'Invalid or expired OTP code');
    }
  };

  return (
    <div className="auth-page-root">
      {/* Background glow effects */}
      <div className="auth-bg-glow" />

      {/* Auth Card Container */}
      <div className="auth-card">
        {/* Top Accent Gradient Stripe */}
        <div className="auth-top-stripe" style={{ background: roleMeta?.topStripe || 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa)' }} />

        {/* Current Active Session Indicator */}
        {user && (
          <div className="auth-session-bar">
            <div>
              Signed in as: <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.role})
            </div>
            <button
              type="button"
              onClick={() => {
                logout();
                handleRoleSelect('customer');
              }}
              className="auth-signout-btn"
            >
              Sign Out
            </button>
          </div>
        )}

        {/* Portal Role Switcher Tabs */}
        <div className="auth-role-tabs">
          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            className={`auth-role-tab-btn ${role === 'customer' ? 'auth-role-tab-customer-active' : ''}`}
          >
            <UserCheck size={14} /> Customer
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('technician')}
            className={`auth-role-tab-btn ${role === 'technician' ? 'auth-role-tab-technician-active' : ''}`}
          >
            <Wrench size={14} /> Technician
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`auth-role-tab-btn ${role === 'admin' ? 'auth-role-tab-admin-active' : ''}`}
          >
            <ShieldCheck size={14} /> Admin
          </button>
        </div>

        {/* Auth Header with Pulsing Badge & Icon Wrap */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 14px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: roleMeta.badgeBg,
              color: roleMeta.badgeColor,
              border: `1px solid ${roleMeta.badgeBorder}`
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: roleMeta.dotColor,
                boxShadow: `0 0 8px ${roleMeta.dotColor}`
              }} />
              {roleMeta.badgeText}
            </span>
          </div>

          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: roleMeta.iconWrapBg,
            border: `1px solid ${roleMeta.badgeBorder}`,
            boxShadow: '0 8px 20px -4px rgba(0,0,0,0.3)'
          }}>
            {roleMeta.icon}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            {mode === 'login' && (role === 'admin' ? 'Super Admin Sign In' : 'Welcome Back')}
            {mode === 'register' && 'Create Free Account'}
            {mode === 'forgot' && 'Reset Account Password'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.45 }}>
            {mode === 'login' && roleMeta.subtitle}
            {mode === 'register' && 'Enter your details below to join Live Fix with full hardware transparency'}
            {mode === 'forgot' && 'Enter your registered email or username for secure OTP password recovery'}
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

        {/* Mode: Login */}
        {mode === 'login' && (
          <div>
            {/* Login Method Sub-Toggle: Password vs Email OTP */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-surface-elevated, rgba(15, 23, 42, 0.5))',
              border: '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '3px',
              marginBottom: '16px',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => { setLoginMethod('password'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: loginMethod === 'password' ? 700 : 500,
                  background: loginMethod === 'password' ? 'var(--primary)' : 'transparent',
                  color: loginMethod === 'password' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Lock size={13} /> Password Sign In
              </button>
              <button
                type="button"
                onClick={() => { setLoginMethod('otp'); setError(''); }}
                style={{
                  flex: 1,
                  padding: '7px 10px',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: loginMethod === 'otp' ? 700 : 500,
                  background: loginMethod === 'otp' ? 'var(--primary)' : 'transparent',
                  color: loginMethod === 'otp' ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Mail size={13} /> Email OTP Sign In
              </button>
            </div>

            {loginMethod === 'password' ? (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Username or Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      style={{
                        width: '100%',
                        paddingLeft: '38px',
                        paddingRight: '12px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                      required
                      autoFocus
                    />
                    <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => { setMode('forgot'); setError(''); setSuccessMsg(''); }}
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
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter account password"
                      style={{
                        width: '100%',
                        paddingLeft: '38px',
                        paddingRight: '40px',
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                      required
                    />
                    <Lock size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                    
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '12px',
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
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '13px',
                    fontSize: '0.94rem',
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
                      <span>Sign In as {role === 'admin' ? 'Admin' : (role === 'technician' ? 'Technician' : 'Customer')}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Sign In Flow */
              <div>
                {otpStep === 1 ? (
                  <form onSubmit={handleSendLoginOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Your Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          placeholder="e.g. yourname@example.com"
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            height: '44px',
                            borderRadius: '10px',
                            background: 'var(--bg-input)',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-main)',
                            fontSize: '0.88rem'
                          }}
                          required
                          autoFocus
                        />
                        <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" /> Sending Code via Gmail...
                        </>
                      ) : (
                        <>
                          <span>Send Sign-In OTP Code</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyLoginOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {otpDevCode && (
                      <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#60a5fa' }}>
                        Security OTP: <strong>{otpDevCode}</strong> (or master <strong>123456</strong>)
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                          Enter 6-Digit OTP Code
                        </label>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                          Sent to {otpEmail}
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        placeholder="••••••"
                        style={{
                          width: '100%',
                          padding: '0 14px',
                          height: '46px',
                          borderRadius: '10px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-light)',
                          color: '#38bdf8',
                          fontSize: '1.25rem',
                          letterSpacing: '8px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontWeight: 700
                        }}
                        required
                        autoFocus
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => { setOtpStep(1); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', padding: 0 }}
                      >
                        &larr; Change Email
                      </button>
                      <button
                        type="button"
                        onClick={handleSendLoginOtp}
                        disabled={otpCooldown > 0 || loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: otpCooldown > 0 ? 'var(--text-muted)' : 'var(--primary)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: otpCooldown > 0 ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0
                        }}
                      >
                        <RotateCcw size={12} />
                        {otpCooldown > 0 ? `Resend Code (${otpCooldown}s)` : 'Resend Code'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-cta"
                      style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                    >
                      {loading ? 'Verifying...' : 'Verify OTP & Sign In'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mode: Register */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
                />
                <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Username (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="e.g. alex2026"
                    style={{ width: '100%', paddingLeft: '12px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', paddingLeft: '32px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  />
                  <Phone size={14} color="var(--text-dim)" style={{ position: 'absolute', left: '10px', top: '13px' }} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex@example.com"
                  style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
                />
                <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Password
                </label>
                {regPassword && regPassword.length < 6 && (
                  <span style={{ fontSize: '0.72rem', color: '#f87171' }}>Minimum 6 characters</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password (min 6 characters)"
                  style={{ width: '100%', paddingLeft: '36px', paddingRight: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
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
            </div>

            {/* Confirm Password */}
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
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter password to confirm"
                  style={{
                    width: '100%',
                    paddingLeft: '36px',
                    paddingRight: '36px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: `1px solid ${regConfirmPassword ? (regPassword === regConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}`,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                  required
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
              {loading ? (
                <>
                  <RefreshCw size={15} className="animate-spin" /> Creating Account...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>
        )}

        {/* Mode: Forgot Password */}
        {mode === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Registered Email or Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Enter registered email or username"
                      style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                      required
                      autoFocus
                    />
                    <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                    We will send a 6-digit OTP code directly to your email inbox.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Sending OTP via Gmail...
                    </>
                  ) : (
                    <>
                      <span>Send Recovery OTP Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Forgot Step 2: Enter OTP, New Password, Confirm New Password */
              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                {forgotDevOtp && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#60a5fa' }}>
                    Security OTP: <strong>{forgotDevOtp}</strong> (or master <strong>123456</strong>)
                  </div>
                )}

                {/* OTP Input */}
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
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '0 14px',
                      height: '44px',
                      borderRadius: '10px',
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border-light)',
                      color: '#38bdf8',
                      fontSize: '1.2rem',
                      letterSpacing: '6px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700
                    }}
                    required
                    autoFocus
                  />
                </div>

                {/* Resend & Edit Email Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setError(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.76rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
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

                {/* New Password */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      style={{ width: '100%', paddingLeft: '36px', paddingRight: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      required
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
                </div>

                {/* Confirm New Password */}
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
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      style={{
                        width: '100%',
                        paddingLeft: '36px',
                        paddingRight: '36px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'var(--bg-input)',
                        border: `1px solid ${forgotConfirmPassword ? (forgotNewPassword === forgotConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}`,
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                      required
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

        {/* Footer Navigation */}
        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.82rem' }}>
          {mode === 'login' ? (
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { navigate('/register'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Create Free Account &rarr;
              </button>
            </p>
          ) : (
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { navigate('/login'); setError(''); setSuccessMsg(''); setMode('login'); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign In to Account &rarr;
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
