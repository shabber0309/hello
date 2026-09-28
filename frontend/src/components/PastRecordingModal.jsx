import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, X, ShieldCheck, Clock, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PastRecordingModal({ isOpen, onClose, repairData }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  const data = repairData || {
    title: 'ThinkPad X1 Carbon Gen 9 — Display Bus & Backlight Fuse Fix',
    technician: 'David P. (Senior Micro-Soldering Specialist)',
    duration: '42 mins 18 secs',
    date: 'Oct 12, 2026',
    orderNumber: 'TS-8419',
    serialNumber: 'PF-289410A',
    replacedPart: 'Original LG-Philips IPS Display Bus & 3A SMD Fuse',
    oldSerial: 'PANEL-FAULT-812',
    newSerial: 'PANEL-OEM-9912A',
    milestones: [
      { time: '00:00', label: 'Doorstep Tamper Bag Unsealed on Camera' },
      { time: '06:14', label: '100x Microscope Diagnostic: Blown 3A Backlight Fuse' },
      { time: '14:20', label: 'SMD Fuse Desoldered & Ultrasonic Clean' },
      { time: '22:45', label: 'New Fuse Soldered; Multimeter Test 19.8V' },
      { time: '35:10', label: 'Display Panel Reconnected; Boot Diagnostic Pass' }
    ]
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2100,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '960px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-primary">ARCHIVED SESSION</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{data.date} • {data.duration}</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{data.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Technician: <strong style={{ color: 'var(--text-main)' }}>{data.technician}</strong> • Serial: <span style={{ fontFamily: 'var(--font-mono)' }}>{data.serialNumber}</span>
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player */}
        <div style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
          background: '#000000',
          marginBottom: '20px'
        }}>
          <img 
            src="/tech_bench_live.jpg" 
            alt="Past Recording"
            style={{ width: '100%', height: '360px', objectFit: 'cover', opacity: 0.85 }}
          />

          {/* Watermark HUD */}
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            borderRadius: '8px',
            padding: '6px 12px',
            color: '#ffffff',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={14} color="#10b981" />
            <span>RECORDING ARCHIVE #{data.orderNumber}</span>
          </div>

          {/* Player Controls Bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                style={{
                  background: 'var(--primary)',
                  color: '#ffffff',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>

              <button 
                onClick={() => setIsPlaying(false)}
                style={{ background: 'transparent', color: '#ffffff' }}
              >
                <RotateCcw size={16} />
              </button>

              <div style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
                {isPlaying ? '14:20' : '00:00'} / {data.duration}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Volume2 size={18} />
              <Maximize size={18} />
            </div>
          </div>
        </div>

        {/* Audit Log & Milestones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '20px'
        }}>
          <div style={{
            background: 'var(--bg-card-subtle)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
              Recording Chapter Milestones:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.milestones.map((m, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.8rem',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: 'var(--bg-surface)'
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)', fontWeight: 700 }}>
                    {m.time}
                  </span>
                  <span style={{ color: 'var(--text-main)' }}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card-subtle)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--border-light)'
          }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '12px' }}>
              Verified Anti-Swapping Audit:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-surface)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Defective Component:</div>
                <div style={{ fontWeight: 600, color: 'var(--danger)', fontFamily: 'var(--font-mono)' }}>{data.oldSerial}</div>
              </div>
              <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-surface)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Installed Genuine Part:</div>
                <div style={{ fontWeight: 600, color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>{data.newSerial}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--success)', marginTop: '4px' }}>
                <CheckCircle2 size={14} />
                <span style={{ fontWeight: 700 }}>100% On-Camera Matched</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
