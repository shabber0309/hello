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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      <h3 className="book-step-title">
        <AlertTriangle size={20} color="var(--primary)" className="book-step-title-icon" /> Step 2: Issue Checklist & Description
      </h3>

      {/* 2-Column Searchable Dropdowns for Laptop View, Stacked on Mobile */}
      <div className="book-dropdowns-stack">
        {/* 1. Category Dropdown */}
        <div id="field-category" style={{ flex: 1 }}> 
          <SearchableDropdown
            label="1. Issue Category (20 Categories)"
            value={selectedCatId}
            options={categoryOptions}
            placeholder="Select Issue Category"
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
            value={selectedProbId}
            options={problemOptions}
            fallbackAllOptions={allProblemsOptions}
            placeholder="Select Problem / Service"
            searchPlaceholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
            icon={Wrench}
            onChange={handleProblemSelect}
            error={problemError}
          />
        </div>
      </div>

      {/* Problem Description in Words */}
      <div>
        <label className="form-label" style={{ marginBottom: '6px' }} >
          Describe the problem in words 
        </label>
        <textarea
          className="form-input"
          rows={12}
          placeholder="Describe symptoms, unusual sounds, error messages, or recent drops/liquid spills (e.g. laptop shut down abruptly, or screen started flickering)..."
          value={formData.issue_description}
          onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
        />
      </div>

      {/* Indicative Price Range & Target Budget Slider Box */}
      {formData.base_price_max > 0 ? (
        <div className="price-slider-box">
          <div className="price-slider-header">
            <div className="customer-budget-tag">
              <span className="label-full">Your Target Budget: </span>
              <span className="label-short">Your Budget: </span>
              <span className="budget-val">₹{formData.customer_selected_price.toLocaleString()}</span>
            </div>
          </div>

          {/* Slider Input */}
          <div style={{ margin: '14px 0 6px' }}>
            <input
              type="range"
              min={formData.base_price_min}
              max={formData.base_price_max}
              step={50}
              value={formData.customer_selected_price}
              onChange={(e) => setFormData({ ...formData, customer_selected_price: Number(e.target.value) })}
              className="ecommerce-range-slider"
            />
            <div className="price-slider-labels">
              <span className="price-slider-label-min">
                <span className="label-full">Fixed Base Price: </span>
                <span className="label-short">Min: </span>
                ₹{formData.base_price_min.toLocaleString()}
              </span>
              <span className="price-slider-label-current">
                <span className="label-full">Selected: </span>
                ₹{formData.customer_selected_price.toLocaleString()}
              </span>
              <span className="price-slider-label-max">
                <span className="label-full">Highest Benchmark: </span>
                <span className="label-short">Max: </span>
                ₹{formData.base_price_max.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="price-slider-box" style={{ textAlign: 'center', padding: '20px 16px', background: 'var(--bg-surface-soft, #f8fafc)', border: '1.5px dashed var(--border-medium, #cbd5e1)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            💡 Select a specific problem or service above to unlock standard pricing benchmarks & customize your budget.
          </p>
        </div>
      )}

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
          Next : Pickup<ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
