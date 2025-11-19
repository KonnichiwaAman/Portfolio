import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';
import OptimizedImage from '@/components/ui/optimized-image';
import { Volume2, VolumeX, SkipBack, SkipForward, Play, Pause } from 'lucide-react';

const RecentFavorite = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Initialize audio when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = true;
      audioRef.current.currentTime = 60;
      audioRef.current.loop = true;
      audioRef.current.load();
      
      // Start playing automatically
      audioRef.current.play().catch(error => {
        console.error('Autoplay failed:', error);
        setIsPlaying(false);
      });
    }
  }, []);

    // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          // Ensure audio is loaded and at the right position before playing
          if (audioRef.current.readyState === 0) {
            await audioRef.current.load();
          }
          if (audioRef.current.currentTime < 60) {
            audioRef.current.currentTime = 60;
          }
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      audioRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      audioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
      if (newMutedState) {
        setVolume(0);
      } else {
        setVolume(0.5);
      }
    }
  };

  const handlePrevious = async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 60;
      if (!isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const handleNext = async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 60;
      if (!isPlaying) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-6 sm:p-8 group hover:border-primary/30 group-hover:bg-card/60 transition-all duration-500">
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
        
        {/* Animated border effect */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-gradient-shift"></div>
        </div>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.03] transition-opacity duration-500">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Now Playing</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-500 font-medium">Live</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-primary to-accent rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500 animate-glow-pulse"></div>
              <div className="relative w-32 h-32 rounded-xl overflow-hidden glass-effect-strong hover:scale-105 transition-transform duration-500">
                <OptimizedImage
                  src="/weightless.png"
                  alt="Weightless album cover art"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Weightless</h4>
              <p className="text-muted-foreground">Marconi Union</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Ambient Music • 8:10</p>
            </div>
          </div>
          
          {/* Music Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-50"></div>
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-progress"></div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary hover:[&::-webkit-slider-thumb]:bg-primary/80 transition-colors duration-200"
                  aria-label="Volume control"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevious}
                  className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-5 h-5 text-muted-foreground" />
                </button>
                
                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 hover:scale-110 shadow-lg shadow-primary/20"
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>
                
                <button
                  onClick={handleNext}
                  className="p-2 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                  aria-label="Next track"
                >
                  <SkipForward className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        src="/api/audio"
        loop
        preload="metadata"
      />
    </motion.div>
  );
};

export default RecentFavorite;
