import React from 'react';
import { Laptop, AlertTriangle, X, Plus, Search, Check, ArrowRight } from 'lucide-react';
import { POPULAR_BRANDS } from './brandLogos';

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
  onNext
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h3 className="book-step-title">
        <Laptop size={20} color="var(--primary)" className="book-step-title-icon" /> Step 1: Laptop Brand, Model & Photo Proof
      </h3>

      {/* Brand Selection */}
      <div>
        <label className="form-label">Brand</label>
        <div className="book-brands-grid">
          {POPULAR_BRANDS.map((b) => {
            const isSelected = formData.laptop_brand === b.name;
            const Logo = b.logo;
            return (
              <button
                key={b.name}
                type="button"
                onClick={() => setFormData({ ...formData, laptop_brand: b.name })}
                className={`book-brand-btn ${isSelected ? 'book-brand-btn-active' : ''}`}
              >
                <span className="book-brand-logo">
                  <Logo color={isSelected ? '#1d4ed8' : b.color} />
                </span>
                <span className="book-brand-name">{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Model & Serial Numbers */}
      <div className="book-form-grid-2">
        <div>
          <label className="form-label">Model Name / Number</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. MacBook Air M2, ThinkPad X1, XPS 15"
            value={formData.laptop_model}
            onChange={(e) => setFormData({ ...formData, laptop_model: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label">Serial Number (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. C02G9012MD6R or leave empty"
            value={formData.serial_number}
            onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
          />
        </div>
      </div>

      {/* Intake Manifest Card (Photos & Accessories) */}
      <div className="intake-manifest-card">
        {/* 1. Upload problem photo * */}
        <div>
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
        <div>
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
