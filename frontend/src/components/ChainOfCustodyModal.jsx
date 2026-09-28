import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Video, 
  CheckCircle2, 
  Package, 
  MapPin, 
  FileCheck, 
  Lock, 
  X, 
  QrCode, 
  ExternalLink,
  ChevronRight,
  Clock,
  Cpu
} from 'lucide-react';

export default function ChainOfCustodyModal({ isOpen, onClose, orderNumber = 'TS-8891' }) {
  const [selectedStage, setSelectedStage] = useState(2); // Default to Live Repair stage

  if (!isOpen) return null;

  const stages = [
    {
      id: 0,
      title: 'Secure Pickup',
      subtitle: 'Doorstep Tamper-Seal Handoff',
      status: 'VERIFIED',
      time: '08:45 AM - Oct 24',
      badge: 'Tamper Sealed #TS-8891',
      icon: Truck,
      image: '/hero_laptop.jpg',
      details: {
        agent: 'Rajesh K. (Authorized Secure Courier #412)',
        location: 'Doorstep Pickup, Flat 402, Green Heights, Hyderabad',
        tamperSealCode: 'SEAL-TX-7842B',
        barcodeScan: 'TS-BC-9920148-SECURE',
        verificationMethod: 'OTP Authenticated & Serialized Security Bag',
        notes: 'Device placed in antistatic ESD bubble sleeve and locked in tamper-evident serialized bag before leaving customer residence.'
      }
    },
    {
      id: 1,
      title: 'In-Lab Processing',
      subtitle: 'Cleanroom Unboxing & Intake',
      status: 'VERIFIED',
      time: '09:02 AM - Oct 24',
      badge: 'Seal Intact Verified',
      icon: Package,
      image: '/tech_bench_live.jpg',
      details: {
        facility: 'TechServe ISO-7 Certified Cleanroom Station #4',
        inspector: 'Vikram Verma (Intake Lead)',
        tamperIntegrity: '100% Unbroken Seal (Hologram matched)',
        externalCondition: 'Minor liquid stain on lower case; no chassis denting.',
        intakeVoltage: '19.5V Power Rail Shorted (0.02V detected)',
        notes: 'Tamper seal unsealed under continuous overhead 4K camera surveillance. Serial number C02G9012MD6R matched with customer invoice.'
      }
    },
    {
      id: 2,
      title: 'Live Repair Session',
      subtitle: '4K Stream & Micro-Soldering',
      status: 'ACTIVE STREAM',
      time: '09:15 AM - Now',
      badge: 'Live on Google Meet',
      icon: Video,
      image: '/microscope_chip.jpg',
      details: {
        technician: 'David P. / Raj K. (IPC-7711 Certified Hardware Master)',
        streamUrl: 'https://meet.google.com/ts-live-bench',
        cameraFeeds: '4K Overhead Bench + 100x Digital Microscope',
        actionTaken: 'Corroded ISL95521A PMIC replaced under microscope.',
        oldSerial: 'OEM-FAULT-781A',
        newSerial: 'OEM-NEW-8899C (Matched on Camera)',
        multimeterReading: '19.52V Normalized / 3.3V Logic Rail Restored'
      }
    },
    {
      id: 3,
      title: 'Quality Assurance (QA) Report',
      subtitle: 'Stress Testing & Inspection Certificate',
      status: 'SCHEDULED',
      time: 'Estimated 11:30 AM',
      badge: 'Digital Signature Req.',
      icon: FileCheck,
      details: {
        checklist: [
          { test: 'Power Rail & Voltage Stability (19.5V & 3.3V)', status: 'PASS' },
          { test: 'Apple Diagnostics / UEFI Hardware Stress Cycle', status: 'PASS' },
          { test: 'Thermal Imaging (Max 68°C under Prime95)', status: 'PASS' },
          { test: 'Display, Audio, Webcam & Thunderbolt I/O Pass', status: 'PASS' },
          { test: 'Battery Charge & Discharge Capacity Retention', status: 'PASS' }
        ],
        qaLead: 'Arun M. (Chief QA Compliance Officer)',
        certificateId: 'QA-CERT-2026-9812A'
      }
    },
    {
      id: 4,
      title: 'Final Delivery',
      subtitle: 'Resealed Return with OTP Handoff',
      status: 'READY FOR DISPATCH',
      time: 'Estimated 02:00 PM',
      badge: 'Secret OTP Protected',
      icon: CheckCircle2,
      details: {
        returnTamperSeal: 'SEAL-TX-RETURN-8812',
        secretOtp: '8492',
        warrantyPeriod: '6 Months Comprehensive Hardware Warranty',
        courier: 'Express Doorstep Courier with Live GPS Tracking'
      }
    }
  ];

  const current = stages[selectedStage];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '1080px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--primary-subtle)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} />
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Repair Chain of Custody</h2>
              <span className="badge badge-primary">
                Order #{orderNumber}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              End-to-end transparent supply chain log. Every handoff, unboxing, micro-soldering step, and QA check is cryptographically verified.
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

        {/* 5-Stage Visual Stepper Timeline */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
          marginBottom: '32px'
        }}>
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isSelected = selectedStage === idx;
            const isDone = idx < 2;
            const isCurrent = idx === 2;

            return (
              <div
                key={stg.id}
                onClick={() => setSelectedStage(idx)}
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  background: isSelected 
                    ? 'var(--primary-subtle)' 
                    : 'var(--bg-card-subtle)',
                  border: isSelected 
                    ? '2px solid var(--primary)' 
                    : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isCurrent ? '#ef4444' : (isDone ? '#10b981' : 'var(--border-light)'),
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: isCurrent ? '#ef4444' : (isDone ? '#10b981' : 'var(--text-dim)')
                  }}>
                    {stg.status}
                  </span>
                </div>

                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '2px' }}>
                  {stg.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  {stg.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Deep Dive Card */}
        <div style={{
          background: 'var(--bg-card-subtle)',
          borderRadius: '18px',
          border: '1px solid var(--border-light)',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: current.image ? '1.2fr 1fr' : '1fr',
          gap: '24px',
          alignItems: 'center'
        }}>
          {/* Details Content */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge badge-verified">
                <CheckCircle2 size={13} /> {current.badge}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Timestamp: {current.time}
              </span>
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '6px' }}>
              {current.title} — {current.subtitle}
            </h3>

            {/* Stage specifics */}
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Object.entries(current.details).map(([key, value]) => {
                if (key === 'checklist') return null;
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{formattedKey}:</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-main)', textAlign: 'right', maxWidth: '60%' }}>
                      {value}
                    </span>
                  </div>
                );
              })}

              {current.details.checklist && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                    QA Certification Checklist:
                  </div>
                  {current.details.checklist.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)',
                      marginBottom: '6px',
                      fontSize: '0.82rem'
                    }}>
                      <span>{item.test}</span>
                      <span className="badge badge-verified" style={{ padding: '2px 8px' }}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Image & Holographic Badge */}
          {current.image && (
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img 
                src={current.image} 
                alt={current.title}
                style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '10px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                  <Lock size={14} color="#10b981" />
                  <span>Tamper Integrity Locked</span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                  TS-SEAL-VERIFIED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <span>Anti-Swapping Protocol: Serial numbers matched & recorded on camera.</span>
          </div>

          <button 
            className="btn-primary"
            onClick={onClose}
          >
            Close Chain of Custody
          </button>
        </div>
      </div>
    </div>
  );
}
