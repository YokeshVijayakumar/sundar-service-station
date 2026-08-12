import React from 'react';
import { Car, Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">SUNDAR SERVICE STATION</h3>
                <p className="text-gray-400 text-sm">Premium Car Detailing</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Los Angeles' premier car detailing service station specializing in ceramic coating, 
              paint protection film, and luxury vehicle care. Experience the difference 
              that 15+ years of expertise makes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-sm">123 Premium Auto Plaza, Los Angeles, CA 90210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-sm">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-sm">info@sundarservicestation.com</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Ceramic Coating</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Paint Protection Film</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Interior Deep Clean</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Complete Detail Package</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Paint Correction</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Headlight Restoration</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Book Appointment</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Our Process</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Gallery</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Contact</a></li>
              <li><a href="#" className="text-gray-300 hover:text-red-400 transition-colors duration-200">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4 text-center md:text-left">Follow Us</h4>
              <div className="flex space-x-4 justify-center md:justify-start">
                <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-200">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="bg-gray-800 hover:bg-red-600 p-3 rounded-full transition-colors duration-200">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="text-center md:text-right">
              <h4 className="font-semibold mb-4">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} Sundar Service Station. All rights reserved. | 
            <a href="#" className="hover:text-red-400 ml-1">Privacy Policy</a> | 
            <a href="#" className="hover:text-red-400 ml-1">Terms of Service</a>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Licensed & Insured</span>
            <span>•</span>
            <span>BBB A+ Rated</span>
            <span>•</span>
            <span>Eco-Friendly Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;