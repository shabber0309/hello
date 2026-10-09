import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import { Navbar, Footer } from './components/layout';
import './App.css';

// Role-based & Public Pages from Central Pages Module
import {
  AdminDashboard,
  CustomerDashboard,
  BookRepair,
  TrackRepairPage,
  TechDashboard,
  ForTechniciansPage,
  LandingPage,
  NotFoundPage,
  HowItWorksPage,
  ServicesPage,
  PricingPage,
  AuthPage
} from './pages';

// Production Modals
import {
  StreamModal,
  ChainOfCustodyModal,
  RepairRequestModal,
  TrackRepairModal,
  TechOnboardingModal,
  PaymentsModal,
  NotificationsModal,
  HelpSupportModal,
  EditProfileModal,
  OrderConversationModal,
  DatabaseMaintenanceModal
} from './components/modals';

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

function HomePageRoute(props) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const allowLanding = searchParams.get('preview') === 'true' || searchParams.get('view') === 'landing';

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--text-muted)' }}>
        Loading...
      </div>
    );
  }

  if (user && !allowLanding) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.role === 'technician') {
      return <Navigate to="/technician/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <LandingPage {...props} />;
}

function CustomerDashboardRoute({ onNewBooking }) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  if (tab === 'chat' || tab === 'messages') {
    return <Navigate to="/customer/chat" replace />;
  }

  return <CustomerDashboard onNewBooking={onNewBooking} />;
}

function UnifiedChatRoute() {
  const { user } = useAuth();
  if (user?.role === 'technician') {
    return <Navigate to="/technician/chat" replace />;
  }
  return <Navigate to="/customer/chat" replace />;
}

function UnifiedOrdersRoute() {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return <Navigate to="/admin/orders" replace />;
  }
  return <Navigate to="/customer/dashboard" replace />;
}

function MainApp() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [demoStreamOrder, setDemoStreamOrder] = useState(null);
  const [isChainOfCustodyOpen, setIsChainOfCustodyOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isTrackRepairOpen, setIsTrackRepairOpen] = useState(false);
  const [trackRepairId, setTrackRepairId] = useState('');
  const [isTechOnboardingOpen, setIsTechOnboardingOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDatabaseMaintenanceOpen, setIsDatabaseMaintenanceOpen] = useState(false);
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
        onOpenRequestModal={() => (user ? navigate('/customer/book') : openAuth('customer'))}
        onOpenTrackRepair={() => navigate('/track-repair')}
        onOpenTechOnboarding={() => (user ? setIsTechOnboardingOpen(true) : openAuth('technician'))}
        onOpenChainOfCustody={() => setIsChainOfCustodyOpen(true)}
        onOpenPayments={() => setIsPaymentsOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenMessages={() => handleOpenChat()}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenDatabaseMaintenance={() => setIsDatabaseMaintenanceOpen(true)}
      />

      <main className="app-main-content">
        <Routes>
          {/* Public Marketing Routes */}
          <Route path="/" element={
            <HomePageRoute
              onStartBooking={() => navigate('/customer/book')}
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
          <Route path="/landing" element={
            <LandingPage
              onStartBooking={() => navigate('/customer/book')}
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
              onStartBooking={() => navigate('/customer/book')}
              onWatchLiveDemo={() => setDemoStreamOrder(sampleDemoOrder)}
            />
          } />

          <Route path="/services" element={
            <ServicesPage 
              onStartBooking={(problem) => navigate('/customer/book', { state: { prefillProblem: problem } })}
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
              onStartBooking={(problem) => navigate('/customer/book', { state: { prefillProblem: problem } })}
            />
          } />

          <Route path="/track-repair" element={
            <TrackRepairPage 
              onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)}
            />
          } />
          <Route path="/track" element={<Navigate to="/track-repair" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/register" element={<AuthPage initialMode="register" />} />
          <Route path="/signin" element={<Navigate to="/login" replace />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Customer Booking Slot Route: /customer/book */}
          <Route path="/customer/book" element={
            <BookRepair
              onBookingSuccess={() => navigate('/customer/dashboard')}
              onCancel={() => navigate('/customer/dashboard')}
            />
          } />
          <Route path="/book" element={<Navigate to="/customer/book" replace />} />

          {/* Customer Dashboard & Chat Routes */}
          <Route path="/customer/dashboard" element={
            <CustomerDashboardRoute onNewBooking={() => navigate('/customer/book')} />
          } />
          <Route path="/customer/chat" element={
            <CustomerDashboard onNewBooking={() => navigate('/customer/book')} isChatRoute={true} />
          } />
          <Route path="/customer/messages" element={
            <Navigate to="/customer/chat" replace />
          } />
          <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} />
          } />
          <Route path="/admin/users" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="users" />
          } />
          <Route path="/admin/orders" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="orders" />
          } />
          <Route path="/admin/streams" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="streams" />
          } />
          <Route path="/admin/database" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/custody" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="custody" />
          } />
          <Route path="/admin/escrow" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="escrow" />
          } />
          <Route path="/admin/overview" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} initialTab="overview" />
          } />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/administrator" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Technician Routes */}
          <Route path="/technician/dashboard" element={<TechDashboard />} />
          <Route path="/technician/workbench" element={<TechDashboard initialTab="dashboard" />} />
          <Route path="/technician/active" element={<TechDashboard initialTab="active" />} />
          <Route path="/technician/active-jobs" element={<TechDashboard initialTab="active" />} />
          <Route path="/technician/chat" element={<TechDashboard initialTab="chat" />} />
          <Route path="/technician/messages" element={<TechDashboard initialTab="chat" />} />
          <Route path="/technician/live" element={<TechDashboard initialTab="live" />} />
          <Route path="/technician/live-stream" element={<TechDashboard initialTab="live" />} />
          <Route path="/technician/earnings" element={<TechDashboard initialTab="earnings" />} />
          <Route path="/technician/requests" element={<TechDashboard initialTab="requests" />} />
          <Route path="/technician" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/tech" element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="/tech/dashboard" element={<Navigate to="/technician/dashboard" replace />} />

          {/* Universal Clean Route Shortcuts */}
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/orders" element={<UnifiedOrdersRoute />} />
          <Route path="/database" element={<Navigate to="/admin/database" replace />} />
          <Route path="/streams" element={<Navigate to="/admin/streams" replace />} />
          <Route path="/custody" element={<Navigate to="/admin/custody" replace />} />
          <Route path="/escrow" element={<Navigate to="/admin/escrow" replace />} />
          <Route path="/chat" element={<UnifiedChatRoute />} />
          <Route path="/messages" element={<UnifiedChatRoute />} />
          <Route path="/active-jobs" element={<Navigate to="/technician/active" replace />} />
          <Route path="/earnings" element={<Navigate to="/technician/earnings" replace />} />
          <Route path="/workbench" element={<Navigate to="/technician/dashboard" replace />} />

          {/* Universal Role Redirect Route */}
          <Route path="/dashboard" element={<UnifiedDashboard />} />

          {/* 404 Catch-All Page */}
          <Route path="*" element={<NotFoundPage />} />
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

      {/* Track Repair Modal */}
      <TrackRepairModal 
        isOpen={isTrackRepairOpen}
        onClose={() => setIsTrackRepairOpen(false)}
        initialId={trackRepairId}
        onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)}
      />

      {/* For Technicians Registration Modal */}
      <TechOnboardingModal 
        isOpen={isTechOnboardingOpen}
        onClose={() => setIsTechOnboardingOpen(false)}
        onRegisterSuccess={() => {
          setIsTechOnboardingOpen(false);
          openAuth('technician');
        }}
      />

      {/* Chain of Custody Logistics Hub Modal */}
      <ChainOfCustodyModal 
        isOpen={isChainOfCustodyOpen}
        onClose={() => setIsChainOfCustodyOpen(false)}
        orderNumber=""
      />

      {/* Repair Request Modal */}
      <RepairRequestModal 
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmitSuccess={() => {
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
          if (action.includes('Live')) {
            if (user?.role === 'technician') navigate('/technician/live');
            else setDemoStreamOrder(sampleDemoOrder);
          } else if (action.includes('Pickup') || action.includes('Track')) {
            navigate('/track-repair');
          } else if (action.includes('Quote') || action.includes('Warranty')) {
            navigate('/customer/dashboard');
          } else if (action.includes('Job') || action.includes('Repair') || action.includes('Bench')) {
            navigate('/technician/dashboard');
          }
        }}
      />

      {/* Help & Support Modal */}
      <HelpSupportModal 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      {/* Super Admin Database Maintenance & System Control Modal */}
      <DatabaseMaintenanceModal
        isOpen={isDatabaseMaintenanceOpen}
        onClose={() => setIsDatabaseMaintenanceOpen(false)}
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

      {/* Application Footer */}
      <Footer onOpenHelp={() => setIsHelpOpen(true)} />
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
