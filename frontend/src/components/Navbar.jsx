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

  // 6 Colorful precision screwdrivers matching the silicone tool bay
  const screwdrivers = [
    { capColor: '#a855f7', bodyColor: '#7e22ce', tip: 'PH000', label: 'Cross #000' },
    { capColor: '#3b82f6', bodyColor: '#1d4ed8', tip: 'T5', label: 'Torx T5' },
    { capColor: '#f97316', bodyColor: '#c2410c', tip: 'P2', label: 'Pentalobe' },
    { capColor: '#ef4444', bodyColor: '#b91c1c', tip: 'Y000', label: 'Tri-Point' },
    { capColor: '#0ea5e9', bodyColor: '#0369a1', tip: 'PH00', label: 'Cross #00' },
    { capColor: '#dc2626', bodyColor: '#991b1b', tip: 'SL1.5', label: 'Flathead' }
  ];

  const publicNavLinks = [
    { name: 'Home', path: '/', color: '#38bdf8' },
    { name: 'How It Works', path: '/how-it-works', color: '#06b6d4' },
    { name: 'Services', path: '/services', color: '#a855f7' },
    { name: 'For Technicians', path: '/for-technicians', color: '#f59e0b' },
    { name: 'Pricing', path: '/pricing', color: '#10b981' }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.45)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(2, 132, 199, 0.15)',
      boxShadow: '0 4px 18px rgba(0, 30, 70, 0.08)',
      transition: 'all 0.25s ease'
    }}>
      {/* ========================================================
          CASE 1: PUBLIC NAVBAR (Molded Silicone Tool Bay Bar)
         ======================================================== */}
      {!user && (
        <div style={{
          maxWidth: '1540px',
          margin: '0 auto',
          background: 'linear-gradient(160deg, #0288d1 0%, #0077b6 40%, #026ca8 75%, #01579b 100%)',
          borderRadius: '18px',
          border: '2.5px solid rgba(255, 255, 255, 0.45)',
          boxShadow: '0 8px 30px rgba(0, 25, 60, 0.35), inset 2px 2px 5px rgba(255, 255, 255, 0.5), inset -2px -2px 6px rgba(0, 20, 50, 0.4)',
          padding: '8px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Left: Brand Logo + Standing Precision Screwdriver Tool Bay */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
            {/* FixConnect Brand */}
            <div 
              onClick={() => navigate('/')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f5a0 0%, #00dfd8 35%, #0070f3 70%, #7928ca 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 8px rgba(0, 112, 243, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.65)'
              }}>
                <ShieldCheck size={19} strokeWidth={2.5} color="#ffffff" />
              </div>

              <span style={{ 
                fontSize: '1.18rem', 
                fontWeight: 800, 
                letterSpacing: '-0.02em',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap',
                textShadow: '0 1px 3px rgba(0, 20, 50, 0.6)'
              }}>
                Fix<span style={{ color: '#7dd3fc' }}>Connect</span>
              </span>
            </div>

            {/* Vertical Separator */}
            <div style={{
              width: '1.5px',
              height: '32px',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.3) 100%)'
            }} />

            {/* TOOL BAY Label */}
            <div style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: 'rgba(255, 255, 255, 0.95)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              userSelect: 'none'
            }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8'
              }} />
              <span>TOOL BAY</span>
            </div>

            {/* The 6 Precision Screwdrivers (Matching Image 2 & screenshot) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {screwdrivers.map((driver, idx) => (
                <div 
                  key={idx}
                  title={`${driver.label} (${driver.tip})`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                >
                  {/* Swivel Rotating Cap */}
                  <div style={{
                    width: '16px',
                    height: '9px',
                    borderRadius: '4px 4px 2px 2px',
                    background: driver.capColor,
                    boxShadow: `0 2px 5px ${driver.capColor}aa, inset 0 1px 2px rgba(255,255,255,0.6)`,
                    border: '1px solid rgba(255,255,255,0.45)',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '1px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '5px',
                      height: '2px',
                      borderRadius: '1px',
                      background: 'rgba(255,255,255,0.7)'
                    }} />
                  </div>
                  
                  {/* Knurled Handle */}
                  <div style={{
                    width: '11px',
                    height: '20px',
                    borderRadius: '2px',
                    background: `repeating-linear-gradient(180deg, ${driver.bodyColor} 0px, ${driver.bodyColor} 3px, #0f172a 3px, #0f172a 5px)`,
                    border: '1px solid rgba(0,0,0,0.3)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                  }} />

                  {/* Steel Shaft */}
                  <div style={{
                    width: '3px',
                    height: '10px',
                    background: 'linear-gradient(90deg, #94a3b8 0%, #ffffff 50%, #64748b 100%)',
                    borderRadius: '0 0 1px 1px'
                  }} />

                  {/* Molded Silicone Hole */}
                  <div style={{
                    width: '12px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#013a5e',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.4)',
                    marginTop: '-2px'
                  }} />

                  <span style={{
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginTop: '2px',
                    letterSpacing: '-0.02em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}>
                    {driver.tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Molded Tool Bay Nav Items (Home, How It Works, Services, For Technicians, Pricing) */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            flex: 1,
            flexWrap: 'wrap'
          }}>
            {publicNavLinks.map((item) => {
              const isActive = (item.path === '/' && (location.pathname === '/' || location.pathname === '/home')) ||
                (item.path !== '/' && location.pathname === item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.12))' 
                      : 'rgba(0, 30, 65, 0.45)',
                    border: isActive 
                      ? '1.5px solid #ffffff' 
                      : '1.5px solid rgba(255, 255, 255, 0.22)',
                    boxShadow: isActive 
                      ? `0 0 14px ${item.color}88, inset 1px 1px 2px rgba(255,255,255,0.6)` 
                      : 'inset 1.5px 1.5px 4px rgba(0, 15, 35, 0.6), inset -1px -1px 2px rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    textShadow: '0 1px 2px rgba(0, 20, 50, 0.6)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0, 45, 95, 0.6)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0, 30, 65, 0.45)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}`
                  }} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Heat Proof Badge + Theme Toggle + Glowing Login Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexShrink: 0
          }}>
            {/* 500°C Heat Proof Badge (as in the screenshot) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(16, 185, 129, 0.16)',
              border: '1px solid #10b981',
              borderRadius: '9999px',
              padding: '4px 12px',
              boxShadow: '0 0 10px rgba(16, 185, 129, 0.25)',
              userSelect: 'none'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981'
              }} />
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#a7f3d0',
                letterSpacing: '0.03em'
              }}>
                500°C HEAT PROOF • S-160 SILICONE
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(0, 30, 65, 0.5)',
                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)'
              }}
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} color="#f59e0b" />}
            </button>

            {/* Login Button */}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(135deg, #06b6d4 0%, #2563eb 50%, #7c3aed 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.86rem',
                padding: '7px 22px',
                borderRadius: '9999px',
                cursor: 'pointer',
                border: '1.5px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.45), 0 0 10px rgba(6, 182, 212, 0.35)',
                letterSpacing: '0.02em',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.04)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.6), 0 0 14px rgba(6, 182, 212, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.45), 0 0 10px rgba(6, 182, 212, 0.35)';
              }}
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
