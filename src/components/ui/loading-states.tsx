import { memo } from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LoadingSpinner = memo(({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`} role="status" aria-label="Loading">
      {/* Outer Ring - Subtle */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Spinning Gradient Arc */}
      <motion.div
        className="absolute inset-0 rounded-full border-t-2 border-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
        style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner Counter-Spinning Arc */}
      <motion.div
        className="absolute inset-2 rounded-full border-b-2 border-primary/50"
        style={{ borderTopColor: 'transparent', borderRightColor: 'transparent', borderLeftColor: 'transparent' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Center Pulse */}
      <motion.div
        className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = memo(({ 
  className = '', 
  variant = 'rectangular',
  width,
  height 
}: SkeletonProps) => {
  const baseClasses = 'animate-pulse bg-muted/50';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  const style = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
});

Skeleton.displayName = 'Skeleton';

export const PageLoadingFallback = memo(() => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6">
    <LoadingSpinner size="xl" />
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-muted-foreground text-sm font-light tracking-[0.2em] uppercase"
    >
      Initializing
    </motion.p>
  </div>
));

PageLoadingFallback.displayName = 'PageLoadingFallback';

export const SectionLoadingFallback = memo(({ title }: { title?: string }) => (
  <section className="py-20 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        {title && <Skeleton className="h-12 w-64 mx-auto" />}
        <Skeleton className="h-1 w-32 mx-auto" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4 p-6 border rounded-lg">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
));

SectionLoadingFallback.displayName = 'SectionLoadingFallback';
