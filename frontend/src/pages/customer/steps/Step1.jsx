import React, { useState } from 'react';
import { Laptop, AlertTriangle, AlertCircle, X, Plus, Search, Check, ArrowRight, ChevronDown } from 'lucide-react';
import { BRAND_OPTIONS } from './brandLogos';
import LaptopVisualPreview from './LaptopVisualPreview';
import ModelSearchDropdown from './ModelSearchDropdown';

export default function Step1({
  formData,
  setFormData,
  photos,
  handlePhotoUpload,
  removePhoto,
  photoError,
  chargerPhotos,
  handleChargerPhotoUpload,
  removeChargerPhoto,
  chargerPhotoError,
  accessoryPhotosMap,
  handleItemPhotoUpload,
  removeItemPhoto,
  accessoryPhotoError,
  customAccText,
  setCustomAccText,
  submitCustomAccessory,
  handleAddCustomAccessory,
  toggleAccessory,
  onNext,
  brandError = '',
  modelError = '',
  onClearError
}) {
  const isInitialCustom = Boolean(formData.laptop_brand && !BRAND_OPTIONS.includes(formData.laptop_brand));
  const [customBrandMode, setCustomBrandMode] = useState(isInitialCustom);
  const [customBrandText, setCustomBrandText] = useState(
    formData.laptop_brand && !BRAND_OPTIONS.includes(formData.laptop_brand) ? formData.laptop_brand : ''
  );

  const handleBrandSelectChange = (e) => {
    const val = e.target.value;
    if (onClearError) onClearError('brand');
    if (val === 'OTHER') {
      setCustomBrandMode(true);
      setFormData(prev => ({ ...prev, laptop_brand: customBrandText || '' }));
    } else {
      setCustomBrandMode(false);
      setFormData(prev => ({ ...prev, laptop_brand: val }));
    }
  };

  const handleCustomBrandInputChange = (e) => {
    const text = e.target.value;
    if (onClearError) onClearError('brand');
    setCustomBrandText(text);
    setFormData(prev => ({ ...prev, laptop_brand: text }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 className="book-step-title">
        <Laptop size={20} color="var(--primary)" className="book-step-title-icon" /> Step 1: Laptop Brand, Model & Photo Proof
      </h3>

      {/* Brand, Model & Online Device Visual Match Side-by-Side */}
      <div className="book-device-identity-grid">
        {/* Left: Input Specifications */}
        <div className="book-device-inputs-col">
          {/* Brand Selection Dropdown */}
          <div id="field-brand">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
              <label className="form-label" htmlFor="laptop-brand-select" style={{ margin: 0 }}>
                Brand <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {customBrandMode && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomBrandMode(false);
                    setFormData(prev => ({ ...prev, laptop_brand: 'Apple' }));
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  &larr; Choose from standard list
                </button>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <select
                id="laptop-brand-select"
                className="form-input"
                value={customBrandMode ? 'OTHER' : (BRAND_OPTIONS.includes(formData.laptop_brand) ? formData.laptop_brand : 'OTHER')}
                onChange={handleBrandSelectChange}
                style={{
                  cursor: 'pointer',
                  fontWeight: 600,
                  paddingRight: '42px',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  borderColor: brandError ? '#ef4444' : undefined,
                  boxShadow: brandError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined
                }}
              >
                <option value="" disabled>-- Select Laptop Brand --</option>
                {BRAND_OPTIONS.map((brandName) => (
                  <option key={brandName} value={brandName}>
                    {brandName}
                  </option>
                ))}
                <option value="OTHER">✍️ Other / Not Listed (Type Custom Brand...)</option>
              </select>

              <div style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}>
                <ChevronDown size={18} strokeWidth={2.4} />
              </div>
            </div>

            {brandError && !customBrandMode && (
              <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                <AlertCircle size={13} /> {brandError}
              </span>
            )}

            {/* Option to type if not available in the dropdown */}
            {customBrandMode && (
              <div style={{ marginTop: '12px' }}>
                <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '5px' }}>
                  Type Laptop Brand Name <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Framework, Avita, Clevo, Gateway, Panasonic, etc."
                  value={customBrandText}
                  onChange={handleCustomBrandInputChange}
                  style={{
                    borderColor: brandError ? '#ef4444' : 'var(--primary)',
                    boxShadow: brandError ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : '0 0 0 3px rgba(37, 99, 235, 0.12)'
                  }}
                  autoFocus
                />
                {brandError ? (
                  <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
                    <AlertCircle size={13} /> {brandError}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Your custom brand will be recorded on the intake manifest.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Model Name / Number (Full width for clean readability) */}
          <div id="field-model">
            <ModelSearchDropdown
              brand={formData.laptop_brand}
              selectedModel={formData.laptop_model}
              onSelectModel={(modelVal) => {
                if (onClearError) onClearError('model');
                setFormData(prev => ({ ...prev, laptop_model: modelVal }));
              }}
              error={modelError}
            />
          </div>

          {/* Serial Number (Optional, clean full-width input) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
              <label className="form-label" style={{ margin: 0 }}>
                Serial Number
              </label>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Optional (located on bottom cover)
              </span>
            </div>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. C02G9012MD6R or leave empty"
              value={formData.serial_number}
              onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
            />
          </div>
        </div>

        {/* Right: Live Generated Laptop Visual Preview Beside the Details */}
        <div className="book-device-preview-col">
          <LaptopVisualPreview
            brand={formData.laptop_brand}
            model={formData.laptop_model}
            serial={formData.serial_number}
          />
        </div>
      </div>

      {/* Intake Manifest Card (Photos & Accessories) */}
      <div className="intake-manifest-card">
        {/* 1. Upload problem photo * */}
        <div id="field-photos">
          <div className="intake-manifest-row">
            <div className="intake-manifest-label">
              <span className="intake-manifest-number">1.</span>
              <span>Upload problem photo <span style={{ color: '#ef4444' }}>*</span></span>
            </div>

            <div className="intake-manifest-middle">
              {photos.map((p, idx) => (
                <div
                  key={p.id}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '46px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-medium, #cbd5e1)',
                    background: 'var(--bg-surface, #ffffff)',
                    flexShrink: 0
                  }}
                  title={`Problem photo ${idx + 1}`}
                >
                  <img src={p.dataUrl} alt={`Problem photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#2563eb',
                      border: 'none',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title="Remove photo"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {photos.length === 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No photos uploaded yet
                </span>
              )}
            </div>

            <div className="intake-manifest-action-col">
              <span className="intake-manifest-limit-text">Max (3 photos)</span>
              <label
                htmlFor="problem-photo-input"
                className={`intake-manifest-upload-btn ${photos.length >= 3 ? 'disabled' : ''}`}
              >
                <input
                  type="file"
                  id="problem-photo-input"
                  accept="image/*"
                  multiple
                  disabled={photos.length >= 3}
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <span>Upload</span>
              </label>
            </div>
          </div>

          {photoError && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={13} /> {photoError}
            </div>
          )}
        </div>

        <div className="intake-manifest-divider" />

        {/* 2. Charger Model / Wattage & Photo Proof */}
        <div id="field-chargerPhotos">
          <div className="intake-manifest-row">
            <div className="intake-manifest-label">
              <span className="intake-manifest-number">2.</span>
              <span>Charger Model / Wattage & Photo Proof <span style={{ color: '#ef4444' }}>*</span></span>
            </div>

            <div className="intake-manifest-middle">
              {chargerPhotos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    position: 'relative',
                    width: '64px',
                    height: '46px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-medium, #cbd5e1)',
                    background: 'var(--bg-surface, #ffffff)',
                    flexShrink: 0
                  }}
                  title={photo.name}
                >
                  <img src={photo.dataUrl} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeChargerPhoto(photo.id)}
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#2563eb',
                      border: 'none',
                      borderRadius: '50%',
                      width: '15px',
                      height: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      cursor: 'pointer',
                      padding: 0
                    }}
                    title="Remove"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {chargerPhotos.length === 0 && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No photos uploaded yet
                </span>
              )}
            </div>

            <div className="intake-manifest-action-col">
              <span className="intake-manifest-limit-text">Max (3 photos)</span>
              <label
                htmlFor="charger-photo-upload-input"
                className={`intake-manifest-upload-btn ${chargerPhotos.length >= 3 ? 'disabled' : ''}`}
              >
                <input
                  type="file"
                  id="charger-photo-upload-input"
                  accept="image/*"
                  multiple
                  disabled={chargerPhotos.length >= 3}
                  onChange={handleChargerPhotoUpload}
                  style={{ display: 'none' }}
                />
                <span>Upload</span>
              </label>
            </div>
          </div>

          {chargerPhotoError && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={13} /> {chargerPhotoError}
            </div>
          )}
        </div>

        <div className="intake-manifest-divider" />

        {/* 3. Other Handover Accessories (Optional) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="intake-manifest-label">
            <span className="intake-manifest-number">3.</span>
            <span>Other Handover Accessories (Optional)</span>
          </div>

          {/* Search Bar */}
          <div className="intake-manifest-input-box" style={{ width: '100%', boxSizing: 'border-box' }}>
            <Search size={16} style={{ color: 'var(--text-muted)', marginLeft: '4px', flexShrink: 0 }} />
            <input
              type="text"
              className="intake-manifest-input"
              placeholder="Type accessory (e.g. Mouse, Bag)..."
              value={customAccText}
              onChange={(e) => setCustomAccText(e.target.value)}
              onKeyDown={handleAddCustomAccessory}
              style={{ width: '100%', fontSize: '0.9rem' }}
            />

            {customAccText.trim() && (
              <button
                type="button"
                onClick={submitCustomAccessory}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '5px 12px',
                  background: 'var(--primary, #2563eb)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <Plus size={13} /> Add
              </button>
            )}
          </div>

          {/* Quick Add Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            paddingTop: '8px',
            borderTop: '1px dashed var(--border-subtle, rgba(0, 0, 0, 0.08))',
            width: '100%',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Quick add:</span>
            {['Mouse', 'Laptop Bag', 'USB Hub', 'External Drive'].map(item => {
              const isAdded = formData.included_accessories.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (isAdded) {
                      toggleAccessory(item);
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        included_accessories: [...prev.included_accessories.filter(a => a !== 'None'), item]
                      }));
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px 9px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    background: isAdded ? 'var(--primary, #2563eb)' : 'var(--bg-surface, #ffffff)',
                    color: isAdded ? '#ffffff' : 'var(--text-muted)',
                    border: '1px solid ' + (isAdded ? 'var(--primary, #2563eb)' : 'var(--border-medium, #cbd5e1)'),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isAdded ? <Check size={11} /> : <Plus size={11} />}
                  <span>{item}</span>
                </button>
              );
            })}
          </div>

          {accessoryPhotoError && (
            <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle size={13} /> {accessoryPhotoError}
            </div>
          )}

          {/* Dedicated Per-Accessory Rows */}
          {formData.included_accessories.filter(a => a && a !== 'None').map((acc) => {
            const itemPhotos = accessoryPhotosMap[acc] || [];
            const isMax = itemPhotos.length >= 3;
            const inputId = `accessory-photo-input-${acc.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;

            return (
              <div
                key={acc}
                className="intake-manifest-row"
                style={{
                  paddingTop: '6px',
                  paddingBottom: '6px',
                  borderTop: '1px solid var(--border-subtle, rgba(0, 0, 0, 0.04))'
                }}
              >
                <div className="intake-manifest-label">
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>{acc}</span>
                  <button
                    type="button"
                    onClick={() => toggleAccessory(acc)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={`Remove ${acc}`}
                  >
                    <X size={13} />
                  </button>
                </div>

                <div className="intake-manifest-middle">
                  {itemPhotos.length > 0 ? (
                    itemPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        style={{
                          position: 'relative',
                          width: '64px',
                          height: '46px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1.5px solid var(--border-medium, #cbd5e1)',
                          background: 'var(--bg-surface, #ffffff)',
                          flexShrink: 0
                        }}
                        title={photo.name}
                      >
                        <img src={photo.dataUrl} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={() => removeItemPhoto(acc, photo.id)}
                          style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            background: '#2563eb',
                            border: 'none',
                            borderRadius: '50%',
                            width: '15px',
                            height: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: 0
                          }}
                          title="Remove photo"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No photos uploaded yet
                    </span>
                  )}
                </div>

                <div className="intake-manifest-action-col">
                  <span className="intake-manifest-limit-text">Max (3 photos)</span>
                  <label
                    htmlFor={inputId}
                    className={`intake-manifest-upload-btn ${isMax ? 'disabled' : ''}`}
                  >
                    <input
                      type="file"
                      id={inputId}
                      accept="image/*"
                      multiple
                      disabled={isMax}
                      onChange={(e) => handleItemPhotoUpload(acc, e)}
                      style={{ display: 'none' }}
                    />
                    <span>Upload</span>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 Actions Footer */}
      <div className="book-actions-footer">
        <button
          type="button"
          onClick={onNext}
          className="btn-action btn-action-next-only"
        >
          Next: Issue Checklist <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
