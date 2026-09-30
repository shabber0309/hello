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
  DollarSign,
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

export default function HowItWorksPage({ onStartBooking, onWatchLiveDemo, onOpenTamperSeal }) {
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
      icon: DollarSign,
      color: '#8b5cf6',
      badge: 'ESCROW'
    },
    {
      num: '04',
      title: 'Serialized Tamper-Evident Pickup',
      tag: 'Step 4: Doorstep Collection',
      summary: 'Your device is placed in a serialized tamper-evident security bag at your doorstep.',
      detail: 'Our secure logistics agent arrives at your door. You inspect the bag together, match serial numbers, and seal the laptop with a tamper-evident barcode seal. The unique seal code is recorded in your live dashboard.',
      highlight: 'No unauthorized opening during transportation. Zero risk of part swapping.',
      icon: Lock,
      color: '#f97316',
      badge: 'TAMPER SEAL'
    },
    {
      num: '05',
      title: 'Watch the Repair Live on Camera',
      tag: 'Step 5: Cleanroom Broadcast',
      summary: 'Tune in to a live 1080p/4K camera feed and watch your laptop repaired under the microscope.',
      detail: 'Receive a live link when your laptop arrives at the cleanroom bench. Watch the technician verify your tamper seal, open the chassis, probe voltage rails on camera, and perform precision soldering under an optical microscope.',
      highlight: 'Real-time chat with the technician. See serial numbers matched live on video.',
      icon: Video,
      color: '#10b981',
      badge: 'LIVE CAMERA'
    },
    {
      num: '06',
      title: 'OTP Delivery & 6-Month Warranty',
      tag: 'Step 6: Return Handoff',
      summary: 'Delivered back sealed. Test your device and release payment via secure OTP.',
      detail: 'Your laptop is tested through a 24-point quality check, sealed with a warranty tamper badge, and delivered back to your doorstep. Turn it on, test the repair, and only then provide the delivery OTP to release payment.',
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
      livefix: 'Serialized tamper-evident seal verified live on video'
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
      a: 'When your laptop reaches the technician workbench, you receive an SMS and email notification with an encrypted private meeting link. You can watch the technician verify your tamper bag seal, unscrew the chassis, test circuits with multimeters, and perform micro-soldering under an optical microscope in real time.'
    },
    {
      q: 'What is a serialized tamper-evident seal?',
      a: 'It is an industrial-grade security seal engineered with tamper-destruct adhesive. Once applied at your doorstep, any attempt to peel or open the bag leaves an irreversible VOID honeycomb pattern. The technician shows this intact barcode on camera before opening it.'
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
            Discover how Live Fix protects your device through serialized tamper seals, live microscope camera streaming, and escrow-secured payments.
          </p>

          <div className="how-cta-row">
            <button 
              className="btn-cta how-btn-primary"
              onClick={onStartBooking}
            >
              Start Repair Request
              <ArrowRight size={17} />
            </button>

            <button 
              className="btn-secondary how-btn-secondary"
              onClick={onWatchLiveDemo}
            >
              <Radio size={16} color="#ef4444" />
              Watch 4K Bench Demo
            </button>
          </div>
        </div>

        {/* 6-STEP INTERACTIVE PROTOCOL */}
        <div className="how-section-block">
          <div className="how-section-header">
            <span className="how-section-tag">
              STEP-BY-STEP PROCESS
            </span>
            <h2 className="how-section-h2">
              The 6 Stages of Verified Care
            </h2>
          </div>

          <div className="how-steps-grid">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div 
                  key={idx}
                  className="how-step-card"
                >
                  <div 
                    className="how-step-top-stripe"
                    style={{ background: st.color }}
                  />

                  <div>
                    <div className="how-step-card-header">
                      <div 
                        className="how-step-icon-wrap"
                        style={{
                          background: `${st.color}15`,
                          border: `1.5px solid ${st.color}40`,
                          color: st.color
                        }}
                      >
                        <Icon size={22} strokeWidth={2.4} />
                      </div>

                      <div 
                        className="how-step-num"
                        style={{ color: st.color }}
                      >
                        {st.num}
                      </div>
                    </div>

                    <div 
                      className="how-step-tag"
                      style={{ color: st.color }}
                    >
                      {st.tag}
                    </div>

                    <h3 className="how-step-title">
                      {st.title}
                    </h3>

                    <p className="how-step-detail">
                      {st.detail}
                    </p>
                  </div>

                  <div className="how-step-highlight">
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>{st.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPARISON MATRIX: TRADITIONAL VS LIVE FIX */}
        <div className="how-comparison-card">
          <div className="how-section-header">
            <span className="how-section-tag">
              TRANSPARENCY AUDIT
            </span>
            <h2 className="how-section-h2">
              Traditional Repair vs. Live Fix
            </h2>
          </div>

          <div className="how-table-wrap">
            <table className="how-table">
              <thead>
                <tr className="how-th-row">
                  <th className="how-th how-th-feature">FEATURE</th>
                  <th className="how-th how-th-trad">TRADITIONAL REPAIR SHOPS</th>
                  <th className="how-th how-th-fix">LIVE FIX VERIFIED BENCH</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={i} className="how-tr">
                    <td className="how-td-feature">
                      {c.aspect}
                    </td>
                    <td className="how-td-trad">
                      <div className="how-row-content">
                        <span style={{ color: '#ef4444', fontWeight: 800 }}>✕</span>
                        {c.traditional}
                      </div>
                    </td>
                    <td className="how-td-fix">
                      <div className="how-row-content">
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
        <div className="how-section-block">
          <div className="how-section-header">
            <span className="how-section-tag">
              COMMON QUESTIONS
            </span>
            <h2 className="how-section-h2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="how-faq-list">
            {faqs.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div 
                  key={i}
                  className="how-faq-item"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="how-faq-toggle"
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--primary)" /> : <ChevronDown size={18} color="#64748b" />}
                  </button>

                  {isOpen && (
                    <div className="how-faq-answer">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="how-cta-banner">
          <h2 className="how-cta-banner-h2">
            Ready for Honest, Live-Monitored Laptop Repair?
          </h2>
          <p className="how-cta-banner-p">
            Submit your laptop brand, symptoms, and target budget. Get verified quotes in minutes.
          </p>

          <div className="how-cta-row">
            <button
              onClick={onStartBooking}
              className="how-banner-primary-btn"
            >
              Get Your Laptop Repaired
              <ArrowRight size={17} />
            </button>

            <button
              onClick={onWatchLiveDemo}
              className="how-banner-secondary-btn"
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
