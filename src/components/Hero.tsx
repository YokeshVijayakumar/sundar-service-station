import React from 'react';
import { Star, ArrowRight, Shield, Clock } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useApiData } from '../hooks/useApiData';
import { publicApi } from '../services/api';
import { Stat } from '../types';

interface HeroProps {
  onBookNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookNow }) => {
  const { config } = useSiteConfig();
  const heroConfig = config?.hero || {
    title: 'SUNDAR SERVICE',
    titleAccent: 'STATION',
    subtitle: 'Experience premium car detailing with our professional ceramic coating, paint protection film, and luxury interior cleaning services. Your vehicle deserves the Sundar treatment.',
    backgroundImage: 'https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
  };

  const { data: stats } = useApiData<Stat[]>(
    () => publicApi.getStats(),
    []
  );

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroConfig.backgroundImage}
          alt="Luxury car detailing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-red-900/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {heroConfig.title}{' '}
            <span className="block text-red-500">{heroConfig.titleAccent}</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            {heroConfig.subtitle}
          </p>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mb-10">
              {stats.map((stat) => (
                <div key={stat._id || stat.key} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-red-500">{stat.value}</div>
                  <div className="text-white text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onBookNow}
              className="group bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span>Book Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <a
              href="#services"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
            >
              View Services
            </a>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center space-x-2 text-white">
              <Shield className="h-5 w-5 text-red-500" />
              <span>Lifetime Warranty</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Clock className="h-5 w-5 text-red-500" />
              <span>Same Day Service</span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <div className="flex text-red-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;