import React from 'react';
import { Shield, Sparkles, Car, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { publicApi } from '../services/api';
import LoadingSkeleton from './LoadingSkeleton';
import { Service } from '../types';

interface ServicesProps {
  onBookService: (service: string) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Shield,
  Sparkles,
  Car,
  Droplets,
};

const Services: React.FC<ServicesProps> = ({ onBookService }) => {
  const { data, loading, error } = useApiData<{
    mainServices: Service[];
    additionalServices: Service[];
  }>(() => publicApi.getServices(), []);

  if (loading) {
    return (
      <section id="services" className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Services
            </h2>
          </div>
          <LoadingSkeleton variant="card" count={4} />
        </div>
      </section>
    );
  }

  const mainServices = data?.mainServices || [];
  const additionalServices = data?.additionalServices || [];

  return (
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Premium Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our expert team delivers exceptional results using the finest products and cutting-edge techniques 
            to protect and enhance your vehicle's appearance.
          </p>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-8 bg-red-600/10 border border-red-600/30 p-4 rounded-xl">
            Unable to load services dynamically. Please try again later.
          </div>
        )}

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {mainServices.map((service) => {
            const IconComponent = iconMap[service.icon] || Shield;
            return (
              <div key={service._id || service.serviceId} className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:border-red-600/50 transition-all duration-300 group">
                {service.popular && (
                  <div className="absolute top-6 right-6 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Most Popular
                  </div>
                )}
                
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-6 text-white">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-red-600 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">{service.name}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="font-semibold text-red-400">{service.price}</span>
                      <span>• {service.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {(service.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onBookService(service.name)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 group"
                  >
                    <span>Book This Service</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Services */}
        {additionalServices.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Additional Services</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {additionalServices.map((addService) => {
                const IconComp = iconMap[addService.icon] || Shield;
                return (
                  <div key={addService._id || addService.serviceId} className="text-center">
                    <div className="bg-red-600/20 border border-red-600/30 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <IconComp className="h-8 w-8 text-red-500" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{addService.name}</h4>
                    <p className="text-gray-400 text-sm mb-2">{addService.description}</p>
                    <p className="text-red-500 font-semibold">{addService.price}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;