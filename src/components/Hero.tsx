import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = memo(() => {
  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section 
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center px-4 sm:px-6 overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background layers with aria-hidden */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-background to-white/5" aria-hidden="true"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]" aria-hidden="true"></div>
      
      {/* Grid pattern with aria-hidden */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}></div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Status indicator with proper ARIA attributes */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full glass-effect-strong border border-white/10 mb-8 sm:mb-12 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            role="status"
            aria-label="Current availability status"
          >
            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-white rounded-full mr-3 sm:mr-4 animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]" aria-hidden="true"></div>
            <span className="text-xs sm:text-sm text-zinc-200 font-semibold tracking-wide">Available for opportunities</span>
          </motion.div>
          
          <div className="mb-8 sm:mb-12">
            <motion.h1 
              variants={itemVariants}
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-4 sm:mb-8 text-white tracking-tight leading-[0.9]" 
              style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em', fontWeight: '900' }}
            >
              Aman Awasthi
            </motion.h1>
            <motion.div 
              variants={itemVariants}
              className="h-16 sm:h-20 mb-8 sm:mb-12 flex items-center justify-center px-2"
            >
              <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl text-zinc-400 font-medium flex items-center text-center leading-tight" role="status">
                AI/ML Engineer & Full Stack Developer
              </p>
            </motion.div>
          </div>
          
          <motion.div variants={itemVariants}>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-zinc-400 mb-8 sm:mb-16 max-w-5xl mx-auto leading-relaxed font-light px-4">
              Python-first <span className="text-white font-semibold">AI/ML engineer</span> and <span className="text-white font-semibold">Web Developer</span> focused on
              <span className="text-white font-semibold"> Generative AI, RAG pipelines,</span>
              and building <span className="text-white font-semibold">high-performance web applications</span>. I combine modern web tech with AI to ship reliable systems.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center mb-12 sm:mb-20"
          >
            <Button 
              size="lg" 
              className="w-auto min-w-[200px] sm:w-auto text-black bg-white hover:bg-zinc-200 px-8 sm:px-12 py-6 sm:py-8 text-lg sm:text-xl rounded-xl sm:rounded-2xl hover-lift group border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.2)] antialiased"
              onClick={() => scrollToSection('projects')}
              aria-label="View projects section"
              style={{ textRendering: 'optimizeLegibility', WebkitFontSmoothing: 'antialiased' } as React.CSSProperties}
            >
              <FolderOpen className="mr-3 sm:mr-4 h-5 w-5 sm:h-7 sm:w-7 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
              View My Projects
            </Button>
            
            <ShinyButton 
              onClick={() => scrollToSection('about')}
              className="w-auto min-w-[200px] sm:w-auto"
            >
              <span className="flex items-center gap-3">
                Explore Portfolio
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </span>
            </ShinyButton>
          </motion.div>

          {/* Scroll indicator with proper ARIA attributes */}
          <motion.div 
            variants={itemVariants}
            className="text-center"
            role="navigation"
            aria-label="Scroll to about section"
          >
            <button 
              className="inline-block animate-bounce transition-transform duration-300" 
              onClick={() => scrollToSection('about')}
              aria-label="Scroll to about section"
            >
              <div className="w-6 sm:w-8 h-10 sm:h-14 border-2 border-white/20 rounded-full flex justify-center relative glass-effect">
                <div className="w-1.5 sm:w-2 h-3 sm:h-4 bg-white rounded-full mt-2 sm:mt-3 animate-pulse" aria-hidden="true"></div>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

export default Hero;