import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import './SearchableDropdown.css';

export default function SearchableDropdown({
  label,
  sublabel,
  value,
  onChange,
  options = [],
  fallbackAllOptions = [],
  placeholder = 'Search...',
  searchPlaceholder = '',
  icon: IconComponent = null,
  emptyMessage = 'No matching options found',
  error = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const effectivePlaceholder = searchPlaceholder || placeholder;

  // Selected Option
  const selectedOption = useMemo(() => {
    if (!value) return null;
    const inOptions = options.find(opt => opt.id === value || opt.value === value);
    if (inOptions) return inOptions;
    return fallbackAllOptions.find(opt => opt.id === value || opt.value === value) || null;
  }, [options, fallbackAllOptions, value]);

  // Sync input value with selected option when dropdown is closed
  useEffect(() => {
    if (!isOpen) {
      if (selectedOption) {
        setInputValue(selectedOption.label || selectedOption.name || '');
      } else {
        setInputValue('');
      }
    }
  }, [selectedOption, isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        if (selectedOption) {
          setInputValue(selectedOption.label || selectedOption.name || '');
        } else {
          setInputValue('');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedOption]);

  // Filter options based on typed input
  const filteredOptions = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    // If empty or exactly matches current selected option's label, show all options in the category
    if (!q || (selectedOption && (selectedOption.label?.toLowerCase() === q || selectedOption.name?.toLowerCase() === q))) {
      return options;
    }

    const matchesQuery = (opt) => {
      const titleMatch = opt.label?.toLowerCase().includes(q) || opt.name?.toLowerCase().includes(q);
      const metaMatch = opt.meta?.toLowerCase().includes(q) || opt.categoryName?.toLowerCase().includes(q);
      const idMatch = opt.id?.toString().includes(q) || opt.num?.toString().includes(q);
      const priceMatch = opt.priceRange?.toLowerCase().includes(q);
      return titleMatch || metaMatch || idMatch || priceMatch;
    };

    const inCurrent = options.filter(matchesQuery);
    if (!fallbackAllOptions || fallbackAllOptions.length === 0) return inCurrent;

    const existingIds = new Set(inCurrent.map(o => o.id));
    const inAll = fallbackAllOptions.filter(matchesQuery).filter(o => !existingIds.has(o.id));

    return [...inCurrent, ...inAll];
  }, [options, fallbackAllOptions, inputValue, selectedOption]);

  const handleInputFocus = () => {
    setIsOpen(true);
    // If an option is already selected, select text for quick editing or replacement
    setTimeout(() => {
      inputRef.current?.select();
    }, 10);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setInputValue('');
    onChange(null);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleOptionClick = (opt) => {
    onChange(opt);
    setInputValue(opt.label || opt.name || '');
    setIsOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={`searchable-dropdown-root ${isOpen ? 'searchable-dropdown-open' : ''}`} ref={containerRef}>
      {label && (
        <div className="searchable-dropdown-header-row">
          <label className="searchable-dropdown-label">{label}</label>
          {sublabel && <span className="searchable-dropdown-sublabel">{sublabel}</span>}
        </div>
      )}

      {/* Main Search Input Bar (Visible At First, exactly like Image 2) */}
      <div 
        className={`search-bar-container ${isOpen ? 'search-bar-open' : ''} ${selectedOption ? 'search-bar-has-value' : ''}`}
        onClick={() => inputRef.current?.focus()}
        style={error ? { borderColor: '#ef4444', boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.15)' } : undefined}
      >
        <div className="search-bar-left">
          <Search size={18} className="search-bar-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-bar-input"
            placeholder={effectivePlaceholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="search-bar-right">
          {/* Price Range Chip (if option has pricing) */}
          {selectedOption?.priceRange && !isOpen && (
            <span className="search-bar-price-chip">
              {selectedOption.priceRange}
            </span>
          )}

          {/* Badge count (e.g. 25 services) */}
          {selectedOption?.badge && !isOpen && (
            <span className="search-bar-count-chip">
              {selectedOption.badge}
            </span>
          )}

          {/* Clear Button */}
          {inputValue && (
            <button
              type="button"
              className="search-bar-clear-btn"
              onClick={handleClear}
              title="Clear selection"
            >
              <X size={14} />
            </button>
          )}

          {/* Chevron Dropdown Trigger */}
          <button
            type="button"
            className={`search-bar-chevron-btn ${isOpen ? 'chevron-active' : ''}`}
            onClick={toggleDropdown}
            title={isOpen ? 'Close menu' : 'Open menu'}
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {error && (
        <span style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}>
          <AlertCircle size={13} /> {error}
        </span>
      )}

      {/* Dropdown Menu (Appears when clicked or typed into) */}
      {isOpen && (
        <div className="searchable-dropdown-menu">
          {/* Results Count Banner */}
          <div className="dropdown-meta-banner">
            <span>
              {inputValue.trim()
                ? `Matching results: ${filteredOptions.length}`
                : `Available options: ${options.length}`}
            </span>
            <span className="dropdown-meta-hint">Click an option to select</span>
          </div>

          {/* Scrollable Options List */}
          <div className="dropdown-options-list" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="dropdown-empty-state">
                <Search size={22} style={{ opacity: 0.4, margin: '0 auto 6px' }} />
                <div>{emptyMessage}</div>
                <span style={{ fontSize: '0.74rem', opacity: 0.7 }}>Try searching with another keyword</span>
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedOption && (selectedOption.id === opt.id || selectedOption.value === opt.value);
                return (
                  <div
                    key={opt.id || opt.value || opt.name}
                    className={`dropdown-option-row ${isSelected ? 'option-selected' : ''}`}
                    onClick={() => handleOptionClick(opt)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="option-info-left">
                      <div className="option-badge-row">
                        {opt.num && <span className="option-num">#{opt.num}</span>}
                        {opt.categoryName && <span className="option-cat">{opt.categoryName}</span>}
                        {opt.badge && <span className="option-count">{opt.badge}</span>}
                      </div>
                      <div className="option-title">
                        {opt.label || opt.name}
                      </div>
                      {opt.desc && (
                        <div className="option-desc">{opt.desc}</div>
                      )}
                    </div>

                    <div className="option-info-right">
                      {opt.priceRange && (
                        <span className="option-price-tag">
                          {opt.priceRange}
                        </span>
                      )}
                      {isSelected && (
                        <div className="option-check-circle">
                          <Check size={14} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
