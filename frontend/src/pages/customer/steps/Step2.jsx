import React from 'react';
import { AlertTriangle, Layers, Wrench, Info, ShieldCheck, CheckSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { SearchableDropdown } from '../../../components/common';

export default function Step2({
  formData,
  setFormData,
  selectedCatId,
  selectedProbId,
  categoryOptions,
  problemOptions,
  allProblemsOptions,
  currentCategory,
  handleCategorySelect,
  handleProblemSelect,
  onBack,
  onNext
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <h3 className="book-step-title">
        <AlertTriangle size={20} color="var(--primary)" className="book-step-title-icon" /> Step 2: Issue Checklist & Description
      </h3>

      {/* 2-Column Searchable Dropdowns for Laptop View, Stacked on Mobile */}
      <div className="book-dropdowns-stack">
        {/* 1. Category Dropdown */}
        <SearchableDropdown
          label="1. Issue Category (20 Categories)"
          sublabel="Select primary diagnostic domain"
          value={selectedCatId}
          options={categoryOptions}
          placeholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
          searchPlaceholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
          icon={Layers}
          onChange={handleCategorySelect}
        />

        {/* 2. Specific Problem / Service Dropdown */}
        <SearchableDropdown
          label="2. Specific Problem / Service"
          sublabel={currentCategory ? `Showing ${currentCategory.problems.length} services in ${currentCategory.shortName} (or type to search all 200)` : 'Search across all 200 laptop problems'}
          value={selectedProbId}
          options={problemOptions}
          fallbackAllOptions={allProblemsOptions}
          placeholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
          searchPlaceholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
          icon={Wrench}
          onChange={handleProblemSelect}
        />
      </div>

      {/* Indicative Benchmark Rate Box */}
      <div className="indicative-rate-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="indicative-icon-circle">
            <Info size={18} color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Hyderabad 2026 Indicative Range
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{formData.base_price_min.toLocaleString()} – ₹{formData.base_price_max.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="indicative-note">
          Base price represents fixed inspection/component rework. The highest price covers OEM/original replacement parts or complex micro-soldering.
        </div>
      </div>

      {/* Problem Description in Words */}
      <div>
        <label className="form-label">
          Describe the problem in words <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Explain symptoms, sounds, or events)</span>
        </label>
        <textarea
          className="form-input"
          rows={4}
          placeholder="Describe what occurred (e.g. system shut down during gaming, screen shows flickering green lines when adjusted, battery drops from 80% to 0%, or tea spill on the keyboard)."
          value={formData.issue_description}
          onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
        />
      </div>

      {/* Spare Part Tier Preference */}
      <div className="book-intake-card">
        <div className="book-intake-title">
          <ShieldCheck size={17} color="#2563eb" /> Replacement Part Tier Preference
        </div>
        <div className="book-power-grid">
          {[
            {
              id: 'OEM Original (100% Genuine with Brand Warranty)',
              title: 'OEM Original (Genuine)',
              desc: 'Direct OEM authentic component with manufacturer warranty'
            },
            {
              id: 'Grade-A High Quality Compatible (Cost-effective)',
              title: 'Grade-A Compatible',
              desc: 'Certified high-performance alternative, tested & guaranteed'
            }
          ].map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setFormData({ ...formData, part_preference: tier.id })}
              className={`book-power-btn ${formData.part_preference === tier.id ? 'book-power-btn-active' : ''}`}
            >
              <CheckSquare size={16} color={formData.part_preference === tier.id ? '#2563eb' : 'var(--text-muted)'} />
              <div>
                <div style={{ fontWeight: 700 }}>{tier.title}</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 400 }}>{tier.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 Actions Footer */}
      <div className="book-actions-footer">
        <button
          type="button"
          onClick={onBack}
          className="btn-neutral"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="btn-action"
        >
          Next: Pickup Logistics <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
