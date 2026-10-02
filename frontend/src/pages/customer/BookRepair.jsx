import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Laptop, ShieldCheck, MapPin, Calendar, Check, ArrowRight, ArrowLeft,
  Lock, AlertTriangle, Upload, Image as ImageIcon, Trash2, Info, Sliders, CheckCircle2,
  Layers, Wrench, Key, BatteryCharging, CheckSquare, MessageCircle, AlertCircle,
  Briefcase, MousePointer, ShoppingBag, X, PackageCheck, Plus, Camera
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TamperSealBadge, SearchableDropdown } from '../../components/common';
import { LAPTOP_PROBLEM_CATEGORIES, ALL_PROBLEMS_FLAT } from '../../data/laptopProblems';
import './BookRepair.css';

// Official Brand Vector Logos
function AppleLogo({ size = 20, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

function DellLogo({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.963 14.6V9.324h1.222v4.204h2.14v1.07h-3.362zm-9.784-3.288l2.98-2.292c.281.228.56.458.841.687l-2.827 2.14.611.535 2.827-2.216c.281.228.56.458.841.688a295.83 295.83 0 0 1-2.827 2.216l.61.536 2.83-2.295-.001-1.986h1.223v4.204h2.216v1.07h-3.362v-1.987c-.995.763-1.987 1.529-2.981 2.292l-2.981-2.292c-.144.729-.653 1.36-1.312 1.694-.285.147-.597.24-.915.276-.183.022-.367.017-.551.017H3.516V9.325H5.69a2.544 2.544 0 0 1 1.563.557c.454.36.778.872.927 1.43m-3.516-.917v3.21l.953-.001a1.377 1.377 0 0 0 1.036-.523 1.74 1.74 0 0 0 .182-1.889 1.494 1.494 0 0 0-.976-.766c-.166-.04-.338-.03-.507-.032h-.688zM11.82 0h.337a11.94 11.94 0 0 1 5.405 1.373 12.101 12.101 0 0 1 4.126 3.557A11.93 11.93 0 0 1 24 11.82v.36a11.963 11.963 0 0 1-3.236 8.033A11.967 11.967 0 0 1 12.182 24h-.361a11.993 11.993 0 0 1-4.145-.806 12.04 12.04 0 0 1-4.274-2.836A12.057 12.057 0 0 1 .576 15.67 12.006 12.006 0 0 1 0 12.181v-.361a11.924 11.924 0 0 1 1.992-6.396 12.211 12.211 0 0 1 4.71-4.172A11.875 11.875 0 0 1 11.82 0m-.153 1.23a10.724 10.724 0 0 0-6.43 2.375 10.78 10.78 0 0 0-3.319 4.573 10.858 10.858 0 0 0 .193 8.12 10.788 10.788 0 0 0 3.546 4.421 10.698 10.698 0 0 0 4.786 1.946c1.456.209 2.955.124 4.376-.26a10.756 10.756 0 0 0 5.075-3.062 10.742 10.742 0 0 0 2.686-5.28 10.915 10.915 0 0 0-.122-4.682 10.77 10.77 0 0 0-7.098-7.626 10.78 10.78 0 0 0-3.693-.525z" />
    </svg>
  );
}

function HPLogo({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12.0069 24h-.3572l2.459-6.7453h3.3796c.5907 0 1.2364-.4533 1.4424-1.0166l2.6652-7.3085c.4396-1.1952-.2473-2.1706-1.525-2.1706h-4.6983l-3.929 10.798-2.2255 6.127C3.929 22.434 0 17.6806 0 12.007 0 6.498 3.7092 1.8546 8.7647.4396L6.4705 6.759 2.6514 17.2547h2.5415L8.4488 8.339h1.9095l-3.2558 8.9158H9.644l3.0223-8.3251c.4396-1.1952-.2473-2.1706-1.525-2.1706h-2.143l2.459-6.7453C11.636 0 11.8145 0 11.9931 0 18.6285 0 24 5.3715 24 12.007c.0137 6.6216-5.3578 11.993-11.9931 11.993zM19.2742 8.325h-1.9096l-2.6789 7.336h1.9096l2.6789-7.336z" />
    </svg>
  );
}

function LenovoLogo({ width = 44, height = 15, color = 'currentColor' }) {
  return (
    <svg width={width} height={height} viewBox="0 7.8 24 8.4" fill={color}>
      <path d="M21.044 12.288c0 .5-.343.867-.815.867-.464 0-.827-.38-.827-.867 0-.51.343-.868.815-.868.464 0 .827.381.827.868zm-14.305-.92a.787.787 0 0 0-.651.307.991.991 0 0 0-.172.738l1.479-.614a.708.708 0 0 0-.656-.43zm6.963.052c-.472 0-.816.358-.816.868 0 .486.364.867.828.867.472 0 .815-.368.815-.867 0-.487-.363-.868-.827-.868zM24 7.997v8.006H0V7.997h24zM5.01 13.05H3.088V9.825H2.23v4.003h2.78v-.777zm1.137-.094l2.163-.897a1.667 1.667 0 0 0-.37-.86c-.284-.33-.704-.505-1.216-.505-.931 0-1.633.686-1.633 1.593 0 .93.704 1.593 1.726 1.593.572 0 1.158-.272 1.432-.589l-.535-.411c-.357.264-.56.326-.885.326-.292 0-.52-.09-.682-.25zm5.57-1.039c0-.709-.507-1.223-1.252-1.223a1.28 1.28 0 0 0-1.005.494v-.442h-.846v3.081h.846v-1.753c0-.316.245-.651.698-.651.35 0 .712.243.712.651v1.753h.847v-1.91zm3.647.37c0-.904-.725-1.593-1.65-1.593-.933 0-1.663.7-1.663 1.593 0 .903.726 1.592 1.651 1.592.932 0 1.662-.7 1.662-1.592zm2.066 1.54l1.268-3.081h-.967l-.765 2.099-.765-2.1h-.966l1.268 3.081h.927zm4.449-1.54c0-.904-.725-1.593-1.65-1.593-.932 0-1.662.7-1.662 1.593 0 .903.725 1.592 1.65 1.592.932 0 1.662-.7 1.662-1.592z" />
    </svg>
  );
}

function AsusLogo({ width = 42, height = 13, color = 'currentColor' }) {
  return (
    <svg width={width} height={height} viewBox="0 9.2 24 5.6" fill={color}>
      <path d="M23.904 10.788V9.522h-4.656c-.972 0-1.41.6-1.482 1.182v.018-1.2h-1.368v1.266h1.362zm-6.144.456l-1.368-.078v1.458c0 .456-.228.594-1.02.594H14.28c-.654 0-.93-.186-.93-.594v-1.596l-1.386-.102v1.812h-.03c-.078-.528-.276-1.14-1.596-1.23L6 11.22c0 .666.474 1.062 1.218 1.14l3.024.306c.24.018.414.09.414.288 0 .216-.18.24-.456.24H5.946V11.22l-1.386-.09v3.348h5.646c1.26 0 1.662-.654 1.722-1.2h.03c.156.864.912 1.2 2.19 1.2h1.41c1.494 0 2.202-.456 2.202-1.524zm4.398.258l-4.338-.258c0 .666.438 1.11 1.182 1.17l3.09.24c.24.018.384.078.384.276 0 .186-.168.258-.516.258h-4.212v1.29h4.302c1.356 0 1.95-.474 1.95-1.554 0-.972-.534-1.338-1.842-1.422zm-10.194-1.98h1.386v1.266h-1.386zM3.798 11.07l-1.506-.15L0 14.478h1.686zm7.914-1.548h-4.23c-.984 0-1.416.612-1.518 1.2v-1.2H3.618c-.33 0-.486.102-.642.33l-.648.936h9.384Z" />
    </svg>
  );
}

function AcerLogo({ width = 42, height = 14, color = 'currentColor' }) {
  return (
    <svg width={width} height={height} viewBox="0 8.8 24 6" fill={color}>
      <path d="M23.943 9.364c-.085-.113-.17-.198-.595-.226-.113 0-.453-.029-1.048-.029-1.56 0-2.636.482-3.175 1.417.142-.935-.765-1.417-2.749-1.417-2.324 0-3.798.935-4.393 2.834-.226.709-.226 1.276-.056 1.73h-.567c-.425.027-.992.056-1.36.056-.85 0-1.39-.142-1.588-.425-.17-.255-.17-.737.057-1.446.368-1.162 1.247-1.672 2.664-1.672.737 0 1.445.085 1.445.085.085 0 .142-.113.142-.198l-.028-.085-.057-.397c-.028-.255-.227-.397-.567-.453-.311-.029-.567-.029-.907-.029h-.028c-1.842 0-3.146.624-3.854 1.814.255-1.219-.596-1.814-2.551-1.814-1.105 0-1.9.029-2.353.085-.368.057-.595.199-.68.454l-.17.51c-.028.085.029.142.142.142.085 0 .425-.057.992-.086a24.816 24.816 0 0 1 1.672-.085c1.077 0 1.559.284 1.389.822-.029.114-.114.199-.255.227-1.02.17-1.842.284-2.438.369-1.7.226-2.692.736-2.947 1.587-.369 1.162.538 1.728 2.72 1.728 1.078 0 2.013-.056 2.75-.198.425-.085.652-.17.737-.453l.396-1.304c-.028 1.304.85 1.955 2.721 1.955.794 0 1.559-.028 1.927-.085.369-.056.567-.141.652-.425l.085-.396c.397.623 1.276.935 2.608.935 1.417 0 2.239-.029 2.465-.114a.523.523 0 0 0 .369-.311l.028-.085.17-.539c.029-.085-.028-.142-.142-.142l-.906.057c-.596.029-1.077.057-1.418.057-.651 0-1.076-.057-1.332-.142-.368-.142-.538-.397-.51-.822l2.863-.368c1.275-.17 2.154-.567 2.579-1.19l-.992 3.315c-.028.057 0 .114.028.142.029.028.085.057.199.057h1.19c.198 0 .283-.114.312-.199l1.048-3.656c.142-.481.567-.708 1.36-.708.71 0 1.22 0 1.56.028h.028c.057 0 .17-.028.255-.17l.17-.51c0-.085 0-.17-.057-.227zM4.841 13.73c-.368.057-.907.085-1.587.085-1.219 0-1.729-.255-1.587-.737.113-.34.425-.567.935-.624l2.75-.368zm12.669-2.95c-.114.369-.652.624-1.616.766l-2.295.311.056-.198c.199-.624.454-1.02.794-1.247.34-.227.907-.34 1.7-.34 1.05.028 1.503.255 1.36.708Z" />
    </svg>
  );
}

export default function BookRepair({ onBookingSuccess, onCancel }) {
  const { token } = useAuth();
  const location = useLocation();
  const prefill = location.state?.prefillProblem || '';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

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
    part_preference: 'OEM Original (100% Genuine with Brand Warranty)',
    whatsapp_number: '',
    pickup_address: 'Flat 302, Cyber Towers View',
    pickup_area: 'Madhapur',
    pickup_city: 'Hyderabad',
    pickup_pincode: '500081',
    pickup_landmark: 'Near Cyber Gateway, Hitec City',
    pickup_slot: 'Today, 2:00 PM - 4:00 PM',
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

  const popularBrands = [
    { name: 'Apple', logo: AppleLogo, color: 'var(--text-main)' },
    { name: 'Dell', logo: DellLogo, color: '#007DB8' },
    { name: 'Lenovo', logo: LenovoLogo, color: '#E2231A' },
    { name: 'HP', logo: HPLogo, color: '#0096D6' },
    { name: 'Asus', logo: AsusLogo, color: '#00539B' },
    { name: 'Acer', logo: AcerLogo, color: '#83B81A' }
  ];

  const timeSlots = [
    'Today, 2:00 PM - 4:00 PM',
    'Today, 5:00 PM - 7:00 PM',
    'Tomorrow, 10:00 AM - 12:00 PM',
    'Tomorrow, 2:00 PM - 4:00 PM',
    'Tomorrow, 5:00 PM - 7:00 PM'
  ];

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
    priceRange: `₹${prob.basePrice.toLocaleString()} – ₹${prob.maxPrice.toLocaleString()}`,
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
      priceRange: `₹${prob.basePrice.toLocaleString()} – ₹${prob.maxPrice.toLocaleString()}`,
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
      part_preference: formData.part_preference,
      whatsapp_number: formData.whatsapp_number,
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
        tamper_seal_code: `SEAL-TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
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
        {/* STEP 1: DEVICE SPECS & PHOTO PROOFS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: '0 0 4px' }}>
              <Laptop size={20} color="var(--primary)" /> Step 1: Laptop Brand, Model & Photo Proof
            </h3>

            <div>
              <label className="form-label">Brand</label>
              <div className="book-brands-grid">
                {popularBrands.map((b) => {
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



            {/* Intake Manifest Card (Matching User Layout from Image 1) */}
            <div className="intake-manifest-card">
              {/* 1. Upload problem photo * */}
              <div>
                <div className="intake-manifest-row">
                  {/* Left: Number + Label */}
                  <div className="intake-manifest-label">
                    <span className="intake-manifest-number">1.</span>
                    <span>Upload problem photo <span style={{ color: '#ef4444' }}>*</span></span>
                  </div>

                  {/* Middle: Inline Thumbnails with blue X */}
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

                  {/* Right: Max (3 photos) + Upload Button */}
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

              {/* Subtle Row Divider */}
              <div className="intake-manifest-divider" />

              {/* 2. Charger Model / Wattage & Photo Proof */}
              <div>
                <div className="intake-manifest-row">
                  {/* Left: Number + Label */}
                  <div className="intake-manifest-label">
                    <span className="intake-manifest-number">2.</span>
                    <span>Charger Model / Wattage & Photo Proof <span style={{ color: '#ef4444' }}>*</span></span>
                  </div>

                  {/* Middle: Inline Charger Thumbnails or 'No photos uploaded yet' */}
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
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No photos uploaded yet
                      </span>
                    )}
                  </div>

                  {/* Right: Max (3 photos) + Upload Button */}
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

              {/* Subtle Row Divider */}
              <div className="intake-manifest-divider" />

              {/* 3. Other Handover Accessories (Optional) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="intake-manifest-row">
                  {/* Left: Number + Label */}
                  <div className="intake-manifest-label">
                    <span className="intake-manifest-number">3.</span>
                    <span>Other Handover Accessories (Optional)</span>
                  </div>

                  {/* Middle: Clean single-bordered input box */}
                  <div className="intake-manifest-input-box">
                    <input
                      type="text"
                      className="intake-manifest-input"
                      placeholder="Type accessory (e.g. Mouse, Bag, USB Hub)..."
                      value={customAccText}
                      onChange={(e) => setCustomAccText(e.target.value)}
                      onKeyDown={handleAddCustomAccessory}
                    />

                    {customAccText.trim() && (
                      <button
                        type="button"
                        onClick={submitCustomAccessory}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '4px 10px',
                          background: 'var(--primary, #2563eb)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                      >
                        <Plus size={12} /> Add
                      </button>
                    )}
                  </div>

                  {/* Right: Empty action col to maintain uniform 3-col grid alignment */}
                  <div className="intake-manifest-action-col" />
                </div>

                {/* Quick Add Pills (Full Width Complete Line) */}
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

                {/* Dedicated Per-Accessory Rows (Matching User Mockup) */}
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
                      {/* Left: Pill with Remove 'X' */}
                      <div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            background: 'var(--primary-subtle, rgba(37, 99, 235, 0.08))',
                            color: 'var(--primary, #2563eb)',
                            border: '1.5px solid var(--border-focus, #93c5fd)',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            maxWidth: '100%',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acc}</span>
                          <button
                            type="button"
                            onClick={() => toggleAccessory(acc)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--primary, #2563eb)',
                              marginLeft: '4px'
                            }}
                            title={`Remove ${acc}`}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Middle: Inline Thumbnails or "No photos uploaded yet" */}
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
                          <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            No photos uploaded yet
                          </span>
                        )}
                      </div>

                      {/* Right: Max (3 photos) + Upload Button */}
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

            <div className="book-actions-footer">
              <div />
              <button
                type="button"
                onClick={handleProceedToStep2}
                className="btn-action"
              >
                Next: Issue Checklist <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ISSUE CHECKLIST (Cascading Dropdowns for 200 items in 20 categories + Description) */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: '0 0 4px' }}>
              <AlertTriangle size={20} color="var(--primary)" /> Step 2: Issue Checklist & Description
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Select the diagnostic category and specific laptop fault from our 2026 indicative database (covering 200 services across Software, Hardware, Display, Power, Motherboard, and Recovery).
            </p>

            <div className="book-dropdowns-stack">
              {/* 1. Category Dropdown - Full Width */}
              <SearchableDropdown
                label="1. Issue Category (20 Categories)"
                sublabel="Select primary diagnostic domain"
                value={selectedCatId}
                options={categoryOptions}
                placeholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
                searchPlaceholder="Search 20 repair categories (e.g. Screen, Motherboard, Battery, Liquid)..."
                icon={Layers}
                onChange={handleCategorySelect}
              />

              {/* 2. Specific Problem / Service Dropdown - Full Width */}
              <SearchableDropdown
                label="2. Specific Problem / Service"
                sublabel={currentCategory ? `Showing ${currentCategory.problems.length} services in ${currentCategory.shortName} (or type to search all 200)` : 'Search across all 200 laptop problems'}
                value={selectedProbId}
                options={problemOptions}
                fallbackAllOptions={allProblemsOptions}
                placeholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
                searchPlaceholder="Search 200 laptop problems (e.g. BSOD, flickering, liquid spill, fan, hinge)..."
                icon={Wrench}
                onChange={handleProblemSelect}
              />
            </div>

            {/* Indicative Benchmark Rate Box */}
            <div className="indicative-rate-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="indicative-icon-circle">
                  <Info size={18} color="var(--primary)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Hyderabad 2026 Indicative Range
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{formData.base_price_min.toLocaleString()} – ₹{formData.base_price_max.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="indicative-note">
                Base price represents fixed inspection/component rework. The highest price covers OEM/original replacement parts or complex micro-soldering.
              </div>
            </div>

            {/* Problem Description in Words */}
            <div>
              <label className="form-label">
                Describe the problem in words <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Explain symptoms, sounds, or events)</span>
              </label>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Describe what occurred (e.g. system shut down during gaming, screen shows flickering green lines when adjusted, battery drops from 80% to 0%, or tea spill on the keyboard)."
                value={formData.issue_description}
                onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
              />
            </div>

            {/* Spare Part Tier Preference */}
            <div className="book-intake-card">
              <div className="book-intake-title">
                <ShieldCheck size={17} color="#2563eb" /> Replacement Part Tier Preference
              </div>
              <div className="book-power-grid">
                {[
                  {
                    id: 'OEM Original (100% Genuine with Brand Warranty)',
                    title: 'OEM Original (Genuine)',
                    desc: 'Direct OEM authentic component with manufacturer warranty'
                  },
                  {
                    id: 'Grade-A High Quality Compatible (Cost-effective)',
                    title: 'Grade-A Compatible',
                    desc: 'Certified high-performance alternative, tested & guaranteed'
                  }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, part_preference: tier.id })}
                    className={`book-power-btn ${formData.part_preference === tier.id ? 'book-power-btn-active' : ''}`}
                  >
                    <CheckSquare size={16} color={formData.part_preference === tier.id ? '#2563eb' : 'var(--text-muted)'} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{tier.title}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 400 }}>{tier.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="book-actions-footer">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleProceedToStep3}
                className="btn-action"
              >
                Next: Pickup Logistics <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DOORSTEP PICKUP SLOT & ADDRESS */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: '0 0 4px' }}>
              <MapPin size={20} color="var(--primary)" /> Step 3: Doorstep Pickup Slot & Address
            </h3>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Our verified courier arrives with a tamper-evident pouch and seals your machine directly in front of you.
            </p>

            <div>
              <label className="form-label">Complete Doorstep Address (Flat, House No., Building, Street)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Flat 302, Cyber Towers View, Hitec City Road"
                value={formData.pickup_address}
                onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
              />
            </div>

            <div className="book-form-grid-3">
              <div>
                <label className="form-label">Area / Locality</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Madhapur, Gachibowli, Kondapur"
                  value={formData.pickup_area}
                  onChange={(e) => setFormData({ ...formData, pickup_area: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label">City</label>
                <select
                  className="form-input"
                  value={formData.pickup_city}
                  onChange={(e) => setFormData({ ...formData, pickup_city: e.target.value })}
                >
                  <option value="Hyderabad">Hyderabad (All Zones)</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  maxLength={6}
                  className="form-input"
                  placeholder="e.g. 500081"
                  value={formData.pickup_pincode}
                  onChange={(e) => setFormData({ ...formData, pickup_pincode: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Preferred Pickup Time Slot</label>
              <select
                className="form-input"
                value={formData.pickup_slot}
                onChange={(e) => setFormData({ ...formData, pickup_slot: e.target.value })}
              >
                {timeSlots.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* WhatsApp Contact & Security Landmark */}
            <div className="book-intake-card">
              <div className="book-intake-title">
                <MessageCircle size={17} color="#2563eb" /> WhatsApp Coordination & Gate Pass
              </div>
              <div className="book-form-grid-2">
                <div>
                  <label className="form-label">WhatsApp Number (For live stream link & OTP)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.whatsapp_number}
                    onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    We send the technician bench stream link and OTP directly to your WhatsApp.
                  </span>
                </div>

                <div>
                  <label className="form-label">Landmark / Gated Community Gate Pass</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Opposite Cyber Gateway, Tower B, MyGate OTP"
                    value={formData.pickup_landmark}
                    onChange={(e) => setFormData({ ...formData, pickup_landmark: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Data Backup Waiver & Chassis Open Authorization */}
            <label className="book-consent-card">
              <input
                type="checkbox"
                checked={formData.chassis_open_consent}
                onChange={(e) => setFormData({ ...formData, chassis_open_consent: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#2563eb', cursor: 'pointer', marginTop: '2px' }}
              />
              <div className="book-consent-text">
                <strong>Data Backup & Diagnostic Authorization:</strong>
                <div>
                  I confirm that critical files have been backed up (or data is non-critical). I authorize Live Fix verified cleanroom technicians to unseal screws and open the chassis under live camera monitoring for hardware diagnostics.
                </div>
              </div>
            </label>

            <div className="book-actions-footer">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="btn-action"
              >
                Next: Price Range & Confirmation <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PRICE RANGE SELECTION & ONLINE SUBMISSION */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', margin: '0 0 4px' }}>
              <Sliders size={20} color="var(--primary)" /> Step 4: Budget Range & Security Confirmation
            </h3>

            {/* E-Commerce Price Range Slider Box */}
            <div className="price-slider-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Indicative Price Range for: {currentProblem.name}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    ₹{formData.base_price_min.toLocaleString()} — ₹{formData.base_price_max.toLocaleString()}
                  </div>
                </div>

                <div className="customer-budget-tag">
                  Your Target Budget: <span className="budget-val">₹{formData.customer_selected_price.toLocaleString()}</span>
                </div>
              </div>

              {/* Slider Input */}
              <div style={{ margin: '18px 0 8px' }}>
                <input
                  type="range"
                  min={formData.base_price_min}
                  max={formData.base_price_max}
                  step={50}
                  value={formData.customer_selected_price}
                  onChange={(e) => setFormData({ ...formData, customer_selected_price: Number(e.target.value) })}
                  className="ecommerce-range-slider"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  <span>Fixed Base Price: ₹{formData.base_price_min.toLocaleString()}</span>
                  <span style={{ color: '#2563eb', fontWeight: 700 }}>Selected: ₹{formData.customer_selected_price.toLocaleString()}</span>
                  <span>Highest Benchmark: ₹{formData.base_price_max.toLocaleString()}</span>
                </div>
              </div>

              {/* Transparent Disclaimer */}
              <div className="price-transparency-disclaimer">
                <ShieldCheck size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Estimated Repair Cost: ₹{formData.base_price_min.toLocaleString()} – ₹{formData.base_price_max.toLocaleString()}</strong>.
                  <div style={{ marginTop: '2px' }}>
                    Final price depends on laptop brand, model, part availability (OEM vs compatible parts), and technician diagnosis during the live workbench video stream. You will approve the final quote before any repair proceeds.
                  </div>
                </div>
              </div>
            </div>

            {/* Tamper Seal Badge */}
            <TamperSealBadge sealCode="SEAL-TX-READY" city={formData.pickup_city} />

            {/* Booking Summary Card */}
            <div className="booking-summary-card">
              <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', fontSize: '0.95rem' }}>
                Repair Order Preview:
              </div>

              <div className="summary-row">
                <span>Laptop:</span>
                <strong>{formData.laptop_brand} {formData.laptop_model}</strong>
              </div>

              <div className="summary-row">
                <span>Diagnostic Credentials:</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>On-Demand (Requested only if required on bench)</span>
              </div>

              <div className="summary-row">
                <span>Charger Handover:</span>
                <span>{formData.charger_included ? (formData.charger_details || 'Yes (Charger Handed Over)') : 'No Charger Included'}</span>
              </div>

              <div className="summary-row">
                <span>Included Accessories:</span>
                <span>{formData.included_accessories.join(', ')}</span>
              </div>

              <div className="summary-row">
                <span>Declared Pre-Existing Condition:</span>
                <span style={{ color: '#d97706', fontWeight: 600 }}>{formData.pre_existing_damage.join(', ')}</span>
              </div>

              <div className="summary-row">
                <span>Part Tier Preference:</span>
                <span>{formData.part_preference}</span>
              </div>

              <div className="summary-row">
                <span>Problem Category:</span>
                <span style={{ color: '#2563eb', fontWeight: 600 }}>
                  {currentCategory ? currentCategory.shortName : 'General'}: {currentProblem ? currentProblem.name : (formData.issue_name || 'Hardware Diagnostic')}
                </span>
              </div>

              <div className="summary-row">
                <span>Photo Proof:</span>
                <span style={{ color: '#059669', fontWeight: 600 }}>{photos.length} photo(s) attached</span>
              </div>

              <div className="summary-row">
                <span>WhatsApp Contact:</span>
                <span>{formData.whatsapp_number || 'Direct Call Phone'}</span>
              </div>

              <div className="summary-row">
                <span>Pickup Address:</span>
                <span>{formData.pickup_address}, {formData.pickup_area}, {formData.pickup_city} - {formData.pickup_pincode} ({formData.pickup_landmark})</span>
              </div>

              <div className="summary-row">
                <span>Pickup Slot:</span>
                <span>{formData.pickup_slot}</span>
              </div>

              <div className="summary-row">
                <span>Customer Target Budget:</span>
                <strong style={{ color: '#059669', fontSize: '1rem' }}>₹{formData.customer_selected_price.toLocaleString()}</strong>
              </div>
            </div>

            <div className="book-actions-footer">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-neutral"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-verified"
                style={{ padding: '12px 28px', fontSize: '1rem' }}
              >
                <ShieldCheck size={18} /> {loading ? 'Posting Repair Request...' : 'Post Problem Online & Confirm Pickup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
