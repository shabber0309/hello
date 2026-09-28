import React, { useState } from 'react';
import { 
  X, Video, Radio, Mic, MicOff, Camera, ExternalLink, 
  CheckCircle2, AlertTriangle, ShieldCheck, MessageSquare, Send, Check,
  PhoneOff, Maximize2, Share2, Layers, Volume2, ShieldAlert
} from 'lucide-react';

export default function StreamModal({ order, onClose, onApproveQuote }) {
  const [activeCam, setActiveCam] = useState('bench'); // 'bench', 'microscope', 'facecam'
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [additionalApproved, setAdditionalApproved] = useState(false);
  const [additionalRejected, setAdditionalRejected] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'Technician Specialist', text: 'Welcome to the live session! I am verifying your tamper seal TC-FX-928341 on camera now.', time: '04:12 PM' },
    { sender: 'Customer', text: 'What is causing the screen problem?', time: '04:14 PM' },
    { sender: 'Technician Specialist', text: 'The display cable appears damaged. I will show you the connector under the microscope before replacing it.', time: '04:15 PM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const checklist = [
    { title: 'Device received', status: 'done' },
    { title: 'Tamper seal verified', status: 'done' },
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      backgroundColor: 'rgba(11, 17, 32, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '1240px',
        height: '92vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-header)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="badge badge-live">
              <Radio size={12} className="pulse-dot" /> LIVE REPAIR SESSION
            </span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Live Repair Session {order?.laptop_brand ? `— ${order.laptop_brand} ${order.laptop_model || ''}` : ''}
            </h2>
            <span className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)' }}>
              Repair ID: {order?.order_number || 'BENCH-LIVE'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a 
              href="https://meet.google.com/eof-live-bench"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
            >
              <ExternalLink size={14} /> Open in Google Meet
            </a>

            <button 
              onClick={onClose}
              style={{
                background: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-light)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Studio Grid: Video on Left + Side Panel on Right */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', overflow: 'hidden' }}>
          {/* Left Video Stage */}
          <div style={{
            background: '#070b14',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            overflow: 'hidden'
          }}>
            {/* Top Video HUD Watermark */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)'
              }}>
                <span style={{ color: '#ef4444', fontWeight: 800 }}>● 4K LIVE</span>
                <span>CLEANROOM BENCH #4 • TECH: RAVI SHARMA</span>
              </div>

              {/* Camera Switcher */}
              <div style={{
                display: 'flex',
                gap: '6px',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                padding: '4px',
                borderRadius: '10px'
              }}>
                {[
                  { id: 'bench', label: 'Overhead Bench 4K' },
                  { id: 'microscope', label: 'Microscope 100x' }
                ].map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => setActiveCam(cam.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      background: activeCam === cam.id ? 'var(--primary)' : 'transparent',
                      color: activeCam === cam.id ? '#ffffff' : '#94a3b8'
                    }}
                  >
                    {cam.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Viewport */}
            <div style={{
              position: 'relative',
              flex: 1,
              margin: '12px 0',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={activeCam === 'microscope' ? '/microscope_chip.jpg' : '/tech_bench_live.jpg'} 
                alt="Live Stream Camera"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Telemetry Annotation HUD */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                padding: '10px 14px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                color: '#ffffff',
                fontSize: '0.78rem'
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>DISPLAY POWER RAIL:</div>
                  <div style={{ color: '#34d399', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>3.308 V [RESTORED]</div>
                </div>
                <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.68rem' }}>EDP CLOCK:</div>
                  <div style={{ color: '#38bdf8', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>120Hz CALIBRATED</div>
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '6px 0' }}>
              <button 
                onClick={() => setMicEnabled(!micEnabled)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: micEnabled ? 'rgba(255,255,255,0.12)' : '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {micEnabled ? <Mic size={18} /> : <MicOff size={18} />}
              </button>

              <button 
                onClick={() => setVideoEnabled(!videoEnabled)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: videoEnabled ? 'rgba(255,255,255,0.12)' : '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Camera size={18} />
              </button>

              <button 
                onClick={() => setActiveCam(prev => prev === 'bench' ? 'microscope' : 'bench')}
                style={{
                  padding: '0 16px',
                  height: '40px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem'
                }}
              >
                <Layers size={15} /> Switch Camera
              </button>

              <button 
                onClick={onClose}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <PhoneOff size={18} />
              </button>
            </div>
          </div>

          {/* Right Side Panel: Checklist + Chat + Additional Repair Approval */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--border-light)',
            background: 'var(--bg-surface)',
            overflowY: 'auto'
          }}>
            {/* 1. Repair Checklist */}
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Repair Checklist
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {checklist.map((item, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.8rem',
                    color: item.status === 'done' ? 'var(--text-main)' : (item.status === 'active' ? 'var(--primary)' : 'var(--text-dim)'),
                    fontWeight: item.status === 'active' ? 700 : 500
                  }}>
                    {item.status === 'done' && <CheckCircle2 size={14} color="#10b981" />}
                    {item.status === 'active' && <Radio size={14} color="#ef4444" className="pulse-dot" />}
                    {item.status === 'upcoming' && <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1px solid var(--border-light)' }} />}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Additional Repair Request Approval Banner (Section 11 Feature) */}
            <div style={{
              padding: '16px',
              background: additionalApproved 
                ? 'rgba(16, 185, 129, 0.1)' 
                : (additionalRejected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 107, 53, 0.08)'),
              borderBottom: '1px solid var(--border-light)'
            }}>
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
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '35vh' }}>
                {chatMessages.map((msg, i) => {
                  const isMe = msg.sender.includes('Customer');
                  return (
                    <div key={i} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: '2px', textAlign: isMe ? 'right' : 'left' }}>
                        {msg.sender} • {msg.time}
                      </div>
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        background: isMe ? 'var(--primary)' : 'var(--bg-card-subtle)',
                        color: isMe ? '#ffffff' : 'var(--text-main)',
                        fontSize: '0.82rem',
                        border: isMe ? 'none' : '1px solid var(--border-light)'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <input 
                  type="text" 
                  placeholder="Message technician..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  style={{ flex: 1, fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 12px' }}>
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
