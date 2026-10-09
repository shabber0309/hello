import React, { useState } from 'react';
import { 
  X, Video, Radio, Mic, MicOff, Camera, ExternalLink, 
  CheckCircle2, AlertTriangle, ShieldCheck, MessageSquare, Send, Check,
  PhoneOff, Maximize2, Share2, Layers, Volume2, ShieldAlert
} from 'lucide-react';
import { getCloudImageUrl } from '../../../utils/cloudImages';
import './StreamModal.css';

export default function StreamModal({ order, isOpen = true, onClose, onApproveQuote }) {
  if (isOpen === false) return null;

  const [activeCam, setActiveCam] = useState('bench'); // 'bench', 'microscope'
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [additionalApproved, setAdditionalApproved] = useState(false);
  const [additionalRejected, setAdditionalRejected] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Technician Specialist', text: 'Welcome to the live session! I am inspecting your device on camera now.', time: '04:12 PM' },
    { sender: 'Customer', text: 'What is causing the screen problem?', time: '04:14 PM' },
    { sender: 'Technician Specialist', text: 'The display cable appears damaged. I will show you the connector under the microscope before replacing it.', time: '04:15 PM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const checklist = [
    { title: 'Device received', status: 'done' },
    { title: 'Intake condition verified', status: 'done' },
    { title: 'Device opened', status: 'done' },
    { title: 'Internal components inspected', status: 'done' },
    { title: 'Fault identified', status: 'active' },
    { title: 'Component replaced', status: 'upcoming' },
    { title: 'Final testing', status: 'upcoming' }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const newMsg = { sender: 'Customer', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setInputMsg('');

    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        sender: 'Technician Specialist',
        text: 'Showing you the 100x zoom of the pinched eDP connector pins now. Notice the trace fracture.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1200);
  };

  return (
    <div className="stream-modal-backdrop">
      <div className="stream-modal-container">
        {/* Header */}
        <div className="stream-modal-header">
          <div className="stream-header-left">
            <span className="badge badge-live">
              <Radio size={12} className="pulse-dot" /> LIVE REPAIR SESSION
            </span>
            <h2 className="stream-modal-title">
              Live Repair Session {order?.laptop_brand ? `— ${order.laptop_brand} ${order.laptop_model || ''}` : ''}
            </h2>
            <span className="badge badge-primary stream-order-badge">
              Repair ID: {order?.order_number || 'BENCH-LIVE'}
            </span>
          </div>

          <div className="stream-header-right">
            <a 
              href={order?.stream_session?.meet_url || order?.meet_recording_url || order?.meet_url || "https://meet.google.com/eof-live-bench"}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary stream-meet-link"
            >
              <ExternalLink size={14} /> Open in Google Meet
            </a>

            <button 
              onClick={onClose}
              className="stream-close-btn"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Grid: Video on Left + Side Panel on Right */}
        <div className="stream-studio-grid">
          {/* Left Video Stage */}
          <div className="stream-video-stage">
            {/* Top Video HUD Watermark */}
            <div className="stream-hud-bar">
              <div className="stream-hud-badge">
                <span style={{ color: '#ef4444', fontWeight: 800 }}>● 4K LIVE</span>
                <span>CLEANROOM BENCH • TECH: {order?.technician_name ? order.technician_name.toUpperCase() : 'CERTIFIED HARDWARE SPECIALIST'}</span>
              </div>

              {/* Camera Switcher */}
              <div className="stream-cam-switcher">
                {[
                  { id: 'bench', label: 'Overhead Bench 4K' },
                  { id: 'microscope', label: 'Microscope 100x' }
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setActiveCam(cam.id)}
                    className={`stream-cam-btn ${activeCam === cam.id ? 'active' : 'inactive'}`}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewport */}
            <div className="stream-viewport">
              <img 
                src={activeCam === 'microscope' ? getCloudImageUrl('/microscope_chip.jpg') : getCloudImageUrl('/tech_bench_live.jpg')} 
                alt="Live Stream Camera"
                className="stream-video-feed"
              />

              {/* Telemetry Annotation HUD */}
              <div className="stream-telemetry-hud">
                <div>
                  <div className="stream-telemetry-label">DISPLAY POWER RAIL:</div>
                  <div style={{ color: '#34d399', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>3.308 V [RESTORED]</div>
                </div>
                <div className="stream-telemetry-divider" />
                <div>
                  <div className="stream-telemetry-label">EDP CLOCK:</div>
                  <div style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>120Hz CALIBRATED</div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="stream-controls-bar">
              <button 
                onClick={() => setMicEnabled(!micEnabled)}
                className={`stream-ctrl-btn ${micEnabled ? 'active' : 'disabled'}`}
              >
                {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button 
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`stream-ctrl-btn ${videoEnabled ? 'active' : 'disabled'}`}
              >
                <Camera size={18} />
              </button>

              <button 
                onClick={() => setActiveCam(prev => prev === 'bench' ? 'microscope' : 'bench')}
                className="stream-switch-cam-btn"
              >
                <Layers size={15} /> Switch Camera
              </button>

              <button 
                onClick={onClose}
                className="stream-ctrl-btn disabled"
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>

          {/* Right Side Panel: Checklist + Chat + Additional Repair Approval */}
          <div className="stream-side-panel">
            {/* 1. Repair Checklist */}
            <div className="stream-checklist-box">
              <div className="stream-side-heading">
                Repair Checklist
              </div>
              <div className="stream-checklist-list">
                {checklist.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="stream-check-item"
                    style={{
                      color: item.status === 'done' ? 'var(--text-main)' : (item.status === 'active' ? 'var(--primary)' : 'var(--text-dim)'),
                      fontWeight: item.status === 'active' ? 700 : 500
                    }}
                  >
                    {item.status === 'done' && <CheckCircle2 size={14} color="#10b981" />}
                    {item.status === 'active' && <Radio size={14} color="#ef4444" className="pulse-dot" />}
                    {item.status === 'upcoming' && <div className="stream-upcoming-circle" />}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Additional Repair Request Approval Banner */}
            <div className={`stream-additional-req-box ${additionalApproved ? 'approved' : (additionalRejected ? 'rejected' : 'pending')}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <ShieldAlert size={16} color="var(--cta-orange)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--cta-orange)', textTransform: 'uppercase' }}>
                  Additional Repair Request
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '2px' }}>
                Technician has identified another issue
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Issue: <strong>Damaged display cable</strong> • Additional cost: <strong>₹450</strong>
              </div>

              {!additionalApproved && !additionalRejected ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                    onClick={() => setAdditionalApproved(true)}
                  >
                    Approve (₹450)
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    onClick={() => setAdditionalRejected(true)}
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: additionalApproved ? 'var(--success)' : '#ef4444' }}>
                  {additionalApproved ? '✓ Additional repair approved by customer' : '✕ Additional repair rejected'}
                </div>
              )}
            </div>

            {/* 3. Live Chat */}
            <div className="stream-chat-container">
              <div className="stream-chat-messages">
                {chatMessages.map((msg, i) => {
                  const isMe = msg.sender.includes('Customer');
                  return (
                    <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                        {msg.sender} • {msg.time}
                      </div>
                      <div className={`stream-chat-bubble ${isMe ? 'me' : 'other'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="stream-chat-form">
                <input 
                  type="text" 
                  placeholder="Message technician..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  className="stream-chat-input"
                />
                <button type="submit" className="btn-primary stream-chat-send-btn">
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
