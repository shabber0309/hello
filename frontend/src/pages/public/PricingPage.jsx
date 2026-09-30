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
} from '../../data/pricingData';
import './PricingPage.css';

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
    <div className="pricing-page-root">
      <div className="pricing-container">
        
        {/* Header */}
        <div className="pricing-header">
          <div className="badge badge-primary pricing-badge">
            <Sparkles size={14} color="#2563eb" />
            100% Transparent Price Index
          </div>

          <h1 className="pricing-h1">
            Transparent Pricing. <br />
            <span className="pricing-gradient-text">
              Zero Hidden Charges.
            </span>
          </h1>

          <p className="pricing-subtitle">
            Explore typical repair cost ranges across laptop models and component repairs. Payment is held in secure escrow until you approve the repair.
          </p>
        </div>

        {/* Search Bar */}
        <div className="pricing-search-wrap">
          <Search size={18} color="var(--text-dim)" className="pricing-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem, part, or symptom..."
            className="pricing-search-input"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="pricing-search-clear"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="pricing-tabs-row">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`pricing-tab-btn ${activeTab === 'symptoms' ? 'active-primary' : ''}`}
          >
            🚨 Common Problems
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`pricing-tab-btn ${activeTab === 'hardware' ? 'active-primary' : ''}`}
          >
            <Cpu size={15} /> Hardware Catalog
          </button>

          <button
            onClick={() => setActiveTab('software')}
            className={`pricing-tab-btn ${activeTab === 'software' ? 'active-primary' : ''}`}
          >
            <Layers size={15} /> Software Catalog
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`pricing-tab-btn ${activeTab === 'workflow' ? 'active-workflow' : ''}`}
          >
            <ShieldCheck size={15} /> How Approval Works
          </button>
        </div>

        {/* TAB 1: COMMON PROBLEMS */}
        {activeTab === 'symptoms' && (
          <div className="pricing-symptoms-grid">
            {filteredSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="tech-card pricing-symptom-card"
              >
                <div>
                  <div className="pricing-symptom-top">
                    <span className="pricing-symptom-icon">{symptom.icon}</span>
                    <span className="pricing-symptom-badge">
                      {symptom.category}
                    </span>
                  </div>

                  <h3 className="pricing-symptom-title">
                    {symptom.title}
                  </h3>

                  <div className="pricing-symptom-range">
                    {symptom.estimateRange}
                  </div>

                  <p className="pricing-symptom-desc">
                    {symptom.explanation}
                  </p>
                </div>

                <button
                  className="btn-primary pricing-symptom-btn"
                  onClick={() => onStartBooking && onStartBooking(symptom.title)}
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
            <div className="pricing-filter-pills">
              <button
                onClick={() => setSelectedHwCategory('all')}
                className={`pricing-filter-pill ${selectedHwCategory === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              {HARDWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedHwCategory(cat.categoryKey)}
                  className={`pricing-filter-pill ${selectedHwCategory === cat.categoryKey ? 'active' : ''}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="pricing-catalog-list">
              {filteredHardware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card pricing-catalog-card">
                  <h3 className="pricing-catalog-h3">
                    {catGroup.category}
                  </h3>

                  <div className="pricing-table-container">
                    <table className="pricing-data-table">
                      <thead>
                        <tr className="pricing-table-header">
                          <th>Repair</th>
                          <th>Estimated Range</th>
                          <th>Note</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} className="pricing-table-row">
                            <td className="pricing-problem-cell">{r.problem}</td>
                            <td className="pricing-range-hw">
                              {r.range}
                            </td>
                            <td className="pricing-note-cell">{r.note}</td>
                            <td className="pricing-action-cell">
                              <button
                                className="btn-primary pricing-book-small-btn"
                                onClick={() => onStartBooking && onStartBooking(r.problem)}
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
            <div className="pricing-software-note">
              *Note: Software licenses (Windows/Office keys) are separate from technician service fees.
            </div>

            <div className="pricing-filter-pills">
              <button
                onClick={() => setSelectedSwCategory('all')}
                className={`pricing-filter-pill ${selectedSwCategory === 'all' ? 'active' : ''}`}
              >
                All
              </button>
              {SOFTWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedSwCategory(cat.categoryKey)}
                  className={`pricing-filter-pill ${selectedSwCategory === cat.categoryKey ? 'active' : ''}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="pricing-catalog-list">
              {filteredSoftware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card pricing-catalog-card">
                  <h3 className="pricing-catalog-h3">
                    {catGroup.category}
                  </h3>

                  <div className="pricing-table-container">
                    <table className="pricing-data-table">
                      <thead>
                        <tr className="pricing-table-header">
                          <th>Service</th>
                          <th>Estimated Range</th>
                          <th>Details</th>
                          <th style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} className="pricing-table-row">
                            <td className="pricing-problem-cell">{r.service}</td>
                            <td className="pricing-range-sw">
                              {r.range}
                            </td>
                            <td className="pricing-note-cell">{r.note}</td>
                            <td className="pricing-action-cell">
                              <button
                                className="btn-primary pricing-book-small-btn"
                                onClick={() => onStartBooking && onStartBooking(r.service)}
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
            <div className="tech-card pricing-workflow-card">
              <h3 className="pricing-workflow-title">
                Transparent Diagnostic & Approval Flow
              </h3>
              <p className="pricing-workflow-subtitle">
                You approve the final cost before any parts are replaced or charged.
              </p>

              <div className="pricing-workflow-grid">
                <div className="pricing-workflow-step-box">
                  <div className="pricing-workflow-step-header" style={{ color: 'var(--primary)' }}>1. SELECT PROBLEM</div>
                  <div className="pricing-workflow-step-title">Laptop Won't Turn On</div>
                  <div className="pricing-workflow-step-detail" style={{ color: 'var(--cta-orange)', fontWeight: 700 }}>Est: ₹500 – ₹10,000+</div>
                </div>

                <div className="pricing-workflow-step-box">
                  <div className="pricing-workflow-step-header" style={{ color: '#10b981' }}>2. LIVE DIAGNOSIS</div>
                  <div className="pricing-workflow-step-title">Failed Power IC (PMIC)</div>
                  <div className="pricing-workflow-step-detail" style={{ color: 'var(--text-muted)' }}>Technician explains on live video</div>
                </div>

                <div className="pricing-workflow-step-box">
                  <div className="pricing-workflow-step-header" style={{ color: 'var(--cta-orange)' }}>3. ITEMIZED QUOTE</div>
                  <div className="pricing-workflow-step-title">Parts: ₹1,800 + Labor: ₹1,000</div>
                  <div className="pricing-workflow-step-detail" style={{ color: 'var(--primary)', fontWeight: 800 }}>Total: ₹2,800</div>
                </div>
              </div>

              {/* Interactive Prompt Demo */}
              <div className={`pricing-prompt-box ${approvalStatus}`}>
                <div className="pricing-prompt-header">
                  <div className="pricing-prompt-title">
                    Repair Approval Prompt
                  </div>
                  <div>
                    {approvalStatus === 'pending' && <span style={{ color: 'var(--cta-orange)', fontSize: '0.8rem', fontWeight: 700 }}>Awaiting Approval</span>}
                    {approvalStatus === 'approved' && <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>✓ Approved (₹2,800)</span>}
                    {approvalStatus === 'rejected' && <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>✕ Declined</span>}
                  </div>
                </div>

                <div className="pricing-prompt-actions">
                  {approvalStatus === 'pending' ? (
                    <>
                      <button
                        onClick={() => setApprovalStatus('rejected')}
                        className="pricing-btn-reject"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => setApprovalStatus('approved')}
                        className="pricing-btn-approve"
                      >
                        Approve ₹2,800
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setApprovalStatus('pending')}
                      className="pricing-btn-reset"
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
        <div className="tech-card pricing-breakdown-card">
          <h3 className="pricing-breakdown-title">What You Pay For</h3>
          <div className="pricing-breakdown-list">
            <div className="pricing-breakdown-item">
              <span>Technician Labor</span>
              <strong>₹800</strong>
            </div>
            <div className="pricing-breakdown-item">
              <span>Replacement Parts (Matched on camera)</span>
              <strong>₹450</strong>
            </div>
            <div className="pricing-breakdown-item free-item">
              <span>Doorstep Pickup & Delivery</span>
              <strong>FREE</strong>
            </div>
            <div className="pricing-breakdown-item">
              <span>Platform Fee & 6-Month Warranty</span>
              <strong>₹100</strong>
            </div>
            <div className="pricing-breakdown-total">
              <span>Total Example</span>
              <span>₹1,350</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
