import { memo } from 'react';
import { SiPython, SiPytorch, SiReact, SiTailwindcss, SiDocker } from 'react-icons/si';
import { Brain, Sparkles, Globe, Database, Code2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: React.ReactNode;
}

const SKILLS_LEFT: readonly Skill[] = [
  { name: 'Python & ML Frameworks', level: 95, category: 'Core', icon: <SiPython className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'PyTorch Deep Learning', level: 88, category: 'ML', icon: <SiPytorch className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'React & Next.js', level: 92, category: 'Web', icon: <SiReact className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'Prompt Engineering', level: 90, category: 'GenAI', icon: <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'Model Fine-tuning', level: 85, category: 'ML', icon: <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
] as const;

const SKILLS_RIGHT: readonly Skill[] = [
  { name: 'Full Stack Web Dev', level: 94, category: 'Web', icon: <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'RAG & Vector DBs', level: 82, category: 'GenAI', icon: <Database className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'TypeScript & Tailwind', level: 90, category: 'Web', icon: <SiTailwindcss className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'Docker & MLOps', level: 75, category: 'DevOps', icon: <SiDocker className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
  { name: 'Agentic Workflows', level: 78, category: 'GenAI', icon: <Code2 className="w-8 h-8 md:w-10 md:h-10 text-primary" /> },
] as const;

const Skills = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="skills" ref={ref} className="relative py-24 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-background via-background to-primary/5 cv-auto scroll-mt-28">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl xs:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-primary tracking-tight">
            My Skills
          </h2>
          <div 
            className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mb-8"
            aria-hidden="true"
          ></div>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
            Python-first AI/ML engineer and Full Stack Developer with expertise spanning generative AI systems, 
            modern web frameworks, and production-grade deployment pipelines.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {SKILLS_LEFT.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} isVisible={inView} />
            ))}
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {SKILLS_RIGHT.map((skill, index) => (
              <SkillBar key={skill.name} skill={skill} index={index} isVisible={inView} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

interface SkillBarProps {
  skill: Skill;
  index: number;
  isVisible: boolean;
}

const SkillBar = memo(({ skill, index, isVisible }: SkillBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="group"
    >
      <div className="flex items-start gap-4 mb-3">
        <div className="p-3 rounded-2xl glass-effect bg-primary/5 group-hover:bg-primary/10 transition-colors duration-300">
          {skill.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {skill.name}
            </h3>
            <span className="text-2xl font-bold text-primary">{skill.level}%</span>
          </div>
        </div>
      </div>
      <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/60 rounded-full" />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              delay: 1.6 + index * 0.1,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

SkillBar.displayName = 'SkillBar';

export default Skills;