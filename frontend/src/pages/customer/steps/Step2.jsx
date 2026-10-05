import React from 'react';
import { AlertTriangle, Layers, Wrench, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
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
  currentProblem,
  handleCategorySelect,
  handleProblemSelect,
  onBack,
  onNext,
  categoryError = '',
  problemError = ''
}) {
  const problemDisplayName = currentProblem?.name || formData.issue_name || 'Hardware Diagnostic';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <h3 className="book-step-title">
        <AlertTriangle size={20} color="var(--primary)" className="book-step-title-icon" /> Step 2: Issue Checklist & Description
      </h3>

      {/* 2-Column Searchable Dropdowns for Laptop View, Stacked on Mobile */}
      <div className="book-dropdowns-stack">
        {/* 1. Category Dropdown */}
        <div id="field-category" style={{ flex: 1 }}>
          <SearchableDropdown
            label="1. Issue Category (20 Categories)"
            sublabel="Select primary diagnostic domain"
            value={selectedCatId}
            options={categoryOptions}
            placeholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
            searchPlaceholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
            icon={Layers}
            onChange={handleCategorySelect}
            error={categoryError}
          />
        </div>

        {/* 2. Specific Problem / Service Dropdown */}
        <div id="field-problem" style={{ flex: 1 }}>
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
            error={problemError}
          />
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
          placeholder="Describe exactly what happened (this is required because the technician will diagnose the issue based on your description). Note: Just like with a doctor or a lawyer, complete honesty with our technician ensures an accurate repair."
          value={formData.issue_description}
          onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
        />
      </div>

      {/* Indicative Price Range & Target Budget Slider Box */}
      <div className="price-slider-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div className="customer-budget-tag">
            Your Target Budget: <span className="budget-val">₹{formData.customer_selected_price.toLocaleString()}</span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              ₹{formData.base_price_min.toLocaleString()} — ₹{formData.base_price_max.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Slider Input */}
        <div style={{ margin: '18px 0 8px' }}>
          <input
            type="range"
            min={formData.base_price_min}
            max={formData.base_price_max}
            step={50}
            value={formData.customer_selected_price}
            onChange={(e) => setFormData({ ...formData, customer_selected_price: Number(e.target.value) })}
            className="ecommerce-range-slider"
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>Fixed Base Price: ₹{formData.base_price_min.toLocaleString()}</span>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Selected: ₹{formData.customer_selected_price.toLocaleString()}</span>
            <span>Highest Benchmark: ₹{formData.base_price_max.toLocaleString()}</span>
          </div>
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
