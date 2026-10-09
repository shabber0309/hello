// ==========================================
// Central Live Fix Notification Engine
// Single Source of Truth for System Notifications
// ==========================================

import { 
  Radio, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Wrench, 
  ShieldCheck, 
  Database 
} from 'lucide-react';

/**
 * Pure generator for system notifications strictly based on active lifecycle events
 * (No conversational chat messages).
 */
export function generateSystemNotifications(orders = [], user = null, dismissedIds = []) {
  if (!user || !Array.isArray(orders)) return [];

  const isTech = user?.role === 'technician';
  const isAdmin = user?.role === 'admin';
  const list = [];
  const dismissedSet = new Set(dismissedIds || []);

  if (isTech) {
    // ---------------- TECHNICIAN NOTIFICATIONS ----------------
    orders.forEach(ord => {
      if (!ord) return;
      const ordNum = ord.order_number || ord.id || 'Order';
      const brandModel = `${ord.laptop_brand || 'Device'} ${ord.laptop_model || ''}`.trim();

      // 1. Live stream broadcast active
      if (ord.stream_session?.is_live) {
        list.push({
          id: `tech-stream-${ordNum}`,
          icon: Radio,
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.12)',
          title: 'Cleanroom 4K Stream Active',
          desc: `Station camera is currently live for ${brandModel} (#${ordNum}). Customer monitoring enabled.`,
          time: 'Live Now',
          action: 'Join Live',
          route: '/technician/live'
        });
      }

      // 2. Customer approved quote & funds locked in escrow
      if (ord.status === 'Quote Approved' || (ord.quote_approved && ord.status === 'In Progress')) {
        list.push({
          id: `tech-quote-approved-${ordNum}`,
          icon: CheckCircle2,
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
          title: 'Quote Approved & Escrow Secured',
          desc: `Customer authorized repair estimate of ₹${ord.quote_amount || 0} for ${brandModel} (#${ordNum}). Escrow locked.`,
          time: 'Payment Secured',
          action: 'Start Repair',
          route: '/technician/dashboard'
        });
      }

      // 3. Device delivered to bench for inspection
      if (ord.status === 'Delivered to Bench' || ord.status === 'Diagnosis / Quoting') {
        list.push({
          id: `tech-bench-${ordNum}`,
          icon: Wrench,
          color: '#0284c7',
          bg: 'rgba(2, 132, 199, 0.12)',
          title: 'Device Arrived at Workbench',
          desc: `${brandModel} (#${ordNum}) delivered to cleanroom. Ready for camera inspection & micro-diagnostics.`,
          time: 'Action Required',
          action: 'Review Job',
          route: '/technician/dashboard'
        });
      }

      // 4. New incoming customer lead
      if (ord.status === 'Order Placed') {
        list.push({
          id: `tech-lead-${ordNum}`,
          icon: AlertTriangle,
          color: '#f97316',
          bg: 'rgba(249, 115, 22, 0.12)',
          title: 'New Customer Repair Lead',
          desc: `Incoming request for ${brandModel} (#${ordNum}) — ${ord.issue_category || 'Hardware Issue'}. Target budget ₹${ord.customer_selected_price || ord.base_price_min || '1,500'}.`,
          time: 'New Request',
          action: 'Review Job',
          route: '/technician/dashboard'
        });
      }

      // 5. Ready for final quality check and packaging
      if (ord.status === 'Repaired & Awaiting Payment' || ord.status === 'Ready for Delivery') {
        list.push({
          id: `tech-qa-${ordNum}`,
          icon: ShieldCheck,
          color: '#059669',
          bg: 'rgba(5, 150, 105, 0.12)',
          title: 'Repair Complete — Ready for QA & Dispatch',
          desc: `Hardware service verified for ${brandModel} (#${ordNum}). Apply tamper-proof seal and initiate dispatch.`,
          time: 'Ready',
          action: 'View Order',
          route: '/technician/dashboard'
        });
      }
    });
  } else if (isAdmin) {
    // ---------------- ADMIN NOTIFICATIONS ----------------
    const liveOrders = orders.filter(o => o?.stream_session?.is_live);
    if (liveOrders.length > 0) {
      list.push({
        id: 'admin-live-streams',
        icon: Radio,
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        title: `${liveOrders.length} Cleanroom Stream${liveOrders.length > 1 ? 's' : ''} Online`,
        desc: `Microscope broadcast feeds are active across cleanroom stations with sub-second latency.`,
        time: 'Live',
        action: 'Monitor Streams',
        route: '/admin/dashboard'
      });
    }

    const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Diagnosis / Quoting');
    if (pendingOrders.length > 0) {
      list.push({
        id: 'admin-pending-leads',
        icon: AlertTriangle,
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        title: `${pendingOrders.length} Open Repair Orders`,
        desc: `Orders active in system pipeline awaiting technician allocation or doorstep logistics.`,
        time: 'Active Pipeline',
        action: 'View Database',
        route: '/admin/dashboard'
      });
    }
  } else {
    // ---------------- CUSTOMER NOTIFICATIONS ----------------
    orders.forEach(ord => {
      if (!ord) return;
      const ordNum = ord.order_number || ord.id || 'Order';
      const brandModel = `${ord.laptop_brand || 'Device'} ${ord.laptop_model || ''}`.trim();

      // 1. Live camera stream started
      if (ord.stream_session?.is_live) {
        list.push({
          id: `cust-stream-${ordNum}`,
          icon: Radio,
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.12)',
          title: 'Live Cleanroom Stream Online',
          desc: `Your technician is broadcasting live on the workbench camera for ${brandModel} (#${ordNum}). Watch the inspection live.`,
          time: 'Live Now',
          action: 'Join Live',
          route: '/customer/dashboard'
        });
      }

      // 2. Diagnostic quote awaiting approval
      if (ord.status === 'Quote Pending' || (ord.quote_amount > 0 && !ord.quote_approved)) {
        list.push({
          id: `cust-quote-${ordNum}`,
          icon: AlertTriangle,
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.12)',
          title: 'Repair Estimate Awaiting Your Approval',
          desc: `Technician submitted diagnostic estimate of ₹${ord.quote_amount || 0} for ${brandModel}. Approve to authorize parts & repair.`,
          time: 'Action Required',
          action: 'Review Quote',
          route: '/customer/dashboard'
        });
      }

      // 3. Pickup scheduled / Transit active
      if (ord.status === 'Order Placed' || ord.status === 'Pickup Scheduled') {
        list.push({
          id: `cust-pickup-${ordNum}`,
          icon: Truck,
          color: '#2563eb',
          bg: 'rgba(37, 99, 235, 0.12)',
          title: 'Doorstep Pickup Scheduled',
          desc: `Secure transit arranged for ${brandModel} (#${ordNum}). Verified courier will collect in tamper-evident antistatic pouch.`,
          time: 'Scheduled',
          action: 'Track Pickup',
          route: '/track-repair'
        });
      }

      // 4. Device received at Cleanroom Bench
      if (ord.status === 'Delivered to Bench' || ord.status === 'Diagnosis / Quoting') {
        list.push({
          id: `cust-bench-${ordNum}`,
          icon: Wrench,
          color: '#0284c7',
          bg: 'rgba(2, 132, 199, 0.12)',
          title: 'Device Reached Cleanroom Bench',
          desc: `Your ${brandModel} (#${ordNum}) has arrived safely at Cleanroom Bench #4. Tamper seal verified under ESD protocol.`,
          time: 'At Workbench',
          action: 'Track Device',
          route: '/track-repair'
        });
      }

      // 5. Repair in progress on bench
      if (ord.status === 'In Repair' || ord.status === 'Quote Approved') {
        list.push({
          id: `cust-repair-${ordNum}`,
          icon: Wrench,
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
          title: 'Repair Underway on Bench',
          desc: `Technician is actively working on ${brandModel} (#${ordNum}). Component replacements and soldering in progress.`,
          time: 'In Progress',
          action: 'Watch Live',
          route: '/customer/dashboard'
        });
      }

      // 6. Quality testing passed / Ready for dispatch
      if (ord.status === 'Quality Testing' || ord.status === 'Ready for Delivery') {
        list.push({
          id: `cust-ready-${ordNum}`,
          icon: CheckCircle2,
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.12)',
          title: 'Quality Check Passed — Ready for Dispatch',
          desc: `Your ${brandModel} (#${ordNum}) passed all 6 hardware benchmark tests and is packed with a new holographic tamper seal.`,
          time: 'Ready',
          action: 'Track Device',
          route: '/track-repair'
        });
      }

      // 7. Completed & Warranty Active
      if (ord.status === 'Delivered') {
        list.push({
          id: `cust-delivered-${ordNum}`,
          icon: ShieldCheck,
          color: '#059669',
          bg: 'rgba(5, 150, 105, 0.12)',
          title: 'Delivered — 6-Month Warranty Active',
          desc: `Repair complete for ${brandModel} (#${ordNum}). 180-day comprehensive Live Fix warranty certificate is now active.`,
          time: 'Warranty Active',
          action: 'View Warranty',
          route: '/customer/dashboard'
        });
      }
    });
  }

  // Filter out any dismissed IDs
  return list.filter(n => !dismissedSet.has(n.id));
}

/**
 * Returns the unread notification count directly from storage
 */
export function getStoredUnreadCount(user) {
  if (!user) return 0;
  try {
    const orders = JSON.parse(localStorage.getItem('livefix_all_orders') || '[]');
    const dismissed = JSON.parse(localStorage.getItem('livefix_dismissed_notifications') || '[]');
    const notifs = generateSystemNotifications(orders, user, dismissed);
    return notifs.length;
  } catch {
    return 0;
  }
}

/**
 * Notify all components that notifications have been read, cleared, or updated
 */
export function emitNotificationsChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('livefix_notifications_changed'));
  }
}
