import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import './SearchableDropdown.css';

export default function SearchableDropdown({
  label,
  sublabel,
  value,
  onChange,
  options = [],
  fallbackAllOptions = [],
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  icon: IconComponent = null,
  emptyMessage = 'No matching options found'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Find currently selected option object (either in options or fallbackAllOptions)
  const selectedOption = useMemo(() => {
    const inOptions = options.find(opt => opt.id === value || opt.value === value);
    if (inOptions) return inOptions;
    return fallbackAllOptions.find(opt => opt.id === value || opt.value === value) || null;
  }, [options, fallbackAllOptions, value]);

  // Filter options by search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();

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
  }, [options, fallbackAllOptions, searchQuery]);

  const handleSelect = (opt) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className="searchable-dropdown-root" ref={containerRef}>
      {label && (
        <div className="searchable-dropdown-header-row">
          <label className="searchable-dropdown-label">{label}</label>
          {sublabel && <span className="searchable-dropdown-sublabel">{sublabel}</span>}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        className={`searchable-dropdown-trigger ${isOpen ? 'trigger-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="trigger-left">
          {IconComponent && (
            <div className="trigger-icon-box">
              <IconComponent size={18} />
            </div>
          )}

          <div className="trigger-text-wrapper">
            {selectedOption ? (
              <div className="trigger-selected-title">
                {selectedOption.num && (
                  <span className="trigger-num-badge">#{selectedOption.num}</span>
                )}
                <span className="trigger-name">{selectedOption.label || selectedOption.name}</span>
                {selectedOption.categoryName && (
                  <span className="trigger-cat-tag">{selectedOption.categoryName}</span>
                )}
              </div>
            ) : (
              <span className="trigger-placeholder">{placeholder}</span>
            )}
          </div>
        </div>

        <div className="trigger-right">
          {selectedOption?.priceRange && (
            <span className="trigger-price-badge">{selectedOption.priceRange}</span>
          )}
          {selectedOption?.badge && (
            <span className="trigger-count-badge">{selectedOption.badge}</span>
          )}
          <div className={`trigger-chevron ${isOpen ? 'chevron-rotated' : ''}`}>
            <ChevronDown size={18} />
          </div>
        </div>
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div className="searchable-dropdown-menu">
          {/* Embedded Search Input */}
          <div className="dropdown-search-wrapper">
            <Search size={16} className="dropdown-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="dropdown-search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                className="dropdown-search-clear"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Results Count Banner */}
          <div className="dropdown-meta-banner">
            <span>
              {searchQuery ? `Matching: ${filteredOptions.length} results` : `Total: ${options.length} options in category`}
            </span>
            <span className="dropdown-meta-hint">Type to search 200 problems</span>
          </div>

          {/* Scrollable Options List */}
          <div className="dropdown-options-list" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="dropdown-empty-state">
                <Search size={22} style={{ opacity: 0.4, margin: '0 auto 6px' }} />
                <div>{emptyMessage}</div>
                <span style={{ fontSize: '0.74rem', opacity: 0.7 }}>Try searching for another keyword</span>
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedOption && (selectedOption.id === opt.id || selectedOption.value === opt.value);
                return (
                  <div
                    key={opt.id || opt.value || opt.name}
                    className={`dropdown-option-row ${isSelected ? 'option-selected' : ''}`}
                    onClick={() => handleSelect(opt)}
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
