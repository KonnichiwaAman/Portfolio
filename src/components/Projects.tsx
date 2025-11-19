import { useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import projectsData from '@/data/projects.json';

const PROJECTS = projectsData.projects;

const STATUS_COLORS: Record<string, string> = {
  Production: 'bg-green-500/20 text-green-400 border-green-500/30',
  Live: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Beta: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Development: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
} as const;

const Projects = () => {
  const handleOpen = useCallback((url?: string) => {
    if (url && url.trim().length > 0) {
      window.open(url, '_blank');
    } else {
      toast({
        title: 'Link unavailable',
        description: 'This link is coming soon.',
      });
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    return STATUS_COLORS[status] || 'bg-muted text-muted-foreground';
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="projects" className="py-20 px-6 cv-auto scroll-mt-28">
      <motion.div 
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gradient-primary tracking-tight">
              Featured Projects
            </h2>
            <div 
              className="w-32 h-1 bg-gradient-to-r from-primary via-accent to-secondary mx-auto mb-8"
              aria-hidden="true"
            ></div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              A selection of recent projects showcasing technical expertise and modern development practices
            </p>
        </motion.div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {PROJECTS.map((project) => (
              <motion.div 
                key={project.title} 
                variants={itemVariants}
                className="h-full"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-primary/50 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold">{project.title}</CardTitle>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <CardDescription className="text-muted-foreground">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        <Button
                          className="flex-1"
                          onClick={() => handleOpen(project.liveUrl)}
                          aria-label="Open live demo"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpen(project.githubUrl)}
                          aria-label="View source code"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          Source
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Projects;
