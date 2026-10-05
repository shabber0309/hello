import React, { useState, useEffect, useMemo } from 'react';
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
import { 
  EMAIL_REGEX, 
  PHONE_REGEX, 
  PASSWORD_REGEX, 
  getPasswordValidationState, 
  sanitizeDigits, 
  validatePhone, 
  validateEmail, 
  scrollToFirstError 
} from '../../utils/validation';
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
  const [formFieldErrors, setFormFieldErrors] = useState({});

  const regPwValidation = useMemo(() => getPasswordValidationState(regPassword), [regPassword]);
  const forgotPwValidation = useMemo(() => getPasswordValidationState(forgotNewPassword), [forgotNewPassword]);

  const clearFormFieldError = (field) => {
    setFormFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

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
    const errors = {};
    if (!identifier.trim()) {
      errors.identifier = 'Please enter your email or phone number';
    }
    if (!password) {
      errors.password = 'Please enter your account password';
    }
    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors, {
        identifier: 'field-identifier',
        password: 'field-password'
      }), 50);
      return;
    }

    setFormFieldErrors({});
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await login(identifier.trim(), password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    } else {
      const u = res.user;
      if (u?.role === 'technician') navigate('/technician');
      else if (u?.role === 'admin') navigate('/admin');
      else {
        const dest = location.state?.from || '/dashboard';
        navigate(dest);
      }
    }
  };

  const handleSendLoginOtp = async (e) => {
    e?.preventDefault();
    const emailResult = validateEmail(otpEmail);
    if (!emailResult.isValid) {
      const errors = { otpEmail: emailResult.error };
      setFormFieldErrors(errors);
      setTimeout(() => scrollToFirstError(errors, { otpEmail: 'field-otpEmail' }), 50);
      return;
    }
    setFormFieldErrors({});
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
    const cleanOtp = sanitizeDigits(otpCode, 6);
    if (!cleanOtp) {
      const errors = { otpCode: 'Please enter the 6-digit verification code' };
      setFormFieldErrors(errors);
      setTimeout(() => scrollToFirstError(errors, { otpCode: 'field-otpCode' }), 50);
      return;
    } else if (cleanOtp.length !== 6) {
      const errors = { otpCode: 'Verification code must be exactly 6 digits' };
      setFormFieldErrors(errors);
      setTimeout(() => scrollToFirstError(errors, { otpCode: 'field-otpCode' }), 50);
      return;
    }
    setFormFieldErrors({});
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await loginWithOtp(otpEmail.trim(), cleanOtp);
    setLoading(false);
    if (res.success) {
      const u = res.user;
      if (u?.role === 'technician') navigate('/technician');
      else if (u?.role === 'admin') navigate('/admin');
      else {
        const dest = location.state?.from || '/dashboard';
        navigate(dest);
      }
    } else {
      setError(res.error || 'Invalid or expired OTP code');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e?.preventDefault();
    const errors = {};

    // 1. Name validation
    const nameClean = regName.trim();
    if (!nameClean) {
      errors.regName = 'Please enter your full name';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(nameClean)) {
      errors.regName = 'Name must contain only letters and spaces (min 2 characters)';
    }

    // 2. Email validation (RFC regex)
    const emailResult = validateEmail(regEmail);
    if (!emailResult.isValid) {
      errors.regEmail = emailResult.error;
    }

    // 3. Phone validation (Indian 10-digits starting with 6,7,8,9)
    const phoneResult = validatePhone(regPhone);
    if (!phoneResult.isValid) {
      errors.regPhone = phoneResult.error;
    }

    // 4. Strict Password Validation:
    // 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passResult = getPasswordValidationState(regPassword);
    if (!passResult.isValid) {
      errors.regPassword = passResult.errorMessage;
    }

    // 5. Confirm Password matching
    if (!regConfirmPassword) {
      errors.regConfirmPassword = 'Please confirm your password';
    } else if (regPassword !== regConfirmPassword) {
      errors.regConfirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors, {
        regName: 'field-regName',
        regEmail: 'field-regEmail',
        regPhone: 'field-regPhone',
        regPassword: 'field-regPassword',
        regConfirmPassword: 'field-regConfirmPassword'
      }), 50);
      return;
    }

    setFormFieldErrors({});
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await register({
      name: nameClean,
      email: regEmail.trim(),
      phone: sanitizeDigits(regPhone, 10),
      password: regPassword,
      role: regRole || 'customer'
    });

    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Registration failed');
    } else {
      const u = res.user;
      if (u?.role === 'technician') navigate('/technician');
      else if (u?.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    }
  };

  const handleRequestOtp = async (e) => {
    e?.preventDefault();
    if (!forgotIdentifier.trim()) {
      const errors = { forgotIdentifier: 'Please provide your registered email or phone number' };
      setFormFieldErrors(errors);
      setTimeout(() => scrollToFirstError(errors, { forgotIdentifier: 'field-forgotIdentifier' }), 50);
      return;
    }
    setFormFieldErrors({});
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
      setError(res.error || 'Account not found. Please verify your email or phone number.');
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
    const cleanOtp = sanitizeDigits(forgotOtp, 6);
    if (!cleanOtp) {
      errors.forgotOtp = 'Please enter the 6-digit OTP code';
    } else if (cleanOtp.length !== 6) {
      errors.forgotOtp = 'OTP code must be exactly 6 digits';
    }

    const passResult = getPasswordValidationState(forgotNewPassword);
    if (!passResult.isValid) {
      errors.forgotNewPassword = passResult.errorMessage;
    }

    if (!forgotConfirmPassword) {
      errors.forgotConfirmPassword = 'Please confirm your new password';
    } else if (forgotNewPassword !== forgotConfirmPassword) {
      errors.forgotConfirmPassword = 'New password and confirmation do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors, {
        forgotOtp: 'field-forgotOtp',
        forgotNewPassword: 'field-forgotNewPassword',
        forgotConfirmPassword: 'field-forgotConfirmPassword'
      }), 50);
      return;
    }

    setFormFieldErrors({});
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await resetPassword(forgotIdentifier.trim(), cleanOtp, forgotNewPassword);
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
        <div 
          className="auth-top-stripe" 
          style={{ 
            background: mode === 'login' 
              ? 'linear-gradient(90deg, #2563eb, #38bdf8, #60a5fa)' 
              : (mode === 'register' 
                ? 'linear-gradient(90deg, #0284c7, #06b6d4, #10b981)' 
                : 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef)') 
          }} 
        />

        {/* Current Active Session Indicator */}
        {user && (
          <div className="auth-session-bar">
            <div>
              Signed in as: <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong> ({user.role})
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  if (user.role === 'technician') navigate('/technician');
                  else if (user.role === 'admin') navigate('/admin');
                  else navigate('/dashboard');
                }}
                className="btn-primary"
                style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '6px' }}
              >
                Dashboard
              </button>
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
          </div>
        )}

        {/* Auth Header with Icon Wrap */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '16px',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: mode === 'login'
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.18) 0%, rgba(30, 64, 175, 0.3) 100%)'
              : (mode === 'register'
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.18) 0%, rgba(16, 185, 129, 0.25) 100%)'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(139, 92, 246, 0.3) 100%)'),
            border: `1px solid ${mode === 'login' ? 'rgba(37, 99, 235, 0.35)' : (mode === 'register' ? 'rgba(2, 132, 199, 0.35)' : 'rgba(99, 102, 241, 0.35)')}`,
            boxShadow: '0 8px 20px -4px rgba(0,0,0,0.3)'
          }}>
            {mode === 'login' && <Lock size={28} color="#3b82f6" />}
            {mode === 'register' && <UserCheck size={28} color="#0284c7" />}
            {mode === 'forgot' && <KeyRound size={28} color="#6366f1" />}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em', color: 'var(--text-main, #ffffff)' }}>
            {mode === 'login' && 'Sign In'}
            {mode === 'register' && 'Create Free Account'}
            {mode === 'forgot' && 'Reset Account Password'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' && 'Enter your credentials to access your dashboard'}
            {mode === 'register' && 'Join Live Fix for live-camera verified hardware and software service'}
            {mode === 'forgot' && 'Enter your registered email or phone to reset your password'}
          </p>
        </div>

        {/* Dedicated Sign In / Register Tab Bar */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-surface-elevated, rgba(15, 23, 42, 0.5))',
          border: '1.5px solid var(--border-light, rgba(255,255,255,0.1))',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '20px',
          gap: '4px'
        }}>
          <button
            type="button"
            onClick={() => {
              navigate('/login');
              setMode('login');
              setError('');
              setFormFieldErrors({});
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'login' ? 'var(--primary, #2563eb)' : 'transparent',
              color: mode === 'login' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Lock size={15} />
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/register');
              setMode('register');
              setError('');
              setFormFieldErrors({});
            }}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: '8px',
              fontSize: '0.86rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: mode === 'register' ? 'var(--primary, #2563eb)' : 'transparent',
              color: mode === 'register' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <UserCheck size={15} />
            Create Account
          </button>
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
              <form onSubmit={handleLoginSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Email Address or Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="field-identifier"
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
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                        border: formFieldErrors.identifier ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                        boxShadow: formFieldErrors.identifier ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                      autoFocus
                    />
                    <Mail size={16} color={formFieldErrors.identifier ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '14px' }} />
                  </div>
                  {formFieldErrors.identifier && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.identifier}
                    </span>
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
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
                      id="field-password"
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
                        height: '44px',
                        borderRadius: '10px',
                        background: 'var(--bg-input, rgba(15, 23, 42, 0.5))',
                        border: formFieldErrors.password ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                        boxShadow: formFieldErrors.password ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.88rem'
                      }}
                    />
                    <Lock size={16} color={formFieldErrors.password ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '14px' }} />
                    
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
                  {formFieldErrors.password && (
                    <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.password}
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
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Sign In Flow */
              <div>
                {otpStep === 1 ? (
                  <form onSubmit={handleSendLoginOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Your Email Address
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="field-otpEmail"
                          type="email"
                          value={otpEmail}
                          onChange={(e) => {
                            clearFormFieldError('otpEmail');
                            setOtpEmail(e.target.value);
                          }}
                          placeholder="e.g. yourname@example.com"
                          style={{
                            width: '100%',
                            paddingLeft: '38px',
                            height: '44px',
                            borderRadius: '10px',
                            background: 'var(--bg-input)',
                            border: formFieldErrors.otpEmail ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                            boxShadow: formFieldErrors.otpEmail ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                            color: 'var(--text-main)',
                            fontSize: '0.88rem'
                          }}
                          autoFocus
                        />
                        <Mail size={16} color={formFieldErrors.otpEmail ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '14px' }} />
                      </div>
                      {formFieldErrors.otpEmail && (
                        <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <AlertCircle size={13} /> {formFieldErrors.otpEmail}
                        </span>
                      )}
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
                  <form onSubmit={handleVerifyLoginOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {otpDevCode && (
                      <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.78rem', color: '#60a5fa' }}>
                        Security OTP: <strong>{otpDevCode}</strong> (or master <strong>123456</strong>)
                      </div>
                    )}

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                          Enter 6-Digit Code
                        </label>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                          Sent to {otpEmail}
                        </span>
                      </div>
                      <input
                        id="field-otpCode"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => {
                          clearFormFieldError('otpCode');
                          setOtpCode(sanitizeDigits(e.target.value, 6));
                        }}
                        placeholder="••••••"
                        style={{
                          width: '100%',
                          padding: '0 14px',
                          height: '46px',
                          borderRadius: '10px',
                          background: 'var(--bg-input)',
                          border: formFieldErrors.otpCode ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                          boxShadow: formFieldErrors.otpCode ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                          color: '#38bdf8',
                          fontSize: '1.25rem',
                          letterSpacing: '8px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontWeight: 700
                        }}
                        autoFocus
                      />
                      {formFieldErrors.otpCode && (
                        <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                          <AlertCircle size={13} /> {formFieldErrors.otpCode}
                        </span>
                      )}
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
          <form onSubmit={handleRegisterSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Account Type Selector */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Account Type
              </label>
              <div className="auth-segmented-role-bar">
                <button
                  type="button"
                  onClick={() => setRegRole('customer')}
                  className={`auth-segmented-role-btn ${regRole === 'customer' ? 'active-customer' : ''}`}
                >
                  <UserCheck size={16} />
                  <span>Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('technician')}
                  className={`auth-segmented-role-btn ${regRole === 'technician' ? 'active-technician' : ''}`}
                >
                  <Wrench size={16} />
                  <span>Technician</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRegRole('admin')}
                  className={`auth-segmented-role-btn ${regRole === 'admin' ? 'active-admin' : ''}`}
                >
                  <ShieldCheck size={16} />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="field-regName"
                  type="text"
                  value={regName}
                  onChange={(e) => {
                    clearFormFieldError('regName');
                    setRegName(e.target.value);
                  }}
                  placeholder="e.g. Alex Morgan"
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
                  autoFocus
                />
                <User size={15} color={formFieldErrors.regName ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
              {formFieldErrors.regName && (
                <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} /> {formFieldErrors.regName}
                </span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="field-regEmail"
                  type="email"
                  value={regEmail}
                  onChange={(e) => {
                    clearFormFieldError('regEmail');
                    setRegEmail(e.target.value);
                  }}
                  placeholder="alex@example.com"
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
                <Mail size={15} color={formFieldErrors.regEmail ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
              </div>
              {formFieldErrors.regEmail && (
                <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} /> {formFieldErrors.regEmail}
                </span>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Phone Number (10 Digits, starts with 6-9)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="field-regPhone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={regPhone}
                  onChange={(e) => {
                    clearFormFieldError('regPhone');
                    setRegPhone(sanitizeDigits(e.target.value, 10));
                  }}
                  placeholder="e.g. 9876543210"
                  style={{
                    width: '100%',
                    paddingLeft: '32px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--bg-input)',
                    border: formFieldErrors.regPhone ? '1.5px solid #ef4444' : '1px solid var(--border-light)',
                    boxShadow: formFieldErrors.regPhone ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Phone size={14} color={formFieldErrors.regPhone ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '10px', top: '13px' }} />
              </div>
              {formFieldErrors.regPhone && (
                <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} /> {formFieldErrors.regPhone}
                </span>
              )}
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0 }}>
                  Password
                </label>
                {regPassword && regPassword.length < 8 && (
                  <span style={{ fontSize: '0.72rem', color: '#f87171' }}>Minimum 8 characters</span>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="field-regPassword"
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
                <Lock size={15} color={formFieldErrors.regPassword ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showRegPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Live Password Rules Breakdown */}
              {regPassword.length > 0 && (
                <div style={{ marginTop: '6px', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.45)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>
                    Password Requirements:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.71rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPwValidation.rules.minLength ? '#10b981' : '#ef4444' }}>
                      {regPwValidation.rules.minLength ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                      8+ Characters
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPwValidation.rules.hasUpper ? '#10b981' : '#ef4444' }}>
                      {regPwValidation.rules.hasUpper ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                      1 Uppercase (A-Z)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPwValidation.rules.hasLower ? '#10b981' : '#ef4444' }}>
                      {regPwValidation.rules.hasLower ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                      1 Lowercase (a-z)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPwValidation.rules.hasNumber ? '#10b981' : '#ef4444' }}>
                      {regPwValidation.rules.hasNumber ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                      1 Number (0-9)
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: regPwValidation.rules.hasSpecial ? '#10b981' : '#ef4444', gridColumn: 'span 2' }}>
                      {regPwValidation.rules.hasSpecial ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                      1 Special Char (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}

              {formFieldErrors.regPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} /> {formFieldErrors.regPassword}
                </span>
              )}
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
                  id="field-regConfirmPassword"
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
                    border: formFieldErrors.regConfirmPassword ? '1.5px solid #ef4444' : `1px solid ${regConfirmPassword ? (regPassword === regConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}`,
                    boxShadow: formFieldErrors.regConfirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <Lock size={15} color={formFieldErrors.regConfirmPassword ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                  {showRegConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formFieldErrors.regConfirmPassword && (
                <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                  <AlertCircle size={13} /> {formFieldErrors.regConfirmPassword}
                </span>
              )}
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
              <form onSubmit={handleRequestOtp} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Registered Email or Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="field-forgotIdentifier"
                      type="text"
                      value={forgotIdentifier}
                      onChange={(e) => {
                        clearFormFieldError('forgotIdentifier');
                        setForgotIdentifier(e.target.value);
                      }}
                      placeholder="Enter registered email or phone number"
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
                      autoFocus
                    />
                    <Mail size={16} color={formFieldErrors.forgotIdentifier ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '13px' }} />
                  </div>
                  {formFieldErrors.forgotIdentifier ? (
                    <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.forgotIdentifier}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                      We will send a 6-digit OTP code to the verified email for your account.
                    </span>
                  )}
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
              <form onSubmit={handleResetSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
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
                    id="field-forgotOtp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={forgotOtp}
                    onChange={(e) => {
                      clearFormFieldError('forgotOtp');
                      setForgotOtp(sanitizeDigits(e.target.value, 6));
                    }}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '0 14px',
                      height: '44px',
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
                    <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.forgotOtp}
                    </span>
                  )}
                </div>

                {/* Resend & Edit Email Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => { setForgotStep(1); setError(''); setFormFieldErrors({}); }}
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
                      id="field-forgotNewPassword"
                      type={showForgotNewPassword ? 'text' : 'password'}
                      value={forgotNewPassword}
                      onChange={(e) => {
                        clearFormFieldError('forgotNewPassword');
                        setForgotNewPassword(e.target.value);
                      }}
                      placeholder="Enter new strong password"
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
                    <Lock size={15} color={formFieldErrors.forgotNewPassword ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showForgotNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Live Password Rules Breakdown */}
                  {forgotNewPassword.length > 0 && (
                    <div style={{ marginTop: '6px', padding: '8px 10px', background: 'rgba(15, 23, 42, 0.45)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px' }}>
                        Password Requirements:
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.71rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: forgotPwValidation.rules.minLength ? '#10b981' : '#ef4444' }}>
                          {forgotPwValidation.rules.minLength ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                          8+ Characters
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: forgotPwValidation.rules.hasUpper ? '#10b981' : '#ef4444' }}>
                          {forgotPwValidation.rules.hasUpper ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                          1 Uppercase (A-Z)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: forgotPwValidation.rules.hasLower ? '#10b981' : '#ef4444' }}>
                          {forgotPwValidation.rules.hasLower ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                          1 Lowercase (a-z)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: forgotPwValidation.rules.hasNumber ? '#10b981' : '#ef4444' }}>
                          {forgotPwValidation.rules.hasNumber ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                          1 Number (0-9)
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: forgotPwValidation.rules.hasSpecial ? '#10b981' : '#ef4444', gridColumn: 'span 2' }}>
                          {forgotPwValidation.rules.hasSpecial ? <CheckCircle2 size={12} color="#10b981" /> : <AlertCircle size={12} color="#ef4444" />}
                          1 Special Char (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  )}

                  {formFieldErrors.forgotNewPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.forgotNewPassword}
                    </span>
                  )}
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
                      id="field-forgotConfirmPassword"
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
                        border: formFieldErrors.forgotConfirmPassword ? '1.5px solid #ef4444' : `1px solid ${forgotConfirmPassword ? (forgotNewPassword === forgotConfirmPassword ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)') : 'var(--border-light)'}`,
                        boxShadow: formFieldErrors.forgotConfirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
                        color: 'var(--text-main)',
                        fontSize: '0.85rem'
                      }}
                    />
                    <Lock size={15} color={formFieldErrors.forgotConfirmPassword ? '#ef4444' : 'var(--text-dim)'} style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <button
                      type="button"
                      onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                      style={{ position: 'absolute', right: '10px', top: '11px', background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showForgotConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formFieldErrors.forgotConfirmPassword && (
                    <span style={{ color: '#ef4444', fontSize: '0.76rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                      <AlertCircle size={13} /> {formFieldErrors.forgotConfirmPassword}
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

        {/* Footer Navigation */}
        <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.82rem' }}>
          {mode === 'login' && (
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { navigate('/register'); setError(''); setSuccessMsg(''); setMode('register'); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Create Free Account &rarr;
              </button>
            </p>
          )}

          {mode === 'register' && (
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

          {mode === 'forgot' && (
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)' }}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => { navigate('/login'); setError(''); setSuccessMsg(''); setMode('login'); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              >
                Back to Sign In &rarr;
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
