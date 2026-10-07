import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  ChevronDown, 
  Wrench, 
  LogOut, 
  Edit, 
  Shield, 
  Menu, 
  X, 
  UserCheck,
  Home,
  PlusCircle,
  Laptop,
  Package,
  MessageSquare,
  CreditCard,
  Bell,
  HelpCircle,
  DollarSign,
  Settings,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({ 
  onOpenEditProfile,
  onOpenPayments,
  onOpenNotifications,
  onOpenHelp,
  onOpenMessages,
  onOpenRequestModal,
  onOpenTrackRepair
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('livefix_theme') || 'light';
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname, location.search]);

  // Click outside to close profile dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = location.pathname === '/';
  const isAdmin = user?.role === 'admin';
  const isTech = user?.role === 'technician';
  const isCustomer = user?.role === 'customer';

  // Check if we are currently inside an authenticated internal workspace
  const isInternalApp = !isHome && (
    (location.pathname.startsWith('/admin') && isAdmin) ||
    (location.pathname.startsWith('/technician') && isTech) ||
    (location.pathname.startsWith('/customer') && isCustomer)
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('livefix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Nav links: Match active internal dashboard context or user role
  const getNavLinks = () => {
    // If user is authenticated, prioritize their role-specific navigation
    if (isAdmin || user?.role === 'admin') {
      return [
        { id: 'dashboard', name: 'Admin Console', path: '/admin/dashboard', icon: Shield },
        { id: 'track-repair', name: 'Track Repair', path: '/track-repair', icon: Package },
        { id: 'services', name: 'Services', path: '/services', icon: Laptop },
        { id: 'pricing', name: 'Pricing', path: '/pricing', icon: DollarSign }
      ];
    }
    if (isTech || user?.role === 'technician') {
      return [
        { id: 'dashboard', name: 'Technician Workbench', path: '/technician/dashboard', icon: Wrench },
        { id: 'track-repair', name: 'Track Repair', path: '/track-repair', icon: Package },
        { id: 'services', name: 'Services', path: '/services', icon: Laptop },
        { id: 'pricing', name: 'Pricing', path: '/pricing', icon: DollarSign }
      ];
    }
    if (isCustomer || user?.role === 'customer') {
      return [
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          path: '/customer/dashboard', 
          icon: Home 
        },
        { 
          id: 'new', 
          name: 'New Repair', 
          path: '/customer/book', 
          icon: PlusCircle 
        },
        { 
          id: 'track-pickup', 
          name: 'Track Repair', 
          path: '/track-repair', 
          icon: Package 
        },
        { 
          id: 'services', 
          name: 'Services', 
          path: '/services', 
          icon: Laptop 
        },
        { 
          id: 'pricing', 
          name: 'Pricing', 
          path: '/pricing', 
          icon: DollarSign 
        }
      ];
    }

    // Public links for unauthenticated guests
    return [
      { name: 'Home', path: '/' },
      { name: 'How It Works', path: '/how-it-works' },
      { name: 'Services', path: '/services' },
      { name: 'For Technicians', path: '/for-technicians' },
      { name: 'Track Repair', path: '/track-repair' },
      { name: 'Pricing', path: '/pricing' }
    ];
  };

  const isLinkActive = (link) => {
    if (link.path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    }
    if (link.path === '/technician/dashboard') {
      return location.pathname === '/technician/dashboard' || location.pathname === '/technician';
    }
    if (link.path === '/customer/chat') {
      return location.pathname === '/customer/chat' || location.pathname === '/customer/messages';
    }
    if (link.path === '/customer/dashboard') {
      return location.pathname === '/customer/dashboard' || location.pathname === '/dashboard';
    }
    if (link.path === '/customer/book') {
      return location.pathname === '/customer/book' || location.pathname === '/book';
    }
    if (link.path === '/') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === link.path;
  };

  const handleNavLinkClick = (link) => {
    if (link.action) {
      link.action();
    } else if (link.path) {
      navigate(link.path);
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="silicone-header">
      <div className="silicone-navbar-container">
        {/* ROW 1: Molded Precision Silicone Bays */}
        <div className="silicone-row-bays">
          
          {/* BAY 1: Far Left - Icon + HOME Label */}
         

          {/* Brand Bay - Live Fix (Official 3D Gemstone Logo) */}
          <div 
            className="silicone-bay-brand"
            onClick={() => {
              if (location.pathname.startsWith('/admin')) navigate('/admin/dashboard');
              else if (location.pathname.startsWith('/technician')) navigate('/technician/dashboard');
              else if (location.pathname.startsWith('/customer')) navigate('/customer/dashboard');
              else if (user?.role === 'admin') navigate('/admin/dashboard');
              else if (user?.role === 'technician') navigate('/technician/dashboard');
              else if (user?.role === 'customer') navigate('/customer/dashboard');
              else navigate('/');
            }}
            title="Live Fix - Home"
          >
            <img 
              src="/livefix-logo.png" 
              alt="Live Fix" 
              className="livefix-navbar-logo" 
            />
          </div>

          {/* Center Navigation Links - Each link as an individual separate silicone bay box */}
          <div className="silicone-nav-group">
            {navLinks.map((link, idx) => {
              const isActive = isLinkActive(link);
              const Icon = link.icon;
              return (
                <div 
                  key={idx}
                  className={`silicone-bay silicone-bay-item ${isActive ? 'silicone-bay-item--active' : ''}`}
                  onClick={() => handleNavLinkClick(link)}
                >
                  <button
                    type="button"
                    className={`silicone-nav-link ${isActive ? 'silicone-nav-link--active' : ''}`}
                  >
                    {Icon && <Icon size={16} className="silicone-nav-link-icon" />}
                    <span>{link.name}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* RIGHT ACTION BAYS: Theme, Profile, Mobile Toggle */}
          <div className="silicone-actions-bay-group">
            {/* BAY 7: Theme Toggle Bay */}
          <div className="silicone-bay silicone-bay-theme">
            <button
              className="silicone-theme-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
              {theme === 'light' ? <Moon size={17} strokeWidth={2.2} /> : <Sun size={17} strokeWidth={2.2} />}
            </button>
          </div>

          {/* BAY 7.5: Notification Bell Bay (Customer, Technician & Admin) */}
          {user && (
            <div className="silicone-bay silicone-bay-theme" style={{ position: 'relative' }}>
              <button
                className="silicone-theme-btn"
                onClick={() => {
                  if (onOpenNotifications) onOpenNotifications();
                }}
                title="Notifications & Alerts"
                aria-label="View notifications"
                style={{ position: 'relative' }}
              >
                <Bell size={17} strokeWidth={2.2} />
                <span 
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 6px #ef4444'
                  }} 
                />
              </button>
            </div>
          )}

          {/* BAY 8: Login Bay OR User Profile Dropdown */}
          <div className="silicone-bay silicone-bay-login" ref={profileMenuRef}>
            {!user ? (
              <div className="silicone-auth-btn-group">
                <button
                  type="button"
                  className="silicone-register-btn"
                  onClick={() => navigate('/register')}
                  title="Create a free Live Fix account"
                >
                  Register
                </button>
                <button
                  type="button"
                  className="silicone-login-btn"
                  onClick={() => navigate('/login')}
                  title="Sign in to your account"
                >
                  Login
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!isInternalApp && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isAdmin) navigate('/admin/dashboard');
                      else if (isTech) navigate('/technician/dashboard');
                      else navigate('/customer/dashboard');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, var(--cta-orange, #f97316) 0%, #ea580c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 13px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.35)',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap'
                    }}
                    title="Return to your dashboard"
                  >
                    <span>Dashboard</span>
                    <ArrowRight size={13} />
                  </button>
                )}

                <button
                  className="silicone-profile-trigger"
                  onClick={() => setShowProfileMenu(prev => !prev)}
                >
                <div 
                  className="silicone-avatar-circle"
                  style={{ 
                    background: isTech ? '#d97706' : (isAdmin ? '#059669' : '#2563eb'),
                    overflow: 'hidden'
                  }}
                >
                  {(user.avatar || user.photo || user.photo_url) ? (
                    <img 
                      src={user.avatar || user.photo || user.photo_url} 
                      alt={user.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <span className="silicone-user-name">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={14} color="#ffffff" strokeWidth={2.4} />
              </button>
            </div>
          )}

            {/* Profile Dropdown Menu for Logged In Users */}
            {user && showProfileMenu && (
              <div className="silicone-profile-dropdown">
                <div className="silicone-dropdown-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{ 
                      width: '42px', 
                      height: '42px', 
                      borderRadius: '50%',
                      background: isTech ? '#d97706' : (isAdmin ? '#059669' : '#2563eb'),
                      overflow: 'hidden',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {(user.avatar || user.photo || user.photo_url) ? (
                      <img 
                        src={user.avatar || user.photo || user.photo_url} 
                        alt={user.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user.name?.charAt(0) || 'U'}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="silicone-dropdown-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div className="silicone-dropdown-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    <span 
                      className="badge" 
                      style={{
                        marginTop: '4px',
                        fontSize: '0.62rem',
                        background: 'rgba(56, 189, 248, 0.16)',
                        color: '#0284c7',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      {user.role?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* User Actions strictly isolated based on role */}
                <div className="silicone-dropdown-footer">
                  {(isTech || user?.role === 'technician') ? (
                    <>
                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                      >
                        <Wrench size={14} color="var(--cta-orange)" />
                        <span>Technician Workbench</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                      >
                        <Laptop size={14} color="var(--primary)" />
                        <span>Active Repairs</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                      >
                        <DollarSign size={14} color="var(--cta-orange)" />
                        <span>Earnings & Escrow</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenMessages) onOpenMessages();
                          else navigate('/technician/dashboard');
                        }}
                      >
                        <MessageSquare size={14} color="var(--primary)" />
                        <span>Customer Chat</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                      >
                        <Settings size={14} color="var(--primary)" />
                        <span>Station Settings</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenNotifications) onOpenNotifications();
                        }}
                      >
                        <Bell size={14} color="var(--cta-orange)" />
                        <span>Bench Notifications</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenEditProfile) onOpenEditProfile();
                        }}
                      >
                        <Edit size={14} color="var(--primary)" />
                        <span>Edit Profile</span>
                      </button>
                    </>
                  ) : (isAdmin || user?.role === 'admin') ? (
                    <>
                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                      >
                        <Shield size={14} color="#10b981" />
                        <span>Admin Console</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                      >
                        <Laptop size={14} color="#10b981" />
                        <span>Repair Orders</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                      >
                        <Settings size={14} color="#10b981" />
                        <span>System Health</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenNotifications) onOpenNotifications();
                        }}
                      >
                        <Bell size={14} color="#10b981" />
                        <span>System Alerts</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenEditProfile) onOpenEditProfile();
                        }}
                      >
                        <Edit size={14} color="var(--primary)" />
                        <span>Edit Profile</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/customer/dashboard');
                        }}
                      >
                        <Home size={14} color="var(--primary)" />
                        <span>Customer Dashboard</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/customer/dashboard');
                        }}
                      >
                        <Laptop size={14} color="var(--primary)" />
                        <span>My Repairs</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenMessages) onOpenMessages();
                          else navigate('/customer/dashboard');
                        }}
                      >
                        <MessageSquare size={14} color="var(--primary)" />
                        <span>Messages</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenHelp) onOpenHelp();
                          else navigate('/customer/dashboard');
                        }}
                      >
                        <HelpCircle size={14} color="var(--primary)" />
                        <span>Help & Support</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenNotifications) onOpenNotifications();
                        }}
                      >
                        <Bell size={14} color="var(--primary)" />
                        <span>Repair Notifications</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenEditProfile) onOpenEditProfile();
                        }}
                      >
                        <Edit size={14} color="var(--primary)" />
                        <span>Edit Profile</span>
                      </button>
                    </>
                  )}

                  {/* 1-Click Portal Switcher */}
                  <div style={{ padding: '8px 12px 6px', borderTop: '1px solid var(--border-light)', marginTop: '6px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
                      Switch Portal View
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={async () => {
                          await switchRole('customer');
                          setShowProfileMenu(false);
                          navigate('/customer/dashboard');
                        }}
                        style={{
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: user?.role === 'customer' ? 800 : 600,
                          borderRadius: '6px',
                          border: user?.role === 'customer' ? '1px solid #2563eb' : '1px solid var(--border-light)',
                          background: user?.role === 'customer' ? 'rgba(37, 99, 235, 0.15)' : 'var(--bg-card)',
                          color: user?.role === 'customer' ? '#2563eb' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                        title="Switch to Customer Dashboard"
                      >
                        👤 Customer
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await switchRole('technician');
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                        style={{
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: user?.role === 'technician' ? 800 : 600,
                          borderRadius: '6px',
                          border: user?.role === 'technician' ? '1px solid #d97706' : '1px solid var(--border-light)',
                          background: user?.role === 'technician' ? 'rgba(217, 119, 6, 0.15)' : 'var(--bg-card)',
                          color: user?.role === 'technician' ? '#d97706' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                        title="Switch to Technician Workbench"
                      >
                        🔧 Tech
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await switchRole('admin');
                          setShowProfileMenu(false);
                          navigate('/admin/dashboard');
                        }}
                        style={{
                          padding: '6px 4px',
                          fontSize: '0.72rem',
                          fontWeight: user?.role === 'admin' ? 800 : 600,
                          borderRadius: '6px',
                          border: user?.role === 'admin' ? '1px solid #059669' : '1px solid var(--border-light)',
                          background: user?.role === 'admin' ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-card)',
                          color: user?.role === 'admin' ? '#059669' : 'var(--text-main)',
                          cursor: 'pointer'
                        }}
                        title="Switch to Admin Console"
                      >
                        🛡️ Admin
                      </button>
                    </div>
                  </div>

                  <button
                    className="silicone-dropdown-item silicone-dropdown-logout"
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                      navigate('/');
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER TOGGLE BAY */}
          <button 
            type="button"
            className="silicone-bay silicone-mobile-toggle-bay"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            title="Menu"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} strokeWidth={2.4} /> : <Menu size={20} strokeWidth={2.4} />}
          </button>
        </div>
      </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="silicone-mobile-drawer">
            {user && (
              <div className="silicone-mobile-user-card">
                <div 
                  style={{ 
                    width: '38px', 
                    height: '38px', 
                    borderRadius: '50%',
                    background: isTech ? '#d97706' : (isAdmin ? '#059669' : '#2563eb'),
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    border: '1.5px solid rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {(user.avatar || user.photo || user.photo_url) ? (
                    <img 
                      src={user.avatar || user.photo || user.photo_url} 
                      alt={user.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    user.name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="silicone-mobile-user-info">
                  <div className="silicone-mobile-user-name">{user.name}</div>
                  <div className="silicone-mobile-user-email">{user.email}</div>
                </div>
                <span className="silicone-mobile-role-badge">
                  {user.role?.toUpperCase()}
                </span>
              </div>
            )}

            {navLinks.map((link, idx) => {
              const isActive = isLinkActive(link);
              const Icon = link.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    handleNavLinkClick(link);
                    setMobileMenuOpen(false);
                  }}
                  className={`silicone-mobile-nav-btn ${isActive ? 'silicone-mobile-nav-btn--active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {Icon && <Icon size={16} />}
                    <span>{link.name}</span>
                  </div>
                  {isActive && (
                    <span style={{ 
                      fontSize: '0.68rem', 
                      background: '#ffffff', 
                      color: '#059669', 
                      padding: '2px 8px', 
                      borderRadius: '9999px', 
                      fontWeight: 800 
                    }}>
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}

            {user && (
              <div style={{
                marginTop: '10px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {(isTech || user?.role === 'technician') ? (
                  <>
                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/technician/dashboard');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <DollarSign size={16} color="var(--primary)" />
                        <span>Earnings & Escrow</span>
                      </div>
                    </button>
                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenMessages) onOpenMessages();
                        else navigate('/technician/dashboard');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={16} color="var(--primary)" />
                        <span>Customer Chat</span>
                      </div>
                    </button>
                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenNotifications) onOpenNotifications();
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Bell size={16} color="var(--primary)" />
                        <span>Notifications</span>
                      </div>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenMessages) onOpenMessages();
                        else navigate('/customer/dashboard');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={16} color="var(--primary)" />
                        <span>Messages</span>
                      </div>
                    </button>

                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenNotifications) onOpenNotifications();
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Bell size={16} color="var(--primary)" />
                        <span>Notifications</span>
                      </div>
                    </button>

                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenEditProfile) onOpenEditProfile();
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Edit size={16} color="var(--primary)" />
                        <span>Edit Profile</span>
                      </div>
                    </button>
                  </>
                )}
              </div>
            )}

            {user ? (
              <button
                className="silicone-mobile-nav-btn silicone-mobile-logout-btn"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </div>
              </button>
            ) : (
              <div className="silicone-mobile-auth-group" style={{ display: 'flex', gap: '8px', width: '100%', marginTop: '8px' }}>
                <button
                  type="button"
                  className="silicone-register-btn"
                  style={{ flex: 1, width: '100%' }}
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                >
                  Register
                </button>
                <button
                  type="button"
                  className="silicone-login-btn"
                  style={{ flex: 1, width: '100%' }}
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        )}

        
      </div>
    </header>
  );
}
