import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { publicApi } from '../services/api';

interface ContactProps {
  selectedService?: string;
}

const Contact: React.FC<ContactProps> = ({ selectedService }) => {
  const { config } = useSiteConfig();
  const contactConfig = config?.contact_info || {};

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: selectedService || '',
    vehicle: '',
    message: '',
    preferredDate: '',
    preferredTime: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const services = [
    'Ceramic Coating',
    'Paint Protection Film',
    'Interior Deep Clean',
    'Complete Detail Package',
    'Headlight Restoration',
    'Engine Bay Cleaning',
    'Scratch Removal',
    'Other'
  ];

  const timeSlots = contactConfig.timeSlots || [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await publicApi.submitBooking(formData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: '',
          vehicle: '',
          message: '',
          preferredDate: '',
          preferredTime: ''
        });
      }, 5000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black border border-gray-800 rounded-2xl p-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Booking Request Submitted!
              </h3>
              <p className="text-gray-300 mb-4">
                Thank you for choosing Sundar Service Station. Your booking has been saved into our system and we will contact you shortly.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book Your Service
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to give your vehicle the premium treatment it deserves? 
            Schedule your appointment today and experience the Sundar Service Station difference.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-black border border-gray-800 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Schedule Your Appointment</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-300 mb-2">
                    Service Needed *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vehicle" className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Information
                  </label>
                  <input
                    type="text"
                    id="vehicle"
                    name="vehicle"
                    value={formData.vehicle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                    placeholder="e.g., 2020 BMW X5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                  />
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 text-white"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time: string) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all duration-200 resize-none text-white"
                  placeholder="Any specific requests or questions about your vehicle..."
                ></textarea>
              </div>

              {errorMsg && (
                <div className="text-red-400 bg-red-600/10 border border-red-600/30 p-3 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-4 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>{loading ? 'Submitting...' : 'Submit Booking Request'}</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Location & Hours */}
            <div className="bg-red-600/10 border border-red-600/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Visit Our Station</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Location</h4>
                    <p className="text-gray-300">
                      {contactConfig.address ? contactConfig.address.join('\n') : '123 Premium Auto Plaza\nDowntown District\nLos Angeles, CA 90210'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Phone</h4>
                    <p className="text-gray-300">{contactConfig.phone || '(555) 123-4567'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Email</h4>
                    <p className="text-gray-300">{contactConfig.email || 'info@sundarservicestation.com'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Hours</h4>
                    <div className="text-gray-300 space-y-1">
                      {contactConfig.hours ? (
                        contactConfig.hours.map((h: { days: string; time: string }, idx: number) => (
                          <p key={idx}>{h.days}: {h.time}</p>
                        ))
                      ) : (
                        <>
                          <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                          <p>Saturday: 8:00 AM - 5:00 PM</p>
                          <p>Sunday: 10:00 AM - 4:00 PM</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-600/20 border border-red-600/50 rounded-2xl p-6">
              <h4 className="font-semibold text-white mb-2">Emergency Service</h4>
              <p className="text-gray-300 text-sm mb-3">
                Need urgent detailing for a special event? We offer same-day emergency services.
              </p>
              <p className="text-red-500 font-semibold">Call: {contactConfig.emergencyPhone || '(555) 123-RUSH'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;