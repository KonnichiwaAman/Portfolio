import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Tool } from '@/data/toolkit';
import { ToolIcon } from '@/components/ToolIcon';
import { cn } from '@/lib/utils';

interface ToolkitListProps {
  tools: Tool[];
}

export const ToolkitList = ({ tools }: ToolkitListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
      {tools.map((tool, index) => {
        return (
          <Card
            key={tool.name}
            className={cn(
              'relative h-full border border-border/60 bg-card/90 text-card-foreground transition-all duration-300',
              'hover:border-primary/40 hover:bg-card hover:-translate-y-1 hover:shadow-lg',
              tool.highlight && 'shadow-xl shadow-primary/20 border-primary/40'
            )}
            role="listitem"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {tool.highlight && (
              <span className="absolute right-4 top-4 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Primary
              </span>
            )}
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col gap-3 rounded-xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <ToolIcon name={tool.icon} className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{tool.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{tool.description}</p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase shrink-0">
                  {tool.category}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tool.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={`${tool.name}-${tag}`}
                    variant="secondary"
                    className="bg-muted/40 text-[10px] font-medium text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-1.5 text-xs font-medium text-primary">
                Explore
                <ExternalLink className="h-3 w-3" />
              </div>
            </a>
          </Card>
        );
      })}
    </div>
  );
};
