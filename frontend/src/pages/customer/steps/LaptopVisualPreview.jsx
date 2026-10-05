import React, { useState } from 'react';
import { Maximize2, X } from 'lucide-react';
import { resolveLaptopModel } from './laptopModelsData';

export default function LaptopVisualPreview({ brand, model }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const resolved = resolveLaptopModel(brand, model);

  const displayBrand = brand ? brand.toUpperCase() : 'LAPTOP';
  const displayModel = model ? resolved.display_name : 'Select a Model';

  return (
    <div className="laptop-preview-container">
      {/* Laptop Real Photo Stage */}
      <div 
        className="laptop-preview-stage" 
        onClick={() => setIsZoomed(true)} 
        title="Click to view enlarged image"
      >
        <img
          src={resolved.imageUrl}
          alt={`${brand || ''} ${model || ''}`.trim() || 'Laptop Preview'}
          className="laptop-preview-image loaded"
          onError={(e) => {
            e.currentTarget.src = '/hero_laptop.jpg';
          }}
        />

        {/* Zoom Button */}
        <button 
          type="button" 
          className="laptop-preview-zoom-btn"
          aria-label="Enlarge image"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomed(true);
          }}
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* Brand & Model Details Only */}
      <div className="laptop-preview-meta">
        <div className="laptop-preview-top-row">
          <span className="laptop-preview-brand-label">{displayBrand}</span>
          {model && (
            <span className="laptop-preview-model-code-badge" title={resolved.model_code || model}>
              {resolved.model_code || model}
            </span>
          )}
        </div>
        <h4 className="laptop-preview-model-name" title={displayModel}>
          {displayModel}
        </h4>
      </div>

      {/* Enlarged Modal */}
      {isZoomed && (
        <div className="laptop-preview-lightbox" onClick={() => setIsZoomed(false)}>
          <div className="laptop-preview-lightbox-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="laptop-preview-lightbox-close"
              onClick={() => setIsZoomed(false)}
            >
              <X size={18} />
            </button>
            <div className="laptop-preview-lightbox-header">
              <div style={{ flex: 1, paddingRight: '12px' }}>
                <div className="laptop-preview-top-row">
                  <span className="laptop-preview-brand-label">{displayBrand}</span>
                  {model && (
                    <span className="laptop-preview-model-code-badge" title={resolved.model_code || model}>
                      {resolved.model_code || model}
                    </span>
                  )}
                </div>
                <h3 style={{ margin: '4px 0 0', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {displayModel}
                </h3>
              </div>
            </div>
            <img
              src={resolved.imageUrl}
              alt={displayModel}
              className="laptop-preview-lightbox-img"
            />
          </div>
        </div>
      )}
    </div>
  );
}
