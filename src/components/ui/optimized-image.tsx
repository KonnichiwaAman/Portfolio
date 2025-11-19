import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  responsive?: boolean; // generate srcSet variants for local images
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  className,
  onLoad,
  onError,
  responsive = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    // Fallback to a placeholder or default image
    setImgSrc('/images/placeholder.jpg');
    onError?.();
  }, [onError]);

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    if (!responsive) return undefined;
    if (!baseSrc.includes('http')) {
      const extension = baseSrc.split('.').pop();
      const basePath = baseSrc.replace(`.${extension}`, '');
      return [
        `${basePath}-400w.${extension} 400w`,
        `${basePath}-800w.${extension} 800w`,
        `${basePath}-1200w.${extension} 1200w`,
        `${basePath}-1600w.${extension} 1600w`,
      ].join(', ');
    }
    return undefined;
  };

  const srcSet = generateSrcSet(imgSrc);

  // Detect if on mobile for optimized image loading
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ width, height }}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 bg-center bg-cover filter blur-sm"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
          }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Main image */}
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        srcSet={srcSet}
        sizes={isMobile 
          ? "(max-width: 640px) 100vw, 400px"
          : "(max-width: 640px) 400px, (max-width: 1024px) 800px, (max-width: 1280px) 1200px, 1600px"
        }
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'low'}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          hasError && 'opacity-50'
        )}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: isLoaded ? 'auto' : 'opacity',
        }}
      />

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded" />
            <p className="text-sm">Image failed to load</p>
          </div>
        </div>
      )}
    </div>
  );
};

export { OptimizedImage };
export default OptimizedImage;
