import { useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SEO from '@/components/SEO';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { SectionLoadingFallback } from '@/components/ui/loading-states';
import { Footer } from '@/components/ui/footer-section';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load heavy components
const ParticleBackground = lazy(() => import('@/components/ParticleBackground'));
const ChessPlaying = lazy(() => import('@/components/ChessPlaying'));
const RecentFavorite = lazy(() => import('@/components/RecentFavorite'));
const About = lazy(() => import('@/components/About'));
const Skills = lazy(() => import('@/components/Skills'));
const Projects = lazy(() => import('@/components/Projects'));
const Testimonials = lazy(() => import('@/components/Testimonials'));
const Pricing = lazy(() => import('@/components/Pricing'));
const Contact = lazy(() => import('@/components/Contact'));

const Index = () => {
  const mainRef = useRef<HTMLElement>(null);

  const handleAnchorClick = useCallback((e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    const targetEl = document.querySelector(hash) as HTMLElement | null;
    if (!targetEl) return;
    e.preventDefault();
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    // Smooth scrolling only for internal anchor links
    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [handleAnchorClick]);

  const isMobile = useIsMobile();
  
  return (
    <>
      <SEO />
      {!isMobile && <Navbar />}
      <main id="main" ref={mainRef} className="relative bg-background text-foreground overflow-x-hidden" tabIndex={-1}>
        <Suspense fallback={<div className="fixed inset-0 bg-background/50" />}>
          <ParticleBackground />
        </Suspense>
        <Hero />
        <SectionErrorBoundary sectionName="About">
          <Suspense fallback={<SectionLoadingFallback title="About" />}>
            <About />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Skills">
          <Suspense fallback={<SectionLoadingFallback title="Skills" />}>
            <Skills />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Projects">
          <Suspense fallback={<SectionLoadingFallback title="Projects" />}>
            <Projects />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Testimonials">
          <Suspense fallback={<SectionLoadingFallback title="Testimonials" />}>
            <Testimonials />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Pricing">
          <Suspense fallback={<SectionLoadingFallback title="Pricing" />}>
            <Pricing />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Contact">
          <Suspense fallback={<SectionLoadingFallback title="Contact" />}>
            <Contact />
          </Suspense>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Footer">
          <Suspense fallback={<SectionLoadingFallback />}>
            <Footer />
          </Suspense>
        </SectionErrorBoundary>
      </main>
    </>
  );
};

export default Index;
