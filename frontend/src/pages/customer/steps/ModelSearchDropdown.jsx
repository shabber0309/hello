import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, X, Laptop, AlertCircle } from 'lucide-react';
import { getModelsForBrand } from './laptopModelsData';

export default function ModelSearchDropdown({
  brand,
  selectedModel,
  onSelectModel,
  serialNumber,
  onSerialChange,
  error = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const brandModels = getModelsForBrand(brand);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autofocus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredModels = brandModels.filter(m => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      m.model_code.toLowerCase().includes(term) ||
      m.display_name.toLowerCase().includes(term) ||
      m.specs.toLowerCase().includes(term)
    );
  });

  const handleSelect = (modelCode) => {
    onSelectModel(modelCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const currentDisplayLabel = () => {
    if (!selectedModel) return 'Select Model Name';
    const found = brandModels.find(
      m => m.model_code.toLowerCase() === selectedModel.toLowerCase()
    );
    return found ? found.display_name : selectedModel;
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <label className="form-label" style={{ marginBottom: '7px', display: 'block' }}>
        Model Name / Number
      </label>

      {/* Main Dropdown Trigger Bar (Standard Select Look matching Brand) */}
      <div
        className="form-input"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          padding: '0 16px',
          boxSizing: 'border-box',
          fontSize: '0.92rem',
          borderColor: error ? '#ef4444' : (isOpen ? '#2563eb' : undefined),
          boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : (isOpen ? '0 0 0 3px rgba(37, 99, 235, 0.15)' : undefined)
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
          <Laptop size={18} color={error ? '#ef4444' : 'var(--primary)'} style={{ flexShrink: 0 }} />
          <span
            style={{
              fontWeight: selectedModel ? 600 : 400,
              color: selectedModel ? 'var(--text-main)' : 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentDisplayLabel()}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
          <ChevronDown
            size={18}
            strokeWidth={2.4}
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          />
        </div>
      </div>

      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <AlertCircle size={13} /> {error}
        </span>
      )}

      {/* Searchable Dropdown Popup */}
      {isOpen && (
        <div className="model-dropdown-menu">
          {/* Search bar at first / top */}
          <div className="model-dropdown-search-bar">
            <Search size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              className="model-dropdown-search-input"
              placeholder={`Search ${brand || 'laptop'} models...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchTerm('');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-muted)' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Model Options List */}
          <div className="model-dropdown-list">
            {/* Quick select typed query if user enters custom model */}
            {searchTerm.trim().length > 1 && (
              <div
                className="model-dropdown-option custom-quick-select"
                onClick={() => handleSelect(searchTerm.trim())}
                style={{
                  background: 'rgba(37, 99, 235, 0.07)',
                  borderBottom: '1px solid var(--border-light, #e2e8f0)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '1.05rem', marginRight: '8px' }}>✨</div>
                <div className="model-dropdown-info">
                  <span className="model-dropdown-title" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    Use &ldquo;{searchTerm.trim()}&rdquo; as Model
                  </span>
                  <span className="model-dropdown-specs">
                    Auto-detects authentic OEM chassis &amp; configuration
                  </span>
                </div>
              </div>
            )}

            {filteredModels.length > 0 ? (
              filteredModels.map((item) => {
                const isSelected = selectedModel?.toLowerCase() === item.model_code.toLowerCase();
                return (
                  <div
                    key={item.model_code}
                    className={`model-dropdown-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(item.model_code)}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.display_name}
                      className="model-dropdown-thumb"
                      onError={(e) => { e.currentTarget.src = '/hero_laptop.jpg'; }}
                    />
                    <div className="model-dropdown-info">
                      <span className="model-dropdown-title">
                        {item.display_name}
                      </span>
                      <span className="model-dropdown-specs">
                        {item.specs}
                      </span>
                    </div>
                    {isSelected && (
                      <Check size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                No standard match found for &ldquo;{searchTerm}&rdquo;.
              </div>
            )}

            {/* Option to type custom if not available in dropdown */}
            {searchTerm.trim().length === 0 && (
              <div
                className="model-dropdown-option custom-trigger"
                onClick={() => {
                  const input = prompt(`Enter ${brand || 'laptop'} model number:`);
                  if (input && input.trim()) {
                    handleSelect(input.trim());
                  }
                }}
                style={{
                  borderTop: '1px solid var(--border-light, #e2e8f0)',
                  marginTop: '4px',
                  paddingTop: '10px',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}
              >
                <div style={{ fontSize: '1.05rem', marginRight: '6px' }}>✍️</div>
                <div className="model-dropdown-info">
                  <span style={{ fontSize: '0.86rem', color: 'var(--primary)', fontWeight: 600 }}>
                    Type Custom / Unlisted Model...
                  </span>
                  <span className="model-dropdown-specs">
                    Enter exact serial or model number
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
