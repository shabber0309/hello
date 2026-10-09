import { request } from './api';

export const repairService = {
  // Fetch active repairs and marketplace requests
  getRepairs: async () => {
    return request('/api/repairs');
  },

  // Accept a repair request
  acceptRepair: async (orderId, targetQuote = 0, technicianNotes = '') => {
    return request(`/api/repairs/${orderId}/accept`, {
      method: 'POST',
      body: JSON.stringify({
        quote_amount: targetQuote,
        technician_notes: technicianNotes || 'Accepted by Cleanroom Specialist. Scheduled for immediate workbench diagnostics.'
      })
    });
  },

  // Update order status / milestone
  updateStatus: async (orderId, newStatus, technicianNotes = '') => {
    return request(`/api/repairs/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: newStatus,
        technician_notes: technicianNotes || `Milestone advanced to ${newStatus} on cleanroom bench.`
      })
    });
  },

  // Submit diagnostic quote
  submitQuote: async (orderId, quoteAmount, technicianNotes = '') => {
    return request(`/api/repairs/${orderId}/quote`, {
      method: 'POST',
      body: JSON.stringify({
        quote_amount: parseFloat(quoteAmount),
        technician_notes: technicianNotes
      })
    });
  },

  // Log part replacement
  logPart: async (orderId, { part_name, old_serial_no, new_serial_no, cost }) => {
    return request(`/api/repairs/${orderId}/parts`, {
      method: 'POST',
      body: JSON.stringify({
        part_name,
        old_serial_no,
        new_serial_no,
        cost: parseFloat(cost || 0)
      })
    });
  },

  // Verify unbox OTP
  verifyUnboxOtp: async (orderRef, otp) => {
    return request(`/api/repairs/${orderRef}/verify-unbox-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp: String(otp).trim() })
    });
  },

  // Notify packing ready & generate packing OTP
  notifyPacking: async (orderRef) => {
    return request(`/api/repairs/${orderRef}/notify-packing`, {
      method: 'POST',
      body: JSON.stringify({})
    });
  },

  // Verify packing OTP
  verifyPackingOtp: async (orderRef, otp) => {
    return request(`/api/repairs/${orderRef}/verify-packing-otp`, {
      method: 'POST',
      body: JSON.stringify({ otp: String(otp).trim() })
    });
  },

  // Request on-demand credentials
  requestCredentials: async (orderId, note) => {
    return request(`/api/repairs/${orderId}/request-credentials`, {
      method: 'POST',
      body: JSON.stringify({ note })
    });
  }
};
