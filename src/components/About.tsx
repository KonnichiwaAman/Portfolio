import { Card, CardContent } from '@/components/ui/card';
import ProfilePicture from '@/components/ProfilePicture';
import { motion } from 'framer-motion';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section 
      id="about" 
      className="relative py-24 px-4 md:px-8 lg:px-12 cv-auto scroll-mt-28"
      aria-labelledby="about-heading"
    >
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-20">
            <h2 
              id="about-heading"
              className="text-3xl xs:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-primary tracking-tight"
            >
              About Me
            </h2>
            <div 
              className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mb-8"
              aria-hidden="true"
            ></div>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              Passionate about creating sophisticated digital solutions
            </p>
        </motion.div>
          
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <motion.div variants={leftVariants}>
              <Card 
                className="glass-effect hover:bg-card/60 transition-all duration-700 ease-out professional-shadow card-3d"
                role="article"
                aria-labelledby="about-intro"
              >
                <CardContent className="p-6 md:p-8">
                  <p id="about-intro" className="text-lg leading-relaxed text-foreground/90 font-light">
                    I'm a Python-focused AI/ML engineer and Full Stack Developer passionate about building practical Generative AI systems and modern web applications.
                    From prompt design and RAG pipelines to crafting responsive, high-performance websites, I care about reliability,
                    user experience, and measurable impact.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={leftVariants}>
              <Card 
                className="glass-effect hover:bg-card/60 transition-all duration-700 ease-out professional-shadow card-3d" 
                role="article"
                aria-labelledby="about-expertise"
              >
                <CardContent className="p-6 md:p-8">
                  <p id="about-expertise" className="text-lg leading-relaxed text-foreground/90 font-light">
                    My toolkit includes <strong>PyTorch</strong>, <strong>RAG</strong>, <strong>PEFT/LoRA</strong>,
                    <strong> FastAPI</strong>, and <strong>Tailwind</strong>. I design data pipelines, fine-tune models,
                    and ship APIs and agents that solve real problems.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div 
            variants={rightVariants}
            className="flex justify-center lg:justify-end"
            aria-hidden="true"
          >
            <ProfilePicture size="xl" className="mx-auto" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default About;
