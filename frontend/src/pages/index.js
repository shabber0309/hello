/**
 * Live Fix Pages Module Architecture
 * 
 * Organized by role and domain:
 * - Admin (/pages/admin)
 * - Customer (/pages/customer)
 * - Technician (/pages/technician)
 * - Public / Marketing (/pages/public)
 * - Authentication (/pages/auth)
 */

// Admin
export { AdminDashboard } from './admin';

// Customer
export { CustomerDashboard, UserDashboard, BookRepair, TrackRepairPage } from './customer';

// Technician
export { TechDashboard, ForTechniciansPage } from './technician';

// Public Marketing Pages
export { LandingPage, HowItWorksPage, ServicesPage, PricingPage } from './public';

// Auth
export { AuthPage } from './auth';
