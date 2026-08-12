import React, { useState } from 'react';
import { Menu, X, Phone, MapPin, Shield } from 'lucide-react';
import Logo from '../assets/new-logo.png';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  activeSection?: string;
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection = 'home', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { config } = useSiteConfig();
  const headerConfig = config?.header || {
    brandName: 'SUNDAR SERVICE STATION',
    tagline: 'Premium Car Wash & Detailing',
    phone: '(555) 123-4567',
    location: 'Downtown LA'
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-black shadow-md z-50 border-b border-red-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavClick('home')}
          >
            <div className="h-12 w-12">
              <img
                src={Logo}
                alt="SUNDAR SERVICE STATION logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white whitespace-nowrap">
                {headerConfig.brandName}
              </h1>
              <p className="text-xs text-red-400">
                {headerConfig.tagline}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm font-medium transition duration-200 ${
                  activeSection === item.id
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-300 hover:text-red-400'
                }`}
              >
                {item.name}
              </button>
            ))}

            <Link
              to="/admin"
              className="text-xs bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-full border border-red-600/40 transition-colors duration-200 flex items-center gap-1"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin Portal
            </Link>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-red-500" />
              <span>{headerConfig.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>{headerConfig.location}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left text-base font-medium px-4 py-2 rounded-md transition ${
                    activeSection === item.id
                      ? 'bg-red-500/10 text-red-500'
                      : 'text-gray-300 hover:text-red-400 hover:bg-gray-800'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <Link
                to="/admin"
                className="text-left text-base font-medium px-4 py-2 text-red-400 hover:bg-gray-800 rounded-md"
              >
                Admin Portal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
