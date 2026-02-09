import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '20px'
}) => {
  const baseClasses = 'relative overflow-hidden bg-white/5';

  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

// Quote Loading Skeleton
export const QuoteLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <SkeletonLoader width="120px" height="24px" />
        <SkeletonLoader width="80px" height="24px" />
      </div>
      <SkeletonLoader width="100%" height="60px" />
      <div className="flex gap-4">
        <SkeletonLoader width="50%" height="40px" />
        <SkeletonLoader width="50%" height="40px" />
      </div>
      <SkeletonLoader width="70%" height="32px" />
    </div>
  );
};
