import { cn } from '@/lib/utils';
import {
  SiDocker,
  SiFastapi,
  SiGithub,
  SiHuggingface,
  SiJupyter,
  SiNvidia,
  SiOpenai,
  SiPostgresql,
  SiPytorch,
  SiPython,
  SiVercel,
} from 'react-icons/si';
import { Brain, Cloud, Code2, Database } from 'lucide-react';

const iconMap = {
  python: SiPython,
  vscode: Code2,
  github: SiGithub,
  jupyter: SiJupyter,
  pytorch: SiPytorch,
  huggingface: SiHuggingface,
  nvidia: SiNvidia,
  openai: SiOpenai,
  langchain: Brain,
  vectordb: Database,
  fastapi: SiFastapi,
  docker: SiDocker,
  aws: Cloud,
  vercel: SiVercel,
  postgres: SiPostgresql,
} as const;

export type ToolIconName = keyof typeof iconMap;

interface ToolIconProps {
  name: ToolIconName;
  className?: string;
}

export const ToolIcon = ({ name, className }: ToolIconProps) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null;
  return <IconComponent className={cn('w-6 h-6', className)} aria-hidden />;
};
