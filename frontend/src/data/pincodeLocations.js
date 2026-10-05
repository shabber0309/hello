// Official Pincode to Mandal Database
// Returns ONLY the specific Mandal(s) for the entered pincode

export const PINCODE_MANDALS_MAP = {
  // Hyderabad District
  '500001': { mandals: ['Nampally Mandal'], city: 'Hyderabad' },
  '500002': { mandals: ['Charminar Mandal'], city: 'Hyderabad' },
  '500003': { mandals: ['Secunderabad Mandal'], city: 'Hyderabad' },
  '500004': { mandals: ['Khairatabad Mandal'], city: 'Hyderabad' },
  '500005': { mandals: ['Bandlaguda Mandal'], city: 'Hyderabad' },
  '500006': { mandals: ['Asifnagar Mandal'], city: 'Hyderabad' },
  '500007': { mandals: ['Musheerabad Mandal'], city: 'Hyderabad' },
  '500008': { mandals: ['Golconda Mandal'], city: 'Hyderabad' },
  '500009': { mandals: ['Goshamahal Mandal'], city: 'Hyderabad' },
  '500010': { mandals: ['Alwal Mandal'], city: 'Medchal-Malkajgiri' },
  '500011': { mandals: ['Bowenpally Mandal', 'Balanagar Mandal'], city: 'Hyderabad' },
  '500012': { mandals: ['Nampally Mandal'], city: 'Hyderabad' },
  '500013': { mandals: ['Amberpet Mandal'], city: 'Hyderabad' },
  '500014': { mandals: ['Secunderabad Mandal'], city: 'Hyderabad' },
  '500015': { mandals: ['Tirumalagiri (Trimulgherry) Mandal'], city: 'Hyderabad' },
  '500016': { mandals: ['Secunderabad Mandal'], city: 'Hyderabad' },
  '500017': { mandals: ['Malkajgiri Mandal'], city: 'Medchal-Malkajgiri' },
  '500018': { mandals: ['Ameerpet Mandal'], city: 'Hyderabad' },
  '500019': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500020': { mandals: ['Himayatnagar Mandal'], city: 'Hyderabad' },
  '500022': { mandals: ['Sanathnagar Mandal'], city: 'Hyderabad' },
  '500023': { mandals: ['Secunderabad Mandal'], city: 'Hyderabad' },
  '500024': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500025': { mandals: ['Secunderabad Mandal', 'Alwal Mandal'], city: 'Hyderabad' },
  '500026': { mandals: ['Marredpally Mandal'], city: 'Hyderabad' },
  '500027': { mandals: ['Amberpet Mandal'], city: 'Hyderabad' },
  '500028': { mandals: ['Asifnagar Mandal'], city: 'Hyderabad' },
  '500029': { mandals: ['Himayatnagar Mandal'], city: 'Hyderabad' },
  '500030': { mandals: ['Rajendranagar Mandal'], city: 'Rangareddy' },
  '500031': { mandals: ['Asifnagar Mandal'], city: 'Hyderabad' },
  '500032': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500033': { mandals: ['Shaikpet Mandal'], city: 'Hyderabad' },
  '500034': { mandals: ['Khairatabad Mandal'], city: 'Hyderabad' },
  '500035': { mandals: ['Saroornagar Mandal'], city: 'Rangareddy' },
  '500036': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500037': { mandals: ['Balanagar Mandal'], city: 'Medchal-Malkajgiri' },
  '500038': { mandals: ['Ameerpet Mandal'], city: 'Hyderabad' },
  '500039': { mandals: ['Uppal Mandal'], city: 'Medchal-Malkajgiri' },
  '500040': { mandals: ['Amberpet Mandal'], city: 'Hyderabad' },
  '500041': { mandals: ['Nampally Mandal'], city: 'Hyderabad' },
  '500042': { mandals: ['Balanagar Mandal'], city: 'Medchal-Malkajgiri' },
  '500043': { mandals: ['Gandipet Mandal'], city: 'Rangareddy' },
  '500044': { mandals: ['Amberpet Mandal'], city: 'Hyderabad' },
  '500045': { mandals: ['Shaikpet Mandal'], city: 'Hyderabad' },
  '500046': { mandals: ['Alwal Mandal'], city: 'Medchal-Malkajgiri' },
  '500047': { mandals: ['Alwal Mandal', 'Malkajgiri Mandal'], city: 'Medchal-Malkajgiri' },
  '500048': { mandals: ['Rajendranagar Mandal'], city: 'Rangareddy' },
  '500049': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500050': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500051': { mandals: ['Uppal Mandal'], city: 'Medchal-Malkajgiri' },
  '500052': { mandals: ['Rajendranagar Mandal'], city: 'Rangareddy' },
  '500053': { mandals: ['Bahadurpura Mandal', 'Bandlaguda Mandal'], city: 'Hyderabad' },
  '500054': { mandals: ['Quthbullapur Mandal'], city: 'Medchal-Malkajgiri' },
  '500055': { mandals: ['Quthbullapur Mandal'], city: 'Medchal-Malkajgiri' },
  '500056': { mandals: ['Quthbullapur Mandal'], city: 'Medchal-Malkajgiri' },
  '500057': { mandals: ['Sanathnagar Mandal'], city: 'Hyderabad' },
  '500058': { mandals: ['Chandrayangutta Mandal'], city: 'Hyderabad' },
  '500059': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500060': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500061': { mandals: ['Uppal Mandal'], city: 'Medchal-Malkajgiri' },
  '500062': { mandals: ['Kapra Mandal'], city: 'Medchal-Malkajgiri' },
  '500063': { mandals: ['Golconda Mandal'], city: 'Hyderabad' },
  '500064': { mandals: ['Bahadurpura Mandal'], city: 'Hyderabad' },
  '500065': { mandals: ['Bahadurpura Mandal'], city: 'Hyderabad' },
  '500066': { mandals: ['Charminar Mandal'], city: 'Hyderabad' },
  '500067': { mandals: ['Shamshabad Mandal'], city: 'Rangareddy' },
  '500068': { mandals: ['Uppal Mandal'], city: 'Medchal-Malkajgiri' },
  '500069': { mandals: ['Musheerabad Mandal'], city: 'Hyderabad' },
  '500070': { mandals: ['Hayathnagar Mandal'], city: 'Rangareddy' },
  '500072': { mandals: ['Kukatpally Mandal'], city: 'Medchal-Malkajgiri' },
  '500073': { mandals: ['Ameerpet Mandal'], city: 'Hyderabad' },
  '500074': { mandals: ['Saroornagar Mandal'], city: 'Rangareddy' },
  '500075': { mandals: ['Gandipet Mandal'], city: 'Rangareddy' },
  '500076': { mandals: ['Uppal Mandal', 'Malkajgiri Mandal'], city: 'Medchal-Malkajgiri' },
  '500077': { mandals: ['Rajendranagar Mandal'], city: 'Rangareddy' },
  '500078': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500079': { mandals: ['Saroornagar Mandal'], city: 'Rangareddy' },
  '500080': { mandals: ['Musheerabad Mandal'], city: 'Hyderabad' },
  '500081': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500082': { mandals: ['Khairatabad Mandal'], city: 'Hyderabad' },
  '500083': { mandals: ['Saroornagar Mandal'], city: 'Rangareddy' },
  '500084': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500085': { mandals: ['Kukatpally Mandal'], city: 'Medchal-Malkajgiri' },
  '500086': { mandals: ['Rajendranagar Mandal'], city: 'Rangareddy' },
  '500087': { mandals: ['Medipally Mandal'], city: 'Medchal-Malkajgiri' },
  '500088': { mandals: ['Uppal Mandal'], city: 'Medchal-Malkajgiri' },
  '500089': { mandals: ['Gandipet Mandal'], city: 'Rangareddy' },
  '500090': { mandals: ['Bachupally Mandal', 'Quthbullapur Mandal'], city: 'Medchal-Malkajgiri' },
  '500091': { mandals: ['Gandipet Mandal'], city: 'Rangareddy' },
  '500092': { mandals: ['Medipally Mandal'], city: 'Medchal-Malkajgiri' },
  '500093': { mandals: ['Saidabad Mandal'], city: 'Hyderabad' },
  '500094': { mandals: ['Tirumalagiri (Trimulgherry) Mandal'], city: 'Hyderabad' },
  '500095': { mandals: ['Nampally Mandal'], city: 'Hyderabad' },
  '500096': { mandals: ['Kukatpally Mandal'], city: 'Medchal-Malkajgiri' },
  '500097': { mandals: ['Bachupally Mandal'], city: 'Medchal-Malkajgiri' },
  '500098': { mandals: ['Medipally Mandal'], city: 'Medchal-Malkajgiri' },
  '500099': { mandals: ['Shamshabad Mandal'], city: 'Rangareddy' },
  '500100': { mandals: ['Medchal Mandal'], city: 'Medchal-Malkajgiri' },
  '500101': { mandals: ['Dundigal Gandimaisamma Mandal'], city: 'Medchal-Malkajgiri' },
  '500102': { mandals: ['Kapra Mandal'], city: 'Medchal-Malkajgiri' },
  '500103': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500104': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500105': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '500107': { mandals: ['Shamshabad Mandal'], city: 'Rangareddy' },
  '500108': { mandals: ['Shamshabad Mandal'], city: 'Rangareddy' },
  '500110': { mandals: ['Serilingampally Mandal'], city: 'Rangareddy' },
  '501301': { mandals: ['Ghatkesar Mandal', 'Keesara Mandal'], city: 'Medchal-Malkajgiri' },
  '501401': { mandals: ['Medchal Mandal'], city: 'Medchal-Malkajgiri' },
  '501503': { mandals: ['Chevella Mandal'], city: 'Rangareddy' },
  '501506': { mandals: ['Ibrahimpatnam Mandal'], city: 'Rangareddy' },
  '501510': { mandals: ['Maheshwaram Mandal'], city: 'Rangareddy' },
  '502032': { mandals: ['Patancheru Mandal'], city: 'Sangareddy' },
  '502319': { mandals: ['Ameenpur Mandal'], city: 'Sangareddy' },
  '502324': { mandals: ['Ramachandrapuram Mandal'], city: 'Sangareddy' },

  // Bengaluru
  '560001': { mandals: ['Bangalore North Taluk'], city: 'Bengaluru' },
  '560002': { mandals: ['Bangalore South Taluk'], city: 'Bengaluru' },
  '560004': { mandals: ['Basavanagudi Taluk'], city: 'Bengaluru' },
  '560008': { mandals: ['Halasuru Taluk'], city: 'Bengaluru' },
  '560025': { mandals: ['Shantinagar Taluk'], city: 'Bengaluru' },
  '560029': { mandals: ['BTM Layout Taluk'], city: 'Bengaluru' },
  '560034': { mandals: ['Koramangala Taluk'], city: 'Bengaluru' },
  '560037': { mandals: ['Marathahalli Taluk'], city: 'Bengaluru' },
  '560038': { mandals: ['Indiranagar Taluk'], city: 'Bengaluru' },
  '560066': { mandals: ['Whitefield Taluk'], city: 'Bengaluru' },
  '560068': { mandals: ['Bommanahalli Taluk'], city: 'Bengaluru' },
  '560076': { mandals: ['Bannerghatta Taluk'], city: 'Bengaluru' },
  '560078': { mandals: ['JP Nagar Taluk'], city: 'Bengaluru' },
  '560100': { mandals: ['Electronic City Taluk'], city: 'Bengaluru' },
  '560102': { mandals: ['HSR Layout Taluk'], city: 'Bengaluru' },
  '560103': { mandals: ['Bellandur Taluk'], city: 'Bengaluru' },

  // Pune
  '411001': { mandals: ['Pune City Taluka'], city: 'Pune' },
  '411002': { mandals: ['Pune City Taluka'], city: 'Pune' },
  '411004': { mandals: ['Shivajinagar Taluka'], city: 'Pune' },
  '411005': { mandals: ['Shivajinagar Taluka'], city: 'Pune' },
  '411007': { mandals: ['Haveli Taluka'], city: 'Pune' },
  '411014': { mandals: ['Haveli Taluka'], city: 'Pune' },
  '411028': { mandals: ['Haveli Taluka'], city: 'Pune' },
  '411038': { mandals: ['Haveli Taluka'], city: 'Pune' },
  '411045': { mandals: ['Haveli Taluka'], city: 'Pune' },
  '411057': { mandals: ['Mulshi Taluka'], city: 'Pune' }
};

/**
 * Get ONLY the mandals for a specific 6-digit Pincode
 * Returns ONLY the administrative Mandal(s) belonging to that pincode.
 */
export async function getMandalsForPincode(pincode) {
  const cleanPin = (pincode || '').toString().trim();
  if (cleanPin.length !== 6 || !/^[1-9]\d{5}$/.test(cleanPin)) {
    return { mandals: [], city: '' };
  }

  // 1. Instant check from verified local Pincode-to-Mandal map
  if (PINCODE_MANDALS_MAP[cleanPin]) {
    return {
      mandals: PINCODE_MANDALS_MAP[cleanPin].mandals,
      city: PINCODE_MANDALS_MAP[cleanPin].city
    };
  }

  // 2. Query India Post API for other pincodes, strictly extracting only the Block/Taluk (Mandal)
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success') {
        const postOffices = data[0].PostOffice || [];
        const mandalSet = new Set();
        let detectedCity = 'Hyderabad';

        postOffices.forEach(po => {
          if (po.District) detectedCity = po.District;
          const block = po.Block && po.Block !== 'NA' ? po.Block : (po.Taluk && po.Taluk !== 'NA' ? po.Taluk : '');
          if (block) {
            const cleanName = block.endsWith('Mandal') || block.endsWith('Taluk') || block.endsWith('Taluka') 
              ? block 
              : `${block} Mandal`;
            mandalSet.add(cleanName);
          }
        });

        const mandalsList = Array.from(mandalSet);
        if (mandalsList.length > 0) {
          return {
            mandals: mandalsList,
            city: detectedCity
          };
        }
      }
    }
  } catch (err) {
    console.warn('Postal API lookup failed:', err);
  }

  return { mandals: [], city: '' };
}

// Backwards-compatible aliases
export const getMandalByPincode = async (pincode) => {
  const res = await getMandalsForPincode(pincode);
  return {
    mandal: res.mandals[0] || '',
    mandals: res.mandals || [],
    city: res.city || 'Hyderabad'
  };
};
export const getLocationsByPincode = getMandalByPincode;
export const OFFICIAL_MANDALS = [];

/**
 * Retrieve saved customer address from persistent storage.
 * Checks user-scoped storage first, then global fallback.
 */
export function getSavedAddress() {
  try {
    const userRaw = localStorage.getItem('livefix_user');
    let userId = null;
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        userId = u.id || u.email;
      } catch (e) {}
    }

    if (userId) {
      const userSaved = localStorage.getItem(`livefix_saved_address_${userId}`);
      if (userSaved) {
        return JSON.parse(userSaved);
      }
    }

    const saved = localStorage.getItem('livefix_saved_address');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Could not read saved address:', e);
  }
  return null;
}

/**
 * Save customer address to persistent storage for future bookings.
 */
export function saveCustomerAddress(addressData) {
  if (!addressData || !addressData.pickup_address) return;
  try {
    const payload = {
      pickup_address: addressData.pickup_address || '',
      pickup_pincode: addressData.pickup_pincode || '',
      pickup_area: addressData.pickup_area || '',
      pickup_city: addressData.pickup_city || 'Hyderabad',
      pickup_landmark: addressData.pickup_landmark || '',
      saved_at: new Date().toISOString()
    };

    localStorage.setItem('livefix_saved_address', JSON.stringify(payload));

    const userRaw = localStorage.getItem('livefix_user');
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        const userId = u.id || u.email;
        if (userId) {
          localStorage.setItem(`livefix_saved_address_${userId}`, JSON.stringify(payload));
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Could not save customer address:', e);
  }
}
