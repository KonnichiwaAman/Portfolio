import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SkipToContentProps {
  targetId?: string;
  className?: string;
}

/**
 * Keyboard-accessible skip link to satisfy WCAG 2.4.1 (Bypass Blocks).
 */
const SkipToContent = memo(({ targetId = 'main', className }: SkipToContentProps) => {
  const handleClick = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus({ preventScroll: false });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        'sr-only focus:not-sr-only focus-visible:ring focus-visible:ring-primary focus-visible:outline-none',
        'fixed left-4 top-4 z-[9999] rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform',
        'focus:translate-y-0',
        className
      )}
    >
      Skip to main content
    </a>
  );
});

SkipToContent.displayName = 'SkipToContent';

export default SkipToContent;
