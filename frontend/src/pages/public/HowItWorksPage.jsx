import React, { useState } from 'react';
import { 
  Laptop, 
  Wrench, 
  Truck, 
  Video, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Star, 
  Clock, 
  IndianRupee,
  Radio,
  Eye,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import './HowItWorksPage.css';

export default function HowItWorksPage({ onStartBooking, onWatchLiveDemo }) {
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const steps = [
    {
      num: '01',
      title: 'Request & Instant Estimate',
      tag: 'Step 1: 2 Minutes',
      summary: 'Describe your device, select symptoms, and set your target budget.',
      detail: 'Choose your laptop brand (Apple, Dell, Lenovo, HP, Asus, Acer), model series, and tell us what went wrong. Select symptoms from our benchmark database and submit your preferred budget.',
      highlight: 'Zero upfront commitment. Get quotes before paying anything.',
      icon: Laptop,
      color: '#3b82f6',
      badge: 'REQUEST'
    },
    {
      num: '02',
      title: 'Technician Matching & Quotes',
      tag: 'Step 2: Within 30 Mins',
      summary: 'Verified cleanroom technicians review schematics and submit itemized offers.',
      detail: 'Our verified technician network reviews your exact model schematics and submits clear quotes. You will see technician certifications, bench equipment, customer reviews, and distance.',
      highlight: 'Compare multiple verified local workshops and select the best fit.',
      icon: Wrench,
      color: '#06b6d4',
      badge: 'MATCHING'
    },
    {
      num: '03',
      title: 'Quote Approval & Escrow Lock',
      tag: 'Step 3: Safe Payment',
      summary: 'Accept your preferred quote with escrow-secured payment protection.',
      detail: 'Accept the quote you like best. Your payment is held securely in an encrypted escrow account. The technician does not receive a single rupee until you inspect and approve the repair.',
      highlight: '100% money-back guarantee if the issue cannot be resolved.',
      icon: IndianRupee,
      color: '#8b5cf6',
      badge: 'ESCROW'
    },
    {
      num: '04',
      title: 'Secure Doorstep Device Collection',
      tag: 'Step 4: Doorstep Collection',
      summary: 'Your device is securely collected at your doorstep by our verified courier.',
      detail: 'Our logistics agent arrives at your door, performs an initial visual verification, logs the pickup in your live dashboard, and safely transports it to the cleanroom lab.',
      highlight: 'Secure padded transit with live status tracking to the technician workbench.',
      icon: Lock,
      color: '#f97316',
      badge: 'DOORSTEP PICKUP'
    },
    {
      num: '05',
      title: 'Watch the Repair Live on Camera',
      tag: 'Step 5: Cleanroom Broadcast',
      summary: 'Tune in to a live 1080p/4K camera feed and watch your laptop repaired under the microscope.',
      detail: 'Receive a live link when your laptop arrives at the cleanroom bench. Watch the technician inspect your device, open the chassis, probe voltage rails on camera, and perform precision soldering under an optical microscope.',
      highlight: 'Real-time chat with the technician. See serial numbers matched live on video.',
      icon: Video,
      color: '#10b981',
      badge: 'LIVE CAMERA'
    },
    {
      num: '06',
      title: 'OTP Delivery & 6-Month Warranty',
      tag: 'Step 6: Return Handoff',
      summary: 'Delivered back safely. Test your device and release payment via secure OTP.',
      detail: 'Your laptop is tested through a 24-point quality check, certified with a 6-month platform warranty, and delivered back to your doorstep. Turn it on, test the repair, and only then provide the delivery OTP to release payment.',
      highlight: 'Includes 6-month Live Fix warranty on all replaced hardware parts.',
      icon: ShieldCheck,
      color: '#2563eb',
      badge: 'COMPLETION'
    }
  ];

  const comparisons = [
    {
      aspect: 'Camera Monitoring',
      traditional: 'Closed backrooms; no visibility into what is done',
      livefix: 'Live 1080p cleanroom stream directly to your phone/PC'
    },
    {
      aspect: 'Component Security',
      traditional: 'Frequent risk of working parts swapped for used ones',
      livefix: 'Live continuous camera monitoring throughout diagnosis and repair'
    },
    {
      aspect: 'Pricing Transparency',
      traditional: 'Hidden fees, surprise diagnostic charges, unexpected hikes',
      livefix: 'Itemized quotes upfront with payment held in escrow'
    },
    {
      aspect: 'Payment Safety',
      traditional: 'Full payment demanded before you can inspect the laptop',
      livefix: 'Funds released only after you test the laptop via OTP'
    },
    {
      aspect: 'Warranty',
      traditional: 'Verbal assurances or 7-day limited warranties',
      livefix: 'Official 6-month platform warranty backed by Live Fix'
    }
  ];

  const faqs = [
    {
      q: 'How does the Live Video Monitoring actually work?',
      a: 'When your laptop reaches the technician workbench, you receive an SMS and email notification with an encrypted private meeting link. You can watch the technician inspect your device condition, unscrew the chassis, test circuits with multimeters, and perform micro-soldering under an optical microscope in real time.'
    },
    {
      q: 'How are my components kept safe without swapping?',
      a: 'Every repair is conducted under high-resolution overhead and optical microscope cameras. The entire process from opening the chassis to replacing chips is streamed live directly to your dashboard so you have complete visibility.'
    },
    {
      q: 'What happens if my laptop cannot be repaired?',
      a: 'If the motherboard or chip has catastrophic damage and cannot be safely restored, the repair is cancelled. Your escrow payment is refunded immediately, minus only the minimal roundtrip courier logistics fee.'
    },
    {
      q: 'Who are the technicians on Live Fix?',
      a: 'Every technician on Live Fix undergoes rigorous background verification, cleanroom bench audit, ESD compliance testing, and skill assessments on BGA rework and motherboard diagnostics.'
    }
  ];

  return (
    <div className="how-page-root">
      <div className="how-container">
        
        {/* HERO SECTION */}
        <div className="how-header">
          <div className="badge badge-primary how-badge">
            <Sparkles size={14} color="#2563eb" />
            100% Transparent Laptop Repair Protocol
          </div>

          <h1 className="how-h1">
            Laptop Repair, <br />
            <span className="how-gradient-text">
              Without the Guesswork.
            </span>
          </h1>

          <p className="how-subtitle">
            Discover how Live Fix protects your device through live microscope camera streaming, verified technicians, and escrow-secured payments.
          </p>

          <div className="how-cta-row d-flex flex-wrap justify-content-center gap-3">
            <button 
              className="btn btn-cta how-btn-primary"
              onClick={onStartBooking}
            >
              Start Repair Request
              <ArrowRight size={17} />
            </button>

            <button 
              className="btn btn-secondary how-btn-secondary"
              onClick={onWatchLiveDemo}
            >
              <Radio size={16} color="#ef4444" />
              Watch 4K Bench Demo
            </button>
          </div>
        </div>

        {/* 6-STEP INTERACTIVE PROTOCOL */}
        <div className="how-section-block mb-5">
          <div className="how-section-header text-center mb-4">
            <span className="how-section-tag badge bg-primary-subtle text-primary mb-2">
              STEP-BY-STEP PROCESS
            </span>
            <h2 className="how-section-h2 h3">
              The 6 Stages of Verified Care
            </h2>
          </div>

          <div className="how-steps-grid row g-4">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="how-step-card card h-100 p-4 position-relative overflow-hidden">
                    <div 
                      className="how-step-top-stripe position-absolute top-0 start-0 end-0"
                      style={{ background: st.color, height: '4px' }}
                    />

                    <div>
                      <div className="how-step-card-header d-flex justify-content-between align-items-center mb-3">
                        <div 
                          className="how-step-icon-wrap rounded-3 p-2 d-flex align-items-center justify-content-center"
                          style={{
                            background: `${st.color}15`,
                            border: `1.5px solid ${st.color}40`,
                            color: st.color
                          }}
                        >
                          <Icon size={22} strokeWidth={2.4} />
                        </div>

                        <div 
                          className="how-step-num fw-bold fs-4"
                          style={{ color: st.color }}
                        >
                          {st.num}
                        </div>
                      </div>

                      <div 
                        className="how-step-tag small fw-bold mb-1"
                        style={{ color: st.color }}
                      >
                        {st.tag}
                      </div>

                      <h3 className="how-step-title h5 mb-2">
                        {st.title}
                      </h3>

                      <p className="how-step-detail small text-muted mb-3">
                        {st.detail}
                      </p>
                    </div>

                    <div className="how-step-highlight small d-flex align-items-center gap-2 mt-auto pt-2 border-top border-light">
                      <CheckCircle2 size={16} color="#10b981" />
                      <span>{st.highlight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPARISON MATRIX: TRADITIONAL VS LIVE FIX */}
        <div className="how-comparison-card card p-4 mb-5">
          <div className="how-section-header text-center mb-4">
            <span className="how-section-tag badge bg-primary-subtle text-primary mb-2">
              TRANSPARENCY AUDIT
            </span>
            <h2 className="how-section-h2 h3">
              Traditional Repair vs. Live Fix
            </h2>
          </div>

          <div className="how-table-wrap table-responsive">
            <table className="how-table table table-hover align-middle mb-0">
              <thead>
                <tr className="how-th-row">
                  <th scope="col" className="how-th how-th-feature">FEATURE</th>
                  <th scope="col" className="how-th how-th-trad text-danger">TRADITIONAL REPAIR SHOPS</th>
                  <th scope="col" className="how-th how-th-fix text-success">LIVE FIX VERIFIED BENCH</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} className="how-tr">
                    <td className="how-td-feature fw-semibold">
                      {c.aspect}
                    </td>
                    <td className="how-td-trad text-muted">
                      <div className="how-row-content d-flex align-items-center gap-2">
                        <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                        {c.traditional}
                      </div>
                    </td>
                    <td className="how-td-fix">
                      <div className="how-row-content d-flex align-items-center gap-2 fw-medium text-success">
                        <CheckCircle2 size={16} color="#10b981" />
                        {c.livefix}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="how-section-block mb-5">
          <div className="how-section-header text-center mb-4">
            <span className="how-section-tag badge bg-primary-subtle text-primary mb-2">
              COMMON QUESTIONS
            </span>
            <h2 className="how-section-h2 h3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="how-faq-list d-flex flex-column gap-3">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="how-faq-item card p-3"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="how-faq-toggle btn w-100 d-flex justify-content-between align-items-center text-start p-0"
                  >
                    <span className="fw-semibold text-main">{f.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div className="how-faq-answer pt-3 text-muted small border-top border-light mt-2">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="how-cta-banner card text-center p-4 p-md-5">
          <h2 className="how-cta-banner-h2 h3 mb-2">
            Ready for Honest, Live-Monitored Laptop Repair?
          </h2>
          <p className="how-cta-banner-p text-muted mb-4">
            Submit your laptop brand, symptoms, and target budget. Get verified quotes in minutes.
          </p>

          <div className="how-cta-row d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={onStartBooking}
              className="btn btn-cta how-banner-primary-btn"
            >
              Get Your Laptop Repaired
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onWatchLiveDemo}
              className="btn btn-secondary how-banner-secondary-btn"
            >
              <Radio size={16} color="#ef4444" />
              Watch Live Cleanroom Feed
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
