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
  IndianRupee,
  Settings,
  CheckCircle2,
  Database,
  Video,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getStoredUnreadCount } from '../../utils/notificationManager';
import { getCloudImageUrl } from '../../utils/cloudImages';
import './Navbar.css';

export default function Navbar({ 
  onOpenEditProfile,
  onOpenPayments,
  onOpenNotifications,
  onOpenHelp,
  onOpenMessages,
  onOpenRequestModal,
  onOpenTrackRepair,
  onOpenDatabaseMaintenance
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


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('livefix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Determine if there are active unread system notifications (strictly synchronized)
  const [hasUnreadAlerts, setHasUnreadAlerts] = useState(false);

  useEffect(() => {
    if (!user) {
      setHasUnreadAlerts(false);
      return;
    }
    const updateUnreadStatus = () => {
      const count = getStoredUnreadCount(user);
      setHasUnreadAlerts(count > 0);
    };

    updateUnreadStatus();

    window.addEventListener('livefix_notifications_changed', updateUnreadStatus);
    window.addEventListener('storage', updateUnreadStatus);
    const interval = setInterval(updateUnreadStatus, 3000);

    return () => {
      window.removeEventListener('livefix_notifications_changed', updateUnreadStatus);
      window.removeEventListener('storage', updateUnreadStatus);
      clearInterval(interval);
    };
  }, [user]);

  // Nav links: Match active internal dashboard context or user role strictly
  const getNavLinks = () => {
    // Admin: Central operations, users, orders, live audits, custody, escrow, and database inspector
    if (isAdmin || user?.role === 'admin') {
      return [
        { id: 'dashboard', name: 'Admin Console', path: '/admin/dashboard', icon: Shield },
        { id: 'users', name: 'Users & Staff', path: '/admin/users', icon: Users },
        { id: 'orders', name: 'Repair Orders', path: '/admin/orders', icon: Package },
        { id: 'streams', name: 'Live Streams & Meet', path: '/admin/streams', icon: Video },
        { id: 'custody', name: 'Custody & Logistics', path: '/admin/custody', icon: ShieldCheck },
        { id: 'escrow', name: 'Escrow Vault', path: '/admin/escrow', icon: IndianRupee }
      ];
    }
    // Technician: Workbench, Active Jobs, Customer Messages, Live Cleanroom & Earnings (NO Track Repair, Services, or Pricing!)
    if (isTech || user?.role === 'technician') {
      return [
        { id: 'workbench', name: 'Technician Workbench', path: '/technician/dashboard', icon: Wrench },
        { id: 'active-jobs', name: 'Active Jobs', path: '/technician/active', icon: Laptop },
        { id: 'chat', name: 'Customer Messages', path: '/technician/chat', icon: MessageSquare },
        { id: 'live-stream', name: 'Live Cleanroom', path: '/technician/live', icon: Video },
        { id: 'earnings', name: 'Earnings & Escrow', path: '/technician/earnings', icon: IndianRupee }
      ];
    }
    // Customer: Personal dashboard, book new repair, live chat, track active device, transparent pricing
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
          name: 'Book Repair', 
          path: '/customer/book', 
          icon: PlusCircle 
        },
        { 
          id: 'chat', 
          name: 'Messages & Chat', 
          path: '/customer/chat', 
          icon: MessageSquare 
        },
        { 
          id: 'track-pickup', 
          name: 'Track Repair', 
          path: '/track-repair', 
          icon: Package 
        },
        { 
          id: 'pricing', 
          name: 'Pricing & Warranty', 
          path: '/pricing', 
          icon: IndianRupee 
        }
      ];
    }

    // Public links for unauthenticated guests
    return [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services' },
      { name: 'Track Repair', path: '/track-repair' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'For Technicians', path: '/for-technicians' },
      { name: 'How It Works', path: '/how-it-works' }
    ];
  };

  const isLinkActive = (link) => {
    const currentPath = location.pathname;
    const currentFull = location.pathname + location.search;
    if (link.path.includes('?')) {
      return currentFull === link.path;
    }
    if (link.path === '/admin/dashboard') {
      return (currentPath === '/admin/dashboard' || currentPath === '/admin') && !location.search;
    }
    if (link.path === '/admin/users') {
      return currentPath === '/admin/users' || location.search.includes('tab=users');
    }
    if (link.path === '/admin/orders') {
      return currentPath === '/admin/orders' || location.search.includes('tab=orders');
    }
    if (link.path === '/admin/streams') {
      return currentPath === '/admin/streams' || location.search.includes('tab=streams');
    }
    if (link.path === '/admin/custody') {
      return currentPath === '/admin/custody' || location.search.includes('tab=custody');
    }
    if (link.path === '/admin/escrow') {
      return currentPath === '/admin/escrow' || location.search.includes('tab=escrow');
    }

    if (link.path === '/technician/dashboard') {
      return (currentPath === '/technician/dashboard' || currentPath === '/technician' || currentPath === '/technician/workbench') && !location.search;
    }
    if (link.path === '/technician/active') {
      return currentPath === '/technician/active' || currentPath === '/technician/active-jobs' || location.search.includes('tab=active');
    }
    if (link.path === '/technician/chat') {
      return currentPath === '/technician/chat' || currentPath === '/technician/messages' || location.search.includes('tab=chat') || location.search.includes('tab=messages');
    }
    if (link.path === '/technician/live') {
      return currentPath === '/technician/live' || currentPath === '/technician/live-stream' || location.search.includes('tab=live');
    }
    if (link.path === '/technician/earnings') {
      return currentPath === '/technician/earnings' || location.search.includes('tab=earnings');
    }

    if (link.path === '/customer/chat') {
      return currentPath === '/customer/chat' || currentPath === '/customer/messages' || location.search.includes('tab=chat');
    }
    if (link.path === '/customer/dashboard') {
      return (currentPath === '/customer/dashboard' || currentPath === '/dashboard') && !location.search;
    }
    if (link.path === '/customer/book') {
      return currentPath === '/customer/book' || currentPath === '/book';
    }
    if (link.path === '/') {
      return (currentPath === '/' || currentPath === '/home') && !location.search;
    }
    return currentPath === link.path;
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
              src={getCloudImageUrl('/livefix-logo.png')} 
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
                {hasUnreadAlerts && (
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
                )}
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
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        letterSpacing: '0.3px',
                        background: isTech ? 'rgba(217, 119, 6, 0.12)' : (isAdmin ? 'rgba(16, 185, 129, 0.12)' : 'rgba(37, 99, 235, 0.12)'),
                        color: isTech ? '#d97706' : (isAdmin ? '#059669' : '#2563eb'),
                        border: `1px solid ${isTech ? 'rgba(217, 119, 6, 0.3)' : (isAdmin ? 'rgba(16, 185, 129, 0.3)' : 'rgba(37, 99, 235, 0.3)')}`
                      }}
                    >
                      {isAdmin ? 'SUPER ADMINISTRATOR' : (isTech ? 'CERTIFIED TECHNICIAN' : 'VERIFIED CUSTOMER')}
                    </span>
                  </div>
                </div>

                {/* Role-Specific Actions */}
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
                          if (onOpenMessages) onOpenMessages();
                          else navigate('/technician/dashboard');
                        }}
                      >
                        <MessageSquare size={14} color="var(--primary)" />
                        <span>Customer Messages</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/technician/dashboard');
                        }}
                      >
                        <IndianRupee size={14} color="var(--cta-orange)" />
                        <span>Earnings & Escrow</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenEditProfile) onOpenEditProfile();
                          else navigate('/technician/dashboard');
                        }}
                      >
                        <Settings size={14} color="var(--primary)" />
                        <span>Station Settings</span>
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
                        <span>Master Admin Console</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenDatabaseMaintenance) onOpenDatabaseMaintenance();
                        }}
                      >
                        <Database size={14} color="#10b981" />
                        <span>Database Maintenance & Backup</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          if (onOpenEditProfile) onOpenEditProfile();
                        }}
                      >
                        <Settings size={14} color="#10b981" />
                        <span>System Settings</span>
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
                        <span>My Repairs & Dashboard</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/customer/chat');
                        }}
                      >
                        <MessageSquare size={14} color="var(--primary)" />
                        <span>Live Technician Chat</span>
                      </button>

                      <button
                        className="silicone-dropdown-item"
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/customer/book');
                        }}
                      >
                        <PlusCircle size={14} color="var(--primary)" />
                        <span>Book New Repair</span>
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
                          if (onOpenEditProfile) onOpenEditProfile();
                        }}
                      >
                        <Settings size={14} color="var(--primary)" />
                        <span>Account Settings</span>
                      </button>
                    </>
                  )}

                  {/* Clean Sign Out */}
                  <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '4px', paddingTop: '4px' }}>
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
                        <IndianRupee size={16} color="var(--primary)" />
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
                ) : (isAdmin || user?.role === 'admin') ? (
                  <>
                    <button
                      className="silicone-mobile-nav-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (onOpenDatabaseMaintenance) onOpenDatabaseMaintenance();
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={16} color="#10b981" />
                        <span>Database Maintenance</span>
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
                        <Settings size={16} color="#10b981" />
                        <span>System Settings</span>
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
