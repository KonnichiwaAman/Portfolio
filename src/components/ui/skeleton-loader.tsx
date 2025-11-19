import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div 
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
};

// Project Card Skeleton
const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="glass-effect p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex flex-wrap gap-2 mt-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-18 rounded-full" />
      </div>
      <div className="flex gap-4 mt-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

// Skill Card Skeleton
const SkillCardSkeleton: React.FC = () => {
  return (
    <div className="glass-effect p-4 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  );
};

// Hero Section Skeleton
const HeroSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-6xl mx-auto space-y-8">
        <Skeleton className="h-8 w-48 mx-auto rounded-full" />
        <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
        <Skeleton className="h-12 w-32 mx-auto" />
        <Skeleton className="h-6 w-full max-w-4xl mx-auto" />
        <Skeleton className="h-6 w-3/4 max-w-3xl mx-auto" />
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </div>
  );
};

// Contact Form Skeleton
const ContactFormSkeleton: React.FC = () => {
  return (
    <div className="glass-effect p-6 rounded-lg space-y-6">
      <Skeleton className="h-6 w-48" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

// Navigation Skeleton
const NavbarSkeleton: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Skeleton className="h-8 w-24" />
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="md:hidden">
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </nav>
  );
};

// Page Loading Skeleton
const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavbarSkeleton />
      <div className="pt-16">
        <HeroSkeleton />
        <div className="max-w-6xl mx-auto px-4 py-24 space-y-24">
          {/* About Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-64 mx-auto" />
              <Skeleton className="h-1 w-32 mx-auto" />
              <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-6 w-4/5" />
              </div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
          
          {/* Skills Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-48 mx-auto" />
              <Skeleton className="h-1 w-32 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkillCardSkeleton key={i} />
              ))}\n            </div>
          </div>
          
          {/* Projects Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-56 mx-auto" />
              <Skeleton className="h-1 w-32 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
          
          {/* Contact Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-12 w-48 mx-auto" />
              <Skeleton className="h-1 w-32 mx-auto" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContactFormSkeleton />
              </div>
              <div className="space-y-6">
                <div className="glass-effect p-6 rounded-lg space-y-6">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { 
  Skeleton, 
  ProjectCardSkeleton, 
  SkillCardSkeleton, 
  HeroSkeleton, 
  ContactFormSkeleton,
  NavbarSkeleton,
  PageSkeleton 
};