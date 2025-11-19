import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import { motion } from "framer-motion"

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
  // Ensure testimonials array is valid
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

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

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
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
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </motion.div>
    </section>
  )
}
