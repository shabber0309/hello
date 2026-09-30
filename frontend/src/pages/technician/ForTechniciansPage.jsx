import React, { useState } from 'react';
import { 
  Wrench, 
  DollarSign, 
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
      icon: DollarSign,
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
      title: 'Serialized Tamper Bags',
      desc: 'Laptops arrive in serialized, barcoded tamper bags. You verify seal integrity on video before opening.',
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

          <div className="for-tech-cta-group">
            <button 
              className="btn-cta for-tech-btn-primary"
              onClick={onRegisterClick}
            >
              Apply as a Technician
              <ArrowRight size={17} />
            </button>

            <button 
              className="btn-secondary for-tech-btn-secondary"
              onClick={onLoginClick}
            >
              Technician Portal Login
            </button>
          </div>
        </div>

        {/* EARNINGS CALCULATOR */}
        <div className="for-tech-calc-wrapper">
          <div>
            <div className="for-tech-calc-tag">
              EARNINGS POTENTIAL
            </div>

            <h3 className="for-tech-calc-title">
              How Much Can You Earn?
            </h3>

            <p className="for-tech-calc-desc">
              Adjust the slider based on the number of chip-level and hardware repairs your bench handles each week.
            </p>

            <div className="for-tech-slider-group">
              <div className="for-tech-slider-label-row">
                <span className="for-tech-slider-label">Repairs Completed Per Week:</span>
                <span className="for-tech-slider-val">{repairsPerWeek} jobs/wk</span>
              </div>
              <input 
                type="range"
                min="2"
                max="25"
                value={repairsPerWeek}
                onChange={(e) => setRepairsPerWeek(Number(e.target.value))}
                className="for-tech-slider-input"
              />
            </div>
          </div>

          <div className="for-tech-calc-result-box">
            <div className="for-tech-calc-result-tag">
              ESTIMATED MONTHLY NET PAYOUT
            </div>
            <div className="for-tech-calc-amount">
              ₹{estimatedMonthlyEarnings.toLocaleString('en-IN')}
            </div>
            <p className="for-tech-calc-note">
              Based on average ₹{avgRepairProfit} net technician profit per completed hardware repair.
            </p>
            <button
              onClick={onRegisterClick}
              className="for-tech-calc-apply-btn"
            >
              Join Our Network
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        {/* 6 PLATFORM ADVANTAGES */}
        <div className="for-tech-section-block">
          <div className="for-tech-section-header">
            <span className="for-tech-section-tag">
              WHY TOP TECHNICIANS CHOOSE US
            </span>
            <h2 className="for-tech-section-h2">
              Built to Protect Honest Craftsmanship
            </h2>
          </div>

          <div className="for-tech-benefits-grid">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div 
                  key={i}
                  className="tech-card for-tech-benefit-card"
                >
                  <div 
                    className="for-tech-benefit-icon-box"
                    style={{
                      background: `${b.color}15`,
                      color: b.color
                    }}
                  >
                    <Icon size={22} strokeWidth={2.4} />
                  </div>
                  <h3 className="for-tech-benefit-title">
                    {b.title}
                  </h3>
                  <p className="for-tech-benefit-desc">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 STAGE ONBOARDING ROADMAP */}
        <div className="for-tech-roadmap-card">
          <div className="for-tech-section-header">
            <span className="for-tech-section-tag">
              FAST-TRACK ONBOARDING
            </span>
            <h2 className="for-tech-section-h2">
              How to Get Verified in 48 Hours
            </h2>
          </div>

          <div className="for-tech-roadmap-grid">
            {steps.map((st, i) => (
              <div 
                key={i}
                className="for-tech-roadmap-step"
              >
                <div>
                  <div className="for-tech-roadmap-num">
                    {st.num}
                  </div>
                  <div className="for-tech-roadmap-tag">
                    {st.tag}
                  </div>
                  <h4 className="for-tech-roadmap-title">
                    {st.title}
                  </h4>
                  <p className="for-tech-roadmap-desc">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM CALLOUT */}
        <div className="for-tech-bottom-callout">
          <h2 className="for-tech-callout-h2">
            Ready to Build a High-Reputation Repair Business?
          </h2>
          <p className="for-tech-callout-p">
            Join our certified network today. Verified workshops gain access to high-margin motherboard orders immediately.
          </p>

          <div className="for-tech-cta-group">
            <button
              onClick={onRegisterClick}
              className="for-tech-callout-btn-primary"
            >
              Start Technician Application
              <ArrowRight size={17} />
            </button>
            <button
              onClick={onLoginClick}
              className="for-tech-callout-btn-secondary"
            >
              Existing Technician Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
