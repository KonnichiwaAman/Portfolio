import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  variant?: 'default' | 'dots' | 'pulse' | 'bars';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)}>
        <div className={cn('bg-primary rounded-full animate-bounce', 
          size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
        )} style={{ animationDelay: '0ms' }}></div>
        <div className={cn('bg-primary rounded-full animate-bounce', 
          size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
        )} style={{ animationDelay: '150ms' }}></div>
        <div className={cn('bg-primary rounded-full animate-bounce', 
          size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'
        )} style={{ animationDelay: '300ms' }}></div>
        {text && (
          <span className={cn('ml-3 text-muted-foreground', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn('bg-primary rounded-full animate-pulse', sizeClasses[size])}></div>
        {text && (
          <span className={cn('ml-3 text-muted-foreground', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)}>
        <div className={cn('bg-primary animate-pulse', 
          size === 'sm' ? 'w-1 h-4' : size === 'lg' ? 'w-2 h-8' : 'w-1.5 h-6'
        )} style={{ animationDelay: '0ms' }}></div>
        <div className={cn('bg-primary animate-pulse', 
          size === 'sm' ? 'w-1 h-4' : size === 'lg' ? 'w-2 h-8' : 'w-1.5 h-6'
        )} style={{ animationDelay: '150ms' }}></div>
        <div className={cn('bg-primary animate-pulse', 
          size === 'sm' ? 'w-1 h-4' : size === 'lg' ? 'w-2 h-8' : 'w-1.5 h-6'
        )} style={{ animationDelay: '300ms' }}></div>
        <div className={cn('bg-primary animate-pulse', 
          size === 'sm' ? 'w-1 h-4' : size === 'lg' ? 'w-2 h-8' : 'w-1.5 h-6'
        )} style={{ animationDelay: '450ms' }}></div>
        {text && (
          <span className={cn('ml-3 text-muted-foreground', textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <span className={cn('ml-3 text-muted-foreground', textSizeClasses[size])}>
          {text}
        </span>
      )}
    </div>
  );
};

export { LoadingSpinner };