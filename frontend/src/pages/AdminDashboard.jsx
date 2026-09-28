import React, { useState, useEffect } from 'react';
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
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ onOpenLiveStream }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'orders', 'database'
  const [overview, setOverview] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Editing Modals state
  const [editingUser, setEditingUser] = useState(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  // Forms state
  const [userForm, setUserForm] = useState({ name: '', username: '', email: '', phone: '', role: 'customer', password: '' });
  const [orderForm, setOrderForm] = useState({ status: '', quote_amount: 0, quote_approved: false, tamper_seal_code: '', technician_id: '', technician_notes: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, usersRes, ordersRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/admin/users'),
        fetch('/api/admin/orders')
      ]);

      if (overviewRes.ok) setOverview(await overviewRes.json());
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersList(uData.users || []);
      }
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrdersList(oData.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditUserClick = (u) => {
    setEditingUser(u);
    setUserForm({
      name: u.name,
      username: u.username,
      email: u.email,
      phone: u.phone || '',
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
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
        headers: { 'Content-Type': 'application/json' },
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

  const handleResetDatabase = async () => {
    if (!window.confirm('WARNING: This will completely wipe all tables and re-seed fresh database with Shabber as Admin and randomized customers, technicians, and repair orders. Proceed?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset-database', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMsg('Database completely wiped and freshly reseeded!');
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

  const filteredUsers = usersList.filter(u => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch = !searchQuery || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.username && u.username.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div style={{ padding: '36px 0 80px', minHeight: 'calc(100vh - 84px)' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-primary" style={{ padding: '4px 12px' }}>
                <ShieldCheck size={14} /> SUPER ADMIN PORTAL
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Full Database CRUD & Marketplace Control
              </span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
              Master Database & Admin Console
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Logged in as <strong>Shabber Hussain (Admin)</strong> • <span style={{ fontFamily: 'var(--font-mono)' }}>shabberhussain934@gmail.com</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-secondary" 
              onClick={fetchData}
              title="Refresh Data"
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={15} /> Refresh
            </button>

            <button 
              className="btn-cta" 
              onClick={() => {
                setUserForm({ name: '', username: '', email: '', phone: '', role: 'customer', password: 'password123' });
                setIsAddUserOpen(true);
              }}
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add User
            </button>

            <button 
              onClick={handleResetDatabase}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Database size={15} /> Reset / Re-Seed Database
            </button>
          </div>
        </div>

        {/* Feedback Message Alert */}
        {feedbackMsg && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#10b981',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} /> {feedbackMsg}
            </div>
            <button onClick={() => setFeedbackMsg('')} style={{ background: 'transparent', color: '#10b981' }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* 6 Metrics Overview Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '36px'
        }}>
          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Users</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {overview?.total_users || usersList.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {overview?.customers_count || 4} Customers • {overview?.technicians_count || 4} Techs
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Orders</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--cta-orange)', marginTop: '4px' }}>
              {overview?.total_orders || ordersList.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {overview?.in_repair_count || 3} Live In Repair
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Volume</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              ₹{overview?.total_volume?.toLocaleString() || '20,550'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Completed + Active repairs
            </div>
          </div>

          <div className="tech-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Escrow</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
              ₹{overview?.escrow_held?.toLocaleString() || '12,250'}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Protected in customer vault
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          borderBottom: '1px solid var(--border-light)',
          marginBottom: '24px',
          paddingBottom: '12px'
        }}>
          <button
            onClick={() => setActiveTab('users')}
            className={`nav-pill-btn ${activeTab === 'users' ? 'active' : ''}`}
            style={{ fontSize: '0.92rem' }}
          >
            <Users size={16} /> All Users ({usersList.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`nav-pill-btn ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ fontSize: '0.92rem' }}
          >
            <Laptop size={16} /> All Repair Orders ({ordersList.length})
          </button>
        </div>

        {/* TAB 1: USERS MANAGEMENT TABLE */}
        {activeTab === 'users' && (
          <div className="tech-card" style={{ padding: '24px' }}>
            {/* Filter Bar */}
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
                      textTransform: 'capitalize'
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
                  style={{ width: '100%', paddingLeft: '36px', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px' }}>ID</th>
                    <th style={{ padding: '12px 16px' }}>Name & Username</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Phone</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin';
                    const isTech = u.role === 'technician';

                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                          #{u.id}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                            @{u.username}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {u.phone || 'N/A'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${isAdmin ? 'badge-verified' : (isTech ? 'badge-orange' : 'badge-primary')}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
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
                                gap: '4px'
                              }}
                            >
                              <Edit3 size={13} /> Edit
                            </button>

                            {u.username !== 'shabber' && (
                              <button
                                onClick={() => handleDeleteUser(u.id, u.username)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.1)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: '#ef4444'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: REPAIR ORDERS MANAGEMENT TABLE */}
        {activeTab === 'orders' && (
          <div className="tech-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>All Repair Orders in System</h2>
              <span className="badge badge-primary">{ordersList.length} Active Orders</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Customer & Device</th>
                    <th style={{ padding: '12px 16px' }}>Issue Category</th>
                    <th style={{ padding: '12px 16px' }}>Tamper Seal</th>
                    <th style={{ padding: '12px 16px' }}>Assigned Tech</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Quote</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersList.map((ord) => {
                    const isLive = ord.status === 'In Repair';
                    const isDelivered = ord.status === 'Delivered';

                    return (
                      <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {ord.order_number}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 700 }}>{ord.laptop_brand} {ord.laptop_model}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>User: {ord.customer_name}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                          {ord.issue_category}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {ord.tamper_seal_code || 'TC-PENDING'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-main)', fontWeight: 600 }}>
                          {ord.technician_name}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className={`badge ${isLive ? 'badge-live' : (isDelivered ? 'badge-verified' : 'badge-orange')}`}>
                            {isLive && <Radio size={11} className="pulse-dot" />}
                            {ord.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                          ₹{ord.quote_amount}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleEditOrderClick(ord)}
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
                              gap: '4px'
                            }}
                          >
                            <Edit3 size={13} /> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
                color: 'var(--text-muted)'
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
                color: 'var(--text-muted)'
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
                  placeholder="e.g. Shabber Hussain"
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
                  placeholder="e.g. shabber"
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
                  placeholder="name@example.com"
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
                color: 'var(--text-muted)'
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
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Repair">In Repair (Live Bench Active)</option>
                  <option value="Repaired & Awaiting Payment">Repaired & Awaiting Payment</option>
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
    </div>
  );
}
