import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/optimized-image';

interface ProfilePictureProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-24 h-24',
  md: 'w-32 h-32',
  lg: 'w-40 h-40',
  xl: 'w-48 h-48'
};

const ProfilePicture = ({ className, size = 'md' }: ProfilePictureProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative group',
        sizeClasses[size],
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500 animate-glow-pulse" />
      
      {/* Border gradient */}
      <div className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-gradient-shift rounded-full" />
      </div>

      {/* Profile picture container */}
      <div 
        className="relative w-full h-full rounded-full overflow-hidden select-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        <OptimizedImage
          src="/profile.png"
          alt="Aman Awasthi"
          width={size === 'xl' ? 192 : size === 'lg' ? 160 : size === 'md' ? 128 : 96}
          height={size === 'xl' ? 192 : size === 'lg' ? 160 : size === 'md' ? 128 : 96}
          className="w-full h-full object-cover transition-all duration-500 filter grayscale group-hover:grayscale-0 pointer-events-none"
          draggable={false}
        />
        {/* Transparent overlay for extra protection */}
        <div className="absolute inset-0 z-10" aria-hidden="true" />
      </div>
    </motion.div>
  );
};

export default ProfilePicture; 