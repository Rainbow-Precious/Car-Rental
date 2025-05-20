import React from "react";
import Navigation from "../../components/HomePage/Navigation/Navigation";
import HeroSection from "../../components/HomePage/HeroSection";
import FeaturesSection from "../../components/HomePage/FeaturesSection";
import WhyChooseSection from "../../components/HomePage/WhyChooseSection";
import Footer from "../../components/HomePage/Footer";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col text-white font-sans">
      <Navigation />
      <div className="flex justify-center flex-1">
        <div className="max-w-5xl w-full bg-black">
          <HeroSection />
          <FeaturesSection />
          <WhyChooseSection />
        </div>
      </div>
      <Footer />
    </div>
  );
}
