import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ServicesPage from './pages/ServicesPage';
import ForTechniciansPage from './pages/ForTechniciansPage';
import PricingPage from './pages/PricingPage';
import TrackRepairPage from './pages/TrackRepairPage';
import BookRepair from './pages/BookRepair';
import UserDashboard from './pages/UserDashboard';
import TechDashboard from './pages/TechDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StreamModal from './components/StreamModal';
import AuthModal from './components/AuthModal';
import ChainOfCustodyModal from './components/ChainOfCustodyModal';
import RepairRequestModal from './components/RepairRequestModal';
import TrackRepairModal from './components/TrackRepairModal';
import TechOnboardingModal from './components/TechOnboardingModal';
import TamperSealModal from './components/TamperSealModal';
import RepairReportModal from './components/RepairReportModal';
import FeedbackModal from './components/FeedbackModal';
import PaymentsModal from './components/PaymentsModal';
import NotificationsModal from './components/NotificationsModal';
import HelpSupportModal from './components/HelpSupportModal';
import EditProfileModal from './components/EditProfileModal';
import QualityCheckDeliveryModal from './components/QualityCheckDeliveryModal';
import AuthPage from './pages/AuthPage';
import SiliconeWorkbenchFrame from './components/SiliconeWorkbenchFrame';
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

  const openAuth = (role = 'admin') => {
    navigate('/login');
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        onOpenAuthModal={openAuth}
        onOpenRequestModal={() => (user ? navigate('/book') : openAuth('customer'))}
        onOpenTrackRepair={() => navigate('/track-repair')}
        onOpenTechOnboarding={() => (user ? setIsTechOnboardingOpen(true) : openAuth('technician'))}
        onOpenChainOfCustody={() => setIsChainOfCustodyOpen(true)}
        onOpenPayments={() => setIsPaymentsOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
      />

      <main style={{ flex: 1 }}>
        <SiliconeWorkbenchFrame>
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
                onStartBooking={() => navigate('/book')}
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
              <UserDashboard onNewBooking={() => navigate('/book')} />
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
        </SiliconeWorkbenchFrame>
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

      {/* Modern Footer for FixConnect */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-light)',
        padding: '36px 0 24px',
        color: 'var(--text-dim)',
        fontSize: '0.85rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span 
              onClick={() => navigate('/')} 
              style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem', cursor: 'pointer' }}
            >
              Fix<span style={{ color: 'var(--primary)' }}>Connect</span>
            </span>
            <span>— Laptop Repair, Without the Guesswork.</span>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/how-it-works')}>How It Works</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/services')}>Services</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/for-technicians')}>For Technicians</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/pricing')}>Pricing</span>
            <span style={{ cursor: 'pointer' }} onClick={() => navigate('/track-repair')}>Track Repair</span>
            {user?.role === 'admin' && (
              <span style={{ cursor: 'pointer', color: '#10b981', fontWeight: 700 }} onClick={() => navigate('/admin')}>
                Admin Console
              </span>
            )}
            <span style={{ cursor: 'pointer' }} onClick={() => setIsHelpOpen(true)}>Help & Support</span>
          </div>

          <div style={{ color: 'var(--text-dim)' }}>
            © 2026 FixConnect. Verified Technician ➔ Secure Pickup ➔ Live Transparent Repair ➔ Tamper-Protected Return.
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
