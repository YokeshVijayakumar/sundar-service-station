import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useApiData } from '../hooks/useApiData';
import { publicApi } from '../services/api';
import { Testimonial, Stat } from '../types';
import LoadingSkeleton from './LoadingSkeleton';
import FeedbackForm from './FeedbackForm';

const Testimonials: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: testimonials, loading: loadingTestimonials } = useApiData<Testimonial[]>(
    () => publicApi.getTestimonials(),
    []
  );

  const { data: stats } = useApiData<Stat[]>(
    () => publicApi.getStats(),
    []
  );

  const items = testimonials || [];

  const nextSlide = () => {
    if (items.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % items.length);
    }
  };

  const prevSlide = () => {
    if (items.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
    }
  };

  useEffect(() => {
    if (items.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [items.length]);

  if (loadingTestimonials) {
    return (
      <section id="testimonials" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Our Clients Say
            </h2>
          </div>
          <LoadingSkeleton variant="text" count={5} />
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. See what our satisfied customers have to say about 
            their experience with Sundar Service Station.
          </p>
        </div>

        {/* Testimonials Carousel */}
        {items.length > 0 && (
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="bg-black border border-gray-800 rounded-2xl p-8 md:p-12 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <Quote className="h-12 w-12 text-red-600 opacity-50" />
                <div className="flex space-x-2">
                  {[...Array(items[currentSlide]?.rating || 5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-6 w-6 text-red-500 fill-current" 
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-6">
                  "{items[currentSlide]?.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {items[currentSlide]?.image ? (
                      <img
                        src={items[currentSlide].image}
                        alt={items[currentSlide].name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-red-600/20 border-2 border-red-600 flex items-center justify-center text-white font-bold text-xl">
                        {items[currentSlide]?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-white">
                        {items[currentSlide]?.name}
                      </h4>
                      {items[currentSlide]?.location && (
                        <p className="text-gray-400 text-sm">
                          {items[currentSlide].location}
                        </p>
                      )}
                      <p className="text-red-500 text-sm font-medium">
                        {items[currentSlide]?.service}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-sm">
                      {items[currentSlide]?.date}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              {items.length > 1 && (
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevSlide}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Dots */}
                  <div className="flex space-x-2">
                    {items.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                          index === currentSlide ? 'bg-red-600' : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextSlide}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Feedback Form Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <FeedbackForm />
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className={`grid md:grid-cols-${Math.min(stats.length, 4)} gap-8 mt-16`}>
            {stats.map((stat) => (
              <div key={stat._id || stat.key} className="text-center">
                <div className="text-4xl font-bold text-red-500 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;