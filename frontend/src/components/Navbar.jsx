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
  Shield,
  Home,
  BookOpen,
  Cpu,
  ShoppingCart,
  Grid,
  Menu,
  X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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
    <header className="silicone-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%',
      background: '#00a4e4',
      borderBottom: '3px solid rgba(0, 30, 60, 0.35)',
      boxShadow: '0 8px 24px rgba(0, 35, 75, 0.28), inset 0 2px 4px rgba(255, 255, 255, 0.45)',
      padding: '8px 16px 6px',
      transition: 'all 0.25s ease'
    }}>
      {/* ========================================================
          CASE 1: PUBLIC NAVBAR (Exact Reference Silicone Mat Layout)
         ======================================================== */}
      {!user && (
        <div style={{
          maxWidth: '1520px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* ROW 1: Molded Silicone Bays Matching User Reference Image */}
          <div className="silicone-row-bays" style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '8px',
            height: '66px'
          }}>
            {/* BAY 1: Far Left - Icon + HOME Label */}
            <div 
              className="silicone-bay-home"
              onClick={() => navigate('/')}
              style={{
                width: '74px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div className="silicone-home-box" style={{
                position: 'relative',
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0f172a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 8px rgba(0, 20, 50, 0.4)'
              }}>
                <ShieldCheck size={18} strokeWidth={2.4} color="#10b981" />
                <span style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }} />
              </div>
              <span className="silicone-home-label" style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textShadow: '0 1px 2px rgba(0, 20, 50, 0.6)'
              }}>
                HOME
              </span>
            </div>

            {/* BAY 2: Wide Compartment - FixConnect + LIVE VERIFIED */}
            <div 
              className="silicone-bay-brand"
              onClick={() => navigate('/')}
              style={{
                width: '210px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <div className="silicone-brand-text" style={{
                display: 'flex',
                alignItems: 'baseline',
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-heading)'
              }}>
                <span style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0, 20, 50, 0.6)' }}>Fix</span>
                <span style={{ color: '#93c5fd', textShadow: '0 2px 4px rgba(0, 20, 50, 0.6)' }}>Connect</span>
              </div>
              <span className="silicone-brand-badge" style={{
                fontSize: '0.62rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                color: '#059669',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '2px 9px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                boxShadow: '0 1px 3px rgba(16, 185, 129, 0.15)'
              }}>
                LIVE VERIFIED
              </span>
            </div>

            {/* BAY 3: Recessed Storage Bay 1 */}
            <div className="silicone-bay-decorative" style={{
              width: '56px',
              borderRadius: '8px',
              background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.32)',
              boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
              flexShrink: 0
            }} />

            {/* BAY 4: Recessed Storage Bay 2 */}
            <div className="silicone-bay-decorative" style={{
              width: '56px',
              borderRadius: '8px',
              background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.32)',
              boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
              flexShrink: 0
            }} />

            {/* BAY 5: Wide Center Bay - Nav Links (Home | How It Works | Services | For Technicians) */}
            <div className="silicone-bay-center silicone-center-links" style={{
              flex: 1,
              borderRadius: '8px',
              background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
              border: '1.5px solid rgba(255, 255, 255, 0.32)',
              boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '0 20px'
            }}>
              {/* Home Pill */}
              <button
                onClick={() => navigate('/')}
                style={{
                  padding: (location.pathname === '/' || location.pathname === '/home') ? '7px 22px' : '7px 14px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: (location.pathname === '/' || location.pathname === '/home') ? 800 : 700,
                  color: '#ffffff',
                  background: (location.pathname === '/' || location.pathname === '/home') ? '#2563eb' : 'transparent',
                  border: 'none',
                  boxShadow: (location.pathname === '/' || location.pathname === '/home') ? '0 4px 14px rgba(37, 99, 235, 0.45)' : 'none',
                  textShadow: (location.pathname === '/' || location.pathname === '/home') ? 'none' : '0 1px 2px rgba(0, 20, 50, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Home
              </button>

              {/* How It Works */}
              <button
                onClick={() => navigate('/how-it-works')}
                style={{
                  padding: location.pathname === '/how-it-works' ? '7px 20px' : '7px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: location.pathname === '/how-it-works' ? '#2563eb' : 'transparent',
                  border: 'none',
                  textShadow: location.pathname === '/how-it-works' ? 'none' : '0 1px 2px rgba(0, 20, 50, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                How It Works
              </button>

              {/* Services */}
              <button
                onClick={() => navigate('/services')}
                style={{
                  padding: location.pathname === '/services' ? '7px 20px' : '7px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: location.pathname === '/services' ? '#2563eb' : 'transparent',
                  border: 'none',
                  textShadow: location.pathname === '/services' ? 'none' : '0 1px 2px rgba(0, 20, 50, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Services
              </button>

              {/* For Technicians */}
              <button
                onClick={() => navigate('/for-technicians')}
                style={{
                  padding: location.pathname === '/for-technicians' ? '7px 20px' : '7px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  background: location.pathname === '/for-technicians' ? '#2563eb' : 'transparent',
                  border: 'none',
                  textShadow: location.pathname === '/for-technicians' ? 'none' : '0 1px 2px rgba(0, 20, 50, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                For Technicians
              </button>
            </div>

            {/* BAY 6: Pricing Bay */}
            <div 
              className="silicone-bay-pricing"
              onClick={() => navigate('/pricing')}
              style={{
                width: '92px',
                borderRadius: '8px',
                background: location.pathname === '/pricing'
                  ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.15) 100%)'
                  : 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <span style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 20, 50, 0.6)'
              }}>
                Pricing
              </span>
            </div>

            {/* BAY 7: Theme Toggle Bay */}
            <div 
              className="silicone-bay-theme"
              style={{
                width: '64px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <button
                className="silicone-theme-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f0f7ff',
                  border: '1px solid #dbeafe',
                  color: '#1e293b',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)'
                }}
              >
                {theme === 'light' ? <Moon size={17} strokeWidth={2.2} /> : <Sun size={17} strokeWidth={2.2} />}
              </button>
            </div>

            {/* BAY 8: Login Bay */}
            <div 
              className="silicone-bay-login"
              style={{
                width: '100px',
                borderRadius: '8px',
                background: 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <button
                className="silicone-login-btn"
                onClick={() => navigate('/login')}
                style={{
                  padding: '7px 20px',
                  borderRadius: '9999px',
                  background: '#ffffff',
                  border: 'none',
                  color: '#0f172a',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.2s ease'
                }}
              >
                Login
              </button>
            </div>

            {/* MOBILE HAMBURGER TOGGLE BAY (Visible on Mobile / Tablets) */}
            <div 
              className="silicone-mobile-toggle-bay"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              title="Menu"
              style={{
                width: '52px',
                borderRadius: '8px',
                background: mobileMenuOpen 
                  ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.15) 100%)' 
                  : 'linear-gradient(180deg, rgba(0, 45, 95, 0.28) 0%, rgba(0, 35, 75, 0.4) 100%)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                boxShadow: 'inset 2px 2px 4px rgba(0, 25, 55, 0.5), inset -1px -1px 2px rgba(255, 255, 255, 0.35)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {mobileMenuOpen ? <X size={22} color="#ffffff" strokeWidth={2.4} /> : <Menu size={22} color="#073258" strokeWidth={2.4} />}
            </div>
          </div>

          {/* MOBILE SLIDE-DOWN DRAWER (Smooth molded silicone layout) */}
          {mobileMenuOpen && (
            <div 
              className="silicone-mobile-drawer"
              style={{
                background: 'linear-gradient(180deg, rgba(0, 40, 85, 0.95) 0%, rgba(0, 30, 65, 0.98) 100%)',
                borderRadius: '10px',
                border: '1.5px solid rgba(255, 255, 255, 0.32)',
                boxShadow: '0 12px 30px rgba(0, 20, 50, 0.5), inset 1px 1px 3px rgba(255, 255, 255, 0.2)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              {publicNavLinks.map(link => {
                const isActive = (link.path === '/' && (location.pathname === '/' || location.pathname === '/home')) ||
                                 (link.path !== '/' && location.pathname === link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      background: isActive 
                        ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      border: isActive ? '1.5px solid rgba(255, 255, 255, 0.7)' : '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.94rem',
                      fontWeight: isActive ? 800 : 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isActive ? '0 4px 14px rgba(37, 99, 235, 0.5)' : 'none'
                    }}
                  >
                    <span>{link.name}</span>
                    {isActive && (
                      <span style={{ 
                        fontSize: '0.68rem', 
                        background: '#ffffff', 
                        color: '#1d4ed8', 
                        padding: '2px 8px', 
                        borderRadius: '9999px', 
                        fontWeight: 800,
                        letterSpacing: '0.04em'
                      }}>
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ROW 2: Continuous Double Row of Silicone Screw Organizer Wells */}
          <div style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(13px, 1fr))',
            gridTemplateRows: 'repeat(2, 9px)',
            gap: '2.5px',
            background: 'rgba(0, 35, 75, 0.32)',
            padding: '3px 28px 3px 3px',
            borderRadius: '4px',
            border: '1.5px solid rgba(255, 255, 255, 0.28)',
            boxShadow: 'inset 1px 1px 3px rgba(0, 20, 50, 0.5)'
          }}>
            {Array.from({ length: 88 }).map((_, idx) => (
              <div key={idx} style={{
                background: 'rgba(0, 20, 45, 0.45)',
                borderRadius: '1.5px',
                boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.55), 0 0.5px 0.5px rgba(255, 255, 255, 0.25)'
              }} />
            ))}
            {/* Embossed Silicone 4-Point Star On the Right */}
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.45)',
              fontSize: '11px',
              userSelect: 'none'
            }}>
              ✦
            </div>
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
