import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Monitor, 
  BatteryCharging, 
  Keyboard, 
  MousePointer, 
  Zap, 
  Flame, 
  HardDrive, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Lock, 
  Package, 
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';
import './ServicesPage.css';

export default function ServicesPage({ onStartBooking }) {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    {
      id: 'screen',
      category: 'hardware',
      icon: Monitor,
      title: 'Screen & Display Replacement',
      turnaround: 'Same Day (2-4 Hrs)',
      priceRange: '₹2,500 - ₹8,500',
      warranty: '6 Months Warranty',
      desc: 'Fix cracked LCD/OLED panels, black screens, vertical lines, flickering, and backlight failure.',
      symptoms: ['Flickering display', 'Cracked front glass', 'Vertical/horizontal lines', 'Blank dark screen'],
      popular: true
    },
    {
      id: 'battery',
      category: 'hardware',
      icon: BatteryCharging,
      title: 'Original Battery Replacement',
      turnaround: 'Same Day (1-2 Hrs)',
      priceRange: '₹1,800 - ₹4,500',
      warranty: '6 Months Warranty',
      desc: 'Replace degraded, swollen, or non-charging batteries with certified OEM cells.',
      symptoms: ['Battery dies in < 1 hr', 'Laptop shuts down abruptly', 'Swollen touchpad/chassis', 'Not charging plugged in'],
      popular: true
    },
    {
      id: 'motherboard',
      category: 'hardware',
      icon: Wrench,
      title: 'Motherboard BGA & Chip-Level Repair',
      turnaround: '24 - 48 Hours',
      priceRange: '₹2,200 - ₹6,500',
      warranty: '6 Months Warranty',
      desc: 'Micro-soldering, short-circuit diagnostics, power IC replacement, and liquid spill rehabilitation.',
      symptoms: ['No power / dead board', 'Power light blinks then dies', 'Liquid damage corrosion', 'Burnt MOSFET / capacitor'],
      popular: true
    },
    {
      id: 'keyboard',
      category: 'hardware',
      icon: Keyboard,
      title: 'Keyboard & Backlight Repair',
      turnaround: 'Same Day (2-3 Hrs)',
      priceRange: '₹1,200 - ₹3,200',
      warranty: '6 Months Warranty',
      desc: 'Resolve unresponsive keys, sticky mechanisms, liquid ingress, or complete chiclet keyboard replacement.',
      symptoms: ['Specific keys not typing', 'Keys auto-repeating', 'Liquid spilled on keyboard', 'Backlight not turning on'],
      popular: false
    },
    {
      id: 'jack',
      category: 'hardware',
      icon: Zap,
      title: 'Charging Port & USB-C DC Jack',
      turnaround: 'Same Day (2-3 Hrs)',
      priceRange: '₹950 - ₹2,400',
      warranty: '6 Months Warranty',
      desc: 'Solder new USB-C charging ports, proprietary barrel jacks, and power delivery controller ICs.',
      symptoms: ['Must hold cable at an angle', 'Loose charging pin', 'Sparking / burning smell', 'Type-C PD not recognized'],
      popular: false
    },
    {
      id: 'thermal',
      category: 'hardware',
      icon: Flame,
      title: 'Thermal Deep Clean & Fan Rework',
      turnaround: 'Same Day (1-2 Hrs)',
      priceRange: '₹750 - ₹1,500',
      warranty: '6 Months Warranty',
      desc: 'Heatsink dust extraction, fan bearing lubrication, and application of high-conductivity thermal paste.',
      symptoms: ['Laptop burns to touch', 'Fan makes grinding noise', 'CPU throttling & lag', 'Shuts down during gaming'],
      popular: true
    },
    {
      id: 'storage',
      category: 'hardware',
      icon: HardDrive,
      title: 'NVMe SSD Storage Upgrade & Clone',
      turnaround: 'Same Day (2-3 Hrs)',
      priceRange: '₹2,200 - ₹7,000',
      warranty: '3-5 Yrs Manufacturer',
      desc: 'Upgrade sluggish mechanical hard drives to blisteringly fast Gen4 NVMe SSDs with complete OS cloning.',
      symptoms: ['Takes 5 mins to boot', 'Disk usage stuck at 100%', 'SMART hard drive failure error', 'Storage full warning'],
      popular: true
    },
    {
      id: 'ram',
      category: 'hardware',
      icon: Cpu,
      title: 'RAM Memory Expansion (DDR4/DDR5)',
      turnaround: 'Same Day (1 Hr)',
      priceRange: '₹1,400 - ₹4,800',
      warranty: 'Lifetime RAM Warranty',
      desc: 'Upgrade system memory to 16GB, 32GB, or 64GB with dual-channel speed tuning and blue-screen fixes.',
      symptoms: ['Browser freezes with tabs open', 'Memory leak blue screens (BSOD)', 'Video editing lag', 'Out of memory alerts'],
      popular: false
    },
    {
      id: 'os',
      category: 'software',
      icon: Laptop,
      title: 'Clean OS Install & Driver Tuning',
      turnaround: 'Same Day (2-3 Hrs)',
      priceRange: '₹600 - ₹1,200',
      warranty: '30-Day Soft Support',
      desc: 'Official licensed installation of Windows 11, Windows 10, macOS, or Linux with verified vendor drivers.',
      symptoms: ['Operating system won\'t boot', 'Endless reboot loop', 'Corrupted system files', 'Missing audio/Wi-Fi drivers'],
      popular: false
    },
    {
      id: 'virus',
      category: 'software',
      icon: ShieldAlert,
      title: 'Malware & Ransomware Neutralization',
      turnaround: 'Same Day (2-4 Hrs)',
      priceRange: '₹800 - ₹1,800',
      warranty: '30-Day Soft Support',
      desc: 'Deep heuristic eradication of rootkits, trojans, adware popups, and browser hijacker infections.',
      symptoms: ['Suspicious popups appearing', 'Browser redirects to search ads', 'Files encrypted / renamed', 'High CPU when idle'],
      popular: false
    },
    {
      id: 'data',
      category: 'software',
      icon: Package,
      title: 'Hard Drive & SSD Data Recovery',
      turnaround: '24 - 72 Hours',
      priceRange: '₹2,500 - ₹9,500',
      warranty: 'Confidentiality Guarantee',
      desc: 'Deep sector-by-sector extraction of lost documents, photos, and project files from failing drives.',
      symptoms: ['Drive not recognized by PC', 'Accidental format / deletion', 'Clicking hard drive sound', 'RAW partition error'],
      popular: true
    },
    {
      id: 'bios',
      category: 'software',
      icon: Lock,
      title: 'BIOS Firmware Flashing & Unlock',
      turnaround: '24 Hours',
      priceRange: '₹1,200 - ₹2,800',
      warranty: '6 Months Warranty',
      desc: 'EEPROM programmer flashing to recover bricked BIOS updates and remove lost hardware passwords.',
      symptoms: ['Black screen after BIOS update', 'Supervisor password locked', 'Power on but no POST beep', 'Corrupted ME region'],
      popular: false
    }
  ];

  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      const matchesCategory = activeCategory === 'all' || srv.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        srv.title.toLowerCase().includes(q) ||
        srv.desc.toLowerCase().includes(q) ||
        srv.symptoms.some(s => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [services, activeCategory, searchQuery]);

  const handleBookService = (serviceTitle) => {
    if (onStartBooking) {
      onStartBooking(serviceTitle);
    } else {
      navigate('/book', { state: { prefillProblem: serviceTitle } });
    }
  };

  return (
    <div className="services-page-root">
      <div className="services-container">
        
        {/* HEADER */}
        <div className="services-header">
          <div className="badge badge-primary services-badge">
            <ShieldCheck size={15} color="#2563eb" />
            Verified Cleanroom Repair Services
          </div>

          <h1 className="services-h1">
            Laptop Services & Solutions
          </h1>

          <p className="services-subtitle">
            Every hardware repair is performed under ESD-safe cleanroom conditions and streamed live to your private dashboard. Backed by our 6-month platform warranty.
          </p>

          {/* SEARCH BAR */}
          <div className="services-search-wrap">
            <Search size={18} className="services-search-icon" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by part, problem, or symptom (e.g. screen, battery, dead)..."
              className="services-search-input"
            />
          </div>

          {/* CATEGORY FILTER PILLS */}
          <div className="services-category-row">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'hardware', label: 'Hardware & Micro-Soldering' },
              { id: 'software', label: 'Software, OS & Security' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`services-category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* SERVICES GRID */}
        <div className="services-grid">
          {filteredServices.map(srv => {
            const Icon = srv.icon;
            return (
              <div 
                key={srv.id}
                className="tech-card services-card"
              >
                <div>
                  <div className="services-card-top">
                    <div className="services-icon-box">
                      <Icon size={22} strokeWidth={2.4} />
                    </div>

                    <div className="services-badges-group">
                      {srv.popular && (
                        <span className="services-popular-badge">
                          POPULAR
                        </span>
                      )}
                      <span className="badge badge-verified">
                        <ShieldCheck size={12} />
                        {srv.warranty}
                      </span>
                    </div>
                  </div>

                  <h3 className="services-card-title">
                    {srv.title}
                  </h3>

                  <p className="services-card-desc">
                    {srv.desc}
                  </p>

                  {/* Symptoms Resolved */}
                  <div className="services-symptoms-section">
                    <div className="services-symptoms-label">
                      SYMPTOMS RESOLVED:
                    </div>
                    <div className="services-symptoms-list">
                      {srv.symptoms.map((symp, sIdx) => (
                        <span 
                          key={sIdx}
                          className="services-symptom-pill"
                        >
                          • {symp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Price, Turnaround, CTA */}
                <div className="services-card-bottom">
                  <div>
                    <div className="services-price-label">
                      ESTIMATED RANGE
                    </div>
                    <div className="services-price-val">
                      {srv.priceRange}
                    </div>
                    <div className="services-warranty-info">
                      <Clock size={11} /> {srv.turnaround}
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookService(srv.title)}
                    className="btn-primary services-book-btn"
                  >
                    Book Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM GUARANTEE CALLOUT */}
        <div className="services-custom-callout">
          <div>
            <h3 className="services-callout-h3">
              Don't see your exact issue listed?
            </h3>
            <p className="services-callout-p">
              Our cleanroom technicians diagnose complex multi-layer PCB motherboard failures, custom bios corruptions, and liquid ingress every day.
            </p>
          </div>

          <button
            onClick={() => onStartBooking ? onStartBooking() : navigate('/book')}
            className="btn-primary services-callout-btn"
          >
            Custom Diagnostic Request
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
