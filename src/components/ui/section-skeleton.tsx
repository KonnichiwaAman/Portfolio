import { memo } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SectionSkeletonProps {
  title?: string;
  className?: string;
}

const SectionSkeleton = memo(({ title = 'Loading section', className }: SectionSkeletonProps) => {
  return (
    <section
      aria-label={`${title} loading placeholder`}
      className={cn('relative isolate overflow-hidden py-20 px-6 min-h-[400px] flex items-center justify-center', className)}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">{title ? `Loading ${title}...` : 'Loading...'}</p>
      </div>
    </section>
  );
});

SectionSkeleton.displayName = 'SectionSkeleton';

export { SectionSkeleton };
