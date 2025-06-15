import React from 'react';
import Hero from '../Landing/Hero.tsx';
import TrustedCompanies from '../Landing/TrustedCompanies.tsx';
import Pricing from '../Landing/Pricing.tsx';
import Features from '../Landing/Features.tsx';
import Footer from '../Landing/Footer.tsx';
function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustedCompanies />
      <Pricing />
      <Features />
      <Footer />
    </div>
  );
}

export default LandingPage;