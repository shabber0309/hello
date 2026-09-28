import React from 'react';
import { 
  Laptop, 
  Monitor, 
  BatteryCharging, 
  Keyboard, 
  MousePointer, 
  Zap, 
  Flame, 
  HardDrive, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Lock, 
  Package, 
  ArrowRight
} from 'lucide-react';

export default function ServicesPage({ onStartBooking }) {
  const hardwareServices = [
    {
      icon: Monitor,
      title: 'Screen Replacement',
      desc: 'Fix cracked glass, black screens, vertical lines, and display flickering.'
    },
    {
      icon: BatteryCharging,
      title: 'Battery Replacement',
      desc: 'Resolve fast battery drain, swollen batteries, and devices not holding charge.'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Repair',
      desc: 'Replace unresponsive keys, sticky buttons, liquid spills, or whole keyboards.'
    },
    {
      icon: MousePointer,
      title: 'Touchpad Repair',
      desc: 'Fix unresponsive clicking, erratic cursor movement, and broken trackpads.'
    },
    {
      icon: Zap,
      title: 'Charging Port & Jack',
      desc: 'Repair loose USB-C ports, damaged DC power jacks, and charging circuit issues.'
    },
    {
      icon: Flame,
      title: 'Overheating & Cleaning',
      desc: 'Internal dust cleaning, fan bearing replacement, and fresh thermal paste.'
    },
    {
      icon: HardDrive,
      title: 'SSD & Storage Upgrade',
      desc: 'High-speed NVMe SSD upgrades, dead drive replacement, and OS migration.'
    },
    {
      icon: Cpu,
      title: 'RAM Memory Upgrade',
      desc: 'RAM expansion (DDR4/DDR5) and troubleshooting blue screen memory errors.'
    },
    {
      icon: Wrench,
      title: 'Motherboard Chip-Level Repair',
      desc: 'Micro-soldering, short-circuit diagnosis, and power IC replacement.'
    }
  ];

  const softwareServices = [
    {
      icon: Laptop,
      title: 'OS & Driver Installation',
      desc: 'Clean installation of Windows, Linux, or macOS with official drivers.'
    },
    {
      icon: ShieldAlert,
      title: 'Virus & Malware Removal',
      desc: 'Deep security scan and complete removal of spyware, adware, and malware.'
    },
    {
      icon: Activity,
      title: 'Speed & Performance Tuning',
      desc: 'Fix slow laptop boot times, background bloatware, and high RAM/CPU usage.'
    },
    {
      icon: Lock,
      title: 'Account & Login Troubleshooting',
      desc: 'Resolve Windows account lockouts, password resets, and user profile issues.'
    },
    {
      icon: Package,
      title: 'Data Recovery & Backup',
      desc: 'Recover lost files from deleted, formatted, or failing hard drives.'
    }
  ];

  return (
    <div style={{ padding: '36px 0 70px' }}>
      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Repair Services
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto' }}>
            Verified hardware repairs and software troubleshooting with live video proof.
          </p>
        </div>

        {/* Hardware Services */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Wrench size={20} color="var(--primary)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hardware Repairs</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {hardwareServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="tech-card" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'var(--primary-subtle)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <Icon size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>{srv.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 14px' }}>
                      {srv.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => onStartBooking && onStartBooking(srv.title)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    Book this repair <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Software Services */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
            <Laptop size={20} color="var(--cta-orange)" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Software & OS Support</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {softwareServices.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div key={idx} className="tech-card" style={{ padding: '20px', borderRadius: '14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(234, 88, 12, 0.1)',
                      color: 'var(--cta-orange)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <Icon size={18} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>{srv.title}</h3>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 14px' }}>
                      {srv.desc}
                    </p>
                  </div>
                  <button 
                    onClick={() => onStartBooking && onStartBooking(srv.title)}
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: 'var(--cta-orange)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                  >
                    Book this service <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Simple Bottom Banner */}
        <div className="tech-card" style={{ padding: '24px', textAlign: 'center', borderRadius: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>
            Don't see your specific issue?
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 auto 16px', maxWidth: '480px' }}>
            Describe your laptop problem and local verified technicians will diagnose it.
          </p>
          <button 
            className="btn-cta"
            onClick={() => onStartBooking && onStartBooking('General Diagnosis')}
            style={{ padding: '10px 22px', fontSize: '0.88rem' }}
          >
            Describe Problem <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
}
