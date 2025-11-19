import { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Github,
  Linkedin,
  Mail,
  Instagram,
  Swords,
  type LucideIcon,
} from 'lucide-react';
import socialsData from '@/data/socials.json';

interface FooterLink {
  title: string;
  href: string;
  icon?: LucideIcon;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Navigation',
    links: [
      { title: 'Home', href: '#hero' },
      { title: 'About', href: '#about' },
      { title: 'Skills', href: '#skills' },
      { title: 'Projects', href: '#projects' },
      { title: 'Pricing', href: '#pricing' },
      { title: 'Contact', href: '#contact' },
    ],
  },
  {
    label: 'Socials',
    links: [
      { title: 'LinkedIn', href: socialsData.linkedin, icon: Linkedin },
      { title: 'GitHub', href: socialsData.github, icon: Github },
      { title: 'Instagram', href: socialsData.instagram, icon: Instagram },
      { title: 'Email', href: `mailto:${socialsData.email}`, icon: Mail },
      { title: 'Chess.com', href: socialsData.chess, icon: Swords },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,rgba(255,255,255,0.1),transparent)] px-4 py-12 md:px-6 md:rounded-t-6xl lg:py-16">
      <div className="bg-foreground/20 absolute top-0 left-1/2 right-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="text-2xl font-bold tracking-tight">AA</div>
          <p className="mt-8 text-sm text-muted-foreground md:mt-0">
            © {new Date().getFullYear()} Aman Awasthi. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="inline-flex items-center gap-1 transition-colors duration-300 hover:text-foreground"
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {link.icon && <link.icon className="me-1 size-4" aria-hidden />}
                        <span>{link.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default Footer;
