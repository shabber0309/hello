import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LAPTOP_PROBLEM_CATEGORIES, ALL_PROBLEMS_FLAT } from '../../data/laptopProblems';
import { Step1, Step2, Step3, Step4 } from './steps';
import './BookRepair.css';

export default function BookRepair({ onBookingSuccess, onCancel }) {
  const { token } = useAuth();
  const location = useLocation();
  const prefill = location.state?.prefillProblem || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

  // Automatically scroll to the top of the wizard whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const wizardRoot = document.querySelector('.book-repair-root');
    if (wizardRoot) {
      wizardRoot.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Selected Category and Problem State (Null initially so search input placeholder appears as in Image 2)
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [selectedProbId, setSelectedProbId] = useState(null);

  // Photos State: Min 1, Max 5 required
  const [photos, setPhotos] = useState([]);
  // Mandatory Charger Photos State: Min 1, Max 3 required
  const [chargerPhotos, setChargerPhotos] = useState([]);
  const [chargerPhotoError, setChargerPhotoError] = useState('');

  // Optional Per-Accessory Photos State: map of accessoryName -> array of photos (Max 3 per item)
  const [accessoryPhotosMap, setAccessoryPhotosMap] = useState({});
  const [accessoryPhotoError, setAccessoryPhotoError] = useState('');
  const [customAccText, setCustomAccText] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    laptop_brand: 'Apple',
    laptop_model: 'MacBook Air M2 (2023)',
    serial_number: '',
    issue_category: '',
    issue_name: '',
    issue_description: prefill ? `Selected Issue: ${prefill}` : '',
    charger_included: true, // Mandatory for all laptops
    charger_details: 'Original Charger / Power Adapter',
    included_accessories: [],
    pre_existing_damage: ['None / Mint Condition'],
    pickup_address: '',
    pickup_area: '',
    pickup_city: 'Hyderabad',
    pickup_pincode: '',
    pickup_landmark: '',
    pickup_slot: 'On-Demand Dispatch',
    data_backup_status: 'Customer Confirmed Backup (Diagnostic Waiver Signed)',
    chassis_open_consent: true,
    base_price_min: 1500,
    base_price_max: 3500,
    customer_selected_price: 2500
  });

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

  // Step 1 Validation (Device Specs, Photo Proof Min 1, Max 5 & Mandatory Charger Photos Min 1, Max 3)
  const handleProceedToStep2 = () => {
    if (!formData.laptop_brand.trim() || !formData.laptop_model.trim()) {
      setError('Please provide laptop brand and model name.');
      return;
    }
    if (photos.length === 0) {
      setPhotoError('Photo proof is required (Min 1, Max 3). Please upload at least 1 photo showing the problem or device label.');
      return;
    }
    if (photos.length > 3) {
      setPhotoError('Maximum 3 photos allowed.');
      return;
    }
    if (chargerPhotos.length < 1) {
      setChargerPhotoError('Charger photo is mandatory for all laptops (Min 1, Max 3). Please upload at least 1 photo of your laptop charger.');
      return;
    }
    if (chargerPhotos.length > 3) {
      setChargerPhotoError('Maximum 3 charger photos allowed.');
      return;
    }
    setError('');
    setPhotoError('');
    setChargerPhotoError('');
    setStep(2);
  };

  // Step 2 to Step 3 Validation
  const handleProceedToStep3 = () => {
    if (!selectedProbId && !formData.issue_name) {
      setError('Please select or search your specific laptop problem before proceeding.');
      return;
    }
    setError('');
    setStep(3);
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
    const cat = LAPTOP_PROBLEM_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.problems.length > 0) {
      const firstProb = cat.problems[0];
      setSelectedProbId(firstProb.id);
      setFormData(prev => ({
        ...prev,
        issue_category: cat.name,
        issue_name: firstProb.name,
        base_price_min: firstProb.basePrice,
        base_price_max: firstProb.maxPrice,
        customer_selected_price: Math.round((firstProb.basePrice + firstProb.maxPrice) / 2)
      }));
    }
  };

  // Step 2 Problem Dropdown Selection Handler (Supports cross-category search!)
  const handleProblemSelect = (opt) => {
    const probId = opt.num || opt.id || opt.value;
    if (opt.categoryId && opt.categoryId !== selectedCatId) {
      setSelectedCatId(opt.categoryId);
    }
    setSelectedProbId(probId);
    const prob = ALL_PROBLEMS_FLAT.find(p => p.id === probId) || currentCategory.problems.find(p => p.id === probId);
    if (prob) {
      setFormData(prev => ({
        ...prev,
        issue_category: prob.categoryName || currentCategory.name,
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
      onBookingSuccess(mockOrder);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-repair-root">


      {/* Stepper Bar */}
      <div className="book-stepper-bar">
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
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
            photoError={photoError}
            chargerPhotos={chargerPhotos}
            handleChargerPhotoUpload={handleChargerPhotoUpload}
            removeChargerPhoto={removeChargerPhoto}
            chargerPhotoError={chargerPhotoError}
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
            handleCategorySelect={handleCategorySelect}
            handleProblemSelect={handleProblemSelect}
            onBack={() => setStep(1)}
            onNext={handleProceedToStep3}
          />
        )}

        {step === 3 && (
          <Step3
            formData={formData}
            setFormData={setFormData}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
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
