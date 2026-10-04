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
  Settings
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

  const isAdmin = user?.role === 'admin';
  const isTech = user?.role === 'technician';
  const isCustomer = user?.role === 'customer';

  // Check if we are currently inside an authenticated internal workspace
  const isInternalApp = (location.pathname.startsWith('/admin') && isAdmin) ||
                        (location.pathname.startsWith('/technician') && isTech) ||
                        isCustomer;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('livefix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Nav links: Customer portal navbar matches the 8 menu items
  const getNavLinks = () => {
    if (isAdmin && location.pathname.startsWith('/admin')) {
      return [
        { name: 'Overview', path: '/admin?tab=overview', basePath: '/admin', tab: 'overview' },
        { name: 'All Users', path: '/admin?tab=users', basePath: '/admin', tab: 'users' },
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
        { name: 'ESD Certs', path: '/technician?tab=verification', basePath: '/technician', tab: 'verification' }
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
        if (link.basePath === '/admin' && link.tab === 'overview') return true;
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
                          navigate('/technician?tab=dashboard');
                        }}
                      >
                        <Wrench size={14} color="var(--cta-orange)" />
                        <span>Technician Workbench</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician?tab=active');
                        }}
                      >
                        <Laptop size={14} color="var(--primary)" />
                        <span>Active Repairs</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician?tab=earnings');
                        }}
                      >
                        <DollarSign size={14} color="var(--cta-orange)" />
                        <span>Earnings & Escrow</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician?tab=messages');
                        }}
                      >
                        <MessageSquare size={14} color="var(--primary)" />
                        <span>Customer Chat</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician?tab=settings');
                        }}
                      >
                        <Settings size={14} color="var(--primary)" />
                        <span>Station Settings</span>
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
                          navigate('/admin?tab=overview');
                        }}
                      >
                        <Shield size={14} color="#10b981" />
                        <span>Admin Console</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin?tab=orders');
                        }}
                      >
                        <Laptop size={14} color="#10b981" />
                        <span>Repair Orders</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/admin?tab=database');
                        }}
                      >
                        <Settings size={14} color="#10b981" />
                        <span>System Health</span>
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
                          navigate('/dashboard');
                        }}
                      >
                        <Home size={14} color="var(--primary)" />
                        <span>Customer Dashboard</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/dashboard?tab=repairs');
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
                    </>
                  )}

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
                        navigate('/technician?tab=earnings');
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
                        navigate('/technician?tab=messages');
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
                        navigate('/technician?tab=settings');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings size={16} color="var(--primary)" />
                        <span>Station Settings</span>
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
                        else navigate('/dashboard?tab=messages');
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
                        if (onOpenHelp) onOpenHelp();
                        else navigate('/dashboard?tab=help');
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <HelpCircle size={16} color="var(--primary)" />
                        <span>Help & Support</span>
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
