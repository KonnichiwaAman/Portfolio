import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import { motion, useMotionValue, animate } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  const isMobile = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Ensure testimonials array is valid
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Auto-scroll animation for desktop and mobile
  useEffect(() => {
    if (!isDragging) {
      // Get current x value to resume from there
      const currentX = x.get();
      
      // Calculate remaining distance and duration to maintain constant speed
      // Total distance is -1000 (arbitrary unit from previous code, likely needs adjustment based on content width)
      // But for seamless loop, we need to know the content width.
      // For now, let's just resume animation from current position
      
      const controls = animate(x, [currentX, currentX - 1000], {
        duration: isMobile ? 10 : 100,
        repeat: Infinity,
        ease: "linear",
      });
      return controls.stop;
    }
  }, [x, isDragging, isMobile]);

  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0",
      className
    )}>
      <motion.div 
        className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="section-heading">
            {title}
          </h2>
          <div className="section-divider" aria-hidden="true"></div>
          <p className="section-description">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden" ref={constraintsRef}>
          {isMobile ? (
            <motion.div 
              className="flex gap-4 p-2 cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -testimonials.length * 350, right: 0 }}
              dragElastic={0.1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
              style={{ x }}
            >
              {/* Original set */}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`mobile-${i}`}
                  {...testimonial}
                />
              ))}
              {/* Duplicate set for seamless loop */}
              {testimonials.map((testimonial, i) => (
                <TestimonialCard 
                  key={`mobile-duplicate-${i}`}
                  {...testimonial}
                />
              ))}
            </motion.div>
          ) : (
            <div className="group flex overflow-hidden p-2 [--gap:1rem] gap-4 flex-row [--duration:40s]">
              <div className="flex shrink-0 justify-around gap-4 animate-marquee flex-row group-hover:[animation-play-state:paused]">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`original-${i}`}
                    {...testimonial}
                  />
                ))}
              </div>
              <div className="flex shrink-0 justify-around gap-4 animate-marquee flex-row group-hover:[animation-play-state:paused]" aria-hidden="true">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`duplicate-${i}`}
                    {...testimonial}
                  />
                ))}
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </motion.div>
    </section>
  )
}
