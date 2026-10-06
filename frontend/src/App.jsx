  import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar, SiliconeWorkbenchFrame } from './components/layout';
import './App.css';
// Role-based Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import BookRepair from './pages/customer/BookRepair';
import TrackRepairPage from './pages/customer/TrackRepairPage';
import TechDashboard from './pages/technician/TechDashboard';
import ForTechniciansPage from './pages/technician/ForTechniciansPage';
import LandingPage from './pages/public/LandingPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ServicesPage from './pages/public/ServicesPage';
import PricingPage from './pages/public/PricingPage';
import AuthPage from './pages/auth/AuthPage';

// Modals
import {
  StreamModal,
  AuthModal,
  ChainOfCustodyModal,
  RepairRequestModal,
  TrackRepairModal,
  TechOnboardingModal,
  RepairReportModal,
  FeedbackModal,
  PaymentsModal,
  NotificationsModal,
  HelpSupportModal,
  EditProfileModal,
  QualityCheckDeliveryModal,
  OrderConversationModal
} from './components/modals';
import { ShieldCheck, Video, Lock, Heart } from 'lucide-react';

function UnifiedDashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
        Loading dashboard...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === 'technician') {
    return <Navigate to="/technician/dashboard" replace />;
  }

  return <Navigate to="/customer/dashboard" replace />;
}

function MainApp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [demoStreamOrder, setDemoStreamOrder] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('admin');
  const [isChainOfCustodyOpen, setIsChainOfCustodyOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTrackRepairOpen, setIsTrackRepairOpen] = useState(false);
  const [trackRepairId, setTrackRepairId] = useState('');
  const [isTechOnboardingOpen, setIsTechOnboardingOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [activeWhatsAppChatOrder, setActiveWhatsAppChatOrder] = useState(null);

  const openAuth = (role = 'customer') => {
    navigate('/login', { state: { role } });
  };

  const handleOpenChat = async (targetOrder = null) => {
    if (targetOrder) {
      setActiveWhatsAppChatOrder(targetOrder);
      return;
    }

    // 1. Check cached orders from localStorage
    try {
      const localSaved = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
      if (localSaved.length > 0) {
        setActiveWhatsAppChatOrder(localSaved[0]);
        return;
      }
    } catch {}

    // 2. Fetch latest repair from API
    try {
      const activeToken = localStorage.getItem('token') || localStorage.getItem('livefix_token') || '';
      const res = await fetch('/api/repairs', {
        headers: activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        const apiOrders = data.orders || [];
        if (apiOrders.length > 0) {
          setActiveWhatsAppChatOrder(apiOrders[0]);
          return;
        }
      }
    } catch {}

    // 3. Fallback default order so the WhatsApp chat always opens immediately
    setActiveWhatsAppChatOrder({
      id: 1,
      order_number: 'EOF-2026-91889',
      customer_name: user?.role === 'technician' ? 'Customer' : (user?.name || 'Customer'),
      technician_name: user?.role === 'technician' ? (user?.name || 'Technician') : 'Shabber Hussain (Technician)',
      laptop_brand: 'Dell XPS 13',
      laptop_model: '9315 / 9310',
      issue_category: 'Keyboard stuck',
      status: 'In Progress',
      quote_amount: 500,
      technician_notes: 'i can fix this for this price because its takes too much time to repair',
      quote_approved: false
    });
  };

  const handleOpenTrackWithId = (id = '') => {
    setTrackRepairId(id);
    setIsTrackRepairOpen(true);
  };

  // One-time clean slate: purge all customer orders from localStorage and backend
  useEffect(() => {
    const purgeKey = 'livefix_purged_old_orders_v3';
    if (!localStorage.getItem(purgeKey)) {
      localStorage.removeItem('livefix_all_orders');
      localStorage.removeItem('livefix_latest_order');
      localStorage.removeItem('livefix_customer_orders');
      localStorage.removeItem('livefix_offline_orders');
      localStorage.removeItem('livefix_mock_orders');
      localStorage.setItem('livefix_all_orders', '[]');
      localStorage.setItem(purgeKey, 'true');
      fetch('/api/repairs/clear-all', { method: 'POST' }).catch(() => {});
    }
  }, []);

  const sampleDemoOrder = {
    id: 1,
    order_number: 'LIVE-PREVIEW',
    customer_name: 'Live Observer',
    technician_name: 'Cleanroom Specialist',
    laptop_brand: 'Workbench',
    laptop_model: 'Station 4 Camera',
    serial_number: 'CAM-LIVE-4K',
    issue_category: 'Diagnostic Video Stream',
    status: 'In Progress',
    quote_amount: 0,
    quote_approved: true,
    stream_session: {
      meet_url: 'https://meet.google.com/eof-live-bench',
      is_live: true,
      current_milestone: 'Live Microscope Bench Feed',
      camera_source: 'Microscope Zoom 100x'
    }
  };

  return (
    <div className="app-root">
      <Navbar 
        onOpenAuthModal={openAuth}
        onOpenRequestModal={() => (user ? navigate('/book') : openAuth('customer'))}
        onOpenTrackRepair={() => navigate('/track-repair')}
        onOpenTechOnboarding={() => (user ? setIsTechOnboardingOpen(true) : openAuth('technician'))}
        onOpenChainOfCustody={() => setIsChainOfCustodyOpen(true)}
        onOpenPayments={() => setIsPaymentsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenMessages={() => handleOpenChat()}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <main className="app-main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <LandingPage
              onStartBooking={() => navigate('/book')}
              onBecomeTechnician={() => navigate('/for-technicians')}
              onSeeHowItWorks={() => navigate('/how-it-works')}
              onWatchLiveDemo={() => setDemoStreamOrder(sampleDemoOrder)}
              onOpenChainOfCustody={() => setIsChainOfCustodyOpen(true)}
              onOpenTrackRepair={(id) => {
                if (id) handleOpenTrackWithId(id);
                else navigate('/track-repair');
              }}
            />
          } />
          <Route path="/home" element={<Navigate to="/" replace />} />

          <Route path="/how-it-works" element={
            <HowItWorksPage 
              onStartBooking={() => navigate('/book')}
              onWatchLiveDemo={() => setDemoStreamOrder(sampleDemoOrder)}
            />
          } />

          <Route path="/services" element={
            <ServicesPage 
              onStartBooking={(problem) => navigate('/book', { state: { prefillProblem: problem } })}
            />
          } />

          <Route path="/for-technicians" element={
            <ForTechniciansPage 
              onRegisterClick={() => setIsTechOnboardingOpen(true)}
              onLoginClick={() => openAuth('technician')}
            />
          } />

          <Route path="/pricing" element={
            <PricingPage 
              onStartBooking={(problem) => navigate('/book', { state: { prefillProblem: problem } })}
            />
          } />

          <Route path="/track-repair" element={
            <TrackRepairPage 
              onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)}
            />
          } />
          <Route path="/track" element={<Navigate to="/track-repair" replace />} />

          {/* Authentication Dedicated Pages */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          <Route path="/book" element={
            <BookRepair
              onBookingSuccess={(newOrder) => {
                navigate('/customer/dashboard');
              }}
              onCancel={() => navigate('/')}
            />
          } />

          {/* Customer Dashboard */}
          <Route path="/customer/dashboard" element={
            <CustomerDashboard onNewBooking={() => navigate('/book')} />
          } />
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} />
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/administrator" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Technician Dashboard */}
          <Route path="/technician/dashboard" element={
            <TechDashboard />
          } />
          <Route path="/technician" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/tech" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/tech/dashboard" element={<Navigate to="/technician/dashboard" replace />} />

          {/* Universal /dashboard Route -> redirects to active role dashboard */}
          <Route path="/dashboard" element={<UnifiedDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4K Live Stream Modal */}
      {demoStreamOrder && (
        <StreamModal
          order={demoStreamOrder}
          onClose={() => setDemoStreamOrder(null)}
          onApproveQuote={() => {}}
        />
      )}

      {/* Pre-Login & Post-Login Track Repair Modal with 9 Milestones */}
      <TrackRepairModal 
        isOpen={isTrackRepairOpen}
        onClose={() => setIsTrackRepairOpen(false)}
        initialId={trackRepairId}
        onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)}
      />

      {/* For Technicians Registration & Benefits Modal */}
      <TechOnboardingModal 
        isOpen={isTechOnboardingOpen}
        onClose={() => setIsTechOnboardingOpen(false)}
        onRegisterSuccess={() => {
          setIsTechOnboardingOpen(false);
          openAuth('technician');
        }}
      />



      {/* Chain of Custody 5-Stage Logistics Hub Modal */}
      <ChainOfCustodyModal 
        isOpen={isChainOfCustodyOpen}
        onClose={() => setIsChainOfCustodyOpen(false)}
        orderNumber=""
      />

      {/* Repair Request Modal (5-Step Guided Form) */}
      <RepairRequestModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmitSuccess={(order) => {
          navigate('/customer/dashboard');
        }}
      />

      {/* Payments Modal */}
      <PaymentsModal 
        isOpen={isPaymentsOpen}
        onClose={() => setIsPaymentsOpen(false)}
      />

      {/* Notifications Modal */}
      <NotificationsModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onActionClick={(action) => {
          if (action.includes('Live')) setDemoStreamOrder(sampleDemoOrder);
          else if (action.includes('Pickup') || action.includes('Track')) navigate('/track-repair');
        }}
      />

      {/* Help & Support Modal */}
      <HelpSupportModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Edit Profile Modal for All User Types */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* WhatsApp Direct Customer-Technician Chat Modal */}
      {activeWhatsAppChatOrder && (
        <OrderConversationModal
          isOpen={Boolean(activeWhatsAppChatOrder)}
          initialOrder={activeWhatsAppChatOrder}
          onClose={() => setActiveWhatsAppChatOrder(null)}
          onOpenLiveStream={(ord) => {
            setActiveWhatsAppChatOrder(null);
            setDemoStreamOrder(ord || sampleDemoOrder);
          }}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authModalRole}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          if (user?.role === 'admin') navigate('/admin/dashboard');
          else if (user?.role === 'technician') navigate('/technician/dashboard');
          else navigate('/customer/dashboard');
        }}
      />

      {/* Modern Responsive Footer for Live Fix */}
      <footer className="app-footer">
        <div className="container app-footer-inner">
          <div className="app-footer-top">
            <div className="app-footer-brand-wrap">
              <span 
                onClick={() => navigate('/')} 
                className="app-footer-brand-title"
              >
                Live<span className="app-footer-brand-accent">Fix</span>
              </span>
              <span className="app-footer-tagline">Laptop Repair, Without the Guesswork.</span>
            </div>

            <nav className="app-footer-nav" aria-label="Footer Navigation">
              <span className="app-footer-nav-link" onClick={() => navigate('/how-it-works')}>How It Works</span>
              <span className="app-footer-nav-link" onClick={() => navigate('/services')}>Services</span>
              <span className="app-footer-nav-link" onClick={() => navigate('/for-technicians')}>For Technicians</span>
              <span className="app-footer-nav-link" onClick={() => navigate('/pricing')}>Pricing</span>
              <span className="app-footer-nav-link" onClick={() => navigate('/track-repair')}>Track Repair</span>
              {user?.role === 'admin' && (
                <span className="app-footer-nav-link admin-link" onClick={() => navigate('/admin')}>
                  Admin Console
                </span>
              )}
              <span className="app-footer-nav-link" onClick={() => setIsHelpOpen(true)}>Help & Support</span>
            </nav>
          </div>

          <div className="app-footer-bottom">
            <span className="app-footer-copy">© 2026 Live Fix. All rights reserved.</span>
            <div className="app-footer-badges">
              <span>Verified Technician</span>
              <span className="app-footer-arrow">➔</span>
              <span>Secure Pickup</span>
              <span className="app-footer-arrow">➔</span>
              <span>Live Transparent Repair</span>
              <span className="app-footer-arrow">➔</span>
              <span>Quality-Certified Return</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
