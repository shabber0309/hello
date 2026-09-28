import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ArrowRight,
  Search,
  Check,
  X,
  Video,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  CUSTOMER_SYMPTOMS, 
  HARDWARE_REPAIRS, 
  SOFTWARE_REPAIRS, 
  WORKFLOW_EXAMPLE 
} from '../data/pricingData';

export default function PricingPage({ onStartBooking }) {
  const [activeTab, setActiveTab] = useState('symptoms');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHwCategory, setSelectedHwCategory] = useState('all');
  const [selectedSwCategory, setSelectedSwCategory] = useState('all');
  const [approvalStatus, setApprovalStatus] = useState('pending');

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return CUSTOMER_SYMPTOMS;
    const q = searchQuery.toLowerCase();
    return CUSTOMER_SYMPTOMS.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.explanation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredHardware = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return HARDWARE_REPAIRS
      .filter(cat => selectedHwCategory === 'all' || cat.categoryKey === selectedHwCategory)
      .map(cat => {
        if (!q) return cat;
        const matchingRepairs = cat.repairs.filter(r => 
          r.problem.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.range.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
        );
        return { ...cat, repairs: matchingRepairs };
      })
      .filter(cat => cat.repairs.length > 0);
  }, [searchQuery, selectedHwCategory]);

  const filteredSoftware = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return SOFTWARE_REPAIRS
      .filter(cat => selectedSwCategory === 'all' || cat.categoryKey === selectedSwCategory)
      .map(cat => {
        if (!q) return cat;
        const matchingRepairs = cat.repairs.filter(r => 
          r.service.toLowerCase().includes(q) ||
          r.note.toLowerCase().includes(q) ||
          r.range.toLowerCase().includes(q) ||
          cat.category.toLowerCase().includes(q)
        );
        return { ...cat, repairs: matchingRepairs };
      })
      .filter(cat => cat.repairs.length > 0);
  }, [searchQuery, selectedSwCategory]);

  return (
    <div style={{ padding: '36px 0 70px' }}>
      <div className="container" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Simple Clean Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.7rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Repair Pricing & Estimates
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
            Indicative price ranges based on Hyderabad & Indian market benchmarks. Final quote is confirmed on live video after diagnosis.
          </p>
        </div>

        {/* Global Search Bar */}
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          margin: '0 auto 28px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', color: 'var(--text-dim)' }} />
          <input 
            type="text"
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem, part, or symptom..."
            style={{
              paddingLeft: '44px',
              paddingRight: '16px',
              height: '46px',
              fontSize: '0.92rem',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-light)',
              width: '100%'
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('symptoms')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              border: activeTab === 'symptoms' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              background: activeTab === 'symptoms' ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === 'symptoms' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            🚨 Common Problems
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              border: activeTab === 'hardware' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              background: activeTab === 'hardware' ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === 'hardware' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Cpu size={15} /> Hardware Catalog
          </button>

          <button
            onClick={() => setActiveTab('software')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              border: activeTab === 'software' ? '2px solid var(--primary)' : '1px solid var(--border-light)',
              background: activeTab === 'software' ? 'var(--primary)' : 'var(--bg-card)',
              color: activeTab === 'software' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <Layers size={15} /> Software Catalog
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              border: activeTab === 'workflow' ? '2px solid #ea580c' : '1px solid var(--border-light)',
              background: activeTab === 'workflow' ? '#ea580c' : 'var(--bg-card)',
              color: activeTab === 'workflow' ? '#fff' : 'var(--text-secondary)'
            }}
          >
            <ShieldCheck size={15} /> How Approval Works
          </button>
        </div>

        {/* TAB 1: COMMON PROBLEMS */}
        {activeTab === 'symptoms' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            gap: '16px',
            marginBottom: '36px'
          }}>
            {filteredSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="tech-card"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{symptom.icon}</span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg-card-subtle)',
                      color: 'var(--text-muted)'
                    }}>
                      {symptom.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px' }}>
                    {symptom.title}
                  </h3>

                  <div style={{
                    color: 'var(--cta-orange)',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    marginBottom: '8px'
                  }}>
                    {symptom.estimateRange}
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 14px' }}>
                    {symptom.explanation}
                  </p>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => onStartBooking && onStartBooking(symptom.title)}
                  style={{
                    width: '100%',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  Book for this Issue <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: HARDWARE CATALOG */}
        {activeTab === 'hardware' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => setSelectedHwCategory('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedHwCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  background: selectedHwCategory === 'all' ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedHwCategory === 'all' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                All
              </button>
              {HARDWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedHwCategory(cat.categoryKey)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: selectedHwCategory === cat.categoryKey ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    background: selectedHwCategory === cat.categoryKey ? 'var(--primary)' : 'var(--bg-card)',
                    color: selectedHwCategory === cat.categoryKey ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '36px' }}>
              {filteredHardware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card" style={{ padding: '20px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>
                    {catGroup.category}
                  </h3>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '8px 12px' }}>Repair</th>
                          <th style={{ padding: '8px 12px' }}>Estimated Range</th>
                          <th style={{ padding: '8px 12px' }}>Note</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === catGroup.repairs.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>{r.problem}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--cta-orange)', whiteSpace: 'nowrap' }}>
                              {r.range}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{r.note}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <button
                                className="btn-primary"
                                onClick={() => onStartBooking && onStartBooking(r.problem)}
                                style={{ padding: '5px 12px', fontSize: '0.76rem', borderRadius: '6px' }}
                              >
                                Book
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SOFTWARE CATALOG */}
        {activeTab === 'software' && (
          <div>
            <div style={{
              padding: '10px 16px',
              borderRadius: '10px',
              background: 'rgba(234, 88, 12, 0.08)',
              color: 'var(--cta-orange)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              *Note: Software licenses (Windows/Office keys) are separate from technician service fees.
            </div>

            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
              <button
                onClick={() => setSelectedSwCategory('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedSwCategory === 'all' ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                  background: selectedSwCategory === 'all' ? 'var(--primary)' : 'var(--bg-card)',
                  color: selectedSwCategory === 'all' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                All
              </button>
              {SOFTWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedSwCategory(cat.categoryKey)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: selectedSwCategory === cat.categoryKey ? '1px solid var(--primary)' : '1px solid var(--border-light)',
                    background: selectedSwCategory === cat.categoryKey ? 'var(--primary)' : 'var(--bg-card)',
                    color: selectedSwCategory === cat.categoryKey ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '36px' }}>
              {filteredSoftware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card" style={{ padding: '20px', borderRadius: '14px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>
                    {catGroup.category}
                  </h3>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                      <thead>
                        <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border-light)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                          <th style={{ padding: '8px 12px' }}>Service</th>
                          <th style={{ padding: '8px 12px' }}>Estimated Range</th>
                          <th style={{ padding: '8px 12px' }}>Details</th>
                          <th style={{ padding: '8px 12px', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: idx === catGroup.repairs.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>{r.service}</td>
                            <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                              {r.range}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{r.note}</td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <button
                                className="btn-primary"
                                onClick={() => onStartBooking && onStartBooking(r.service)}
                                style={{ padding: '5px 12px', fontSize: '0.76rem', borderRadius: '6px' }}
                              >
                                Book
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOW APPROVAL WORKS */}
        {activeTab === 'workflow' && (
          <div style={{ marginBottom: '36px' }}>
            <div className="tech-card" style={{ padding: '24px', borderRadius: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>
                Transparent Diagnostic & Approval Flow
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                You approve the final cost before any parts are replaced or charged.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '14px',
                marginBottom: '20px'
              }}>
                <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>1. SELECT PROBLEM</div>
                  <div style={{ fontWeight: 800, margin: '4px 0' }}>Laptop Won't Turn On</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--cta-orange)', fontWeight: 700 }}>Est: ₹500 – ₹10,000+</div>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981' }}>2. LIVE DIAGNOSIS</div>
                  <div style={{ fontWeight: 800, margin: '4px 0' }}>Failed Power IC (PMIC)</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Technician explains on live video</div>
                </div>

                <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--cta-orange)' }}>3. ITEMIZED QUOTE</div>
                  <div style={{ fontWeight: 800, margin: '4px 0' }}>Parts: ₹1,800 + Labor: ₹1,000</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800 }}>Total: ₹2,800</div>
                </div>
              </div>

              {/* Interactive Prompt Demo */}
              <div style={{
                background: approvalStatus === 'approved' ? 'rgba(16, 185, 129, 0.08)' : approvalStatus === 'rejected' ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-card-subtle)',
                border: approvalStatus === 'approved' ? '1px solid #10b981' : approvalStatus === 'rejected' ? '1px solid #ef4444' : '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '18px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem' }}>
                    Repair Approval Prompt
                  </div>
                  <div>
                    {approvalStatus === 'pending' && <span style={{ color: 'var(--cta-orange)', fontSize: '0.8rem', fontWeight: 700 }}>Awaiting Approval</span>}
                    {approvalStatus === 'approved' && <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>✓ Approved (₹2,800)</span>}
                    {approvalStatus === 'rejected' && <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>✕ Declined</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {approvalStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => setApprovalStatus('rejected')}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', background: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setApprovalStatus('approved')}
                        style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Approve ₹2,800
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setApprovalStatus('pending')}
                      style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'none', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      Reset Demo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What You Pay For - Simple Itemized Table */}
        <div className="tech-card" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '12px' }}>What You Pay For</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Technician Labor</span>
              <strong>₹800</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Replacement Parts (Matched on camera)</span>
              <strong>₹450</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Doorstep Pickup & Delivery</span>
              <strong style={{ color: 'var(--success)' }}>FREE</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
              <span>Platform Fee & 6-Month Warranty</span>
              <strong>₹100</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', fontSize: '1.05rem', fontWeight: 800 }}>
              <span>Total Example</span>
              <span style={{ color: 'var(--primary)' }}>₹1,350</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
