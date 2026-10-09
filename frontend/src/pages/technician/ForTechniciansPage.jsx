import React, { useState } from 'react';
import { 
  Wrench, 
  IndianRupee, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  Users, 
  Clock, 
  Video,
  CheckCircle2,
  Sparkles,
  Cpu,
  TrendingUp,
  FileCheck,
  Camera,
  Layers
} from 'lucide-react';
import './ForTechniciansPage.css';

export default function ForTechniciansPage({ onRegisterClick, onLoginClick }) {
  const [repairsPerWeek, setRepairsPerWeek] = useState(8);
  const avgRepairProfit = 2200;
  const estimatedMonthlyEarnings = repairsPerWeek * avgRepairProfit * 4;

  const steps = [
    {
      num: '01',
      title: 'Workshop & ID Verification',
      tag: 'Stage 1: 15 Mins',
      desc: 'Submit your government ID, workshop address, and certification credentials for quick review.',
      badge: 'VERIFICATION'
    },
    {
      num: '02',
      title: 'Cleanroom & Bench Tooling Audit',
      tag: 'Stage 2: Equipment Check',
      desc: 'Confirm your ESD safety mat, temperature-controlled soldering station, and inspection tools.',
      badge: 'EQUIPMENT'
    },
    {
      num: '03',
      title: 'Microscope Stream Calibration',
      tag: 'Stage 3: Camera Test',
      desc: 'Complete a brief 5-minute video stream test to ensure crisp 1080p visibility of ICs and serial tags.',
      badge: 'STREAM TEST'
    },
    {
      num: '04',
      title: 'Go Live & Earn Guaranteed Fees',
      tag: 'Stage 4: Instant Dispatch',
      desc: 'Start receiving nearby laptop repair orders with funds locked securely in customer escrow.',
      badge: 'START EARNING'
    }
  ];

  const benefits = [
    {
      icon: IndianRupee,
      title: '85% Net Payouts',
      desc: 'Keep the highest commission in the industry. Funds are held in escrow and released directly via UPI/Bank transfer.',
      color: '#10b981'
    },
    {
      icon: Video,
      title: 'Zero Customer Disputes',
      desc: 'Live microscope video recording eliminates 100% of "you broke my part" claims. Full transparency protects you.',
      color: '#2563eb'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Bench Intake',
      desc: 'Laptops arrive directly at your workbench. You verify intake condition on video before opening.',
      color: '#f97316'
    },
    {
      icon: Cpu,
      title: 'High-Margin Chip-Level Work',
      desc: 'No low-ball software gigs unless you want them. Focus on high-value BGA rework, PMIC replacements, and logic board repair.',
      color: '#8b5cf6'
    },
    {
      icon: Users,
      title: 'Doorstep Courier Logistics',
      desc: 'Live Fix handles doorstep pickup, delivery, and insurance. Focus 100% of your time on the soldering bench.',
      color: '#06b6d4'
    },
    {
      icon: Award,
      title: 'Verified Partner Badge',
      desc: 'Build a permanent verified reputation with verified reviews, cleanroom certification, and platform status.',
      color: '#ec4899'
    }
  ];

  return (
    <div className="for-tech-root">
      <div className="for-tech-container">
        
        {/* HERO SECTION */}
        <div className="for-tech-header">
          <div className="badge badge-primary for-tech-badge">
            <Sparkles size={14} color="#2563eb" />
            Verified Technician Marketplace
          </div>

          <h1 className="for-tech-h1">
            Elevate Your Repair Bench. <br />
            <span className="for-tech-gradient-text">
              Zero Disputes. Guaranteed Pay.
            </span>
          </h1>

          <p className="for-tech-subtitle">
            Join India's premier live-monitored laptop repair network. Eliminate customer mistrust with live microscope streaming and receive direct escrow-backed payouts.
          </p>

          <div className="for-tech-cta-group d-flex flex-wrap justify-content-center gap-3">
            <button 
              className="btn btn-cta for-tech-btn-primary"
              onClick={onRegisterClick}
            >
              Apply as a Technician
              <ArrowRight size={17} />
            </button>

            <button 
              className="btn btn-secondary for-tech-btn-secondary"
              onClick={onLoginClick}
            >
              Technician Portal Login
            </button>
          </div>
        </div>

        {/* EARNINGS CALCULATOR */}
        <div className="for-tech-calc-wrapper card p-4 p-md-5 mb-5">
          <div className="row g-4 align-items-center">
            <div className="col-12 col-lg-7">
              <div className="for-tech-calc-tag badge bg-primary-subtle text-primary mb-2">
                EARNINGS POTENTIAL
              </div>

              <h3 className="for-tech-calc-title h4 mb-2">
                How Much Can You Earn?
              </h3>

              <p className="for-tech-calc-desc text-muted mb-4">
                Adjust the slider based on the number of chip-level and hardware repairs your bench handles each week.
              </p>

              <div className="for-tech-slider-group">
                <div className="for-tech-slider-label-row d-flex justify-content-between mb-2">
                  <span className="for-tech-slider-label fw-semibold">Repairs Completed Per Week:</span>
                  <span className="for-tech-slider-val fw-bold text-primary">{repairsPerWeek} jobs/wk</span>
                </div>
                <input 
                  type="range"
                  min="2"
                  max="25"
                  value={repairsPerWeek}
                  onChange={(e) => setRepairsPerWeek(Number(e.target.value))}
                  className="for-tech-slider-input form-range"
                />
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="for-tech-calc-result-box card p-4 text-center bg-primary-subtle border-primary-subtle">
                <div className="for-tech-calc-result-tag small fw-bold text-dim mb-1">
                  ESTIMATED MONTHLY NET PAYOUT
                </div>
                <div className="for-tech-calc-amount display-6 fw-bold text-primary mb-2">
                  ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}
                </div>
                <p className="for-tech-calc-note small text-muted mb-3">
                  Based on average ₹{avgRepairProfit} net technician profit per completed hardware repair.
                </p>
                <button
                  onClick={onRegisterClick}
                  className="btn btn-primary w-100 for-tech-calc-apply-btn d-flex align-items-center justify-content-center gap-2"
                >
                  Join Our Network
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6 PLATFORM ADVANTAGES */}
        <div className="for-tech-section-block mb-5">
          <div className="for-tech-section-header text-center mb-4">
            <span className="for-tech-section-tag badge bg-primary-subtle text-primary mb-2">
              WHY TOP TECHNICIANS CHOOSE US
            </span>
            <h2 className="for-tech-section-h2 h3">
              Built to Protect Honest Craftsmanship
            </h2>
          </div>

          <div className="for-tech-benefits-grid row g-4">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="col-12 col-md-6 col-lg-4">
                  <div className="tech-card card h-100 for-tech-benefit-card p-4">
                    <div 
                      className="for-tech-benefit-icon-box rounded-3 p-2 d-inline-flex align-items-center justify-content-center mb-3"
                      style={{
                        background: `${b.color}15`,
                        color: b.color
                      }}
                    >
                      <Icon size={22} strokeWidth={2.4} />
                    </div>
                    <h3 className="for-tech-benefit-title h5 mb-2">
                      {b.title}
                    </h3>
                    <p className="for-tech-benefit-desc small text-muted mb-0">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 STAGE ONBOARDING ROADMAP */}
        <div className="for-tech-roadmap-card card p-4 mb-5">
          <div className="for-tech-section-header text-center mb-4">
            <span className="for-tech-section-tag badge bg-primary-subtle text-primary mb-2">
              FAST-TRACK ONBOARDING
            </span>
            <h2 className="for-tech-section-h2 h3">
              How to Get Verified in 48 Hours
            </h2>
          </div>

          <div className="for-tech-roadmap-grid row g-4">
            {steps.map((st, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="for-tech-roadmap-step card h-100 p-3 bg-card-subtle">
                  <div className="for-tech-roadmap-num fw-bold fs-3 text-primary mb-1">
                    {st.num}
                  </div>
                  <div className="for-tech-roadmap-tag small fw-bold text-muted mb-2">
                    {st.tag}
                  </div>
                  <h4 className="for-tech-roadmap-title h6 mb-2">
                    {st.title}
                  </h4>
                  <p className="for-tech-roadmap-desc small text-muted mb-0">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="for-tech-bottom-callout card text-center p-4 p-md-5">
          <h2 className="for-tech-callout-h2 h3 mb-2">
            Ready to Build a High-Reputation Repair Business?
          </h2>
          <p className="for-tech-callout-p text-muted mb-4">
            Join our certified network today. Verified workshops gain access to high-margin motherboard orders immediately.
          </p>

          <div className="for-tech-cta-group d-flex flex-wrap justify-content-center gap-3">
            <button
              onClick={onRegisterClick}
              className="btn btn-cta for-tech-callout-btn-primary"
            >
              Start Technician Application
              <ArrowRight size={17} />
            </button>
            <button
              onClick={onLoginClick}
              className="btn btn-secondary for-tech-callout-btn-secondary"
            >
              Existing Technician Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
