import React from 'react';
import './SiliconeWorkbenchFrame.css';

export default function SiliconeWorkbenchFrame({ children }) {
  // 6 Colorful precision screwdrivers as seen in the reference image
  const screwdrivers = [
    { capColor: '#a855f7', bodyColor: '#7e22ce', tip: 'PH000', label: 'Cross #000' },
    { capColor: '#3b82f6', bodyColor: '#1d4ed8', tip: 'T5', label: 'Torx T5' },
    { capColor: '#f97316', bodyColor: '#c2410c', tip: 'P2', label: 'Pentalobe' },
    { capColor: '#ef4444', bodyColor: '#b91c1c', tip: 'Y000', label: 'Tri-Point' },
    { capColor: '#0ea5e9', bodyColor: '#0369a1', tip: 'PH00', label: 'Cross #00' },
    { capColor: '#dc2626', bodyColor: '#991b1b', tip: 'SL1.5', label: 'Flathead' }
  ];

  // Screw sorting matrix slots (24 numbered organizer wells)
  const screwSlots = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    hasScrew: [2, 5, 8, 11, 14, 19, 22].includes(i + 1)
  }));

  return (
    <div className="silicone-mat-wrapper" style={{
      position: 'relative',
      maxWidth: '1540px',
      margin: '18px auto 40px',
      padding: '0 16px'
    }}>
      {/* ========================================================
          OUTER MOLDED SILICONE WORKBENCH MAT (Image 2 Replica)
         ======================================================== */}
      <div style={{
        background: 'linear-gradient(160deg, #0288d1 0%, #0077b6 40%, #026ca8 75%, #01579b 100%)',
        borderRadius: '26px',
        border: '3px solid rgba(255, 255, 255, 0.45)',
        boxShadow: '0 20px 60px rgba(0, 25, 60, 0.4), inset 2px 2px 6px rgba(255, 255, 255, 0.5), inset -3px -3px 8px rgba(0, 20, 50, 0.35)',
        padding: '16px 20px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle molded silicone texture lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
          opacity: 0.7
        }} />

        {/* ========================================================
            TOP DOCK: SCREWDRIVERS, TWEEZERS, SOLDER & FLUX TRAY
           ======================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          background: 'rgba(0, 60, 115, 0.35)',
          borderRadius: '18px',
          padding: '12px 18px',
          marginBottom: '16px',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          boxShadow: 'inset 2px 2px 6px rgba(0, 20, 50, 0.4), inset -1px -1px 3px rgba(255, 255, 255, 0.3)',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Left: 6 Precision Screwdrivers Standing in Molded Slots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: 'rgba(255, 255, 255, 0.95)',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#38bdf8',
                boxShadow: '0 0 8px #38bdf8'
              }} />
              <span>TOOL BAY</span>
            </div>

            {/* Screwdrivers container */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {screwdrivers.map((driver, idx) => (
                <div 
                  key={idx}
                  title={`${driver.label} (${driver.tip})`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px) scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
                >
                  {/* Swivel Rotating Cap */}
                  <div style={{
                    width: '18px',
                    height: '11px',
                    borderRadius: '5px 5px 2px 2px',
                    background: driver.capColor,
                    boxShadow: `0 2px 6px ${driver.capColor}88, inset 0 1px 2px rgba(255,255,255,0.6)`,
                    border: '1px solid rgba(255,255,255,0.4)',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '6px',
                      height: '2px',
                      borderRadius: '1px',
                      background: 'rgba(255,255,255,0.7)'
                    }} />
                  </div>
                  
                  {/* Knurled Handle Body */}
                  <div style={{
                    width: '13px',
                    height: '24px',
                    borderRadius: '2px',
                    background: `repeating-linear-gradient(180deg, ${driver.bodyColor} 0px, ${driver.bodyColor} 3px, #0f172a 3px, #0f172a 5px)`,
                    border: '1px solid rgba(0,0,0,0.3)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }} />

                  {/* Steel Shaft & Tip */}
                  <div style={{
                    width: '3.5px',
                    height: '14px',
                    background: 'linear-gradient(90deg, #94a3b8 0%, #ffffff 50%, #64748b 100%)',
                    borderRadius: '0 0 1px 1px'
                  }} />

                  {/* Molded Silicone Socket Hole */}
                  <div style={{
                    width: '14px',
                    height: '5px',
                    borderRadius: '50%',
                    background: '#013a5e',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.4)',
                    marginTop: '-2px'
                  }} />

                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginTop: '2px',
                    letterSpacing: '-0.02em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.6)'
                  }}>
                    {driver.tip}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Molded Tweezers, Spudger & Opening Tools */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Stainless Steel Tweezers */}
            <div 
              title="Curved Anti-Static ESD Tweezers"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 30, 60, 0.4)',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.35)'
              }}
            >
              <div style={{
                width: '60px',
                height: '7px',
                borderRadius: '3px',
                background: 'linear-gradient(90deg, #334155 0%, #475569 40%, #cbd5e1 90%, #94a3b8 100%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  right: '0',
                  top: '-2px',
                  width: '8px',
                  height: '11px',
                  borderRight: '2px solid #cbd5e1',
                  borderRadius: '0 4px 4px 0'
                }} />
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                ESD-15
              </span>
            </div>

            {/* Yellow Dual-Head Pry Tool */}
            <div 
              title="Double-Ended Laptop Case Pry Spudger"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 30, 60, 0.4)',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.35)'
              }}
            >
              <div style={{
                width: '55px',
                height: '8px',
                borderRadius: '4px',
                background: 'linear-gradient(90deg, #eab308 0%, #ca8a04 50%, #1e293b 80%, #0f172a 100%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.4)'
              }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fef08a' }}>
                SPUDGER
              </span>
            </div>

            {/* Solder Wire Spool */}
            <div 
              title="63/37 Rosin Core Solder Spool"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 30, 60, 0.4)',
                padding: '3px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #0284c7 40%, #e2e8f0 45%, #94a3b8 100%)',
                border: '2px solid #ffffff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
              }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#e0f2fe' }}>
                SOLDER 0.8mm
              </span>
            </div>

            {/* Amber Rosin Flux Box */}
            <div 
              title="Lead-Free Rosin Soldering Flux Paste"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 30, 60, 0.4)',
                padding: '3px 10px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.25)'
              }}
            >
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
                border: '1.5px solid #ffffff',
                boxShadow: '0 2px 6px rgba(245, 158, 11, 0.5)'
              }} />
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#fef3c7' }}>
                ROSIN FLUX
              </span>
            </div>
          </div>

          {/* Right: Silicone Heat & Anti-Static Certification */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid #10b981',
            borderRadius: '9999px',
            padding: '4px 14px',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.3)'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px #10b981'
            }} />
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#a7f3d0',
              letterSpacing: '0.04em'
            }}>
              500°C HEAT PROOF • S-160 SILICONE
            </span>
          </div>
        </div>

        {/* ========================================================
            MAIN WORKBENCH: RULER (LEFT) + WORK ZONE + SCREW GRID (RIGHT)
           ======================================================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '14px',
          alignItems: 'stretch'
        }}>
          {/* 1. Left Vertical Molded Metric Ruler */}
          <div style={{
            width: '32px',
            background: 'rgba(0, 50, 100, 0.35)',
            borderRadius: '12px',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            boxShadow: 'inset 2px 2px 5px rgba(0, 20, 50, 0.4), inset -1px -1px 3px rgba(255, 255, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 0',
            userSelect: 'none'
          }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.7)', transform: 'rotate(-90deg)', whiteSpace: 'nowrap' }}>
              CM SCALE
            </span>
            {[40, 35, 30, 25, 20, 15, 10, 5, 0].map((num) => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '4px',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  {num}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  width: '10px',
                  height: '1.5px',
                  background: 'rgba(255, 255, 255, 0.65)'
                }} />
              </div>
            ))}
            <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#38bdf8' }}>
              mm
            </span>
          </div>

          {/* 2. Center Recessed Diagnostic Work Zone (Contains Page Content) */}
          <div style={{
            background: 'rgba(2, 116, 178, 0.28)',
            borderRadius: '20px',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            boxShadow: 'inset 3px 3px 12px rgba(0, 20, 50, 0.4), inset -2px -2px 8px rgba(255, 255, 255, 0.35)',
            padding: '8px',
            position: 'relative'
          }}>
            {/* Top molded header strip on the central work pad */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 14px 10px',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.25)',
              marginBottom: '10px',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#e0f2fe'
            }}>
              <span>✦ CIRCUIT BOARD & LAPTOP WORK AREA</span>
              <span style={{ color: '#38bdf8' }}>100% LIVE CAMERA MONITORED BENCH</span>
              <span>ANTI-STATIC ESD SAFE ✦</span>
            </div>

            {/* Actual Page Content Placed on the Work Mat */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>

            {/* Bottom molded silicone metric scale on the center pad */}
            <div style={{
              marginTop: '16px',
              padding: '8px 12px 2px',
              borderTop: '1px dashed rgba(255, 255, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.62rem',
              fontWeight: 800,
              color: 'rgba(255, 255, 255, 0.7)'
            }}>
              <span>| 0</span>
              <span>| 5</span>
              <span>| 10</span>
              <span>| 15</span>
              <span>| 20</span>
              <span>| 25</span>
              <span>| 30</span>
              <span>| 35</span>
              <span>| 40</span>
              <span>| 45</span>
              <span>| 50 cm</span>
            </div>
          </div>

          {/* 3. Right Magnetic Screw Sorting Organizer Grid (Directly from Image 2) */}
          <div style={{
            width: '105px',
            background: 'rgba(0, 50, 100, 0.38)',
            borderRadius: '16px',
            border: '1.5px solid rgba(255, 255, 255, 0.28)',
            boxShadow: 'inset 2px 2px 6px rgba(0, 20, 50, 0.45), inset -1px -1px 3px rgba(255, 255, 255, 0.3)',
            padding: '10px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            userSelect: 'none'
          }}>
            <div style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '0.04em',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
            }}>
              MAGNETIC<br />SCREW GRID
            </div>

            {/* 24-slot screw organizer grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '4px'
            }}>
              {screwSlots.map((slot) => (
                <div 
                  key={slot.id}
                  title={`Screw Slot #${slot.id} ${slot.hasScrew ? '(Occupied)' : '(Empty)'}`}
                  style={{
                    height: '24px',
                    borderRadius: '4px',
                    background: 'rgba(0, 25, 55, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <span style={{
                    fontSize: '0.52rem',
                    color: 'rgba(255, 255, 255, 0.45)',
                    fontWeight: 700
                  }}>
                    {slot.id}
                  </span>

                  {/* Tiny metallic screw icon in selected slots */}
                  {slot.hasScrew && (
                    <div style={{
                      position: 'absolute',
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, #e2e8f0 30%, #94a3b8 70%, #475569 100%)',
                      border: '0.5px solid #ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ width: '5px', height: '1px', background: '#334155' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Lower Parts Tray Compartments */}
            <div style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{
                background: 'rgba(0, 25, 55, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 4px',
                textAlign: 'center',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#f59e0b' }}>IC CHIP TRAY</div>
                <div style={{
                  width: '18px',
                  height: '18px',
                  margin: '4px auto 0',
                  background: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '2px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  position: 'relative'
                }}>
                  <span style={{ position: 'absolute', top: '1px', left: '1px', width: '2px', height: '2px', borderRadius: '50%', background: '#10b981' }} />
                </div>
              </div>

              <div style={{
                background: 'rgba(0, 25, 55, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '6px 4px',
                textAlign: 'center',
                boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#38bdf8' }}>FLEX CABLE</div>
                <div style={{
                  width: '28px',
                  height: '8px',
                  margin: '4px auto 0',
                  background: '#ca8a04',
                  borderRadius: '1px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
