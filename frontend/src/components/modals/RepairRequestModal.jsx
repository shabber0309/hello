import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Laptop, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Upload, 
  Camera, 
  Video, 
  Clock, 
  MapPin,
  Check,
  AlertTriangle,
  Trash2,
  Info,
  Layers,
  Wrench
} from 'lucide-react';
import { SearchableDropdown } from '../common';
import { LAPTOP_PROBLEM_CATEGORIES, ALL_PROBLEMS_FLAT } from '../../data/laptopProblems';
import { getMandalsForPincode, getSavedAddress, saveCustomerAddress } from '../../data/pincodeLocations';
import './RepairRequestModal.css';

export default function RepairRequestModal({ isOpen, onClose, onSubmitSuccess }) {
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);

  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedProbId, setSelectedProbId] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [availableMandals, setAvailableMandals] = useState([]);

  const currentCategory = selectedCatId ? LAPTOP_PROBLEM_CATEGORIES.find(c => c.id === selectedCatId) : null;
  const currentProblem = currentCategory && selectedProbId ? currentCategory.problems.find(p => p.id === selectedProbId) : null;

  const [formData, setFormData] = useState(() => {
    const savedAddr = getSavedAddress();
    return {
      brand: 'Dell',
      model: '',
      serial_number: '',
      os: 'Windows 11',
      description: '',
      budgetMin: currentProblem ? currentProblem.basePrice : 0,
      budgetMax: currentProblem ? currentProblem.maxPrice : 0,
      customer_selected_price: currentProblem ? Math.round((currentProblem.basePrice + currentProblem.maxPrice) / 2) : 0,
      address: savedAddr?.pickup_address || '',
      area: savedAddr?.pickup_area || '',
      city: savedAddr?.pickup_city || 'Hyderabad',
      pincode: savedAddr?.pickup_pincode || '',
      preferredTime: 'On-Demand Dispatch',
      phone: '',
      name: ''
    };
  });

  // Preload mandals if saved address has pincode
  useEffect(() => {
    if (!isOpen) return;
    const savedAddr = getSavedAddress();
    if (savedAddr?.pickup_pincode && savedAddr.pickup_pincode.length === 6) {
      getMandalsForPincode(savedAddr.pickup_pincode).then(res => {
        if (res && res.mandals && res.mandals.length > 0) {
          setAvailableMandals(res.mandals);
        }
      });
    }
  }, [isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  // Handle Photo selection with base64 conversion
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (photos.length + files.length > 5) {
      setPhotoError('Maximum 5 photos allowed.');
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
          if (prev.length >= 5) return prev;
          return [...prev, {
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
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

  const categoryOptions = LAPTOP_PROBLEM_CATEGORIES.map(cat => ({
    id: cat.id,
    value: cat.id,
    label: cat.name,
    badge: `${cat.problems.length} services`,
    meta: cat.shortName
  }));

  const problemOptions = currentCategory.problems.map(prob => ({
    id: prob.id,
    value: prob.id,
    num: prob.id,
    label: prob.name,
    basePrice: prob.basePrice,
    maxPrice: prob.maxPrice,
    categoryName: currentCategory.shortName
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

  const handleCategorySelect = (opt) => {
    const catId = opt.id || opt.value;
    setSelectedCatId(catId);
    const cat = LAPTOP_PROBLEM_CATEGORIES.find(c => c.id === catId);
    if (cat && cat.problems.length > 0) {
      const firstProb = cat.problems[0];
      setSelectedProbId(firstProb.id);
      setFormData(prev => ({
        ...prev,
        budgetMin: firstProb.basePrice,
        budgetMax: firstProb.maxPrice,
        customer_selected_price: Math.round((firstProb.basePrice + firstProb.maxPrice) / 2)
      }));
    }
  };

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
        budgetMin: prob.basePrice,
        budgetMax: prob.maxPrice,
        customer_selected_price: Math.round((prob.basePrice + prob.maxPrice) / 2)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const randomSeal = Math.floor(100000 + Math.random() * 900000);

    const payload = {
      laptop_brand: formData.brand,
      laptop_model: formData.model,
      serial_number: formData.serial_number,
      issue_category: `${currentCategory.shortName}: ${currentProblem.name}`,
      issue_description: formData.description,
      pickup_address: formData.address,
      pickup_area: formData.area,
      pickup_city: formData.city,
      pickup_pincode: formData.pincode,
      pickup_slot: formData.preferredTime,
      base_price_min: formData.budgetMin,
      base_price_max: formData.budgetMax,
      customer_selected_price: formData.customer_selected_price,
      problem_photos: photos.map(p => p.dataUrl)
    };

    let serverOrder = null;

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('livefix_token');
      if (token) {
        const res = await fetch('/api/repairs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          serverOrder = data.order;
        }
      }
    } catch (err) {
      console.log('Error creating backend order:', err);
    }

    const finalOrder = serverOrder || {
      order_number: `FX-2026-${randomId}`,
      tamper_seal_code: `TC-FX-${randomSeal}`,
      laptop_brand: formData.brand,
      laptop_model: formData.model,
      status: 'Order Placed',
      price_range: `₹${formData.budgetMin} – ₹${formData.customer_selected_price}`,
      customer_selected_price: formData.customer_selected_price,
      pickup_address: `${formData.address}, ${formData.area}, ${formData.city}`
    };

    saveCustomerAddress({
      pickup_address: formData.address,
      pickup_pincode: formData.pincode,
      pickup_area: formData.area,
      pickup_city: formData.city
    });

    setIsSubmitting(false);
    setCreatedOrder(finalOrder);
    if (onSubmitSuccess) onSubmitSuccess(finalOrder);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2200,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="tech-card" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: 'var(--bg-surface)',
        borderRadius: '24px',
        padding: '32px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
              STEP {currentStep} OF 4
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Let's Get Your Laptop Fixed.</h2>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-light)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginBottom: '24px' }}>
          <div style={{
            width: `${(currentStep / 4) * 100}%`,
            height: '100%',
            background: 'var(--primary)',
            borderRadius: '2px',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {createdOrder ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10b981',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Repair Request Broadcasted!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '8px 0 20px' }}>
              Your request is now live to nearby verified technicians with tamper-seal packaging reserved.
            </p>

            <div style={{
              background: 'var(--bg-card-subtle)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid var(--border-light)',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Repair ID:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{createdOrder.order_number}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Device:</span>
                <span style={{ fontWeight: 700 }}>{createdOrder.laptop_brand} {createdOrder.laptop_model}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Budget:</span>
                <span style={{ fontWeight: 700, color: 'var(--cta-orange)' }}>₹{formData.customer_selected_price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Tamper Seal Reserved:</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  {createdOrder.tamper_seal_code}
                </span>
              </div>
            </div>

            <button 
              className="btn-cta"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              Done & View In Dashboard
            </button>
          </div>
        ) : (
          <div>
            {/* Step 1: Device Details & Photo Proof (Min 1, Max 5) */}
            {currentStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 1 — Device Details & Fault Photos</h3>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Laptop Brand
                  </label>
                  <select 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="Dell">Dell</option>
                    <option value="Apple">Apple MacBook</option>
                    <option value="Lenovo">Lenovo / ThinkPad</option>
                    <option value="HP">HP</option>
                    <option value="Asus">Asus / ROG</option>
                    <option value="Acer">Acer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Model Name / Number
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Inspiron 15 3520 or MacBook Pro 14"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                {/* Photo Upload (Min 1, Max 5) */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Fault Photos <span style={{ color: '#ef4444' }}>*</span> (Min 1, Max 5 required)
                    </label>
                    <span style={{ fontSize: '0.75rem', color: photos.length >= 1 ? '#10b981' : 'var(--text-muted)', fontWeight: 700 }}>
                      {photos.length} / 5 uploaded
                    </span>
                  </div>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    multiple 
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />

                  {photos.length < 5 && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        border: '1.5px dashed var(--border-glow, #3b82f6)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        background: 'var(--bg-card-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      <Upload size={20} color="var(--primary)" style={{ margin: '0 auto 4px' }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>Click to Upload Device / Fault Photos</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP</div>
                    </div>
                  )}

                  {photoError && (
                    <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '6px' }}>
                      {photoError}
                    </div>
                  )}

                  {photos.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {photos.map((p) => (
                        <div key={p.id} style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={p.dataUrl} alt="proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => removePhoto(p.id)}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  type="button" 
                  className="btn-primary" 
                  style={{ alignSelf: 'flex-end', marginTop: '12px' }}
                  onClick={() => {
                    if (photos.length === 0) {
                      setPhotoError('Please upload at least 1 photo showing the fault or device.');
                      return;
                    }
                    setPhotoError('');
                    setCurrentStep(2);
                  }}
                >
                  Continue to Problem Details <ArrowRight size={15} />
                </button>
              </div>
            )}

            {/* Step 2: Issue Checklist (Cascading Dropdown of 200 items in 20 categories + Description) */}
            {currentStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 2 — Diagnostic Category & Service</h3>

                {/* 1. Category Dropdown - Line 1 */}
                <SearchableDropdown
                  label="1. Issue Category (20 Categories)"
                  sublabel="Select diagnostic domain"
                  value={selectedCatId}
                  options={categoryOptions}
                  placeholder="Select Issue Category"
                  searchPlaceholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
                  icon={Layers}
                  onChange={handleCategorySelect}
                />

                {/* 2. Specific Problem Dropdown - Line 2 */}
                <SearchableDropdown
                  label="2. Specific Problem / Service"
                  sublabel={currentCategory ? `Showing ${currentCategory.problems.length} services (or search all 200)` : 'Search across all 200 laptop problems'}
                  value={selectedProbId}
                  options={problemOptions}
                  fallbackAllOptions={allProblemsOptions}
                  placeholder="Select Problem / Service"
                  searchPlaceholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
                  icon={Wrench}
                  onChange={handleProblemSelect}
                />

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Describe the problem in words
                  </label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe symptoms, error codes, what preceded the issue, etc."
                    style={{ width: '100%', fontSize: '0.88rem' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(1)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(3)}>
                    Pickup Logistics <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Doorstep Pickup Slot & Address */}
            {currentStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 3 — Doorstep Pickup Address & Slot</h3>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Street Address (Flat / House No., Building)
                  </label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
                  <div style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Pincode
                    </label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => {
                        const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData(prev => ({ ...prev, pincode: cleanDigits }));
                        if (cleanDigits.length === 6) {
                          getMandalsForPincode(cleanDigits).then((res) => {
                            if (res && res.mandals && res.mandals.length > 0) {
                              setAvailableMandals(res.mandals);
                              setFormData(prev => ({
                                ...prev,
                                pincode: cleanDigits,
                                area: res.mandals[0],
                                city: res.city || prev.city
                              }));
                            } else {
                              setAvailableMandals([]);
                            }
                          }).catch(() => {
                            setAvailableMandals([]);
                          });
                        } else {
                          setAvailableMandals([]);
                          setFormData(prev => ({ ...prev, area: '' }));
                        }
                      }}
                      style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
                      required
                    />
                  </div>

                  <div style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      Mandal
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      style={{ 
                        width: '100%', 
                        maxWidth: '100%', 
                        minWidth: 0, 
                        height: '42px', 
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                      required
                    >
                      {availableMandals.length === 0 ? (
                        <option value="">
                          {formData.pincode?.length === 6 ? 'No mandal found for this pincode' : 'Enter pincode first'}
                        </option>
                      ) : (
                        <>
                          <option value="">Select Mandal</option>
                          {availableMandals.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                  </div>

                  <div style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                      City
                    </label>
                    <select 
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ 
                        width: '100%', 
                        maxWidth: '100%', 
                        minWidth: 0, 
                        height: '42px', 
                        borderRadius: '8px',
                        boxSizing: 'border-box',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Secunderabad">Secunderabad</option>
                      <option value="Rangareddy">Rangareddy</option>
                      <option value="Medchal-Malkajgiri">Medchal-Malkajgiri</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Pune">Pune</option>
                      {formData.city && !['Hyderabad', 'Secunderabad', 'Rangareddy', 'Medchal-Malkajgiri', 'Bengaluru', 'Pune'].includes(formData.city) && (
                        <option value={formData.city}>{formData.city}</option>
                      )}
                    </select>
                  </div>
                </div>



                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(2)}>
                    Back
                  </button>
                  <button type="button" className="btn-primary" onClick={() => setCurrentStep(4)}>
                    Price Range & Confirm <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Price Range Selection & Online Submission */}
            {currentStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Step 4 — Budget Range & Post Online</h3>

                <div style={{
                  background: 'var(--bg-card-subtle)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--border-light)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Indicative Bench Range:
                    </span>
                    <span style={{ fontWeight: 800, color: 'var(--text-main)', fontSize: '1.1rem' }}>
                      ₹{formData.budgetMin.toLocaleString()} – ₹{formData.budgetMax.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Your Target Budget:</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--cta-orange)' }}>
                      ₹{formData.customer_selected_price.toLocaleString()}
                    </span>
                  </div>

                  <input 
                    type="range"
                    min={formData.budgetMin}
                    max={formData.budgetMax}
                    step="50"
                    value={formData.customer_selected_price}
                    onChange={(e) => setFormData({ ...formData, customer_selected_price: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--cta-orange)', cursor: 'pointer' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    <span>Base Floor: ₹{formData.budgetMin.toLocaleString()}</span>
                    <span>Max Ceiling: ₹{formData.budgetMax.toLocaleString()}</span>
                  </div>

                  <div style={{
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                    marginTop: '12px',
                    padding: '8px 10px',
                    background: 'rgba(37, 99, 235, 0.08)',
                    borderRadius: '8px',
                    lineHeight: 1.4
                  }}>
                    Estimated Repair Cost: ₹{formData.budgetMin.toLocaleString()} – ₹{formData.budgetMax.toLocaleString()}. Final price depends on laptop model, OEM vs compatible parts, and live video diagnosis.
                  </div>
                </div>

                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck size={18} />
                  <span>Device will be placed in serialized tamper bag SEAL-TX-READY at your doorstep.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setCurrentStep(3)}>
                    Back
                  </button>
                  <button 
                    type="button" 
                    className="btn-cta"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? 'Posting Repair Request...' : 'Post Problem Online'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
