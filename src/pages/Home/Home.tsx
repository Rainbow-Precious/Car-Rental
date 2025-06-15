import React from 'react';
import HeroSection from '../../components/HomePage/HeroSection/HeroSection';
import FeaturesSection from '../../components/HomePage/FeaturesSection/FeaturesSection';
import WhyChooseSection from '../../components/HomePage/WhyChooseSection/WhyChooseSection';
import Footer from '../../components/HomePage/Footer/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
      <Footer />
    </>
  );
}
