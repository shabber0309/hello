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
  Laptop
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialRole = 'admin', initialMode = 'login' }) {
  const { user, login, register, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(initialRole); // 'admin' | 'customer' | 'technician'
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

  // If already authenticated, redirect to respective portal
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'technician') navigate('/technician', { replace: true });
      else navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Login state (empty by default so user can type or choose quick fill)
  const [identifier, setIdentifier] = useState('shabber');
  const [password, setPassword] = useState('123123123');
  const [showPassword, setShowPassword] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('customer');

  // Forgot password state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotDevOtp, setForgotDevOtp] = useState('');

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Portal metadata inspired by E-Commerce project
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
    setError('');
    setSuccessMsg('');
    if (selectedRole === 'admin') {
      setIdentifier('shabber');
      setPassword('123123123');
    } else {
      setIdentifier('');
      setPassword('');
    }
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
      if (u?.role === 'admin') navigate('/admin');
      else if (u?.role === 'technician') navigate('/technician');
      else navigate('/dashboard');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setError('Name, email, and password are required');
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
      setError('Please provide your email or username');
      return;
    }
    setLoading(true);
    setError('');

    const res = await forgotPassword(forgotIdentifier.trim());
    setLoading(false);
    if (res.success) {
      setForgotStep(2);
      setSuccessMsg(`Verification code sent to ${res.data?.email || forgotIdentifier}`);
      if (res.data?.dev_otp) {
        setForgotDevOtp(res.data.dev_otp);
      }
    } else {
      setError(res.error || 'Account not found');
    }
  };

  const handleResetSubmit = async (e) => {
    e?.preventDefault();
    if (!forgotOtp.trim() || !forgotNewPassword) {
      setError('OTP and new password are required');
      return;
    }
    setLoading(true);
    setError('');

    const res = await resetPassword(forgotIdentifier.trim(), forgotOtp.trim(), forgotNewPassword);
    setLoading(false);
    if (res.success) {
      setSuccessMsg('Password updated! You can now sign in.');
      setMode('login');
      setPassword(forgotNewPassword);
      setIdentifier(forgotIdentifier);
    } else {
      setError(res.error || 'Invalid or expired OTP code');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
        filter: 'blur(80px)',
        opacity: 0.25,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Auth Card Container */}
      <div 
        className="glass-panel" 
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '38px 34px 30px',
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.85), 0 0 50px -10px var(--primary-glow)',
          border: '1px solid var(--border-light)',
          zIndex: 1
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

        {/* Portal Role Switcher Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card-subtle)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '24px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            style={{
              flex: 1,
              padding: '9px 6px',
              borderRadius: '8px',
              background: role === 'admin' ? '#10b981' : 'transparent',
              color: role === 'admin' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 800,
              fontSize: '0.8rem',
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

          <button
            type="button"
            onClick={() => handleRoleSelect('customer')}
            style={{
              flex: 1,
              padding: '9px 6px',
              borderRadius: '8px',
              background: role === 'customer' ? 'var(--primary)' : 'transparent',
              color: role === 'customer' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
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
            onClick={() => handleRoleSelect('technician')}
            style={{
              flex: 1,
              padding: '9px 6px',
              borderRadius: '8px',
              background: role === 'technician' ? 'var(--cta-orange)' : 'transparent',
              color: role === 'technician' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.8rem',
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
            {mode === 'register' && 'Enter your details below to join FixConnect'}
            {mode === 'forgot' && 'Enter your username or email for OTP password recovery'}
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
            <AlertCircle size={15} flexShrink={0} />
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
            <CheckCircle2 size={15} flexShrink={0} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Mode: Login */}
        {mode === 'login' && (
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
                  placeholder={role === 'admin' ? 'shabber or shabberhussain934@gmail.com' : 'Enter username or email'}
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
                
                {/* Password Show/Hide Toggle */}
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
                  placeholder="e.g. Shabber Hussain"
                  style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
                />
                <User size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="shabber"
                  style={{ width: '100%', padding: '0 12px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
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
                  placeholder="shabberhussain934@gmail.com"
                  style={{ width: '100%', paddingLeft: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
                />
                <Mail size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password"
                  style={{ width: '100%', paddingLeft: '36px', paddingRight: '36px', height: '40px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                  required
                />
                <Lock size={15} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

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
                Technician
              </button>
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

        {/* Mode: Forgot Password */}
        {mode === 'forgot' && (
          <div>
            {forgotStep === 1 ? (
              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Email or Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="shabber or shabberhussain934@gmail.com"
                      style={{ width: '100%', paddingLeft: '38px', height: '42px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                      required
                    />
                    <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
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
              <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {forgotDevOtp && (
                  <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#60a5fa' }}>
                    Development OTP: <strong>{forgotDevOtp}</strong> (or master <strong>123456</strong>)
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="123456"
                    style={{ width: '100%', padding: '0 14px', height: '42px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '4px', textAlign: 'center' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={{ width: '100%', padding: '0 14px', height: '42px', borderRadius: '10px', background: 'var(--bg-input)', border: '1px solid var(--border-light)', color: 'var(--text-main)', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-cta"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px', borderRadius: '10px', fontWeight: 700 }}
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
                onClick={() => { navigate('/login'); setError(''); setSuccessMsg(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Sign In to Account &rarr;
              </button>
            </p>
          )}

          {/* Quick preset chips */}
          <div style={{
            paddingTop: '12px',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700 }}>Quick Fill:</span>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              👑 Admin (Shabber)
            </button>
          </div>

          {/* SSL Trust Footer */}
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
