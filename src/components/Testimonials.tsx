import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee"
import { memo } from 'react';

const testimonials = [
  {
    author: {
      name: "Manik Thapa",
      handle: "@manikthapa",
      avatar: "/manik.png"
    },
    text: "Aman is an exceptional developer who consistently delivers high-quality work. His attention to detail is impressive."
  },
  {
    author: {
      name: "Emma Thompson",
      handle: "@emmaai",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Using this AI platform has transformed how we handle data analysis. The speed and accuracy are unprecedented.",
    href: "https://twitter.com/emmaai"
  },
  {
    author: {
      name: "David Park",
      handle: "@davidtech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The API integration is flawless. We've reduced our development time by 60% since implementing this solution.",
    href: "https://twitter.com/davidtech"
  },
  {
    author: {
      name: "Sofia Rodriguez",
      handle: "@sofiaml",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, an AI tool that actually understands context! The accuracy in natural language processing is impressive."
  },
  {
    author: {
      name: "James Mitchell",
      handle: "@jamesmit",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Outstanding performance and reliability. This has become an essential part of our ML pipeline.",
    href: "https://twitter.com/jamesmit"
  },
  {
    author: {
      name: "Maya Patel",
      handle: "@mayacode",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    text: "The documentation is crystal clear and the support team is incredibly responsive. Best developer experience I've had.",
    href: "https://twitter.com/mayacode"
  },
  {
    author: {
      name: "Alex Chen",
      handle: "@alexdata",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Incredible results with minimal setup. The AI models are state-of-the-art and extremely accurate."
  },
  {
    author: {
      name: "Sarah Johnson",
      handle: "@sarahdev",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    },
    text: "The real-time collaboration features have revolutionized our team's workflow. Highly recommended!"
  },
  {
    author: {
      name: "Michael Roberts",
      handle: "@mikeroberts",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Outstanding platform with incredible scalability. Our production load increased 10x with zero issues."
  },
  {
    author: {
      name: "Priya Sharma",
      handle: "@priyatech",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    text: "Best investment we've made in our tech stack. The ROI was visible within the first month."
  },
  {
    author: {
      name: "Daniel Lee",
      handle: "@danlee",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face"
    },
    text: "Seamless integration and exceptional support. The team went above and beyond to help us succeed."
  },
  {
    author: {
      name: "Lisa Anderson",
      handle: "@lisacode",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
    },
    text: "The automation capabilities saved us hundreds of hours. A true game-changer for our operations."
  },
  {
    author: {
      name: "Ryan Garcia",
      handle: "@ryandev",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "Incredibly intuitive interface with powerful features. Our team was productive from day one."
  },
  {
    author: {
      name: "Nina Patel",
      handle: "@ninaml",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "The analytics and insights provided are invaluable. We make better decisions faster now."
  },
  {
    author: {
      name: "Tom Wilson",
      handle: "@tomwilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "Excellent performance even under heavy load. The infrastructure is rock solid and reliable."
  }
]

const Testimonials = memo(() => {
  try {
    return (
      <div id="testimonials">
        <TestimonialsSection
          title="Trusted by developers worldwide"
          description="Join thousands of developers who are already building the future with AI"
          testimonials={testimonials}
          className="scroll-mt-28"
        />
      </div>
    );
  } catch (error) {
    console.error('Error rendering Testimonials:', error);
    // Return a fallback instead of nothing
    return (
      <div id="testimonials" className="py-12 sm:py-24 md:py-32">
        <div className="text-center px-4">
          <h2 className="section-heading">Trusted by developers worldwide</h2>
          <div className="section-divider mx-auto" aria-hidden="true"></div>
          <p className="section-description">Join thousands of developers who are already building the future with AI</p>
        </div>
      </div>
    );
  }
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;

