import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'text' | 'circle' | 'image' | 'hero';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'card', count = 1, className = '' }) => {
  const skeletons = Array.from({ length: count });

  if (variant === 'hero') {
    return (
      <div className={`min-h-screen bg-gray-900 flex items-center justify-center ${className}`}>
        <div className="max-w-4xl mx-auto px-4 text-center animate-pulse">
          <div className="h-16 bg-gray-800 rounded-lg w-3/4 mx-auto mb-6"></div>
          <div className="h-8 bg-gray-800 rounded-lg w-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-800 rounded-lg w-2/3 mx-auto mb-10"></div>
          <div className="flex justify-center gap-8 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="text-center">
                <div className="h-10 w-20 bg-gray-800 rounded mx-auto mb-2"></div>
                <div className="h-4 w-24 bg-gray-800 rounded mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <div className="h-14 w-40 bg-gray-800 rounded-full"></div>
            <div className="h-14 w-40 bg-gray-800 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'image') {
    return (
      <div className={`animate-pulse ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="h-64 bg-gray-800 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="h-4 bg-gray-800 rounded w-full"></div>
        ))}
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={`animate-pulse flex gap-4 ${className}`}>
        {skeletons.map((_, i) => (
          <div key={i} className="h-16 w-16 bg-gray-800 rounded-full"></div>
        ))}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`grid md:grid-cols-2 gap-8 ${className}`}>
      {skeletons.map((_, i) => (
        <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-64 bg-gray-800"></div>
          <div className="p-6 space-y-4">
            <div className="h-6 bg-gray-800 rounded w-3/4"></div>
            <div className="h-4 bg-gray-800 rounded w-full"></div>
            <div className="h-4 bg-gray-800 rounded w-2/3"></div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="h-4 bg-gray-800 rounded"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-800 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
