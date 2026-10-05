import React, { useState } from 'react';
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
  TamperSealModal,
  RepairReportModal,
  FeedbackModal,
  PaymentsModal,
  NotificationsModal,
  HelpSupportModal,
  EditProfileModal,
  QualityCheckDeliveryModal
} from './components/modals';
import { ShieldCheck, Video, Lock, Heart } from 'lucide-react';

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
  const [isTamperSealOpen, setIsTamperSealOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const openAuth = (role = 'customer') => {
    navigate('/login', { state: { role } });
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
    tamper_seal_code: 'VERIFIED',
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
        onOpenMessages={() => setDemoStreamOrder(sampleDemoOrder)}
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
              onOpenTamperSeal={() => setIsTamperSealOpen(true)}
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
                navigate('/dashboard');
              }}
              onCancel={() => navigate('/')}
            />
          } />

          {/* Role Protected / Dedicated Portals */}
          <Route path="/dashboard" element={
            <CustomerDashboard onNewBooking={() => navigate('/book')} />
          } />

          <Route path="/technician" element={
            <TechDashboard />
          } />
          <Route path="/tech" element={<Navigate to="/technician" replace />} />

          <Route path="/admin" element={
            <AdminDashboard onOpenLiveStream={() => setDemoStreamOrder(sampleDemoOrder)} />
          } />

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

      {/* Tamper Seal Security Modal */}
      <TamperSealModal 
        isOpen={isTamperSealOpen}
        onClose={() => setIsTamperSealOpen(false)}
        sealId=""
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
          navigate('/dashboard');
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

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialRole={authModalRole}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedInUser) => {
          if (loggedInUser?.role === 'admin') navigate('/admin');
          else if (loggedInUser?.role === 'technician') navigate('/technician');
          else navigate('/dashboard');
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
              <span>Tamper-Protected Return</span>
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
