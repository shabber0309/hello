import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import './SearchableDropdown.css';

export default function SearchableDropdown({
  label,
  sublabel,
  value,
  onChange,
  options = [],
  fallbackAllOptions = [],
  placeholder = 'Select option...',
  searchPlaceholder = '',
  icon: IconComponent = null,
  emptyMessage = 'No matching options found',
  error = ''
}) {
  const handleChange = (e) => {
    const val = e.target.value;
    if (!val) {
      onChange(null);
      return;
    }
    // Find matching option object from options or fallback
    const found = options.find(opt => (opt.id !== undefined && opt.id.toString() === val) || (opt.value !== undefined && opt.value.toString() === val)) ||
                  fallbackAllOptions.find(opt => (opt.id !== undefined && opt.id.toString() === val) || (opt.value !== undefined && opt.value.toString() === val));
    if (found) {
      onChange(found);
    } else {
      onChange({ id: val, value: val, label: val });
    }
  };

  const selectedValue = value !== null && value !== undefined ? value.toString() : '';

  return (
    <div className="searchable-dropdown-root">
      {label && (
        <div className="searchable-dropdown-header-row">
          <label className="searchable-dropdown-label">{label}</label>
          {sublabel && <span className="searchable-dropdown-sublabel">{sublabel}</span>}
        </div>
      )}

      {/* Standard Select Wrapper matching Brand select exactly */}
      <div className="searchable-select-wrapper" style={{ position: 'relative', width: '100%' }}>
        <select
          className="form-input searchable-native-select"
          value={selectedValue}
          onChange={handleChange}
          style={{
            cursor: 'pointer',
            fontWeight: selectedValue ? 600 : 400,
            color: selectedValue ? 'var(--text-main, #0f172a)' : 'var(--text-muted, #94a3b8)',
            paddingRight: '42px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            borderColor: error ? '#ef4444' : undefined,
            boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => {
            const optVal = opt.id !== undefined ? opt.id.toString() : (opt.value !== undefined ? opt.value.toString() : opt.name);
            const optText = opt.label || opt.name || optVal;
            return (
              <option key={optVal} value={optVal}>
                {optText}
              </option>
            );
          })}
        </select>

        {/* Chevron icon on the right */}
        <div
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--text-muted, #94a3b8)',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ChevronDown size={18} strokeWidth={2.4} />
        </div>
      </div>

      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <AlertCircle size={13} /> {error}
        </span>
      )}
    </div>
  );
}
