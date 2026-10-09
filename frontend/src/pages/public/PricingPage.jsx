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
        <div className="pricing-tabs-row nav nav-pills justify-content-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`btn pricing-tab-btn ${activeTab === 'symptoms' ? 'btn-primary active-primary' : 'btn-outline-secondary'}`}
          >
            🚨 Common Problems
          </button>

          <button
            onClick={() => setActiveTab('hardware')}
            className={`btn pricing-tab-btn ${activeTab === 'hardware' ? 'btn-primary active-primary' : 'btn-outline-secondary'}`}
          >
            <Cpu size={15} /> Hardware Catalog
          </button>

          <button
            onClick={() => setActiveTab('software')}
            className={`btn pricing-tab-btn ${activeTab === 'software' ? 'btn-primary active-primary' : 'btn-outline-secondary'}`}
          >
            <Layers size={15} /> Software Catalog
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`btn pricing-tab-btn ${activeTab === 'workflow' ? 'btn-primary active-workflow' : 'btn-outline-secondary'}`}
          >
            <ShieldCheck size={15} /> How Approval Works
          </button>
        </div>

        {/* TAB 1: COMMON PROBLEMS */}
        {activeTab === 'symptoms' && (
          <div className="pricing-symptoms-grid row g-4">
            {filteredSymptoms.map((symptom) => (
              <div key={symptom.id} className="col-12 col-md-6 col-lg-4">
                <div className="tech-card card h-100 pricing-symptom-card d-flex flex-column justify-content-between p-4">
                  <div>
                    <div className="pricing-symptom-top d-flex justify-content-between align-items-center mb-3">
                      <span className="pricing-symptom-icon fs-3">{symptom.icon}</span>
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
                        {symptom.category}
                      </span>
                    </div>

                    <h3 className="pricing-symptom-title h5 mb-2">
                      {symptom.title}
                    </h3>

                    <div className="pricing-symptom-range fw-bold text-primary mb-2">
                      {symptom.estimateRange}
                    </div>

                    <p className="pricing-symptom-desc small text-muted mb-4">
                      {symptom.explanation}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary w-100 pricing-symptom-btn"
                    onClick={() => onStartBooking && onStartBooking(symptom.title)}
                  >
                    Book for this Issue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: HARDWARE CATALOG */}
        {activeTab === 'hardware' && (
          <div>
            <div className="pricing-filter-pills d-flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedHwCategory('all')}
                className={`btn btn-sm ${selectedHwCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                All
              </button>
              {HARDWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedHwCategory(cat.categoryKey)}
                  className={`btn btn-sm ${selectedHwCategory === cat.categoryKey ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="pricing-catalog-list d-flex flex-column gap-4">
              {filteredHardware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card card pricing-catalog-card p-4">
                  <h3 className="pricing-catalog-h3 h5 mb-3">
                    {catGroup.category}
                  </h3>

                  <div className="pricing-table-container table-responsive">
                    <table className="table table-hover align-middle pricing-data-table mb-0">
                      <thead>
                        <tr className="pricing-table-header">
                          <th scope="col">Repair</th>
                          <th scope="col">Estimated Range</th>
                          <th scope="col">Note</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} className="pricing-table-row">
                            <td className="pricing-problem-cell fw-medium">{r.problem}</td>
                            <td className="pricing-range-hw text-primary fw-bold">
                              {r.range}
                            </td>
                            <td className="pricing-note-cell text-muted small">{r.note}</td>
                            <td className="pricing-action-cell" style={{ textAlign: 'right' }}>
                              <button
                                className="btn btn-sm btn-primary pricing-book-small-btn"
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
            <div className="pricing-software-note alert alert-info py-2 px-3 mb-3">
              *Note: Software licenses (Windows/Office keys) are separate from technician service fees.
            </div>

            <div className="pricing-filter-pills d-flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setSelectedSwCategory('all')}
                className={`btn btn-sm ${selectedSwCategory === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                All
              </button>
              {SOFTWARE_REPAIRS.map(cat => (
                <button
                  key={cat.categoryKey}
                  onClick={() => setSelectedSwCategory(cat.categoryKey)}
                  className={`btn btn-sm ${selectedSwCategory === cat.categoryKey ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {cat.category}
                </button>
              ))}
            </div>

            <div className="pricing-catalog-list d-flex flex-column gap-4">
              {filteredSoftware.map((catGroup) => (
                <div key={catGroup.categoryKey} className="tech-card card pricing-catalog-card p-4">
                  <h3 className="pricing-catalog-h3 h5 mb-3">
                    {catGroup.category}
                  </h3>

                  <div className="pricing-table-container table-responsive">
                    <table className="table table-hover align-middle pricing-data-table mb-0">
                      <thead>
                        <tr className="pricing-table-header">
                          <th scope="col">Service</th>
                          <th scope="col">Estimated Range</th>
                          <th scope="col">Details</th>
                          <th scope="col" style={{ textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {catGroup.repairs.map((r, idx) => (
                          <tr key={idx} className="pricing-table-row">
                            <td className="pricing-problem-cell fw-medium">{r.service}</td>
                            <td className="pricing-range-sw text-primary fw-bold">
                              {r.range}
                            </td>
                            <td className="pricing-note-cell text-muted small">{r.note}</td>
                            <td className="pricing-action-cell" style={{ textAlign: 'right' }}>
                              <button
                                className="btn btn-sm btn-primary pricing-book-small-btn"
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
