import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useResponsive } from '@/hooks/useResponsive';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
}

interface ProjectFilterProps {
  projects: Project[];
  onFilter: (filteredProjects: Project[]) => void;
}

const categories = ['All', 'Web', 'Mobile', 'Desktop', 'API', 'Other'];

export const ProjectFilter = ({ projects, onFilter }: ProjectFilterProps) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    const filtered = category === 'All' 
      ? projects 
      : projects.filter(project => project.category === category);
    onFilter(filtered);
  };

  return (
    <div className="w-full space-y-4" role="group" aria-label="Project filters">
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={activeCategory === category ? "default" : "outline"}
              onClick={() => handleFilter(category)}
              className="transition-all duration-200"
              aria-pressed={activeCategory === category}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="text-center text-sm text-muted-foreground"
        >
          {activeCategory === 'All' 
            ? `Showing all ${projects.length} projects`
            : `Showing ${projects.filter(p => p.category === activeCategory).length} ${activeCategory} projects`}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 