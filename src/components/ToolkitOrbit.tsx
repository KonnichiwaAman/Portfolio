import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Tool, ToolCategory } from '@/data/toolkit';
import { ToolIcon } from '@/components/ToolIcon';
import { getOrbitPosition, ringConfig } from '@/lib/orbit';
import { cn } from '@/lib/utils';

interface ToolkitOrbitProps {
  tools: Tool[];
}

interface PlanetProps {
  tool: Tool;
  position: { x: number; y: number; angle: number };
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const Planet = ({ tool, position, isSelected, onClick, index }: PlanetProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}
      className={cn(
        'absolute flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        isSelected
          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110 z-10'
          : 'bg-card/80 border-2 border-primary/20 hover:border-primary/60 hover:bg-card hover:scale-105'
      )}
      style={{
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) rotate(${position.angle}deg) translateX(${position.x}rem) rotate(-${position.angle}deg)`,
      }}
      onClick={onClick}
      aria-label={`${tool.name} - ${tool.description}`}
      aria-pressed={isSelected}
      role="tab"
      tabIndex={isSelected ? 0 : -1}
    >
      <ToolIcon name={tool.icon} className={cn('w-6 h-6', isSelected && 'text-primary-foreground')} />
      {tool.highlight && (
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-background" aria-hidden />
      )}
    </motion.button>
  );
};

const InfoPanel = ({ tool }: { tool: Tool | null }) => {
  return (
    <AnimatePresence mode="wait">
      {tool && (
        <motion.div
          key={tool.name}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <Card className="border-primary/20 bg-card/90 backdrop-blur">
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ToolIcon name={tool.icon} className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      {tool.name}
                      {tool.highlight && (
                        <Badge variant="default" className="text-[10px] uppercase">
                          Primary
                        </Badge>
                      )}
                    </h3>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

              <div className="flex flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button
                variant="default"
                size="sm"
                className="w-full"
                onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Explore {tool.name}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const ToolkitOrbit = ({ tools }: ToolkitOrbitProps) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(
    tools.find((t) => t.highlight) || tools[0] || null
  );

  // Group tools by category
  const toolsByCategory = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<Exclude<ToolCategory, 'All'>, Tool[]>);

  const allCategoryTools = Object.entries(toolsByCategory).flatMap(([category, categoryTools]) =>
    categoryTools.map((tool, idx) => ({
      tool,
      category: category as Exclude<ToolCategory, 'All'>,
      config: ringConfig[category as Exclude<ToolCategory, 'All'>],
      position: getOrbitPosition(idx, categoryTools.length, ringConfig[category as Exclude<ToolCategory, 'All'>].radius),
    }))
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedTool) return;
      
      const currentIndex = tools.findIndex((t) => t.name === selectedTool.name);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tools.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tools.length) % tools.length;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = tools.length - 1;
          break;
        default:
          return;
      }

      setSelectedTool(tools[nextIndex]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTool, tools]);

  if (tools.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        No tools available
      </div>
    );
  }

  const maxRadius = Math.max(...Object.values(ringConfig).map(c => c.radius));

  return (
    <div className="grid lg:grid-cols-[1fr,400px] gap-8 items-start">
      {/* Orbit Canvas */}
      <div
        className="relative mx-auto"
        style={{
          width: `${maxRadius * 2 + 8}rem`,
          height: `${maxRadius * 2 + 8}rem`,
        }}
        role="tablist"
        aria-label="Tools orbit visualization"
      >
        {/* Rings for each category */}
        {Object.entries(ringConfig).map(([category, config]) => (
          <div
            key={category}
            className="absolute inset-0 rounded-full border-2 border-dashed opacity-20"
            style={{
              borderColor: `hsl(var(--primary))`,
              width: `${config.radius * 2}rem`,
              height: `${config.radius * 2}rem`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            aria-hidden
          />
        ))}

        {/* Center badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
        >
          <div className="rounded-full p-4 bg-gradient-to-br from-primary to-accent shadow-lg">
            <div className="text-sm font-bold text-primary-foreground text-center whitespace-nowrap px-2">
              Stack
            </div>
          </div>
        </motion.div>

        {/* Planets */}
        {allCategoryTools.map(({ tool, position }, globalIndex) => (
          <Planet
            key={tool.name}
            tool={tool}
            position={position}
            isSelected={selectedTool?.name === tool.name}
            onClick={() => setSelectedTool(tool)}
            index={globalIndex}
          />
        ))}
      </div>

      {/* Info Panel */}
      <div className="lg:sticky lg:top-24">
        <InfoPanel tool={selectedTool} />
      </div>
    </div>
  );
};
