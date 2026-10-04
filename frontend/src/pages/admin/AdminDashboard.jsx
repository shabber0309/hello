import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Wrench, 
  Laptop, 
  Database, 
  Edit3, 
  Trash2, 
  Plus, 
  RefreshCw, 
  DollarSign, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Lock,
  X,
  Radio,
  FileCheck,
  Video,
  Download,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
  Activity,
  Check,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Phone,
  Key,
  Power,
  BatteryCharging,
  Star,
  Award,
  MessageCircle,
  Eye,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { StreamModal, OrderConversationModal } from '../../components/modals';
import './AdminDashboard.css';

export default function AdminDashboard({ onOpenLiveStream }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'orders', 'streams', 'custody', 'escrow', 'database'
  const [adminConversationOrder, setAdminConversationOrder] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Sync activeTab with URL query param ?tab=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'users', 'orders', 'streams', 'custody', 'escrow', 'database'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    if (params.get('action') === 'add-user') {
      setIsAddUserOpen(true);
    }
  }, [location.search]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/admin?tab=${tabId}`, { replace: true });
  };
  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [liveStreamOrder, setLiveStreamOrder] = useState(null);

  // Editing Modals state
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Forms state
  const [userForm, setUserForm] = useState({ name: '', username: '', email: '', phone: '', role: 'customer', password: '' });
  const [orderForm, setOrderForm] = useState({ status: '', quote_amount: 0, quote_approved: false, tamper_seal_code: '', technician_id: '', technician_notes: '' });

  const getAuthHeaders = () => {
    const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || '';
    return {
      'Content-Type': 'application/json',
      ...(activeToken ? { 'Authorization': `Bearer ${activeToken}` } : {})
    };
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [overviewRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/overview', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/orders', { headers })
      ]);

      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setOverview(oData);
      }
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersList(uData.users || []);
      }
      if (ordersRes.ok) {
        const ordData = await ordersRes.json();
        setOrdersList(ordData.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 4-second live polling to track active repair progress, handoffs & new registrations
    const interval = setInterval(() => {
      fetchData(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [token]);

  const handleEditUserClick = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone || '',
      whatsapp: u.whatsapp || u.phone || '',
      address: u.address || '',
      city: u.city || 'Hyderabad',
      landmark: u.landmark || '',
      pincode: u.pincode || '',
      bench_station: u.bench_station || '',
      specialization: u.specialization || '',
      certifications: u.certifications || '',
      payout_upi: u.payout_upi || '',
      role: u.role,
      password: ''
    });
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`User ${userForm.name} updated successfully!`);
        setEditingUser(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to update user');
      }
    } catch (err) {
      alert('Network error updating user');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userForm)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`User ${userForm.name} created successfully!`);
        setIsAddUserOpen(false);
        setUserForm({ name: '', username: '', email: '', phone: '', role: 'customer', password: '' });
        fetchData();
      } else {
        alert(data.error || 'Failed to create user');
      }
    } catch (err) {
      alert('Network error creating user');
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete user @${username}?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`User deleted successfully`);
        fetchData();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleEditOrderClick = (ord) => {
    setEditingOrder(ord);
    setOrderForm({
      status: ord.status,
      quote_amount: ord.quote_amount,
      quote_approved: ord.quote_approved,
      tamper_seal_code: ord.tamper_seal_code || '',
      technician_id: ord.technician_id || '',
      technician_notes: ord.technician_notes || ''
    });
  };

  const handleSaveOrder = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const res = await fetch(`/api/admin/orders/${editingOrder.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderForm)
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg(`Order ${editingOrder.order_number} updated successfully!`);
        setEditingOrder(null);
        fetchData();
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (err) {
      alert('Network error updating order');
    }
  };

  const handleDeleteOrder = async (id, orderNumber) => {
    if (!window.confirm(`Are you sure you want to permanently delete Order ${orderNumber}?`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setFeedbackMsg(`Order ${orderNumber} deleted successfully`);
        fetchData();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      alert('Network error deleting order');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('WARNING: This will completely wipe all tables and reset the database to a clean state. Proceed?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-database', { 
        method: 'POST',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg('Database completely wiped and freshly initialized clean!');
        fetchData();
      } else {
        alert(data.error || 'Failed to reset database');
      }
    } catch (err) {
      alert('Error triggering database reset');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      overview,
      users: usersList,
      orders: ordersList
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `livefix-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setFeedbackMsg('Database backup JSON successfully downloaded!');
  };

  const filteredUsers = usersList.filter(u => {
    if (!u) return false;
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q));
    return matchesRole && matchesSearch;
  });

  const filteredOrders = ordersList.filter(o => {
    if (!o) return false;
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const q = orderSearchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (o.order_number && o.order_number.toLowerCase().includes(q)) ||
      (o.laptop_brand && o.laptop_brand.toLowerCase().includes(q)) ||
      (o.laptop_model && o.laptop_model.toLowerCase().includes(q)) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
      (o.technician_name && o.technician_name.toLowerCase().includes(q)) ||
      (o.tamper_seal_code && o.tamper_seal_code.toLowerCase().includes(q)) ||
      (o.issue_category && o.issue_category.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-dashboard-root">
      <div className="admin-dashboard-container">
        
        {/* Admin Header */}
        <div className="admin-header-row">
          <div className="admin-header-title-block">
            <div className="admin-header-badge-row">
              <span className="badge badge-primary admin-header-badge">
                <ShieldCheck size={14} /> SUPER ADMIN PORTAL
              </span>
              <span className="admin-header-subtext">
                Master Database, Live Feeds & Marketplace Control
              </span>
            </div>
            <h1 className="admin-header-heading">
              Master Database & Admin Console
            </h1>
            <p className="admin-header-user-meta">
              Logged in as <strong>{user?.name || 'Administrator'} (Admin)</strong> • <span className="admin-header-mono-tag">{user?.email || 'admin@livefix.com'}</span>
            </p>
          </div>

          <div className="admin-header-actions">
            <button 
              className="btn-secondary admin-action-btn" 
              onClick={fetchData}
              title="Refresh Data"
            >
              <RefreshCw size={15} /> Refresh
            </button>

            <button 
              className="btn-cta admin-action-btn" 
              onClick={() => {
                setUserForm({ name: '', username: '', email: '', phone: '', role: 'customer', password: 'password123' });
                setIsAddUserOpen(true);
              }}
            >
              <Plus size={16} /> Add User
            </button>

            <button 
              className="btn-secondary admin-action-btn" 
              onClick={handleExportBackup}
            >
              <Download size={15} /> Export JSON
            </button>

            <button 
              onClick={handleResetDatabase}
              className="admin-btn-danger-soft"
            >
              <Database size={15} /> Reset / Re-Seed Database
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="admin-feedback-banner">
            <div className="admin-feedback-content">
              <CheckCircle2 size={18} /> {feedbackMsg}
            </div>
            <button onClick={() => setFeedbackMsg('')} className="admin-feedback-close">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-tabs-nav">
          <button
            onClick={() => handleTabChange('overview')}
            className={`admin-tab-btn ${activeTab === 'overview' ? 'admin-tab-btn-active' : ''}`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>

          <button
            onClick={() => handleTabChange('users')}
            className={`admin-tab-btn ${activeTab === 'users' ? 'admin-tab-btn-active' : ''}`}
          >
            <Users size={16} /> All Users <span className="admin-tab-pill-count">{usersList.length}</span>
          </button>

          <button
            onClick={() => handleTabChange('orders')}
            className={`admin-tab-btn ${activeTab === 'orders' ? 'admin-tab-btn-active' : ''}`}
          >
            <Laptop size={16} /> All Repair Orders <span className="admin-tab-pill-count">{ordersList.length}</span>
          </button>

          <button
            onClick={() => handleTabChange('streams')}
            className={`admin-tab-btn ${activeTab === 'streams' ? 'admin-tab-btn-active' : ''}`}
          >
            <Radio size={16} /> Live Cleanroom Feeds
          </button>

          <button
            onClick={() => handleTabChange('custody')}
            className={`admin-tab-btn ${activeTab === 'custody' ? 'admin-tab-btn-active' : ''}`}
          >
            <Lock size={16} /> Tamper Seals <span className="admin-tab-pill-count">{ordersList.filter(o => o.tamper_seal_code).length}</span>
          </button>

          <button
            onClick={() => handleTabChange('escrow')}
            className={`admin-tab-btn ${activeTab === 'escrow' ? 'admin-tab-btn-active' : ''}`}
          >
            <DollarSign size={16} /> Escrow & Financials
          </button>

          <button
            onClick={() => handleTabChange('database')}
            className={`admin-tab-btn ${activeTab === 'database' ? 'admin-tab-btn-active' : ''}`}
          >
            <Database size={16} /> System & Health
          </button>
        </div>

        {/* ========================================================
            TAB 0: EXECUTIVE OVERVIEW & PLATFORM METRICS
           ======================================================== */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 4 High-Level Metrics Cards */}
            <div className="admin-metrics-grid" style={{ marginBottom: 0 }}>
              <div className="admin-metric-card">
                <div className="admin-metric-label">TOTAL USERS</div>
                <div className="admin-metric-value admin-metric-value-primary">
                  {overview?.total_users ?? usersList.length}
                </div>
                <div className="admin-metric-subtext">
                  {overview?.customers_count ?? 0} Customers • {overview?.technicians_count ?? 0} Techs
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-label">TOTAL REPAIRS</div>
                <div className="admin-metric-value admin-metric-value-orange">
                  {overview?.total_orders ?? ordersList.length}
                </div>
                <div className="admin-metric-subtext">
                  {overview?.in_repair_count ?? 0} Active / Bench Cleanrooms
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-label">TOTAL VOLUME</div>
                <div className="admin-metric-value admin-metric-value-success">
                  ₹{overview?.total_volume != null ? Number(overview.total_volume).toLocaleString('en-IN') : '0'}
                </div>
                <div className="admin-metric-subtext">
                  Gross marketplace GMV
                </div>
              </div>

              <div className="admin-metric-card">
                <div className="admin-metric-label">ESCROW HELD IN VAULT</div>
                <div className="admin-metric-value admin-metric-value-sky">
                  ₹{overview?.escrow_held != null ? Number(overview.escrow_held).toLocaleString('en-IN') : '0'}
                </div>
                <div className="admin-metric-subtext">
                  100% Protected until customer delivery
                </div>
              </div>
            </div>

            {/* Platform Quick Health & Distribution Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* User Roles Breakdown */}
              <div className="tech-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color="var(--primary)" /> Registered User Base
                  </h3>
                  <button onClick={() => handleTabChange('users')} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
                    Manage Users <ArrowRight size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Customers</span>
                    <strong style={{ color: 'var(--primary)' }}>{overview?.customers_count ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Cleanroom Technicians</span>
                    <strong style={{ color: '#ea580c' }}>{overview?.technicians_count ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>System Administrators</span>
                    <strong style={{ color: '#10b981' }}>{overview?.admins_count ?? 1}</strong>
                  </div>
                </div>
              </div>

              {/* Order Milestones Breakdown */}
              <div className="tech-card" style={{ padding: '22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Laptop size={18} color="var(--cta-orange)" /> Repair Order Pipeline
                  </h3>
                  <button onClick={() => handleTabChange('orders')} className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>
                    View Orders <ArrowRight size={13} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Orders Placed (Awaiting Acceptance)</span>
                    <strong style={{ color: '#d97706' }}>{overview?.placed_count ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Active On Bench / In Repair</span>
                    <strong style={{ color: '#2563eb' }}>{overview?.in_repair_count ?? 0}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-main)', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ fontWeight: 600 }}>Successfully Delivered & Closed</span>
                    <strong style={{ color: '#10b981' }}>{overview?.delivered_count ?? 0}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 1: USERS MANAGEMENT TABLE
           ======================================================== */}
        {activeTab === 'users' && (
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['all', 'customer', 'technician', 'admin'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: userRoleFilter === r ? 'var(--primary)' : 'var(--bg-card-subtle)',
                      color: userRoleFilter === r ? '#ffffff' : 'var(--text-muted)',
                      textTransform: 'capitalize',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {r === 'all' ? 'All Roles' : `${r}s`}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  placeholder="Search user, email, username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Name & Username</th>
                    <th style={{ padding: '12px 16px' }}>Email & Phone</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Repairs & Jobs</th>
                    <th style={{ padding: '12px 16px' }}>Total Volume</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin';
                    const isTech = u.role === 'technician';
                    const userOrders = ordersList.filter(o => isTech ? o.technician_id === u.id : o.customer_id === u.id);
                    const totalUserVol = userOrders.reduce((sum, o) => sum + (o.final_agreed_price || o.customer_selected_price || o.quote_amount || 0), 0);

                    return (
                      <React.Fragment key={u.id}>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                            #{u.id}
                          </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                            @{u.username}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          <div>{u.email}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{u.phone || 'No phone'}</div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${isAdmin ? 'badge-verified' : (isTech ? 'badge-orange' : 'badge-primary')}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {userOrders.length > 0 ? (
                            <button
                              onClick={() => {
                                setOrderSearchQuery(u.name || u.email);
                                handleTabChange('orders');
                              }}
                              style={{
                                background: 'rgba(37, 99, 235, 0.1)',
                                border: '1px solid rgba(37, 99, 235, 0.3)',
                                color: 'var(--primary)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              title={`Filter repair orders for ${u.name}`}
                            >
                              <Laptop size={12} /> {userOrders.length} {userOrders.length === 1 ? 'Repair' : 'Repairs'} &rarr;
                            </button>
                          ) : (
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>0 orders</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: totalUserVol > 0 ? 'var(--success)' : 'var(--text-dim)' }}>
                          ₹{totalUserVol.toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}
                              style={{
                                background: expandedUserId === u.id ? 'var(--primary)' : 'var(--bg-card-subtle)',
                                border: '1px solid var(--border-light)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: expandedUserId === u.id ? '#ffffff' : 'var(--text-main)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                              title="Inspect 100% of user profile, contact, logistics, and job data"
                            >
                              <Eye size={13} /> {expandedUserId === u.id ? 'Hide Dossier' : 'All Data'}
                            </button>

                            <button
                              onClick={() => handleEditUserClick(u)}
                              style={{
                                background: 'var(--bg-card-subtle)',
                                border: '1px solid var(--border-light)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit3 size={13} /> Edit
                            </button>

                            {u.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#ef4444',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* EXHAUSTIVE USER DOSSIER ACCORDION (100% Data Visibility) */}
                      {expandedUserId === u.id && (
                        <tr key={`dossier-${u.id}`} style={{ background: 'var(--bg-card-subtle)' }}>
                          <td colSpan="7" style={{ padding: '16px 20px' }}>
                            <div className="admin-dossier-panel">
                              <div className="admin-dossier-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span className={`badge ${isAdmin ? 'badge-verified' : (isTech ? 'badge-orange' : 'badge-primary')}`}>
                                    {u.role.toUpperCase()} DOSSIER
                                  </span>
                                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{u.name}</strong>
                                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                                    (@{u.username} • User ID #{u.id})
                                  </span>
                                  <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
                                    Verified Intact
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {u.whatsapp && (
                                    <a
                                      href={`https://wa.me/${(u.whatsapp || u.phone || '').replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="admin-whatsapp-btn"
                                      title="Open direct WhatsApp chat with user"
                                    >
                                      <MessageCircle size={14} /> WhatsApp Chat
                                    </a>
                                  )}
                                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                    Registered: {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Active Member'}
                                  </span>
                                </div>
                              </div>

                              {/* Customer Dossier Grid */}
                              {!isTech && !isAdmin && (
                                <div className="admin-dossier-grid">
                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Direct Communication</div>
                                    <div className="admin-dossier-value">
                                      📞 {u.phone || 'No phone'}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                      ✉️ {u.email}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '2px' }}>
                                      💬 WA: {u.whatsapp || u.phone || 'Same as phone'}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Doorstep Logistics & Address</div>
                                    <div className="admin-dossier-value" style={{ fontSize: '0.82rem' }}>
                                      {u.address || 'Flat 302, Cyber Towers View'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                      Landmark: {u.landmark || 'Hitec City Road, Near Cyber Gateway'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                                      City: {u.city || 'Hyderabad'} - {u.pincode || '500081'}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Lifetime Spend & Volume</div>
                                    <div className="admin-dossier-value admin-dossier-mono" style={{ color: 'var(--success)', fontSize: '1.2rem', fontWeight: 800 }}>
                                      ₹{totalUserVol.toLocaleString('en-IN')}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      Total Orders: {userOrders.length} • Active: {userOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box" style={{ gridColumn: 'span 2' }}>
                                    <div className="admin-dossier-label">Complete Order History ({userOrders.length} Orders)</div>
                                    {userOrders.length === 0 ? (
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No repair orders placed yet.</span>
                                    ) : (
                                      <div className="admin-dossier-pills">
                                        {userOrders.map(ord => (
                                          <button
                                            key={ord.id}
                                            onClick={() => {
                                              setOrderSearchQuery(ord.order_number);
                                              handleTabChange('orders');
                                            }}
                                            className="admin-dossier-pill"
                                            title="Click to view full order details in All Orders tab"
                                          >
                                            <Laptop size={12} /> {ord.order_number} ({ord.laptop_brand}) • ₹{(ord.final_agreed_price || ord.quote_amount || 0).toLocaleString()} • <span style={{ color: ord.status === 'Delivered' ? '#10b981' : '#f59e0b' }}>{ord.status}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Technician Dossier Grid */}
                              {isTech && (
                                <div className="admin-dossier-grid">
                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Contact & Communication</div>
                                    <div className="admin-dossier-value">
                                      📞 {u.phone || 'No phone'}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                      ✉️ {u.email}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: '#16a34a', marginTop: '2px' }}>
                                      💬 WA: {u.whatsapp || u.phone || 'Direct'}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Cleanroom Station & Specialization</div>
                                    <div className="admin-dossier-value" style={{ color: 'var(--primary)' }}>
                                      🔬 {u.bench_station || 'Bench #3 - Cleanroom ISO-5'}
                                    </div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginTop: '4px' }}>
                                      <strong>Skills:</strong> {u.specialization || 'Motherboard Chip-Level, BGA Micro-Soldering, Liquid Damage Rework'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                      <strong>Certs:</strong> {u.certifications || 'IPC-7711/7721 Certified Rework Specialist, ACMT'}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Reputation & Experience</div>
                                    <div className="admin-dossier-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                      <span>{u.rating || 4.9} / 5.0</span>
                                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                        ({u.experience_years || 6}+ years in field)
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                      Bench Broadcast: {userOrders.some(o => o.stream_session?.is_live) ? '🔴 ACTIVE BROADCAST' : 'Idle / Standby'}
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Escrow Payout & Net Earnings</div>
                                    <div className="admin-dossier-value admin-dossier-mono" style={{ color: 'var(--success)', fontSize: '1.2rem', fontWeight: 800 }}>
                                      ₹{Math.round(totalUserVol * 0.9).toLocaleString('en-IN')}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      90% Payout Cut • UPI: <span style={{ fontFamily: 'var(--font-mono)' }}>{u.payout_upi || `tech.${u.username || 'payout'}@okaxis`}</span>
                                    </div>
                                  </div>

                                  <div className="admin-dossier-box" style={{ gridColumn: 'span 2' }}>
                                    <div className="admin-dossier-label">Assigned Workbench Jobs ({userOrders.length} Jobs)</div>
                                    {userOrders.length === 0 ? (
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No repair jobs currently assigned.</span>
                                    ) : (
                                      <div className="admin-dossier-pills">
                                        {userOrders.map(ord => (
                                          <button
                                            key={ord.id}
                                            onClick={() => {
                                              setOrderSearchQuery(ord.order_number);
                                              handleTabChange('orders');
                                            }}
                                            className="admin-dossier-pill"
                                            title="Click to view assigned job in All Orders tab"
                                          >
                                            <Wrench size={12} /> {ord.order_number} ({ord.laptop_brand} {ord.laptop_model}) • Payout: ₹{Math.round((ord.final_agreed_price || ord.quote_amount || 0) * 0.9).toLocaleString()} • <span style={{ color: ord.status === 'Delivered' ? '#10b981' : '#3b82f6' }}>{ord.status}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Administrator Overview */}
                              {isAdmin && (
                                <div className="admin-dossier-grid">
                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Admin Privileges</div>
                                    <div className="admin-dossier-value">
                                      Full Platform Root Access (Users, Orders, Streams, Escrow, DB)
                                    </div>
                                  </div>
                                  <div className="admin-dossier-box">
                                    <div className="admin-dossier-label">Primary Contact</div>
                                    <div className="admin-dossier-value">
                                      ✉️ {u.email} • 📞 {u.phone || '+91 90000 00000'}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: REPAIR ORDERS MANAGEMENT TABLE
           ======================================================== */}
        {activeTab === 'orders' && (
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'Order Placed', 'Technician Accepted', 'Pickup Scheduled', 'Picked Up', 'Delivered to Bench', 'In Repair', 'Repaired & Awaiting Payment', 'Delivered'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderStatusFilter(s)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: orderStatusFilter === s ? 'var(--primary)' : 'var(--bg-card-subtle)',
                      color: orderStatusFilter === s ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {s === 'all' ? 'All Orders' : s}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-dim)' }} />
                <input 
                  type="text" 
                  placeholder="Search order ID, brand, customer..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID & Serial</th>
                    <th style={{ padding: '12px 16px' }}>Customer & Device</th>
                    <th style={{ padding: '12px 16px' }}>Issue & Logistics</th>
                    <th style={{ padding: '12px 16px' }}>Price Range & Agreed</th>
                    <th style={{ padding: '12px 16px' }}>Tamper Seal & Custody</th>
                    <th style={{ padding: '12px 16px' }}>Assigned Tech</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((ord) => {
                    const isLive = ord.status === 'In Repair';
                    const isDelivered = ord.status === 'Delivered';

                    return (
                      <React.Fragment key={ord.id}>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                            {ord.order_number}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            SN: {ord.serial_number || 'N/A'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800 }}>{ord.laptop_brand} {ord.laptop_model}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                            {ord.customer_name || 'Customer'} • <span style={{ fontFamily: 'var(--font-mono)' }}>{ord.customer_phone || ord.customer_email || ''}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{ord.issue_category}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            📍 {ord.pickup_area ? `${ord.pickup_area}, ${ord.pickup_city}` : (ord.pickup_city || 'Doorstep Pickup')}
                          </div>
                          {ord.pickup_slot && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                              🕒 {ord.pickup_slot}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--success)', fontSize: '0.95rem' }}>
                            ₹{(ord.final_agreed_price || ord.customer_selected_price || ord.quote_amount || 0).toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
                            Base: ₹{ord.base_price_min || 1500} – ₹{ord.base_price_max || 3500}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>
                            {ord.tamper_seal_code || 'TC-VERIFIED'}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                            {ord.unseal_status === 'unsealed' ? 'Unsealed (Authorized)' :
                             ord.reseal_status === 'resealed' ? `Resealed: ${ord.reseal_tamper_code || 'Yes'}` :
                             ord.pickup_status === 'collected' ? 'In Bench Custody' : 'Sealed Intact'}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>
                          {ord.technician_name ? (
                            <span style={{ color: 'var(--cta-orange)', fontWeight: 700 }}>{ord.technician_name}</span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${
                            isLive ? 'badge-live' : 
                            isDelivered ? 'badge-verified' : 
                            ['Technician Accepted', 'Pickup Scheduled', 'Picked Up', 'Delivered to Bench'].includes(ord.status) ? 'badge-primary' :
                            'badge-orange'
                          }`}>
                            {isLive && <Radio size={11} className="pulse-dot" />}
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                              style={{
                                background: expandedOrderId === ord.id ? 'var(--primary)' : 'var(--bg-card-subtle)',
                                border: '1px solid var(--border-light)',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: expandedOrderId === ord.id ? '#ffffff' : 'var(--text-main)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                              title="Inspect complete hardware intake specs, PIN, charger, pre-existing condition, and consent"
                            >
                              <Key size={13} /> {expandedOrderId === ord.id ? 'Hide Specs' : 'Intake Specs'}
                            </button>

                            <button
                              onClick={() => {
                                setLiveStreamOrder(ord);
                              }}
                              title="Inspect Live Feed"
                              style={{
                                background: 'rgba(37, 99, 235, 0.1)',
                                border: '1px solid rgba(37, 99, 235, 0.25)',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: 'var(--primary)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <Video size={13} /> Feed
                            </button>

                            <button
                              onClick={() => setAdminConversationOrder(ord)}
                              title="Inspect Customer-Technician Negotiation & Custody Thread"
                              style={{
                                background: 'rgba(37, 99, 235, 0.1)',
                                border: '1px solid rgba(37, 99, 235, 0.3)',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#2563eb',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <MessageSquare size={13} /> Chat & Custody
                            </button>

                            <button
                              onClick={() => handleEditOrderClick(ord)}
                              style={{
                                background: 'var(--bg-card-subtle)',
                                border: '1px solid var(--border-light)',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: 'var(--text-main)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(ord.id, ord.order_number)}
                              style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                padding: '6px 8px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* COMPREHENSIVE HARDWARE INTAKE SPECIFICATIONS ACCORDION */}
                      {expandedOrderId === ord.id && (
                        <tr key={`intake-${ord.id}`} style={{ background: 'var(--bg-card-subtle)' }}>
                          <td colSpan="8" style={{ padding: '16px 20px' }}>
                            <div className="admin-dossier-panel">
                              <div className="admin-dossier-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <span className="badge badge-primary">
                                    HARDWARE INTAKE SPECIFICATIONS
                                  </span>
                                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>
                                    {ord.laptop_brand} {ord.laptop_model}
                                  </strong>
                                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-dim)', fontSize: '0.82rem' }}>
                                    (Order #{ord.order_number} • SN: {ord.serial_number || 'N/A'})
                                  </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {(ord.customer_whatsapp || ord.customer_phone) && (
                                    <a
                                      href={`https://wa.me/${(ord.customer_whatsapp || ord.customer_phone || '').replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="admin-whatsapp-btn"
                                      title="Open direct WhatsApp with customer"
                                    >
                                      <MessageCircle size={14} /> Customer WhatsApp
                                    </a>
                                  )}
                                  <span className="badge badge-verified" style={{ fontSize: '0.75rem' }}>
                                    Seal: {ord.tamper_seal_code || 'VERIFIED'}
                                  </span>
                                </div>
                              </div>

                              <div className="admin-dossier-grid">
                                <div className="admin-dossier-box">
                                  <div className="admin-dossier-label">Device Access & Diagnostic Credentials</div>
                                  <div className="admin-dossier-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92rem', fontWeight: 800 }}>
                                    {ord.credentials_provided ? (
                                      <span style={{ color: '#16a34a' }}>🔑 PIN: {ord.device_pin}</span>
                                    ) : ord.credentials_requested ? (
                                      <span style={{ color: '#d97706' }}>⏳ Requested by Tech</span>
                                    ) : (
                                      <span style={{ color: 'var(--text-dim)' }}>Not Requested (On-Demand)</span>
                                    )}
                                  </div>
                                  {ord.credentials_request_note && (
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                      Note: "{ord.credentials_request_note}"
                                    </div>
                                  )}
                                </div>

                                <div className="admin-dossier-box">
                                  <div className="admin-dossier-label">Charger & Accessories Intake</div>
                                  <div className="admin-dossier-value" style={{ color: ord.charger_included ? '#16a34a' : 'var(--text-dim)' }}>
                                    ⚡ {ord.charger_included ? (ord.charger_details || 'Original Charger Handed Over') : 'No Charger Handed Over'}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    <strong>Accessories:</strong> {Array.isArray(ord.included_accessories) ? ord.included_accessories.join(', ') : (ord.included_accessories || 'None')}
                                  </div>
                                </div>

                                <div className="admin-dossier-box">
                                  <div className="admin-dossier-label">Declared Pre-Existing Damage & Flaws</div>
                                  <div className="admin-dossier-value" style={{ color: '#d97706', fontSize: '0.85rem' }}>
                                    ⚠️ {Array.isArray(ord.pre_existing_damage) ? ord.pre_existing_damage.join(', ') : (ord.pre_existing_damage || 'None Declared')}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                                    Customer verified condition prior to tamper-proof courier seal.
                                  </div>
                                </div>

                                <div className="admin-dossier-box">
                                  <div className="admin-dossier-label">Customer Target Budget</div>
                                  <div className="admin-dossier-value" style={{ color: 'var(--primary)', fontWeight: 800 }}>
                                    ₹{(ord.customer_selected_price || ord.base_price_min || 0).toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                    Data Backup: {ord.data_backup_status || 'Customer Confirmed'}
                                  </div>
                                </div>

                                <div className="admin-dossier-box" style={{ gridColumn: 'span 2' }}>
                                  <div className="admin-dossier-label">Logistics, Doorstep Address & Gate Pass</div>
                                  <div className="admin-dossier-value" style={{ fontSize: '0.85rem' }}>
                                    📍 {ord.pickup_address}, {ord.pickup_area ? `${ord.pickup_area}, ` : ''}{ord.pickup_city} - {ord.pickup_pincode || '500081'}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                                    <strong>Landmark / Gate Pass:</strong> {ord.pickup_landmark || 'No landmark specified'}
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    <strong>Customer:</strong> {ord.customer_name} ({ord.customer_phone} / {ord.customer_email}) • <strong>Assigned Tech:</strong> {ord.technician_name} ({ord.technician_bench || 'Cleanroom Bench'})
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: LIVE CLEANROOM FEEDS MONITOR
           ======================================================== */}
        {activeTab === 'streams' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Cleanroom Live Camera Feeds</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Super Admin supervisory monitor of all active technician microscope and cleanroom workbench streams
                </p>
              </div>
              <span className="badge badge-live">
                <Radio size={12} className="pulse-dot" /> 3 Cleanrooms Online
              </span>
            </div>

            {ordersList.filter(o => o.stream_session || ['In Repair', 'Delivered to Bench', 'Quality Check'].includes(o.status)).length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={16} color="#ef4444" className="pulse-dot" /> Active Live Workbench Repairs ({ordersList.filter(o => o.stream_session || ['In Repair', 'Delivered to Bench', 'Quality Check'].includes(o.status)).length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {ordersList.filter(o => o.stream_session || ['In Repair', 'Delivered to Bench', 'Quality Check'].includes(o.status)).map((ord) => (
                    <div key={ord.id} className="tech-card" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.35)' }}>
                      <div style={{ position: 'relative', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', background: '#0f172a' }}>
                        <img 
                          src="/hero_laptop.jpg" 
                          alt="Customer Repair Stream" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }} 
                        />
                        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                          <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>
                            <Radio size={10} className="pulse-dot" /> LIVE CLEANROOM FEED
                          </span>
                        </div>
                        <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.88)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Order: {ord.order_number}</span>
                          <span style={{ color: '#10b981' }}>Seal: {ord.tamper_seal_code || 'VERIFIED'}</span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 4px' }}>
                        {ord.laptop_brand} {ord.laptop_model}
                      </h3>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Customer: <strong>{ord.customer_name || 'Customer'}</strong> • Tech: <strong>{ord.technician_name || 'Workbench'}</strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '14px' }}>
                        Issue: {ord.issue_category} • Status: {ord.status}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-primary"
                          onClick={() => setLiveStreamOrder(ord)}
                          style={{ flex: 1, padding: '9px', fontSize: '0.84rem', display: 'flex', justifyContent: 'center', gap: '8px' }}
                        >
                          <Video size={15} /> Join Live Cleanroom Feed
                        </button>
                        <button
                          className="btn-secondary"
                          onClick={() => setAdminConversationOrder(ord)}
                          style={{ padding: '9px 12px', fontSize: '0.84rem' }}
                          title="Open Order Audit & Chat"
                        >
                          <MessageSquare size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {[
                { station: 'Station #4 — Cleanroom Workbench', tech: 'Senior Hardware Specialist', device: 'Diagnostic Testing Station', issue: 'Motherboard Inspection', cam: 'Microscope 100x Zoom', status: 'STANDBY / READY' },
                { station: 'Station #2 — Cleanroom Station', tech: 'Cleanroom Specialist', device: 'Thermal Diagnostics Station', issue: 'Thermal Paste Reapplication', cam: 'Wide Bench Angle', status: 'STANDBY / READY' },
                { station: 'Station #1 — Diagnostics Station', tech: 'Micro-soldering Lead', device: 'Component Diagnostics Station', issue: 'Display Connector Micro-solder', cam: 'Microscope 80x Zoom', status: 'STANDBY / READY' }
              ].map((bench, idx) => (
                <div key={idx} className="tech-card" style={{ padding: '20px', borderRadius: '16px' }}>
                  <div style={{ position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '14px', background: '#0f172a' }}>
                    <img 
                      src="/hero_laptop.jpg" 
                      alt="Cleanroom Stream" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                      <span className="badge badge-live" style={{ fontSize: '0.68rem' }}>
                        <Radio size={10} className="pulse-dot" /> {bench.status}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.85)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Camera: {bench.cam}</span>
                      <span style={{ color: '#10b981' }}>Serial Matched ✓</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 4px' }}>{bench.station}</h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Technician: <strong>{bench.tech}</strong> • Device: {bench.device}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '14px' }}>
                    Current Action: {bench.issue}
                  </div>

                  <button
                    className="btn-primary"
                    onClick={() => {
                      setLiveStreamOrder({
                        order_number: `STATION-CAM-0${idx + 1}`,
                        laptop_brand: bench.device,
                        laptop_model: bench.station,
                        issue_category: bench.issue
                      });
                    }}
                    style={{ width: '100%', padding: '9px', fontSize: '0.84rem', display: 'flex', justifyContent: 'center', gap: '8px' }}
                  >
                    <Video size={15} /> Join Live Cleanroom Feed
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: TAMPER SEALS & CHAIN OF CUSTODY
           ======================================================== */}
        {activeTab === 'custody' && (
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Serialized Tamper Seal Custody Ledger</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                  Anti-tamper holographic barcode registry protecting customer devices during transit & repair
                </p>
              </div>
              <span className="badge badge-verified">
                <ShieldCheck size={13} /> Zero Breaches Reported
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px' }}>Seal Barcode</th>
                    <th style={{ padding: '12px 16px' }}>Order Number</th>
                    <th style={{ padding: '12px 16px' }}>Device Details</th>
                    <th style={{ padding: '12px 16px' }}>Current Seal Status</th>
                    <th style={{ padding: '12px 16px' }}>Handoff Integrity</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((ord, idx) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#10b981' }}>
                        {ord.tamper_seal_code || `SEAL-TX-09${idx}84`}
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        {ord.order_number}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700 }}>{ord.laptop_brand} {ord.laptop_model}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Custody with: {ord.technician_name || 'Transit Courier'}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${
                          ['resealed', 'dispatched'].includes(ord.reseal_status) ? 'badge-verified' :
                          ord.unseal_status === 'unsealed' ? 'badge-orange' :
                          ord.unseal_status === 'unseal_requested' ? 'badge-primary' :
                          'badge-verified'
                        }`} style={{ fontSize: '0.72rem' }}>
                          {['resealed', 'dispatched'].includes(ord.reseal_status) ? `RESEALED (${ord.reseal_tamper_code || 'VERIFIED'})` :
                           ord.unseal_status === 'unsealed' ? 'UNSEALED AT BENCH' :
                           ord.unseal_status === 'unseal_requested' ? 'UNSEAL REQUESTED' :
                           ord.pickup_status === 'collected' ? 'SEALED IN CUSTODY' :
                           'SEAL INTACT & VERIFIED'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700, fontSize: '0.82rem' }}>
                        {ord.reseal_status === 'resealed' ? 'Re-sealed with Tamper Code' :
                         ord.unseal_status === 'unsealed' ? 'Authorized by Customer' :
                         '100% Secure • Unbroken'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => setAdminConversationOrder(ord)}
                          style={{
                            background: 'rgba(37, 99, 235, 0.12)',
                            border: '1px solid rgba(37, 99, 235, 0.35)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#2563eb',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <MessageSquare size={13} /> View Audit & Custody Thread
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: ESCROW & FINANCIAL LEDGER
           ======================================================== */}
        {activeTab === 'escrow' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div className="tech-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>GROSS PLATFORM VOLUME</div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{(overview?.total_volume || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Total client repair quotes processed</div>
              </div>

              <div className="tech-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>PLATFORM REVENUE (10%)</div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{Math.round((overview?.total_volume || 0) * 0.1).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Live Fix 10% platform facilitation</div>
              </div>

              <div className="tech-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>TECHNICIAN DISBURSEMENTS (90%)</div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--cta-orange)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{Math.round((overview?.total_volume || 0) * 0.9).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Allocated to verified specialists</div>
              </div>

              <div className="tech-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)' }}>ESCROW VAULT BALANCE</div>
                <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                  ₹{(overview?.escrow_held || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>100% Locked until customer delivery signoff</div>
              </div>
            </div>

            <div className="tech-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Escrow Settlements & Payout Registry</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', margin: '4px 0 0' }}>
                    Transparent 90/10 escrow split protecting customer payments until tamper seal verification
                  </p>
                </div>
                <span className="badge badge-primary">
                  {ordersList.length} Total Escrow Accounts
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)' }}>
                      <th style={{ padding: '12px 16px' }}>Transaction ID</th>
                      <th style={{ padding: '12px 16px' }}>Order & Parties</th>
                      <th style={{ padding: '12px 16px' }}>Agreed Amount</th>
                      <th style={{ padding: '12px 16px' }}>Tech Payout (90%)</th>
                      <th style={{ padding: '12px 16px' }}>Platform Fee (10%)</th>
                      <th style={{ padding: '12px 16px' }}>Escrow Vault Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Audit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((o, idx) => {
                      const amount = o.final_agreed_price || o.customer_selected_price || o.quote_amount || 0;
                      const isReleased = o.status === 'Delivered';
                      return (
                        <tr key={o.id || idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                            TXN-ESC-{o.order_number?.replace('EOF-2026-', '') || (90000 + idx)}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                              {o.order_number}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                              {o.customer_name} &rarr; <span style={{ color: 'var(--cta-orange)' }}>{o.technician_name || 'Unassigned Tech'}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                            ₹{amount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                            ₹{Math.round(amount * 0.9).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                            ₹{Math.round(amount * 0.1).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`badge ${isReleased ? 'badge-verified' : 'badge-primary'}`}>
                              {isReleased ? 'RELEASED TO TECH' : 'HELD IN ESCROW VAULT'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => setAdminConversationOrder(o)}
                              style={{
                                background: 'rgba(37, 99, 235, 0.1)',
                                border: '1px solid rgba(37, 99, 235, 0.3)',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#2563eb',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <MessageSquare size={13} /> View Audit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: SYSTEM HEALTH & DATABASE CONTROLS
           ======================================================== */}
        {activeTab === 'database' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
              <div className="tech-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Activity size={24} color="#10b981" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>API Server Status</h3>
                    <span className="badge badge-verified" style={{ fontSize: '0.68rem', marginTop: '2px' }}>HEALTHY (HTTP 200)</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Backend Flask instance running on port 5000 with CORS authorization and JWT cryptographic token auth.
                </p>
              </div>

              <div className="tech-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Database size={24} color="var(--primary)" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Database Storage</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem', marginTop: '2px' }}>SQLITE ATTACHED</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  ACID transactional SQLite engine. Tables: Users, Orders, Streams, Parts, Payments.
                </p>
              </div>

              <div className="tech-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <Video size={24} color="var(--cta-orange)" />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>WebRTC / Live Streams</h3>
                    <span className="badge badge-orange" style={{ fontSize: '0.68rem', marginTop: '2px' }}>ONLINE (3 ACTIVE)</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  Microscope streams transmitting 4K 60fps cleanroom video feeds with sub-second latency.
                </p>
              </div>
            </div>

            <div className="tech-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                Database Maintenance & Backup Actions
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Perform administrative backups, data exports, or complete database restorations.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  onClick={handleExportBackup}
                  style={{ padding: '10px 20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Download size={16} /> Download Full Database JSON Dump
                </button>

                <button
                  onClick={handleResetDatabase}
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1.5px solid rgba(239, 68, 68, 0.4)',
                    color: '#ef4444',
                    padding: '10px 20px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <Database size={16} /> Reset & Re-Seed Database
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Stream Inspector Modal */}
      {liveStreamOrder && (
        <StreamModal
          order={liveStreamOrder}
          onClose={() => setLiveStreamOrder(null)}
          onApproveQuote={() => {}}
        />
      )}

      {/* MODAL 1: EDIT USER MODAL */}
      {editingUser && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2600,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="tech-card" style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '32px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setEditingUser(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
              Edit User: @{editingUser.username}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Modify account attributes, roles, and security credentials.
            </p>

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={userForm.name} 
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Username
                </label>
                <input 
                  type="text" 
                  value={userForm.username} 
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} 
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  value={userForm.email} 
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Phone
                </label>
                <input 
                  type="text" 
                  value={userForm.phone} 
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} 
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  WhatsApp Phone
                </label>
                <input 
                  type="text" 
                  value={userForm.whatsapp || ''} 
                  onChange={(e) => setUserForm({ ...userForm, whatsapp: e.target.value })} 
                  style={{ width: '100%' }}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    City
                  </label>
                  <input 
                    type="text" 
                    value={userForm.city || 'Hyderabad'} 
                    onChange={(e) => setUserForm({ ...userForm, city: e.target.value })} 
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Pincode
                  </label>
                  <input 
                    type="text" 
                    value={userForm.pincode || ''} 
                    onChange={(e) => setUserForm({ ...userForm, pincode: e.target.value })} 
                    style={{ width: '100%' }}
                    placeholder="500081"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Doorstep Delivery Address
                </label>
                <input 
                  type="text" 
                  value={userForm.address || ''} 
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })} 
                  style={{ width: '100%' }}
                  placeholder="Flat 302, Cyber Towers View"
                />
              </div>

              {userForm.role === 'technician' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Cleanroom Bench Station
                      </label>
                      <input 
                        type="text" 
                        value={userForm.bench_station || ''} 
                        onChange={(e) => setUserForm({ ...userForm, bench_station: e.target.value })} 
                        style={{ width: '100%' }}
                        placeholder="Bench #3 - Cleanroom ISO-5"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                        Payout UPI ID
                      </label>
                      <input 
                        type="text" 
                        value={userForm.payout_upi || ''} 
                        onChange={(e) => setUserForm({ ...userForm, payout_upi: e.target.value })} 
                        style={{ width: '100%' }}
                        placeholder="tech.ramesh@okaxis"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Specialization / Chip-Level Skills
                    </label>
                    <input 
                      type="text" 
                      value={userForm.specialization || ''} 
                      onChange={(e) => setUserForm({ ...userForm, specialization: e.target.value })} 
                      style={{ width: '100%' }}
                      placeholder="Motherboard Chip-Level, BGA Micro-Soldering, Display Rework"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Professional Certifications
                    </label>
                    <input 
                      type="text" 
                      value={userForm.certifications || ''} 
                      onChange={(e) => setUserForm({ ...userForm, certifications: e.target.value })} 
                      style={{ width: '100%' }}
                      placeholder="IPC-7711/7721 Certified Rework Specialist, ACMT"
                    />
                  </div>
                </>
              )}

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Account Role
                </label>
                <select 
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin (Full Control)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  New Password (optional)
                </label>
                <input 
                  type="password" 
                  placeholder="Leave blank to keep unchanged"
                  value={userForm.password} 
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setEditingUser(null)} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW USER MODAL */}
      {isAddUserOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2600,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="tech-card" style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '32px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setIsAddUserOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
              Add New User to Database
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Register a customer, verified technician, or administrator.
            </p>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Suresh Kumar"
                  value={userForm.name} 
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Username
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. suresh_tech"
                  value={userForm.username} 
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} 
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  placeholder="suresh@example.com"
                  value={userForm.email} 
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                  style={{ width: '100%' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Phone
                </label>
                <input 
                  type="text" 
                  placeholder="+91 98765 43210"
                  value={userForm.phone} 
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} 
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Role
                </label>
                <select 
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <input 
                  type="password" 
                  placeholder="Initial password"
                  value={userForm.password} 
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                  style={{ width: '100%' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setIsAddUserOpen(false)} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-cta" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT REPAIR ORDER MODAL */}
      {editingOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2600,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="tech-card" style={{
            width: '100%',
            maxWidth: '540px',
            background: 'var(--bg-surface)',
            borderRadius: '24px',
            padding: '32px',
            position: 'relative'
          }}>
            <button 
              onClick={() => setEditingOrder(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '4px' }}>
              Edit Order: {editingOrder.order_number}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Device: {editingOrder.laptop_brand} {editingOrder.laptop_model}
            </p>

            <form onSubmit={handleSaveOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Lifecycle Status
                </label>
                <select 
                  value={orderForm.status}
                  onChange={(e) => setOrderForm({ ...orderForm, status: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Technician Accepted">Technician Accepted</option>
                  <option value="Pickup Scheduled">Pickup Scheduled</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="Delivered to Bench">Delivered to Bench</option>
                  <option value="In Repair">In Repair (Live Bench Active)</option>
                  <option value="Quality Check">Quality Check</option>
                  <option value="Repaired & Awaiting Payment">Repaired & Awaiting Payment</option>
                  <option value="Return Pickup">Return Pickup</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Quote Amount (₹)
                </label>
                <input 
                  type="number" 
                  value={orderForm.quote_amount} 
                  onChange={(e) => setOrderForm({ ...orderForm, quote_amount: e.target.value })} 
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                  required 
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Tamper Seal Code
                </label>
                <input 
                  type="text" 
                  value={orderForm.tamper_seal_code} 
                  onChange={(e) => setOrderForm({ ...orderForm, tamper_seal_code: e.target.value })} 
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Assign Technician
                </label>
                <select 
                  value={orderForm.technician_id}
                  onChange={(e) => setOrderForm({ ...orderForm, technician_id: e.target.value })}
                  style={{ width: '100%' }}
                >
                  <option value="">Unassigned</option>
                  {usersList.filter(u => u.role === 'technician').map(t => (
                    <option key={t.id} value={t.id}>{t.name} (@{t.username})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Technician Diagnostic Notes
                </label>
                <textarea 
                  rows={2}
                  value={orderForm.technician_notes}
                  onChange={(e) => setOrderForm({ ...orderForm, technician_notes: e.target.value })}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setEditingOrder(null)} 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Update Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {adminConversationOrder && (
        <OrderConversationModal
          isOpen={Boolean(adminConversationOrder)}
          initialOrder={adminConversationOrder}
          onClose={() => setAdminConversationOrder(null)}
          onOpenLiveStream={(ord) => {
            setAdminConversationOrder(null);
            setLiveStreamOrder(ord);
          }}
        />
      )}
    </div>
  );
}
