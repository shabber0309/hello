import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  User, 
  ChevronDown,
  Wrench, 
  Laptop, 
  CheckCircle2, 
  Bell, 
  Search, 
  PlusCircle, 
  LogOut, 
  Radio, 
  Layers, 
  MessageSquare, 
  CreditCard, 
  Award,
  Package,
  Database,
  Edit,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenAuthModal, 
  onOpenRequestModal,
  onOpenTrackRepair,
  onOpenTechOnboarding,
  onOpenChainOfCustody,
  onOpenPayments,
  onOpenEditProfile
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();
  const [theme, setTheme] = useState('light');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  const isAdmin = user?.role === 'admin';
  const isTech = user?.role === 'technician';
  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: theme === 'light' ? 'rgba(255, 255, 255, 0.94)' : 'rgba(5, 25, 55, 0.94)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.25)',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 4px 20px rgba(0, 50, 100, 0.12)',
      position: 'sticky',
      transition: 'all 0.25s ease'
    }}>
      {/* Vibrant Rainbow Spectrum Hairline along top of Navbar */}
      <div className="rainbow-strip" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3.5px',
        zIndex: 10
      }} />

      {/* ========================================================
          CASE 1: PUBLIC NAVBAR (When Not Logged In)
         ======================================================== */}
      {!user && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 24px',
          gap: '16px'
        }}>
          {/* Left: Brand Logo with Vibrant Colorful Shield & Glow */}
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00f5a0 0%, #00dfd8 35%, #0070f3 70%, #7928ca 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(0, 112, 243, 0.4), 0 0 10px rgba(0, 223, 216, 0.3)',
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              position: 'relative'
            }}>
              <ShieldCheck size={22} strokeWidth={2.5} color="#ffffff" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                border: '1.5px solid #ffffff'
              }} />
            </div>

            <span style={{ 
              fontSize: '1.3rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>
                Fix<span style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 50%, #ec4899 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block'
                }}>Connect</span>
              </span>
              <span style={{
                fontSize: '0.64rem',
                fontWeight: 800,
                color: '#059669',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16), rgba(6, 182, 212, 0.16))',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '3px 9px',
                borderRadius: '9999px',
                letterSpacing: '0.05em',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.2)'
              }}>
                LIVE VERIFIED
              </span>
            </span>
          </div>

          {/* Center: Navigation Buttons with Colorful Accents */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => navigate('/')}
              className={`nav-pill-btn nav-link-colorful ${location.pathname === '/' || location.pathname === '/home' ? 'active' : ''}`}
              style={{
                background: (location.pathname === '/' || location.pathname === '/home') 
                  ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
                  : 'transparent',
                color: (location.pathname === '/' || location.pathname === '/home') ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Home
            </button>

            <button
              onClick={() => navigate('/how-it-works')}
              className={`nav-pill-btn nav-link-colorful ${location.pathname === '/how-it-works' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/how-it-works' 
                  ? 'linear-gradient(135deg, #0284c7, #0369a1)' 
                  : 'transparent',
                color: location.pathname === '/how-it-works' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              How It Works
            </button>

            <button
              onClick={() => navigate('/services')}
              className={`nav-pill-btn nav-link-colorful ${location.pathname === '/services' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/services' 
                  ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' 
                  : 'transparent',
                color: location.pathname === '/services' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Services
            </button>

            <button
              onClick={() => navigate('/for-technicians')}
              className={`nav-pill-btn nav-link-colorful ${location.pathname === '/for-technicians' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/for-technicians' 
                  ? 'linear-gradient(135deg, #ea580c, #c2410c)' 
                  : 'transparent',
                color: location.pathname === '/for-technicians' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              For Technicians
            </button>

            <button
              onClick={() => navigate('/pricing')}
              className={`nav-pill-btn nav-link-colorful ${location.pathname === '/pricing' ? 'active' : ''}`}
              style={{
                background: location.pathname === '/pricing' 
                  ? 'linear-gradient(135deg, #059669, #047857)' 
                  : 'transparent',
                color: location.pathname === '/pricing' ? '#ffffff' : 'var(--text-muted)'
              }}
            >
              Pricing
            </button>
          </nav>

          {/* Right: Actions (Theme Toggle, Glowing Colorful Login Button) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            flexShrink: 0
          }}>
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1.5px solid rgba(56, 189, 248, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} color="#f59e0b" />}
            </button>

            <button
              onClick={() => navigate('/login')}
              className="colorful-login-btn"
            >
              Login
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          CASE 2: ADMIN APPLICATION NAVBAR
          Master Database & Marketplace Control
         ======================================================== */}
      {user && isAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 24px',
          gap: '16px'
        }}>
          {/* Left: Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}>
              <ShieldCheck size={19} strokeWidth={2.4} />
            </div>

            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap'
            }}>
              Fix<span style={{ color: 'var(--primary)' }}>Connect</span>
              <span style={{ fontSize: '0.7rem', color: '#10b981', marginLeft: '6px', fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                ADMIN
              </span>
            </span>
          </div>

          {/* Center: Admin Control Buttons */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => navigate('/admin')}
              className={`nav-pill-btn ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <Database size={15} />
              Database Console
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className={`nav-pill-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              <Laptop size={15} />
              Customer View
            </button>

            <button
              onClick={() => navigate('/technician')}
              className={`nav-pill-btn ${location.pathname === '/technician' || location.pathname === '/tech' ? 'active' : ''}`}
            >
              <Wrench size={15} />
              Technician Bench
            </button>

            <button
              onClick={() => navigate('/book')}
              className={`nav-pill-btn ${location.pathname === '/book' ? 'active' : ''}`}
              style={{ color: 'var(--cta-orange)', fontWeight: 700 }}
            >
              <PlusCircle size={14} />
              New Repair
            </button>

            <button
              onClick={() => navigate('/track-repair')}
              className={`nav-pill-btn ${location.pathname === '/track-repair' || location.pathname === '/track' ? 'active' : ''}`}
            >
              <Search size={14} />
              Track Repair
            </button>
          </nav>

          {/* Right: Admin Profile & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0
          }}>
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="#f59e0b" />}
            </button>

            {/* Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#10b981',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  👑
                </div>
                <span>{user?.name || 'Admin'}</span>
                <ChevronDown size={14} color="var(--text-dim)" />
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '220px',
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.2)',
                  padding: '8px',
                  zIndex: 200
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
                    SUPER ADMIN CONSOLE
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Edit size={14} color="var(--primary)" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('customer');
                      setShowProfileMenu(false);
                      navigate('/dashboard');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Laptop size={14} color="var(--primary)" />
                    <span>Switch to Customer</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('technician');
                      setShowProfileMenu(false);
                      navigate('/technician');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Wrench size={14} color="var(--cta-orange)" />
                    <span>Switch to Technician</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CASE 3: CUSTOMER APPLICATION NAVBAR
         ======================================================== */}
      {user && isCustomer && !isAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 24px',
          gap: '16px'
        }}>
          {/* Left: Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <ShieldCheck size={19} strokeWidth={2.4} />
            </div>

            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap'
            }}>
              Fix<span style={{ color: 'var(--primary)' }}>Connect</span>
            </span>
          </div>

          {/* Center: Customer Navigation Buttons */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              className={`nav-pill-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate('/book')}
              className={`nav-pill-btn ${location.pathname === '/book' ? 'active' : ''}`}
              style={{
                color: 'var(--cta-orange)',
                fontWeight: 700
              }}
            >
              <PlusCircle size={14} />
              New Repair
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="nav-pill-btn"
            >
              My Repairs
            </button>

            <button
              onClick={() => navigate('/track-repair')}
              className={`nav-pill-btn ${location.pathname === '/track-repair' || location.pathname === '/track' ? 'active' : ''}`}
            >
              <Package size={14} />
              Track Repair
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="nav-pill-btn"
            >
              <MessageSquare size={14} />
              Messages
            </button>

            <button
              onClick={onOpenPayments}
              className="nav-pill-btn"
            >
              <CreditCard size={14} />
              Payments
            </button>
          </nav>

          {/* Right: Customer Profile & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0
          }}>
            <button
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {showNotificationBadge && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#ef4444'
                }} />
              )}
            </button>

            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="#f59e0b" />}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '9999px',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span>{user?.name || 'Customer'}</span>
                <ChevronDown size={14} color="var(--text-dim)" />
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '210px',
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.2)',
                  padding: '8px',
                  zIndex: 200
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                    CUSTOMER ACCOUNT
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Edit size={14} color="var(--primary)" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setShowProfileMenu(false);
                      navigate('/admin');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left',
                      fontWeight: 700
                    }}
                  >
                    <Shield size={14} />
                    <span>Switch to Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('technician');
                      setShowProfileMenu(false);
                      navigate('/technician');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Wrench size={14} color="var(--cta-orange)" />
                    <span>Switch to Technician</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CASE 4: TECHNICIAN APPLICATION NAVBAR
         ======================================================== */}
      {user && isTech && !isAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '0 24px',
          gap: '16px'
        }}>
          {/* Left: Logo */}
          <div 
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <ShieldCheck size={19} strokeWidth={2.4} />
            </div>

            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-heading)',
              whiteSpace: 'nowrap'
            }}>
              Fix<span style={{ color: 'var(--primary)' }}>Connect</span>
            </span>
          </div>

          {/* Center: Technician Navigation Buttons */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1
          }}>
            <button
              onClick={() => navigate('/technician')}
              className={`nav-pill-btn ${location.pathname === '/technician' || location.pathname === '/tech' ? 'active' : ''}`}
            >
              Dashboard
            </button>

            <button
              onClick={() => navigate('/technician')}
              className="nav-pill-btn"
              style={{
                color: 'var(--cta-orange)',
                fontWeight: 700
              }}
            >
              <span>Repair Requests</span>
              <span className="badge badge-orange" style={{ padding: '1px 6px', fontSize: '0.65rem' }}>
                3 New
              </span>
            </button>

            <button
              onClick={() => navigate('/technician')}
              className="nav-pill-btn"
            >
              Active Repairs
            </button>

            <button
              onClick={() => navigate('/technician')}
              className="nav-pill-btn"
            >
              Earnings
            </button>

            <button
              onClick={() => navigate('/technician')}
              className="nav-pill-btn"
            >
              Messages
            </button>

            <button
              onClick={() => navigate('/track-repair')}
              className={`nav-pill-btn ${location.pathname === '/track-repair' || location.pathname === '/track' ? 'active' : ''}`}
            >
              <Package size={14} />
              Track Repair
            </button>

            <button
              onClick={() => navigate('/technician')}
              className="nav-pill-btn"
              style={{ color: 'var(--success)', fontWeight: 700 }}
            >
              <Award size={14} color="var(--success)" />
              Verification
            </button>
          </nav>

          {/* Right: Technician Profile & Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0
          }}>
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} color="#f59e0b" />}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px 5px 6px',
                  borderRadius: '9999px',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'var(--purple)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  {user?.name?.charAt(0) || 'T'}
                </div>
                <span>{user?.name || 'Technician'}</span>
                <ChevronDown size={14} color="var(--text-dim)" />
              </button>

              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '210px',
                  background: 'var(--bg-surface)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 12px 30px -5px rgba(0,0,0,0.2)',
                  padding: '8px',
                  zIndex: 200
                }}>
                  <div style={{ padding: '6px 12px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 800 }}>
                    TECHNICIAN WORKBENCH
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenEditProfile) onOpenEditProfile();
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Edit size={14} color="var(--primary)" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setShowProfileMenu(false);
                      navigate('/admin');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left',
                      fontWeight: 700
                    }}
                  >
                    <Shield size={14} />
                    <span>Switch to Admin</span>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('customer');
                      setShowProfileMenu(false);
                      navigate('/dashboard');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <Laptop size={14} color="var(--primary)" />
                    <span>Switch to Customer</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'transparent',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.82rem',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
