import { Pricing, PricingPlan } from "@/components/ui/pricing";

const plans: PricingPlan[] = [
  {
    name: "CONSULTATION",
    price: "10",
    yearlyPrice: "10",
    period: "per project",
    features: [
      "1 hour of dedicated work",
      "Code reviews & auditing",
      "Architecture planning",
      "Tech stack consultation",
      "Email support",
    ],
    description: "Perfect for teams needing expert guidance",
    buttonText: "Book Consultation",
    href: "#contact",
    isPopular: false,
  },
  {
    name: "DEVELOPMENT",
    price: "50",
    yearlyPrice: "50",
    period: "per project",
    features: [
      "Feature implementation",
      "Bug fixes & optimization",
      "Priority response time",
      "Weekly sync meetings",
      "Direct communication channel",
      "Price depends on project scope",
    ],
    description: "Ideal for ongoing project development",
    buttonText: "Start Building",
    href: "#contact",
    isPopular: true,
  },
  {
    name: "PARTNERSHIP",
    price: "100",
    yearlyPrice: "100",
    period: "per project",
    features: [
      "Full-stack development",
      "System architecture design",
      "Custom AI/ML solutions",
      "On-call support",
      "Strategic planning",
      "Unlimited consultations",
      "Price depends on requirements",
    ],
    description: "For organizations requiring deep integration",
    buttonText: "Contact Me",
    href: "#contact",
    isPopular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <Pricing 
        plans={plans}
        title="Service Packages"
        description="Flexible engagement models tailored to your project needs.
        Choose a retainer plan or contact me for a custom project quote."
      />
    </section>
  );
}
