// Comprehensive FixConnect 2026 Repair Database
// Synthesized from current Hyderabad & Indian market benchmarks

export const CUSTOMER_SYMPTOMS = [
  {
    id: 'not_turning_on',
    title: "Laptop won't turn on",
    icon: '💻',
    category: 'Power & Motherboard',
    estimateRange: '₹500 – ₹10,000+',
    minPrice: 500,
    maxPrice: 10000,
    explanation: 'Depends on whether the issue is charger, battery, charging port, power IC, or motherboard short-circuit.',
    commonCauses: ['Faulty AC adapter/charger', 'Exhausted or shorted battery cell', 'Damaged DC power jack', 'Blown Power IC / Mosfet chip', 'Motherboard primary rail failure'],
    recommendedAction: 'Full multi-point multimeter power trace diagnostic under camera.'
  },
  {
    id: 'battery_draining',
    title: 'Laptop battery drains quickly',
    icon: '🔋',
    category: 'Battery',
    estimateRange: '₹1,500 – ₹5,000',
    minPrice: 1500,
    maxPrice: 5000,
    explanation: 'Degrading lithium-ion cells, charging controller malfunction, or high parasitic standby drain.',
    commonCauses: ['Degraded cell capacity (>300 cycles)', 'Swollen lithium pouch', 'Background OS power leak', 'Damaged charge management circuit'],
    recommendedAction: 'Battery health & discharge curve analysis followed by genuine OEM-grade replacement.'
  },
  {
    id: 'screen_cracked',
    title: 'Screen is cracked',
    icon: '🖥️',
    category: 'Display',
    estimateRange: '₹2,500 – ₹18,000+',
    minPrice: 2500,
    maxPrice: 18000,
    explanation: 'Physical glass/matrix shatter or internal bleeding. Cost varies by HD, FHD, IPS, 2K/4K high-refresh, or OLED touch panels.',
    commonCauses: ['Direct impact or drop', 'Object closed inside keyboard lid', 'Torsion stress from stiff hinge'],
    recommendedAction: 'Exact panel pin-count (30-pin / 40-pin eDP) match and camera-verified dust-free installation.'
  },
  {
    id: 'screen_black_running',
    title: 'Screen is black but laptop is running',
    icon: '🖥️',
    category: 'Display & GPU',
    estimateRange: '₹500 – ₹7,000+',
    minPrice: 500,
    maxPrice: 7000,
    explanation: 'Fans spin and power LEDs glow, but no image or faint backlight only.',
    commonCauses: ['Loose or pinched eDP display flex cable', 'Blown screen backlight fuse on motherboard', 'Faulty RAM stick/contact oxidation', 'Dedicated GPU or integrated chip failure'],
    recommendedAction: 'External display loop test followed by RAM reseating and motherboard backlight rail diagnosis.'
  },
  {
    id: 'keyboard_not_working',
    title: "Keyboard isn't working",
    icon: '⌨️',
    category: 'Input Devices',
    estimateRange: '₹500 – ₹5,000',
    minPrice: 500,
    maxPrice: 5000,
    explanation: 'Unresponsive keys, ghost typing, or complete keyboard failure. Backlit and gaming keyboards cost more.',
    commonCauses: ['Liquid spill corrosion on membrane layer', 'Detached ribbon cable', 'Worn mechanical switches or scissor clips', 'Embedded controller (EC) chip fault'],
    recommendedAction: 'Individual keycap test or rivet-sealed full palmrest keyboard replacement.'
  },
  {
    id: 'overheating',
    title: 'Laptop is overheating',
    icon: '🔥',
    category: 'Cooling & Performance',
    estimateRange: '₹500 – ₹3,500',
    minPrice: 500,
    maxPrice: 3500,
    explanation: 'High thermal throttling, loud fan noise, or sudden thermal shutdowns.',
    commonCauses: ['Dry, cracked factory thermal paste', 'Dust & lint choking heatsink fins', 'Seized cooling fan bearings', 'De-pressurized copper heat pipe'],
    recommendedAction: 'Deep ultrasonic clean, high-performance thermal paste (Artic/Honeywell PTM) application & fan bearing lubrication.'
  },
  {
    id: 'laptop_very_slow',
    title: 'Laptop is very slow',
    icon: '🐌',
    category: 'Performance & Storage',
    estimateRange: '₹500 – ₹8,000+',
    minPrice: 500,
    maxPrice: 8000,
    explanation: 'Depending on whether it requires software optimization, RAM upgrade, SSD migration, or thermal de-throttling.',
    commonCauses: ['Old mechanical HDD 100% disk usage', 'Insufficient RAM (4GB or less in 2026)', 'Background malware/bloatware', 'Thermal throttling due to high heat'],
    recommendedAction: 'Storage health test + recommended NVMe SSD upgrade and OS clone for 5x speed boost.'
  },
  {
    id: 'not_charging',
    title: "Laptop isn't charging",
    icon: '🔌',
    category: 'Power',
    estimateRange: '₹600 – ₹5,000+',
    minPrice: 600,
    maxPrice: 5000,
    explanation: 'Charger connected but plugged in not charging, loose barrel jack, or blown USB-C Power Delivery chip.',
    commonCauses: ['Wobbly DC jack pin or broken solder pads', 'Burned USB-C PD controller (Cypress / TI)', 'Defective power brick / adapter', 'Battery charging MOSFET short'],
    recommendedAction: 'Board-level USB-C PD or DC jack reflow/replacement with voltage stabilization test.'
  },
  {
    id: 'got_wet',
    title: 'Laptop got wet (Liquid damage)',
    icon: '💧',
    category: 'Emergency Motherboard',
    estimateRange: '₹2,500 – ₹15,000+',
    minPrice: 2500,
    maxPrice: 15000,
    explanation: 'Water, tea, or coffee spillage requiring immediate motherboard de-oxidation and trace repair.',
    commonCauses: ['Corroded traces and vias', 'Electrolysis bridging between SMD components', 'Short-circuited capacitors and power rails'],
    recommendedAction: 'Immediate battery disconnection, ultrasonic board bath with pure isopropyl alcohol, and trace micro-soldering.'
  },
  {
    id: 'no_sound',
    title: 'No sound / crackling audio',
    icon: '🔊',
    category: 'Audio',
    estimateRange: '₹500 – ₹3,000',
    minPrice: 500,
    maxPrice: 3000,
    explanation: 'Audio crackles, no output from internal speakers, or headphone jack not detecting.',
    commonCauses: ['Torn speaker cones / blown coils', 'Realtek audio codec IC failure', 'Physical damage to 3.5mm combo jack', 'Corrupted Realtek/Dolby sound drivers'],
    recommendedAction: 'OEM speaker replacement or audio IC reflow.'
  },
  {
    id: 'wifi_not_working',
    title: "Wi-Fi isn't working / drops frequently",
    icon: '📶',
    category: 'Connectivity',
    estimateRange: '₹500 – ₹3,000',
    minPrice: 500,
    maxPrice: 3000,
    explanation: 'Wi-Fi adapter missing in Device Manager, low signal strength, or disconnected connections.',
    commonCauses: ['Damaged antenna cable routed through display hinge', 'Burned PCIe M.2 Wi-Fi / Bluetooth card', 'Driver mismatch or Windows power management bug'],
    recommendedAction: 'Wi-Fi 6/6E upgrade card installation and antenna continuity test.'
  },
  {
    id: 'camera_not_working',
    title: "Camera isn't working",
    icon: '📷',
    category: 'Webcam',
    estimateRange: '₹500 – ₹3,000',
    minPrice: 500,
    maxPrice: 3000,
    explanation: 'Webcam error code 0xA00F4244, black screen, or broken camera shutter mechanism.',
    commonCauses: ['Pinched webcam cable in display hinge', 'Defective CMOS sensor module', 'Privacy shutter physical blockage', 'Driver/privacy permission lock'],
    recommendedAction: 'Webcam module testing and replacement with high-definition camera sensor.'
  },
  {
    id: 'lost_data',
    title: 'I lost my data / Disk not detected',
    icon: '💾',
    category: 'Data Recovery',
    estimateRange: '₹1,500 – ₹25,000+',
    minPrice: 1500,
    maxPrice: 25000,
    explanation: 'Severity and storage-device physical condition determine final cost. Simple deletion vs mechanical head/motor failure.',
    commonCauses: ['Accidental formatting or OS reinstall', 'Raw partition / bitlocker lock', 'Clicking HDD actuator heads (mechanical failure)', 'Dead SSD NAND flash controller'],
    recommendedAction: 'Clean-room disk cloning and deep non-destructive data recovery.'
  }
];

export const HARDWARE_REPAIRS = [
  {
    category: '🖥️ Display',
    categoryKey: 'display',
    repairs: [
      { problem: 'Screen replacement – HD/FHD', range: '₹2,500 – ₹7,000', note: 'Standard TN / IPS panels for 14"-15.6" laptops' },
      { problem: 'Screen replacement – IPS/2K/4K/OLED', range: '₹5,000 – ₹18,000+', note: 'Color-accurate, high refresh rate & creative grade' },
      { problem: 'Touchscreen replacement', range: '₹6,000 – ₹20,000+', note: 'Digitizer glass + display assembly bonded' },
      { problem: 'Display flickering', range: '₹800 – ₹3,000', note: 'Cable reseat, inverter fix, or refresh rate capacitor' },
      { problem: 'Black screen diagnosis', range: '₹500 – ₹2,500', note: 'Backlight rail check, RAM isolation, and GPU test' },
      { problem: 'Display cable replacement', range: '₹800 – ₹2,500', note: 'Hinge eDP 30/40-pin ribbon replacement' }
    ]
  },
  {
    category: '🔋 Battery',
    categoryKey: 'battery',
    repairs: [
      { problem: 'Battery replacement', range: '₹1,500 – ₹5,000', note: 'Standard 3-cell / 4-cell OEM grade replacement' },
      { problem: 'Gaming laptop battery', range: '₹4,000 – ₹8,000+', note: 'High capacity 6-cell / 90Wh+ performance batteries' },
      { problem: 'Battery not charging', range: '₹800 – ₹2,500', note: 'Charging circuit & battery board communication repair' },
      { problem: 'Battery health/diagnosis', range: '₹300 – ₹800', note: 'Cycle count analysis, cell balance & load test' }
    ]
  },
  {
    category: '⌨️ Keyboard',
    categoryKey: 'keyboard',
    repairs: [
      { problem: 'Keyboard replacement', range: '₹900 – ₹3,500', note: 'Standard layout OEM keyboard unit' },
      { problem: 'Backlit keyboard replacement', range: '₹1,500 – ₹5,000+', note: 'RGB / White LED backlit keyboards' },
      { problem: 'Single key / key-cap repair', range: '₹300 – ₹700', note: 'Scissor mechanism & keycap replacement' }
    ]
  },
  {
    category: '🖱️ Touchpad',
    categoryKey: 'touchpad',
    repairs: [
      { problem: 'Touchpad repair', range: '₹500 – ₹2,000', note: 'Clicker spring restoration and ribbon replacement' },
      { problem: 'Touchpad replacement', range: '₹1,000 – ₹3,000', note: 'Precision glass or multi-touch trackpad unit' }
    ]
  },
  {
    category: '🔌 Power',
    categoryKey: 'power',
    repairs: [
      { problem: 'Charging port / DC jack', range: '₹600 – ₹3,500', note: 'Soldered barrel jack or harness cable replacement' },
      { problem: 'USB-C charging port', range: '₹1,000 – ₹4,000', note: 'Type-C PD micro-soldering and rail reflow' },
      { problem: 'Charger / adapter replacement', range: '₹1,000 – ₹3,500', note: 'Genuine 45W, 65W, 100W, or 240W power bricks' }
    ]
  },
  {
    category: '⚡ Motherboard',
    categoryKey: 'motherboard',
    repairs: [
      { problem: 'Chip-level repair', range: '₹2,500 – ₹10,000+', note: 'Short-circuit isolation, MOSFET & BGA reballing' },
      { problem: 'Power IC repair', range: '₹2,000 – ₹6,000', note: 'Charging / standby power management IC replacement' },
      { problem: 'BIOS / EC repair', range: '₹1,500 – ₹5,000', note: 'SPI programmer reflashing & clean ME region injection' },
      { problem: 'Motherboard replacement', range: '₹8,000 – ₹30,000+', note: 'Original OEM logic board swap (brand dependent)' }
    ]
  },
  {
    category: '🌡️ Cooling',
    categoryKey: 'cooling',
    repairs: [
      { problem: 'Internal cleaning', range: '₹400 – ₹1,000', note: 'Chassis de-dusting, fin clean & debris removal' },
      { problem: 'Thermal paste replacement', range: '₹500 – ₹1,500', note: 'Premium thermal compound (Noctua/Kryonaut/PTM)' },
      { problem: 'Fan repair', range: '₹700 – ₹2,000', note: 'Bearing realignment, cleaning and lubrication' },
      { problem: 'Fan replacement', range: '₹1,000 – ₹3,500', note: 'Brand new OEM high-RPM brushless fan unit' }
    ]
  },
  {
    category: '🦾 Body & Chassis',
    categoryKey: 'body',
    repairs: [
      { problem: 'Hinge repair', range: '₹800 – ₹3,500', note: 'Brass bushing fabrication & tension adjustment' },
      { problem: 'Hinge replacement', range: '₹1,500 – ₹5,000', note: 'Pair of original alloy display hinges' },
      { problem: 'Laptop body / chassis repair', range: '₹1,000 – ₹5,000+', note: 'A/B/C/D panel repair or cosmetic welding' },
      { problem: 'Liquid / water damage', range: '₹2,500 – ₹15,000+', note: 'Full chemical de-oxidation and SMD restoration' }
    ]
  },
  {
    category: '💾 Storage',
    categoryKey: 'storage',
    repairs: [
      { problem: 'HDD replacement', range: '₹2,000 – ₹6,000', note: '1TB / 2TB 2.5" mechanical hard drive' },
      { problem: 'SSD upgrade', range: '₹1,500 – ₹8,000+', note: '256GB / 512GB / 1TB / 2TB NVMe PCIe Gen 4' },
      { problem: 'SSD installation', range: '₹500 – ₹1,000', note: 'Labor charge when customer provides own drive' },
      { problem: 'HDD → SSD migration', range: '₹1,000 – ₹3,000', note: '1:1 sector-by-sector clone with OS and programs intact' }
    ]
  },
  {
    category: '🧠 RAM Memory',
    categoryKey: 'ram',
    repairs: [
      { problem: 'RAM upgrade', range: '₹1,000 – ₹4,000+', note: '8GB / 16GB / 32GB DDR4 or DDR5 SO-DIMM' },
      { problem: 'RAM troubleshooting', range: '₹300 – ₹1,000', note: 'MemTest86 diagnosis, slot cleaning & oxidation removal' }
    ]
  },
  {
    category: '📷 Camera',
    categoryKey: 'camera',
    repairs: [
      { problem: 'Webcam repair', range: '₹500 – ₹2,000', note: 'Cable reseating and lens re-alignment' },
      { problem: 'Webcam replacement', range: '₹1,000 – ₹3,000', note: 'Original HD / FHD webcam module replacement' }
    ]
  },
  {
    category: '🔊 Audio',
    categoryKey: 'audio',
    repairs: [
      { problem: 'Speaker repair', range: '₹500 – ₹2,000', note: 'Debris extraction and membrane repair' },
      { problem: 'Speaker replacement', range: '₹1,000 – ₹3,000', note: 'Left + Right matched OEM speaker set' }
    ]
  },
  {
    category: '📡 Connectivity',
    categoryKey: 'connectivity',
    repairs: [
      { problem: 'Wi-Fi problem', range: '₹500 – ₹2,000', note: 'Driver configuration and antenna inspection' },
      { problem: 'Wi-Fi card replacement', range: '₹1,000 – ₹3,000', note: 'Wi-Fi 6/6E dual-band M.2 module' },
      { problem: 'Bluetooth problem', range: '₹500 – ₹2,000', note: 'Stack troubleshooting & hardware diagnostic' },
      { problem: 'Ethernet / LAN problem', range: '₹500 – ₹2,000', note: 'RJ45 port spring repair or magnetics replacement' }
    ]
  }
];

export const SOFTWARE_REPAIRS = [
  {
    category: '🪟 Windows OS',
    categoryKey: 'windows',
    repairs: [
      { service: 'Windows installation', range: '₹500 – ₹1,500', note: 'Clean installation of Windows 11 / 10' },
      { service: 'Windows activation/setup*', range: '₹300 – ₹1,000*', note: 'Account setup and configuration (*license separate)' },
      { service: 'Driver installation', range: '₹300 – ₹800', note: 'Official OEM chipset, GPU, and audio drivers' },
      { service: 'Windows boot problem', range: '₹500 – ₹2,000', note: 'Fixing missing BCD, EFI bootloader & loop errors' },
      { service: 'Blue Screen (BSOD) diagnosis', range: '₹500 – ₹2,000', note: 'Kernel dump crash analysis & faulty driver removal' },
      { service: 'Windows corruption repair', range: '₹500 – ₹2,000', note: 'SFC / DISM image repair without data loss' },
      { service: 'System restore/recovery', range: '₹500 – ₹1,500', note: 'Rollback to working state & shadow copy recovery' }
    ]
  },
  {
    category: '🦠 Security & Antivirus',
    categoryKey: 'security',
    repairs: [
      { service: 'Virus removal', range: '₹500 – ₹1,500', note: 'Complete deep scan, rootkit purging & cleanup' },
      { service: 'Malware removal', range: '₹500 – ₹2,000', note: 'Adware, spyware, and hijacked browser cleanup' },
      { service: 'Ransomware investigation', range: '₹2,000 – ₹10,000+', note: 'Shadow copy analysis & decryptor assessment' }
    ]
  },
  {
    category: '⚡ Performance Tuning',
    categoryKey: 'performance',
    repairs: [
      { service: 'Laptop slow fix', range: '₹500 – ₹2,000', note: 'Deep software optimization, registry and bloat purge' },
      { service: 'Startup optimization', range: '₹400 – ₹1,000', note: 'Startup daemon & service pruning for fast boot' },
      { service: 'System optimization', range: '₹500 – ₹2,000', note: 'RAM paging, disk defrag & power profile tuning' }
    ]
  },
  {
    category: '📦 Software & Productivity',
    categoryKey: 'software',
    repairs: [
      { service: 'Software installation', range: '₹200 – ₹800/app', note: 'Application setup (*licenses separate)' },
      { service: 'Application troubleshooting', range: '₹300 – ₹1,500', note: 'DLL errors, crashes, and compatibility fixes' },
      { service: 'Development environment setup', range: '₹500 – ₹2,500', note: 'VS Code, Node.js, Python, Docker, WSL config' }
    ]
  },
  {
    category: '🌐 Network & Sharing',
    categoryKey: 'network',
    repairs: [
      { service: 'Wi-Fi / software configuration', range: '₹300 – ₹1,000', note: 'IP assignment, DNS optimization & SSID setup' },
      { service: 'Network troubleshooting', range: '₹500 – ₹2,000', note: 'VPN, printer sharing, and firewall rules' }
    ]
  },
  {
    category: '🔐 Accounts & Access',
    categoryKey: 'accounts',
    repairs: [
      { service: 'Windows account troubleshooting', range: '₹500 – ₹1,500', note: 'Forgotten local password & profile fix' },
      { service: 'Email / application configuration', range: '₹300 – ₹1,000', note: 'Outlook, MS 365, IMAP/SMTP setup' }
    ]
  },
  {
    category: '💾 Data & Backup',
    categoryKey: 'data',
    repairs: [
      { service: 'Data backup', range: '₹500 – ₹2,000', note: 'Secure transfer to external drive or cloud' },
      { service: 'Data transfer (old to new PC)', range: '₹500 – ₹2,000', note: 'Full user profile & document transfer' },
      { service: 'Data recovery – basic (logical)', range: '₹1,500 – ₹5,000', note: 'Accidental delete, formatted partition, raw drive' },
      { service: 'Data recovery – advanced (physical)', range: '₹5,000 – ₹25,000+', note: 'Bad sectors, firmware glitch, cleanroom work' }
    ]
  },
  {
    category: '🐧 Linux Systems',
    categoryKey: 'linux',
    repairs: [
      { service: 'Linux installation', range: '₹500 – ₹1,500', note: 'Ubuntu, Fedora, Mint, Arch installation' },
      { service: 'Dual-boot setup (Win + Linux)', range: '₹800 – ₹2,500', note: 'GRUB EFI partition partitioning & config' },
      { service: 'Linux troubleshooting', range: '₹500 – ₹2,500', note: 'Nvidia driver, kernel panic & package fixing' }
    ]
  },
  {
    category: '🍎 macOS Systems',
    categoryKey: 'macos',
    repairs: [
      { service: 'macOS installation / recovery', range: '₹1,000 – ₹3,000', note: 'Internet recovery, Ventura/Sonoma reinstall' },
      { service: 'macOS troubleshooting', range: '₹800 – ₹3,000', note: 'Keychain, startup loop, APFS filesystem repair' }
    ]
  }
];

export const WORKFLOW_EXAMPLE = {
  problemCard: {
    customerSymptom: "❌ Laptop Won't Turn On",
    initialEstimate: "₹500 – ₹10,000+",
    rule: "The exact problem will be diagnosed by the technician before any repair work or charging occurs."
  },
  technicianDiagnosis: {
    techName: "Rajesh V. (Chip-Level Certified)",
    techBadge: "Verified Cleanroom Technician #4092",
    diagnosisTitle: "Failed Power-Management IC (PMIC)",
    diagnosisDetail: "Microscope bench inspection revealed short-circuit on the 3.3V standby rail caused by a blown Intersil/TI power-management controller. No damage to the main CPU/GPU.",
    videoTimestamp: "Live stream recorded at 14:22:15 • 1080p 60fps",
    itemizedBreakdown: [
      { item: "Power Management IC Component (ISL95855)", cost: 1800, category: "Part" },
      { item: "Micro-soldering & Thermal Bench Labor", cost: 1000, category: "Labor" }
    ],
    totalQuote: 2800
  },
  customerApprovalPrompt: {
    title: "🔴 Additional Repair Approval Required",
    problemFound: "Power-management IC failure (Standby rail short)",
    originalRange: "₹1,000 – ₹3,000 (Estimated category: Power)",
    finalQuote: "₹2,800 (Parts: ₹1,800 + Labor: ₹1,000)",
    technicianNote: "Technician has provided a live video explanation with microscope proof.",
    action: "Transparent authorization before parts are installed"
  }
};
