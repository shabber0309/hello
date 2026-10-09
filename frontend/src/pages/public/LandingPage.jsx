import React from 'react';
import { 
  ShieldCheck, 
  Video, 
  Lock, 
  Wrench, 
  ArrowRight, 
  Radio, 
  IndianRupee,
  Eye
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ 
  onStartBooking, 
  onBecomeTechnician,
  onSeeHowItWorks
}) {
  const trustIndicators = [
    {
      icon: ShieldCheck,
      title: 'Verified Technicians',
      desc: 'Background and skill verification',
      bgGrad: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      topBorder: '#10b981',
      glow: '0 4px 14px rgba(16, 185, 129, 0.4)'
    },
    {
      icon: IndianRupee,
      title: 'Transparent Pricing',
      desc: 'Compare offers before accepting',
      bgGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      topBorder: '#2563eb',
      glow: '0 4px 14px rgba(37, 99, 235, 0.4)'
    },
    {
      icon: Video,
      title: 'Live Repair Sessions',
      desc: 'Watch the repair through video',
      bgGrad: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      topBorder: '#8b5cf6',
      glow: '0 4px 14px rgba(139, 92, 246, 0.4)'
    },
    {
      icon: Eye,
      title: 'Live Camera Oversight',
      desc: 'Full transparency during diagnosis & rework',
      bgGrad: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      topBorder: '#0284c7',
      glow: '0 4px 14px rgba(6, 182, 212, 0.4)'
    }
  ];

  const sixSteps = [
    { num: '1', title: 'Describe Your Problem', desc: 'Tell us your laptop brand, model, issue, and expected repair budget.', grad: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { num: '2', title: 'Get Matched With Technicians', desc: 'Your request is shared with verified technicians who can service your device.', grad: 'linear-gradient(135deg, #06b6d4, #0284c7)' },
    { num: '3', title: 'Compare & Accept Offers', desc: 'Technicians can accept your budget or send their own repair quote.', grad: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    { num: '4', title: 'Secure Pickup', desc: 'Your laptop is safely collected and tracked during transportation.', grad: 'linear-gradient(135deg, #f97316, #ea580c)' },
    { num: '5', title: 'Watch the Repair Live', desc: 'Join a video session and watch the technician diagnose and repair your laptop.', grad: 'linear-gradient(135deg, #10b981, #059669)' },
    { num: '6', title: 'Get It Back Safely', desc: 'Your repaired laptop is quality certified and delivered back to you.', grad: 'linear-gradient(135deg, #6366f1, #4338ca)' }
  ];

  return (
    <div className="landing-root">
      {/* 1. Hero Section */}
      <section className="landing-hero-section">
        <div className="container">
          <div className="landing-hero-grid row align-items-center g-4">
            {/* Left Headline Column */}
            <div className="landing-headline-col col-12 col-lg-6">
              <h1 className="landing-h1">
                Laptop Repair, <br />
                <span className="landing-gradient-text">
                  Without the Guesswork.
                </span>
              </h1>

              <p className="landing-hero-desc">
                Connect with verified technicians, get transparent repair estimates, track your device at every step, and watch your repair happen live on camera.
              </p>

              <div className="landing-hero-cta-group d-flex flex-wrap gap-3">
                <button 
                  className="btn btn-cta landing-cta-btn"
                  onClick={onStartBooking}
                >
                  Get Your Laptop Repaired
                  <ArrowRight size={16} />
                </button>

                <button 
                  className="btn btn-secondary landing-secondary-btn"
                  onClick={onBecomeTechnician}
                >
                  <Wrench size={15} color="var(--primary)" />
                  Become a Technician
                </button>
              </div>
            </div>

            {/* Right Column: Exploded Laptop Graphic */}
            <div className="col-12 col-lg-6">
              <div className="landing-hero-preview-card card shadow-lg border-0 overflow-hidden">
                <img 
                  src="/hero_laptop.jpg" 
                  alt="Laptop Diagnostics"
                  className="landing-hero-img img-fluid w-100"
                />

                <div className="landing-stream-badge">
                  <Radio size={12} color="#ef4444" />
                  <span>Live Microscope Stream</span>
                </div>

                <div className="landing-serial-badge">
                  <ShieldCheck size={14} /> Serial Numbers Matched Live on Camera
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Indicators with Rich Colors */}
      <section className="landing-trust-section py-4">
        <div className="container">
          <div className="landing-trust-grid row g-4">
            {trustIndicators.map((t, idx) => {
              const Icon = t.icon;
              return (
                <div key={idx} className="col-12 col-sm-6 col-lg-3">
                  <div 
                    className="landing-trust-card card h-100 p-4" 
                    style={{ borderTop: `4px solid ${t.topBorder}` }}
                  >
                    <div 
                      className="landing-trust-icon-box mb-3"
                      style={{ background: t.bgGrad, boxShadow: t.glow }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="landing-trust-title h5 mb-2">{t.title}</h3>
                    <p className="landing-trust-desc small mb-0">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. How Live Fix Works (6 Steps with Colored Badges) */}
      <section className="landing-steps-section py-5">
        <div className="container">
          <div className="landing-section-header text-center mb-5">
            <h2 className="landing-section-h2 mb-2">How Live Fix Works</h2>
            <p className="landing-section-sub">
              6 transparent steps from request to delivery.
            </p>
          </div>

          <div className="landing-steps-grid row g-4">
            {sixSteps.map((s, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div className="landing-step-card card h-100 p-4">
                  <div 
                    className="landing-step-num mb-3"
                    style={{ background: s.grad }}
                  >
                    {s.num}
                  </div>
                  <h3 className="landing-step-title h5 mb-2">{s.title}</h3>
                  <p className="landing-step-desc small mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom Trust Callout */}
      <section className="landing-callout-section py-4">
        <div className="container">
          <div className="landing-callout-box card text-center p-4 p-md-5">
            <h2 className="landing-callout-h2 mb-3">
              Your Device. Your Control.
            </h2>
            <p className="landing-callout-p mb-4">
              No hidden repairs, unexpected charges, or opening your laptop without your approval.
            </p>
            <div className="d-flex justify-content-center">
              <button 
                className="btn btn-primary landing-callout-btn" 
                onClick={onSeeHowItWorks}
              >
                See How It Works <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
