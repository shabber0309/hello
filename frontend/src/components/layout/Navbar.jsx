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
  HelpCircle
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
  const [theme, setTheme] = useState('light');
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

  const isAdmin = user?.role === 'admin';
  const isTech = user?.role === 'technician';
  const isCustomer = user?.role === 'customer';

  // Check if we are currently inside an authenticated internal workspace
  const isInternalApp = (location.pathname.startsWith('/admin') && isAdmin) ||
                        (location.pathname.startsWith('/technician') && isTech) ||
                        isCustomer;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Nav links: Customer portal navbar matches the 8 menu items
  const getNavLinks = () => {
    if (isAdmin && location.pathname.startsWith('/admin')) {
      return [
        { name: 'Console', path: '/admin?tab=users', basePath: '/admin', tab: 'users' },
        { name: 'Repair Orders', path: '/admin?tab=orders', basePath: '/admin', tab: 'orders' },
        { name: 'Cleanrooms', path: '/admin?tab=streams', basePath: '/admin', tab: 'streams' },
        { name: 'Tamper Seals', path: '/admin?tab=custody', basePath: '/admin', tab: 'custody' },
        { name: 'Financials', path: '/admin?tab=escrow', basePath: '/admin', tab: 'escrow' },
        { name: 'System Health', path: '/admin?tab=database', basePath: '/admin', tab: 'database' }
      ];
    }
    if (isTech && location.pathname.startsWith('/technician')) {
      return [
        { name: 'Workbench', path: '/technician?tab=dashboard', basePath: '/technician', tab: 'dashboard' },
        { name: 'Requests', path: '/technician?tab=requests', basePath: '/technician', tab: 'requests' },
        { name: 'Active Repairs', path: '/technician?tab=active', basePath: '/technician', tab: 'active' },
        { name: 'My Jobs', path: '/technician?tab=my-jobs', basePath: '/technician', tab: 'my-jobs' },
        { name: 'Earnings', path: '/technician?tab=earnings', basePath: '/technician', tab: 'earnings' },
        { name: 'Customer Chat', path: '/technician?tab=messages', basePath: '/technician', tab: 'messages' },
        { name: 'ESD Certs', path: '/technician?tab=verification', basePath: '/technician', tab: 'verification' },
        { name: 'Station Settings', path: '/technician?tab=settings', basePath: '/technician', tab: 'settings' }
      ];
    }
    if (isCustomer || (user && user.role === 'customer')) {
      return [
        { 
          id: 'dashboard', 
          name: 'Dashboard', 
          path: '/dashboard', 
          icon: Home 
        },
        { 
          id: 'new', 
          name: 'New Repair', 
          path: '/book', 
          icon: PlusCircle 
        },
        { 
          id: 'my-repairs', 
          name: 'My Repairs', 
          path: '/dashboard?tab=repairs', 
          icon: Laptop 
        },
        { 
          id: 'track-pickup', 
          name: 'Track Pickup', 
          path: '/track-repair', 
          icon: Package 
        },
        { 
          id: 'payments', 
          name: 'Payments', 
          path: '/dashboard?tab=payments', 
          icon: CreditCard,
          action: () => {
            if (onOpenPayments) onOpenPayments();
            else navigate('/dashboard?tab=payments');
          }
        },
        { 
          id: 'notifications', 
          name: 'Notifications', 
          path: '/dashboard?tab=notifications', 
          icon: Bell,
          action: () => {
            if (onOpenNotifications) onOpenNotifications();
            else navigate('/dashboard?tab=notifications');
          }
        }
      ];
    }

    // Public links matching brand navigation
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
    if (isCustomer || (user && user.role === 'customer')) {
      const params = new URLSearchParams(location.search);
      const currentTab = params.get('tab');

      if (link.id === 'new') {
        return location.pathname === '/book';
      }
      if (link.id === 'track-pickup') {
        return location.pathname === '/track-repair';
      }
      if (link.id === 'my-repairs') {
        return location.pathname === '/dashboard' && currentTab === 'repairs';
      }
      if (link.id === 'messages') {
        return currentTab === 'messages';
      }
      if (link.id === 'payments') {
        return currentTab === 'payments';
      }
      if (link.id === 'notifications') {
        return currentTab === 'notifications';
      }
      if (link.id === 'help') {
        return currentTab === 'help';
      }
      if (link.id === 'dashboard') {
        return location.pathname === '/dashboard' && (!currentTab || currentTab === 'dashboard');
      }
    }

    if (link.tab && link.basePath) {
      if (location.pathname !== link.basePath) return false;
      const params = new URLSearchParams(location.search);
      const currentTab = params.get('tab');
      if (!currentTab) {
        if (link.basePath === '/admin' && link.tab === 'users') return true;
        if (link.basePath === '/technician' && link.tab === 'dashboard') return true;
        return false;
      }
      return currentTab === link.tab;
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
            onClick={() => navigate(isCustomer ? '/dashboard' : (isTech ? '/technician' : (isAdmin ? '/admin' : '/')))}
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
                    {Icon && <Icon size={17} className="silicone-nav-link-icon" />}
                    <span>{link.name}</span>
                  </button>
                </div>
              );
            })}
          </div>

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

          {/* BAY 8: Login Bay OR User Profile Dropdown */}
          <div className="silicone-bay silicone-bay-login" ref={profileMenuRef}>
            {!user ? (
              <button
                className="silicone-login-btn"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            ) : (
              <button
                className="silicone-profile-trigger"
                onClick={() => setShowProfileMenu(prev => !prev)}
              >
                <div 
                  className="silicone-avatar-circle"
                  style={{ background: isTech ? '#d97706' : (isAdmin ? '#059669' : '#2563eb') }}
                >
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="silicone-user-name">
                  {user.name?.split(' ')[0] || 'User'}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </button>
            )}

            {/* Profile Dropdown Menu for Logged In Users */}
            {user && showProfileMenu && (
              <div className="silicone-profile-dropdown">
                <div className="silicone-dropdown-header">
                  <div className="silicone-dropdown-name">{user.name}</div>
                  <div className="silicone-dropdown-email">{user.email}</div>
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

                {/* Role Switchers - Only visible to Admins */}
                {isAdmin && (
                  <div className="silicone-dropdown-section">
                    <button
                      className="silicone-dropdown-item"
                      onClick={() => {
                        switchRole('customer');
                        setShowProfileMenu(false);
                        navigate('/dashboard');
                      }}
                    >
                      <UserCheck size={14} color="var(--primary)" />
                      <span>Customer Portal</span>
                    </button>

                    <button
                      className="silicone-dropdown-item"
                      onClick={() => {
                        switchRole('technician');
                        setShowProfileMenu(false);
                        navigate('/technician');
                      }}
                    >
                      <Wrench size={14} color="var(--cta-orange)" />
                      <span>Technician Workbench</span>
                    </button>

                    <button
                      className="silicone-dropdown-item"
                      onClick={() => {
                        switchRole('admin');
                        setShowProfileMenu(false);
                        navigate('/admin');
                      }}
                    >
                      <Shield size={14} color="#10b981" />
                      <span>Admin Console</span>
                    </button>
                  </div>
                )}

                {/* User Actions: Messages, Help, Edit Profile, Sign Out */}
                <div className="silicone-dropdown-footer">
                  <button
                    className="silicone-dropdown-item"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenMessages) onOpenMessages();
                      else navigate('/dashboard?tab=messages');
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
                      else navigate('/dashboard?tab=help');
                    }}
                  >
                    <HelpCircle size={14} color="var(--primary)" />
                    <span>Help & Support</span>
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
          <div 
            className="silicone-bay silicone-mobile-toggle-bay"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            title="Menu"
          >
            {mobileMenuOpen ? <X size={22} color="#1e293b" strokeWidth={2.4} /> : <Menu size={22} color="#1e293b" strokeWidth={2.4} />}
          </div>
        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="silicone-mobile-drawer">
            {user && (
              <div className="silicone-mobile-user-card">
                <div>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>{user.email}</div>
                </div>
                <span 
                  className="badge" 
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#93c5fd',
                    border: '1px solid rgba(147, 197, 253, 0.3)'
                  }}
                >
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={16} />}
                    <span>{link.name}</span>
                  </div>
                  {isActive && (
                    <span style={{ 
                      fontSize: '0.68rem', 
                      background: '#ffffff', 
                      color: '#1d4ed8', 
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
                borderTop: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <button
                  className="silicone-mobile-nav-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenMessages) onOpenMessages();
                    else navigate('/dashboard?tab=messages');
                  }}
                  style={{ fontSize: '0.84rem' }}
                >
                  <MessageSquare size={15} color="#93c5fd" />
                  <span>Messages</span>
                </button>

                <button
                  className="silicone-mobile-nav-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenHelp) onOpenHelp();
                    else navigate('/dashboard?tab=help');
                  }}
                  style={{ fontSize: '0.84rem' }}
                >
                  <HelpCircle size={15} color="#93c5fd" />
                  <span>Help & Support</span>
                </button>

                <button
                  className="silicone-mobile-nav-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenEditProfile) onOpenEditProfile();
                  }}
                  style={{ fontSize: '0.84rem' }}
                >
                  <Edit size={15} color="#93c5fd" />
                  <span>Edit Profile</span>
                </button>

                {isAdmin && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', margin: '4px 0' }}>
                    <button
                      onClick={() => {
                        switchRole('customer');
                        setMobileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      style={{
                        background: 'rgba(37, 99, 235, 0.25)',
                        border: '1px solid rgba(147, 197, 253, 0.4)',
                        color: '#ffffff',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => {
                        switchRole('technician');
                        setMobileMenuOpen(false);
                        navigate('/technician');
                      }}
                      style={{
                        background: 'rgba(234, 88, 12, 0.25)',
                        border: '1px solid rgba(251, 146, 60, 0.4)',
                        color: '#ffffff',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Tech
                    </button>
                    <button
                      onClick={() => {
                        switchRole('admin');
                        setMobileMenuOpen(false);
                        navigate('/admin');
                      }}
                      style={{
                        background: 'rgba(16, 185, 129, 0.25)',
                        border: '1px solid rgba(52, 211, 153, 0.4)',
                        color: '#ffffff',
                        padding: '8px 4px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Admin
                    </button>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <button
                className="silicone-dropdown-item silicone-dropdown-logout"
                style={{ padding: '10px 16px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.18)', border: '1px solid rgba(239, 68, 68, 0.4)', marginTop: '6px' }}
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            ) : (
              <button
                className="silicone-login-btn"
                style={{ width: '100%', marginTop: '6px' }}
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </button>
            )}
          </div>
        )}

        
      </div>
    </header>
  );
}
