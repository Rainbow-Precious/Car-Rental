import React from "react";
import Navigation from "../../components/HomePage/Navigation/Navigation";
import HeroSection from "../../components/HomePage/HeroSection";
import FeaturesSection from "../../components/HomePage/FeaturesSection";
import WhyChooseSection from "../../components/HomePage/WhyChooseSection";
import Footer from "../../components/HomePage/Footer";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex justify-center text-white font-sans">
      <div className="max-w-5xl w-full bg-black">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <WhyChooseSection />
        <Footer />
      </div>
    </div>
  );
}
