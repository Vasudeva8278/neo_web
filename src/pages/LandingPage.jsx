import React from 'react';
import Hero from '../Landing/Hero.tsx';
import TrustedCompanies from '../Landing/TrustedCompanies.tsx';
import Pricing from '../Landing/Pricing.tsx';
import Features from '../Landing/Features.tsx';
import Footer from '../Landing/Footer.tsx';
import Colletion from '../Landing/Collection.tsx';
import Explore from '../Landing/Explore.tsx';
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustedCompanies />
      <Pricing />
      <Features />
       <Explore />
      <Colletion />
      <Footer />
    </div>
  );
}

export default LandingPage;