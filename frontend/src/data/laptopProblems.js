// 2026 India / Hyderabad Comprehensive Laptop Repair Database & Indicative Pricing
export const LAPTOP_PROBLEM_CATEGORIES = [
  {
    id: 'software',
    name: '1. Software & Windows Problems',
    shortName: 'Software',
    problems: [
      { id: 1, name: 'Windows not booting', basePrice: 500, maxPrice: 1500 },
      { id: 2, name: 'Windows installation', basePrice: 500, maxPrice: 1500 },
      { id: 3, name: 'Windows reinstall', basePrice: 600, maxPrice: 1500 },
      { id: 4, name: 'Windows activation/setup', basePrice: 300, maxPrice: 1000 },
      { id: 5, name: 'Windows update failure', basePrice: 400, maxPrice: 1200 },
      { id: 6, name: 'Blue Screen / BSOD', basePrice: 500, maxPrice: 2000 },
      { id: 7, name: 'Startup repair', basePrice: 400, maxPrice: 1500 },
      { id: 8, name: 'Bootloader/BCD repair', basePrice: 500, maxPrice: 1500 },
      { id: 9, name: 'System restore', basePrice: 300, maxPrice: 1000 },
      { id: 10, name: 'Driver installation', basePrice: 300, maxPrice: 1000 },
      { id: 11, name: 'Driver conflict', basePrice: 400, maxPrice: 1500 },
      { id: 12, name: 'Missing drivers', basePrice: 300, maxPrice: 1000 },
      { id: 13, name: 'Windows slow', basePrice: 500, maxPrice: 2000 },
      { id: 14, name: 'System freezing', basePrice: 500, maxPrice: 2000 },
      { id: 15, name: 'Software crash', basePrice: 300, maxPrice: 1500 },
      { id: 16, name: 'Application installation', basePrice: 200, maxPrice: 800 },
      { id: 17, name: 'Application configuration', basePrice: 300, maxPrice: 1000 },
      { id: 18, name: 'Virus removal', basePrice: 500, maxPrice: 1500 },
      { id: 19, name: 'Malware removal', basePrice: 500, maxPrice: 2000 },
      { id: 20, name: 'Adware/browser hijacking', basePrice: 400, maxPrice: 1500 },
      { id: 21, name: 'Windows password/login issue', basePrice: 500, maxPrice: 1500 },
      { id: 22, name: 'Microsoft account/setup issue', basePrice: 300, maxPrice: 1000 },
      { id: 23, name: 'System restore/recovery', basePrice: 500, maxPrice: 1500 },
      { id: 24, name: 'Software compatibility issue', basePrice: 300, maxPrice: 1500 },
      { id: 25, name: 'General software troubleshooting', basePrice: 300, maxPrice: 1500 }
    ]
  },
  {
    id: 'performance',
    name: '2. Performance Problems',
    shortName: 'Performance',
    problems: [
      { id: 26, name: 'Laptop running slow', basePrice: 500, maxPrice: 2000 },
      { id: 27, name: 'Laptop hanging', basePrice: 500, maxPrice: 2000 },
      { id: 28, name: 'Laptop freezing', basePrice: 500, maxPrice: 2500 },
      { id: 29, name: 'High CPU usage', basePrice: 400, maxPrice: 1500 },
      { id: 30, name: 'High RAM usage', basePrice: 400, maxPrice: 1500 },
      { id: 31, name: 'Disk usage 100%', basePrice: 500, maxPrice: 1500 },
      { id: 32, name: 'Overheating', basePrice: 700, maxPrice: 3000 },
      { id: 33, name: 'Thermal paste replacement', basePrice: 500, maxPrice: 2000 },
      { id: 34, name: 'Internal cleaning', basePrice: 500, maxPrice: 1500 },
      { id: 35, name: 'Fan cleaning', basePrice: 400, maxPrice: 1200 },
      { id: 36, name: 'Fan replacement', basePrice: 1000, maxPrice: 5000 },
      { id: 37, name: 'Thermal throttling', basePrice: 800, maxPrice: 3000 },
      { id: 38, name: 'Random performance drops', basePrice: 500, maxPrice: 2500 },
      { id: 39, name: 'Gaming performance issue', basePrice: 800, maxPrice: 4000 },
      { id: 40, name: 'GPU overheating', basePrice: 1000, maxPrice: 5000 }
    ]
  },
  {
    id: 'display',
    name: '3. Display / Screen Problems',
    shortName: 'Display',
    problems: [
      { id: 41, name: 'No display', basePrice: 1000, maxPrice: 5000 },
      { id: 42, name: 'Black screen', basePrice: 500, maxPrice: 5000 },
      { id: 43, name: 'Screen flickering', basePrice: 500, maxPrice: 5000 },
      { id: 44, name: 'Screen dim', basePrice: 500, maxPrice: 4000 },
      { id: 45, name: 'Screen lines', basePrice: 2000, maxPrice: 10000 },
      { id: 46, name: 'Dead pixels', basePrice: 2000, maxPrice: 12000 },
      { id: 47, name: 'Cracked display', basePrice: 2500, maxPrice: 15000 },
      { id: 48, name: 'Broken LCD', basePrice: 2500, maxPrice: 15000 },
      { id: 49, name: 'Broken LED panel', basePrice: 2500, maxPrice: 15000 },
      { id: 50, name: 'Display cable fault', basePrice: 800, maxPrice: 3000 },
      { id: 51, name: 'Display connector issue', basePrice: 800, maxPrice: 3000 },
      { id: 52, name: 'Screen color problem', basePrice: 800, maxPrice: 5000 },
      { id: 53, name: 'Touchscreen not working', basePrice: 2500, maxPrice: 15000 },
      { id: 54, name: 'Touchscreen replacement', basePrice: 4000, maxPrice: 20000 },
      { id: 55, name: 'OLED display replacement', basePrice: 7000, maxPrice: 25000 },
      { id: 56, name: '144Hz/165Hz gaming display', basePrice: 5000, maxPrice: 18000 },
      { id: 57, name: '4K display replacement', basePrice: 7000, maxPrice: 25000 }
    ]
  },
  {
    id: 'keyboard',
    name: '4. Keyboard Problems',
    shortName: 'Keyboard',
    problems: [
      { id: 58, name: 'Single key not working', basePrice: 300, maxPrice: 800 },
      { id: 59, name: 'Multiple keys not working', basePrice: 500, maxPrice: 1500 },
      { id: 60, name: 'Keyboard cleaning', basePrice: 300, maxPrice: 800 },
      { id: 61, name: 'Keyboard stuck', basePrice: 300, maxPrice: 1000 },
      { id: 62, name: 'Keyboard typing wrong characters', basePrice: 300, maxPrice: 1000 },
      { id: 63, name: 'Keyboard liquid damage', basePrice: 500, maxPrice: 2000 },
      { id: 64, name: 'Keyboard replacement', basePrice: 900, maxPrice: 4000 },
      { id: 65, name: 'Backlit keyboard replacement', basePrice: 1500, maxPrice: 6000 },
      { id: 66, name: 'Gaming/RGB keyboard replacement', basePrice: 2000, maxPrice: 8000 }
    ]
  },
  {
    id: 'battery',
    name: '5. Battery & Charging Problems',
    shortName: 'Battery',
    problems: [
      { id: 67, name: 'Battery draining quickly', basePrice: 1000, maxPrice: 6000 },
      { id: 68, name: 'Battery not charging', basePrice: 500, maxPrice: 4000 },
      { id: 69, name: 'Battery not detected', basePrice: 500, maxPrice: 3000 },
      { id: 70, name: 'Battery swollen', basePrice: 1500, maxPrice: 6000 },
      { id: 71, name: 'Battery replacement', basePrice: 1200, maxPrice: 8000 },
      { id: 72, name: 'OEM battery replacement', basePrice: 2500, maxPrice: 10000 },
      { id: 73, name: 'Battery connector issue', basePrice: 500, maxPrice: 2000 },
      { id: 74, name: 'Battery calibration', basePrice: 300, maxPrice: 1000 },
      { id: 75, name: 'Laptop shuts down on battery', basePrice: 500, maxPrice: 5000 },
      { id: 76, name: 'Battery percentage stuck', basePrice: 300, maxPrice: 1500 }
    ]
  },
  {
    id: 'charger',
    name: '6. Charger & Charging-Port Problems',
    shortName: 'Charger & Port',
    problems: [
      { id: 77, name: 'Charger not working', basePrice: 800, maxPrice: 4000 },
      { id: 78, name: 'Charger cable damaged', basePrice: 500, maxPrice: 2000 },
      { id: 79, name: 'Adapter replacement', basePrice: 1000, maxPrice: 5000 },
      { id: 80, name: 'Laptop not charging', basePrice: 500, maxPrice: 4000 },
      { id: 81, name: 'Charging port loose', basePrice: 700, maxPrice: 2500 },
      { id: 82, name: 'Charging port broken', basePrice: 1000, maxPrice: 3500 },
      { id: 83, name: 'DC jack replacement', basePrice: 1000, maxPrice: 3500 },
      { id: 84, name: 'USB-C charging issue', basePrice: 1000, maxPrice: 5000 },
      { id: 85, name: 'Charging IC problem', basePrice: 1500, maxPrice: 6000 },
      { id: 86, name: 'Power connector problem', basePrice: 800, maxPrice: 3500 }
    ]
  },
  {
    id: 'motherboard',
    name: '7. Motherboard / Chip-Level Problems',
    shortName: 'Motherboard',
    problems: [
      { id: 87, name: 'Laptop completely dead', basePrice: 1500, maxPrice: 15000 },
      { id: 88, name: 'Motherboard short circuit', basePrice: 2000, maxPrice: 15000 },
      { id: 89, name: 'Power IC failure', basePrice: 2000, maxPrice: 8000 },
      { id: 90, name: 'Charging IC failure', basePrice: 2000, maxPrice: 8000 },
      { id: 91, name: 'BIOS corruption', basePrice: 1000, maxPrice: 5000 },
      { id: 92, name: 'BIOS chip programming', basePrice: 1500, maxPrice: 5000 },
      { id: 93, name: 'EC firmware issue', basePrice: 2000, maxPrice: 7000 },
      { id: 94, name: 'MOSFET failure', basePrice: 2000, maxPrice: 7000 },
      { id: 95, name: 'Capacitor failure', basePrice: 1500, maxPrice: 5000 },
      { id: 96, name: 'Voltage regulator failure', basePrice: 2000, maxPrice: 8000 },
      { id: 97, name: 'CPU power circuit issue', basePrice: 3000, maxPrice: 12000 },
      { id: 98, name: 'GPU power circuit issue', basePrice: 3000, maxPrice: 15000 },
      { id: 99, name: 'Motherboard corrosion', basePrice: 2000, maxPrice: 12000 },
      { id: 100, name: 'Motherboard chip-level repair', basePrice: 3500, maxPrice: 15000 },
      { id: 101, name: 'BGA/reballing work', basePrice: 4000, maxPrice: 15000 },
      { id: 102, name: 'Full motherboard replacement', basePrice: 6000, maxPrice: 35000 }
    ]
  },
  {
    id: 'ram',
    name: '8. RAM Problems & Upgrades',
    shortName: 'RAM',
    problems: [
      { id: 103, name: 'RAM not detected', basePrice: 500, maxPrice: 3000 },
      { id: 104, name: 'RAM failure', basePrice: 1000, maxPrice: 6000 },
      { id: 105, name: 'RAM compatibility issue', basePrice: 300, maxPrice: 1000 },
      { id: 106, name: 'RAM reseating', basePrice: 300, maxPrice: 800 },
      { id: 107, name: 'RAM upgrade 4GB → 8GB', basePrice: 1000, maxPrice: 3000 },
      { id: 108, name: 'RAM upgrade 8GB → 16GB', basePrice: 1500, maxPrice: 5000 },
      { id: 109, name: 'RAM upgrade 16GB → 32GB', basePrice: 3000, maxPrice: 9000 },
      { id: 110, name: 'RAM stress testing/diagnosis', basePrice: 300, maxPrice: 1000 }
    ]
  },
  {
    id: 'storage',
    name: '9. HDD / SSD Problems',
    shortName: 'Storage',
    problems: [
      { id: 111, name: 'HDD slow', basePrice: 500, maxPrice: 2000 },
      { id: 112, name: 'HDD clicking/noise', basePrice: 500, maxPrice: 2000 },
      { id: 113, name: 'HDD not detected', basePrice: 500, maxPrice: 3000 },
      { id: 114, name: 'HDD bad sectors', basePrice: 500, maxPrice: 3000 },
      { id: 115, name: 'HDD replacement', basePrice: 1500, maxPrice: 5000 },
      { id: 116, name: 'SSD not detected', basePrice: 500, maxPrice: 3000 },
      { id: 117, name: 'SSD failure', basePrice: 1500, maxPrice: 8000 },
      { id: 118, name: 'SSD replacement', basePrice: 1500, maxPrice: 8000 },
      { id: 119, name: 'HDD → SSD upgrade', basePrice: 1500, maxPrice: 6000 },
      { id: 120, name: 'SSD upgrade 256GB → 512GB', basePrice: 2000, maxPrice: 5000 },
      { id: 121, name: 'SSD upgrade 512GB → 1TB', basePrice: 3000, maxPrice: 8000 },
      { id: 122, name: 'Data cloning', basePrice: 500, maxPrice: 2500 }
    ]
  },
  {
    id: 'recovery',
    name: '10. Data Recovery',
    shortName: 'Data Recovery',
    problems: [
      { id: 123, name: 'Deleted file recovery', basePrice: 1000, maxPrice: 5000 },
      { id: 124, name: 'Accidentally formatted drive', basePrice: 1500, maxPrice: 6000 },
      { id: 125, name: 'Corrupted partition recovery', basePrice: 2000, maxPrice: 8000 },
      { id: 126, name: 'HDD data recovery', basePrice: 2000, maxPrice: 10000 },
      { id: 127, name: 'SSD data recovery', basePrice: 3000, maxPrice: 15000 },
      { id: 128, name: 'Dead HDD recovery', basePrice: 4000, maxPrice: 15000 },
      { id: 129, name: 'Physically damaged drive', basePrice: 5000, maxPrice: 20000 },
      { id: 130, name: 'Advanced cleanroom data recovery', basePrice: 8000, maxPrice: 30000 }
    ]
  },
  {
    id: 'cooling',
    name: '11. Cooling / Fan Problems',
    shortName: 'Cooling & Fan',
    problems: [
      { id: 131, name: 'Fan noisy', basePrice: 500, maxPrice: 2000 },
      { id: 132, name: 'Fan not spinning', basePrice: 800, maxPrice: 3000 },
      { id: 133, name: 'Fan cleaning', basePrice: 400, maxPrice: 1200 },
      { id: 134, name: 'Fan replacement', basePrice: 1000, maxPrice: 5000 },
      { id: 135, name: 'Heatsink cleaning', basePrice: 500, maxPrice: 1500 },
      { id: 136, name: 'Thermal paste replacement', basePrice: 500, maxPrice: 2500 },
      { id: 137, name: 'CPU overheating', basePrice: 700, maxPrice: 3000 },
      { id: 138, name: 'GPU overheating', basePrice: 1000, maxPrice: 5000 },
      { id: 139, name: 'Thermal throttling', basePrice: 800, maxPrice: 3000 }
    ]
  },
  {
    id: 'network',
    name: '12. Wi-Fi / Bluetooth / Network',
    shortName: 'Networking',
    problems: [
      { id: 140, name: 'Wi-Fi not working', basePrice: 400, maxPrice: 2500 },
      { id: 141, name: 'Wi-Fi keeps disconnecting', basePrice: 300, maxPrice: 1500 },
      { id: 142, name: 'Wi-Fi driver issue', basePrice: 300, maxPrice: 1000 },
      { id: 143, name: 'Wi-Fi card failure', basePrice: 800, maxPrice: 3000 },
      { id: 144, name: 'Bluetooth not working', basePrice: 300, maxPrice: 2000 },
      { id: 145, name: 'Bluetooth driver issue', basePrice: 300, maxPrice: 1000 },
      { id: 146, name: 'LAN/Ethernet issue', basePrice: 400, maxPrice: 2500 },
      { id: 147, name: 'Network configuration', basePrice: 300, maxPrice: 1000 },
      { id: 148, name: 'Wi-Fi antenna problem', basePrice: 500, maxPrice: 2500 }
    ]
  },
  {
    id: 'ports',
    name: '13. USB / HDMI / Audio Ports',
    shortName: 'Ports',
    problems: [
      { id: 149, name: 'USB port not working', basePrice: 500, maxPrice: 2500 },
      { id: 150, name: 'USB port physically damaged', basePrice: 800, maxPrice: 3000 },
      { id: 151, name: 'USB-C port problem', basePrice: 800, maxPrice: 4000 },
      { id: 152, name: 'HDMI not working', basePrice: 700, maxPrice: 3500 },
      { id: 153, name: 'Audio jack not working', basePrice: 500, maxPrice: 2500 },
      { id: 154, name: 'Headphone not detected', basePrice: 300, maxPrice: 1500 },
      { id: 155, name: 'SD card reader issue', basePrice: 500, maxPrice: 2500 }
    ]
  },
  {
    id: 'audio_camera',
    name: '14. Speaker / Microphone / Webcam',
    shortName: 'Audio & Camera',
    problems: [
      { id: 156, name: 'Speaker not working', basePrice: 500, maxPrice: 3000 },
      { id: 157, name: 'Speaker distorted', basePrice: 500, maxPrice: 2500 },
      { id: 158, name: 'Speaker replacement', basePrice: 800, maxPrice: 4000 },
      { id: 159, name: 'Microphone not working', basePrice: 400, maxPrice: 2500 },
      { id: 160, name: 'Webcam not working', basePrice: 400, maxPrice: 3000 },
      { id: 161, name: 'Webcam replacement', basePrice: 800, maxPrice: 4000 },
      { id: 162, name: 'Camera driver issue', basePrice: 300, maxPrice: 1000 }
    ]
  },
  {
    id: 'touchpad',
    name: '15. Touchpad Problems',
    shortName: 'Touchpad',
    problems: [
      { id: 163, name: 'Touchpad not working', basePrice: 400, maxPrice: 2500 },
      { id: 164, name: 'Touchpad cursor jumping', basePrice: 300, maxPrice: 1500 },
      { id: 165, name: 'Touchpad buttons not working', basePrice: 500, maxPrice: 2000 },
      { id: 166, name: 'Touchpad replacement', basePrice: 1000, maxPrice: 4000 },
      { id: 167, name: 'Touchpad driver issue', basePrice: 300, maxPrice: 1000 }
    ]
  },
  {
    id: 'hinge_body',
    name: '16. Hinge / Body / Chassis',
    shortName: 'Hinge & Chassis',
    problems: [
      { id: 168, name: 'Loose hinge', basePrice: 500, maxPrice: 2000 },
      { id: 169, name: 'Broken hinge', basePrice: 800, maxPrice: 4000 },
      { id: 170, name: 'Hinge replacement', basePrice: 1000, maxPrice: 5000 },
      { id: 171, name: 'Broken laptop body', basePrice: 700, maxPrice: 5000 },
      { id: 172, name: 'Cracked palm rest', basePrice: 800, maxPrice: 5000 },
      { id: 173, name: 'Broken bottom panel', basePrice: 1000, maxPrice: 6000 },
      { id: 174, name: 'Screen bezel broken', basePrice: 700, maxPrice: 3000 },
      { id: 175, name: 'Hinge + body repair', basePrice: 1500, maxPrice: 6000 }
    ]
  },
  {
    id: 'liquid_damage',
    name: '17. Liquid / Water Damage',
    shortName: 'Liquid Damage',
    problems: [
      { id: 176, name: 'Water spill', basePrice: 800, maxPrice: 5000 },
      { id: 177, name: 'Tea/coffee spill', basePrice: 1000, maxPrice: 7000 },
      { id: 178, name: 'Liquid cleaning', basePrice: 800, maxPrice: 3000 },
      { id: 179, name: 'Keyboard liquid damage', basePrice: 1000, maxPrice: 5000 },
      { id: 180, name: 'Motherboard liquid damage', basePrice: 2000, maxPrice: 15000 },
      { id: 181, name: 'Corrosion removal', basePrice: 1500, maxPrice: 8000 },
      { id: 182, name: 'Liquid-damaged motherboard repair', basePrice: 3000, maxPrice: 15000 }
    ]
  },
  {
    id: 'bios',
    name: '18. BIOS / Firmware',
    shortName: 'BIOS & Firmware',
    problems: [
      { id: 183, name: 'BIOS update', basePrice: 300, maxPrice: 1000 },
      { id: 184, name: 'BIOS corrupted', basePrice: 1000, maxPrice: 4000 },
      { id: 185, name: 'BIOS flashing', basePrice: 1000, maxPrice: 4000 },
      { id: 186, name: 'BIOS chip replacement', basePrice: 1500, maxPrice: 5000 },
      { id: 187, name: 'EC firmware issue', basePrice: 2000, maxPrice: 7000 },
      { id: 188, name: 'BIOS password issue', basePrice: 500, maxPrice: 3000 }
    ]
  },
  {
    id: 'optical',
    name: '19. Optical Drive / Older Laptops',
    shortName: 'Optical Drive',
    problems: [
      { id: 189, name: 'DVD drive not reading', basePrice: 500, maxPrice: 2000 },
      { id: 190, name: 'DVD drive replacement', basePrice: 800, maxPrice: 3000 },
      { id: 191, name: 'CD/DVD stuck', basePrice: 300, maxPrice: 1000 },
      { id: 192, name: 'Optical drive cleaning', basePrice: 300, maxPrice: 800 }
    ]
  },
  {
    id: 'security',
    name: '20. Security / Account / Setup Services',
    shortName: 'Security & Setup',
    problems: [
      { id: 193, name: 'Antivirus installation', basePrice: 300, maxPrice: 1000 },
      { id: 194, name: 'Security scan', basePrice: 300, maxPrice: 1000 },
      { id: 195, name: 'Malware cleanup', basePrice: 500, maxPrice: 2000 },
      { id: 196, name: 'Backup setup', basePrice: 500, maxPrice: 2000 },
      { id: 197, name: 'Cloud backup setup', basePrice: 500, maxPrice: 2000 },
      { id: 198, name: 'Email setup', basePrice: 200, maxPrice: 800 },
      { id: 199, name: 'Printer setup', basePrice: 300, maxPrice: 1500 },
      { id: 200, name: 'Wi-Fi/router setup', basePrice: 300, maxPrice: 1500 }
    ]
  }
];

export const ALL_PROBLEMS_FLAT = LAPTOP_PROBLEM_CATEGORIES.flatMap(cat => 
  cat.problems.map(p => ({ ...p, categoryId: cat.id, categoryName: cat.name, shortCategory: cat.shortName }))
);
