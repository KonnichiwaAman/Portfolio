import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, Orbit } from 'lucide-react';
import { toolkit, ToolCategory } from '@/data/toolkit';
import { ToolkitOrbit } from '@/components/ToolkitOrbit';
import { ToolkitList } from '@/components/ToolkitList';
import { cn } from '@/lib/utils';

const Uses = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const [viewMode, setViewMode] = useState<'orbit' | 'list'>('orbit');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Force list view on mobile or reduced motion
  const effectiveViewMode = isMobile || prefersReducedMotion ? 'list' : viewMode;

  return (
    <section 
      id="uses" 
      ref={sectionRef} 
      className="relative py-24 px-6 cv-auto scroll-mt-28"
      aria-label="Tools and Technology Section"
    >
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-500 ${isVisible ? 'animate-smooth-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="section-heading">Toolkit for AI/ML</h2>
            <div className="section-divider"></div>
            <p className="section-description">Core stack and AI/ML/GenAI tools I use to build, train, and deploy.</p>
          </div>

          {/* View mode toggle (hidden on mobile/reduced-motion) */}
          {!isMobile && !prefersReducedMotion && (
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
                <Button
                  variant={viewMode === 'orbit' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('orbit')}
                  className="gap-2"
                  aria-label="Orbit view"
                >
                  <Orbit className="h-4 w-4" />
                  Orbit
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                  List
                </Button>
              </div>
            </div>
          )}

          {/* Toolkit content */}
          <div id="toolkit-content" role="tabpanel" aria-label="All tools">
            {effectiveViewMode === 'orbit' ? (
              <ToolkitOrbit tools={toolkit} />
            ) : (
              <ToolkitList tools={toolkit} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Uses;
