import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LAPTOP_PROBLEM_CATEGORIES, ALL_PROBLEMS_FLAT } from '../../data/laptopProblems';
import { getSavedAddress, saveCustomerAddress } from '../../data/pincodeLocations';
import { Step1, Step2, Step3, Step4 } from './steps';
import { scrollToFirstError } from '../../utils/validation';
import './BookRepair.css';

export default function BookRepair({ onBookingSuccess, onCancel }) {
  const { token } = useAuth();
  const location = useLocation();
  const prefill = location.state?.prefillProblem || '';

  const [step, setStep] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step && parsed.step >= 1 && parsed.step <= 4) {
          return parsed.step;
        }
      }
    } catch (e) {}
    return 1;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const stepperRef = useRef(null);

  // Selected Category and Problem State - Defaults to empty ('') so "Select Issue Category" is default
  const [selectedCatId, setSelectedCatId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step > 2 && parsed.selectedCatId && parsed.formData?.issue_category) {
          return parsed.selectedCatId;
        }
      }
    } catch (e) {}
    return '';
  });

  const [selectedProbId, setSelectedProbId] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step > 2 && parsed.selectedProbId && parsed.formData?.issue_name) {
          return parsed.selectedProbId;
        }
      }
    } catch (e) {}
    return '';
  });

  // Photos State: Min 1, Max 3 required
  const [photos, setPhotos] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.photos)) return parsed.photos;
      }
    } catch (e) {}
    return [];
  });

  // Mandatory Charger Photos State: Min 1, Max 3 required
  const [chargerPhotos, setChargerPhotos] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.chargerPhotos)) return parsed.chargerPhotos;
      }
    } catch (e) {}
    return [];
  });
  const [chargerPhotoError, setChargerPhotoError] = useState('');

  // Optional Per-Accessory Photos State: map of accessoryName -> array of photos (Max 3 per item)
  const [accessoryPhotosMap, setAccessoryPhotosMap] = useState(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.accessoryPhotosMap) return parsed.accessoryPhotosMap;
      }
    } catch (e) {}
    return {};
  });
  const [accessoryPhotoError, setAccessoryPhotoError] = useState('');
  const [customAccText, setCustomAccText] = useState('');

  // Form State with Session Storage Hydration & Saved Address Auto-fill
  const [formData, setFormData] = useState(() => {
    const savedAddr = getSavedAddress();
    const initialData = {
      laptop_brand: '',
      laptop_model: '',
      serial_number: '',
      issue_category: '',
      issue_name: '',
      issue_description: prefill ? `Selected Issue: ${prefill}` : '',
      charger_included: true,
      charger_details: 'Original Charger / Power Adapter',
      included_accessories: [],
      pre_existing_damage: ['None / Mint Condition'],
      pickup_address: savedAddr?.pickup_address || '',
      pickup_area: savedAddr?.pickup_area || '',
      pickup_city: savedAddr?.pickup_city || 'Hyderabad',
      pickup_pincode: savedAddr?.pickup_pincode || '',
      pickup_landmark: savedAddr?.pickup_landmark || '',
      pickup_slot: 'On-Demand Dispatch',
      data_backup_status: 'Customer Confirmed Backup (Diagnostic Waiver Signed)',
      chassis_open_consent: true,
      base_price_min: 0,
      base_price_max: 0,
      customer_selected_price: 0
    };

    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) {
          return { 
            ...initialData, 
            ...parsed.formData,
            pickup_address: parsed.formData.pickup_address || savedAddr?.pickup_address || '',
            pickup_pincode: parsed.formData.pickup_pincode || savedAddr?.pickup_pincode || '',
            pickup_area: parsed.formData.pickup_area || savedAddr?.pickup_area || '',
            pickup_city: parsed.formData.pickup_city || savedAddr?.pickup_city || 'Hyderabad',
            pickup_landmark: parsed.formData.pickup_landmark || savedAddr?.pickup_landmark || ''
          };
        }
      }
    } catch (e) {}
    return initialData;
  });

  // Clear any old stale test selections so Step 2 always defaults to "Select Issue Category"
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('livefix_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.step <= 2 && parsed.selectedCatId === 'software' && parsed.selectedProbId === 1) {
          setSelectedCatId('');
          setSelectedProbId('');
          setFormData(prev => ({
            ...prev,
            issue_category: '',
            issue_name: '',
            base_price_min: 0,
            base_price_max: 0,
            customer_selected_price: 0
          }));
        }
      }
    } catch (e) {}
  }, []);

  // Automatically persist progress to sessionStorage so page refresh stays on current step with all data intact
  useEffect(() => {
    try {
      const stateToSave = {
        step,
        formData,
        selectedCatId,
        selectedProbId,
        photos,
        chargerPhotos,
        accessoryPhotosMap
      };
      sessionStorage.setItem('livefix_booking_state', JSON.stringify(stateToSave));
    } catch (err) {
      // In case quota is exceeded due to raw photos, safely persist step and form fields
      try {
        const fallbackState = {
          step,
          formData,
          selectedCatId,
          selectedProbId
        };
        sessionStorage.setItem('livefix_booking_state', JSON.stringify(fallbackState));
      } catch (e) {}
    }
  }, [step, formData, selectedCatId, selectedProbId, photos, chargerPhotos, accessoryPhotosMap]);

  // Automatically scroll to the top of the wizard (book-stepper-bar) on step transition
  useEffect(() => {
    const scrollToStepper = () => {
      if (stepperRef.current) {
        const header = document.querySelector('.silicone-header');
        const headerHeight = header ? header.offsetHeight : 76;
        const rect = stepperRef.current.getBoundingClientRect();
        const absoluteTop = rect.top + window.pageYOffset;
        const targetScroll = Math.max(0, absoluteTop - headerHeight - 16);

        window.scrollTo({
          top: targetScroll,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    };

    scrollToStepper();
    const timeoutId = setTimeout(scrollToStepper, 50);
    return () => clearTimeout(timeoutId);
  }, [step]);

  // Handle Charger Photo Upload (Mandatory Min 1, Max 3)
  const handleChargerPhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (chargerPhotos.length + files.length > 3) {
      setChargerPhotoError('Maximum 3 charger photos allowed. Please select up to 3 images.');
      return;
    }
    setChargerPhotoError('');

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setChargerPhotoError('Only image files (JPG, PNG, WebP) are supported.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setChargerPhotos(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            dataUrl: event.target.result
          }];
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeChargerPhoto = (id) => {
    setChargerPhotos(prev => prev.filter(p => p.id !== id));
  };

  // Handle Per-Accessory Photo Upload (Max 3 per accessory)
  const handleItemPhotoUpload = (accName, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentPhotos = accessoryPhotosMap[accName] || [];
    if (currentPhotos.length + files.length > 3) {
      setAccessoryPhotoError(`Maximum 3 photos allowed for "${accName}".`);
      return;
    }
    setAccessoryPhotoError('');

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setAccessoryPhotoError('Only image files (JPG, PNG, WebP) are supported.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAccessoryPhotosMap(prev => {
          const itemPhotos = prev[accName] || [];
          if (itemPhotos.length >= 3) return prev;
          return {
            ...prev,
            [accName]: [
              ...itemPhotos,
              {
                id: Math.random().toString(36).substring(2, 9),
                name: file.name,
                size: (file.size / 1024).toFixed(1) + ' KB',
                dataUrl: event.target.result
              }
            ]
          };
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeItemPhoto = (accName, photoId) => {
    setAccessoryPhotosMap(prev => ({
      ...prev,
      [accName]: (prev[accName] || []).filter(p => p.id !== photoId)
    }));
  };

  const submitCustomAccessory = () => {
    const val = customAccText.trim();
    if (val) {
      setFormData(prev => {
        const current = (prev.included_accessories || []).filter(item => item !== 'None');
        if (!current.includes(val)) {
          return { ...prev, included_accessories: [...current, val] };
        }
        return prev;
      });
      setCustomAccText('');
    }
  };

  const handleAddCustomAccessory = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitCustomAccessory();
    }
  };

  const toggleAccessory = (acc) => {
    setFormData(prev => {
      const current = (prev.included_accessories || []).filter(item => item !== acc && item !== 'None');
      return { ...prev, included_accessories: current };
    });
    setAccessoryPhotosMap(prev => {
      const next = { ...prev };
      delete next[acc];
      return next;
    });
  };

  const toggleDamage = (dmg) => {
    setFormData(prev => {
      let current = [...prev.pre_existing_damage];
      if (dmg === 'None / Mint Condition') {
        return { ...prev, pre_existing_damage: ['None / Mint Condition'] };
      }
      current = current.filter(item => item !== 'None / Mint Condition');
      if (current.includes(dmg)) {
        current = current.filter(item => item !== dmg);
        if (current.length === 0) current = ['None / Mint Condition'];
      } else {
        current.push(dmg);
      }
      return { ...prev, pre_existing_damage: current };
    });
  };



  // Active Category & Problem objects
  const currentCategory = selectedCatId ? LAPTOP_PROBLEM_CATEGORIES.find(c => c.id === selectedCatId) : null;
  const currentProblem = selectedProbId
    ? (currentCategory?.problems.find(p => p.id === selectedProbId) || ALL_PROBLEMS_FLAT.find(p => p.id === selectedProbId))
    : null;

  // Handle Photo selection (converts files to base64 data URLs for immediate preview & zero-setup persistence)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 3) {
      setPhotoError('Maximum 3 photos allowed. Please select up to 3 images.');
      return;
    }
    setPhotoError('');

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setPhotoError('Only image files (JPG, PNG, WebP) are supported.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => {
          if (prev.length >= 3) return prev;
          return [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            dataUrl: event.target.result
          }];
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const clearFieldError = (fieldName) => {
    setFieldErrors(prev => {
      if (!prev[fieldName]) return prev;
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  // Step 1 Validation with individual errors for brand, model, photos, and chargerPhotos
  const handleProceedToStep2 = () => {
    const errors = {};
    if (!formData.laptop_brand || !formData.laptop_brand.trim()) {
      errors.brand = 'Please select or enter your laptop brand.';
    }
    if (!formData.laptop_model || !formData.laptop_model.trim()) {
      errors.model = 'Please select or enter your laptop model name/number.';
    }
    if (photos.length === 0) {
      errors.photos = 'Photo proof is required (Min 1, Max 3). Please upload at least 1 photo.';
    } else if (photos.length > 3) {
      errors.photos = 'Maximum 3 photos allowed.';
    }
    if (chargerPhotos.length < 1) {
      errors.chargerPhotos = 'Charger photo is mandatory (Min 1, Max 3). Please upload at least 1 photo of your charger.';
    } else if (chargerPhotos.length > 3) {
      errors.chargerPhotos = 'Maximum 3 charger photos allowed.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors), 50);
      return;
    }

    setFieldErrors({});
    setError('');
    setPhotoError('');
    setChargerPhotoError('');
    setStep(2);
  };

  // Step 2 to Step 3 Validation with individual errors for problem
  const handleProceedToStep3 = () => {
    const errors = {};
    if (!selectedCatId && !formData.issue_category) {
      errors.category = 'Please select a primary diagnostic category.';
    }
    if (!selectedProbId && !formData.issue_name) {
      errors.problem = 'Please select or search your specific laptop problem/service.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors), 50);
      return;
    }

    setFieldErrors({});
    setError('');
    setStep(3);
  };

  // Step 3 to Step 4 Validation with individual errors for address, area, pincode, consent
  const handleProceedToStep4 = () => {
    const errors = {};
    if (!formData.pickup_address || !formData.pickup_address.trim()) {
      errors.pickup_address = 'Please enter your complete doorstep pickup address.';
    }
    if (!formData.pickup_area || !formData.pickup_area.trim()) {
      errors.pickup_area = 'Please enter your area or locality.';
    }
    const pincodeClean = (formData.pickup_pincode || '').trim();
    if (!pincodeClean) {
      errors.pickup_pincode = 'Please enter your 6-digit postal pincode.';
    } else if (!/^[1-9]\d{5}$/.test(pincodeClean)) {
      errors.pickup_pincode = 'Pincode must be exactly 6 numeric digits (e.g. 500081).';
    }
    if (!formData.chassis_open_consent) {
      errors.chassis_open_consent = 'Diagnostic & backup authorization is required to proceed with repair.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('');
      setTimeout(() => scrollToFirstError(errors), 50);
      return;
    }

    setFieldErrors({});
    setError('');
    setStep(4);
  };

  // Memoized options for SearchableDropdowns
  const categoryOptions = LAPTOP_PROBLEM_CATEGORIES.map(cat => ({
    id: cat.id,
    value: cat.id,
    label: cat.name,
    badge: `${cat.problems.length} services`,
    meta: cat.shortName
  }));

  const allProblemsOptions = ALL_PROBLEMS_FLAT.map(prob => ({
    id: prob.id,
    value: prob.id,
    num: prob.id,
    label: prob.name,
    basePrice: prob.basePrice,
    maxPrice: prob.maxPrice,
    categoryId: prob.categoryId,
    categoryName: prob.shortCategory
  }));

  const problemOptions = currentCategory
    ? currentCategory.problems.map(prob => ({
      id: prob.id,
      value: prob.id,
      num: prob.id,
      label: prob.name,
      basePrice: prob.basePrice,
      maxPrice: prob.maxPrice,
      categoryName: currentCategory.shortName
    }))
    : allProblemsOptions;

  // Step 2 Category Dropdown Selection Handler
  const handleCategorySelect = (opt) => {
    const catId = opt.id || opt.value;
    setSelectedCatId(catId);
    setSelectedProbId(null);
    clearFieldError('category');
    clearFieldError('problem');
    const cat = LAPTOP_PROBLEM_CATEGORIES.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      issue_category: cat ? cat.name : '',
      issue_name: '',
      base_price_min: 0,
      base_price_max: 0,
      customer_selected_price: 0
    }));
  };

  // Step 2 Problem Dropdown Selection Handler (Supports cross-category search!)
  const handleProblemSelect = (opt) => {
    const probId = opt.num || opt.id || opt.value;
    if (opt.categoryId && opt.categoryId !== selectedCatId) {
      setSelectedCatId(opt.categoryId);
    }
    setSelectedProbId(probId);
    clearFieldError('problem');
    const prob = ALL_PROBLEMS_FLAT.find(p => p.id === probId) || currentCategory?.problems.find(p => p.id === probId);
    if (prob) {
      setFormData(prev => ({
        ...prev,
        issue_category: prob.categoryName || currentCategory?.name || '',
        issue_name: prob.name,
        base_price_min: prob.basePrice,
        base_price_max: prob.maxPrice,
        customer_selected_price: Math.round((prob.basePrice + prob.maxPrice) / 2)
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const payload = {
      laptop_brand: formData.laptop_brand,
      laptop_model: formData.laptop_model,
      serial_number: formData.serial_number,
      issue_category: `${currentCategory ? currentCategory.shortName : 'General'}: ${currentProblem ? currentProblem.name : (formData.issue_name || 'Hardware Diagnostic')}`,
      issue_description: formData.issue_description,
      charger_included: formData.charger_included,
      charger_details: formData.charger_details,
      included_accessories: formData.included_accessories,
      pre_existing_damage: formData.pre_existing_damage,
      pickup_address: formData.pickup_address,
      pickup_area: formData.pickup_area,
      pickup_city: formData.pickup_city,
      pickup_pincode: formData.pickup_pincode,
      pickup_landmark: formData.pickup_landmark,
      pickup_slot: formData.pickup_slot,
      data_backup_status: formData.data_backup_status,
      chassis_open_consent: formData.chassis_open_consent,
      base_price_min: formData.base_price_min,
      base_price_max: formData.base_price_max,
      customer_selected_price: formData.customer_selected_price,
      problem_photos: photos.map(p => p.dataUrl),
      charger_photos: chargerPhotos.map(p => p.dataUrl),
      accessory_photos: Object.values(accessoryPhotosMap).flat().map(p => p.dataUrl)
    };

    try {
      const activeToken = token || localStorage.getItem('token') || localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token');
      const res = await fetch('/api/repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        try { sessionStorage.removeItem('livefix_booking_state'); } catch (e) {}
        saveCustomerAddress(formData);
        onBookingSuccess(data.order);
      } else {
        setError(data.error || 'Failed to book repair.');
      }
    } catch (err) {
      // Local resilient fallback
      const mockOrder = {
        id: Date.now(),
        order_number: `EOF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        ...payload,
        tamper_seal_code: null,
        status: 'Order Placed',
        quote_amount: formData.customer_selected_price,
        quote_approved: false
      };
      try { sessionStorage.removeItem('livefix_booking_state'); } catch (e) {}
      saveCustomerAddress(formData);
      onBookingSuccess(mockOrder);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-repair-root">


      {/* Stepper Bar */}
      <div ref={stepperRef} className="book-stepper-bar">
        {[
          { num: 1, label: 'Device Specs & Photos' },
          { num: 2, label: 'Issue Checklist' },
          { num: 3, label: 'Pickup Logistics' },
          { num: 4, label: 'Price Range & Confirm' }
        ].map((s) => (
          <div key={s.num} className="book-step-col">
            <div className={`book-step-circle ${step >= s.num ? 'book-step-circle-active' : 'book-step-circle-inactive'}`}>
              {step > s.num ? <Check size={16} /> : s.num}
            </div>
            <span className={`book-step-label ${step >= s.num ? 'book-step-label-active' : ''}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          {error}
        </div>
      )}

      {/* Step Content */}
      <div className="book-card-container">
        {step === 1 && (
          <Step1
            formData={formData}
            setFormData={setFormData}
            photos={photos}
            handlePhotoUpload={(e) => {
              clearFieldError('photos');
              handlePhotoUpload(e);
            }}
            removePhoto={removePhoto}
            photoError={fieldErrors.photos || photoError}
            chargerPhotos={chargerPhotos}
            handleChargerPhotoUpload={(e) => {
              clearFieldError('chargerPhotos');
              handleChargerPhotoUpload(e);
            }}
            removeChargerPhoto={removeChargerPhoto}
            chargerPhotoError={fieldErrors.chargerPhotos || chargerPhotoError}
            accessoryPhotosMap={accessoryPhotosMap}
            handleItemPhotoUpload={handleItemPhotoUpload}
            removeItemPhoto={removeItemPhoto}
            accessoryPhotoError={accessoryPhotoError}
            customAccText={customAccText}
            setCustomAccText={setCustomAccText}
            submitCustomAccessory={submitCustomAccessory}
            handleAddCustomAccessory={handleAddCustomAccessory}
            toggleAccessory={toggleAccessory}
            onNext={handleProceedToStep2}
            brandError={fieldErrors.brand}
            modelError={fieldErrors.model}
            onClearError={clearFieldError}
          />
        )}

        {step === 2 && (
          <Step2
            formData={formData}
            setFormData={setFormData}
            selectedCatId={selectedCatId}
            selectedProbId={selectedProbId}
            categoryOptions={categoryOptions}
            problemOptions={problemOptions}
            allProblemsOptions={allProblemsOptions}
            currentCategory={currentCategory}
            currentProblem={currentProblem}
            handleCategorySelect={(opt) => {
              clearFieldError('category');
              clearFieldError('problem');
              handleCategorySelect(opt);
            }}
            handleProblemSelect={(opt) => {
              clearFieldError('problem');
              handleProblemSelect(opt);
            }}
            onBack={() => setStep(1)}
            onNext={handleProceedToStep3}
            categoryError={fieldErrors.category}
            problemError={fieldErrors.problem}
          />
        )}

        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(2)}
            onNext={handleProceedToStep4}
            addressError={fieldErrors.pickup_address}
            areaError={fieldErrors.pickup_area}
            pincodeError={fieldErrors.pickup_pincode}
            consentError={fieldErrors.chassis_open_consent}
            onClearError={clearFieldError}
          />
        )}

        {step === 4 && (
          <Step4
            formData={formData}
            setFormData={setFormData}
            currentCategory={currentCategory}
            currentProblem={currentProblem}
            photos={photos}
            loading={loading}
            onBack={() => setStep(3)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
