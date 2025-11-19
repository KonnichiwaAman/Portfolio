import { ToolIconName } from '@/components/ToolIcon';

export type ToolCategory = 'All' | 'Core' | 'AI/ML' | 'GenAI' | 'Infra';

export interface Tool {
  name: string;
  icon: ToolIconName;
  description: string;
  tags: string[];
  url: string;
  category: Exclude<ToolCategory, 'All'>;
  highlight?: boolean;
}

export const toolkit: Tool[] = [
  {
    name: 'Python',
    icon: 'python',
    description: 'Primary language for AI/ML systems',
    tags: ['Typing', 'Poetry', 'venv'],
    url: 'https://www.python.org',
    category: 'Core',
    highlight: true,
  },
  {
    name: 'VS Code',
    icon: 'vscode',
    description: 'Editor of choice with AI pair tools',
    tags: ['Copilot', 'Devcontainers'],
    url: 'https://code.visualstudio.com',
    category: 'Core',
  },
  {
    name: 'GitHub',
    icon: 'github',
    description: 'Source, reviews, CI and packages',
    tags: ['Actions', 'Packages'],
    url: 'https://github.com',
    category: 'Core',
  },
  {
    name: 'Jupyter',
    icon: 'jupyter',
    description: 'Exploration, notebooks and demos',
    tags: ['EDA', 'Prototyping'],
    url: 'https://jupyter.org',
    category: 'Core',
  },
  {
    name: 'PyTorch',
    icon: 'pytorch',
    description: 'Modeling, training and inference',
    tags: ['PEFT', 'TorchScript'],
    url: 'https://pytorch.org',
    category: 'AI/ML',
    highlight: true,
  },
  {
    name: 'Hugging Face',
    icon: 'huggingface',
    description: 'Models, datasets and Spaces',
    tags: ['Transformers', 'Datasets'],
    url: 'https://huggingface.co',
    category: 'AI/ML',
  },
  {
    name: 'NVIDIA CUDA',
    icon: 'nvidia',
    description: 'GPU acceleration stack',
    tags: ['cuDNN', 'nvcc'],
    url: 'https://developer.nvidia.com/cuda-zone',
    category: 'AI/ML',
  },
  {
    name: 'OpenAI API',
    icon: 'openai',
    description: 'Production LLM inference',
    tags: ['Function Calls', 'JSON Mode'],
    url: 'https://platform.openai.com',
    category: 'GenAI',
  },
  {
    name: 'LangChain',
    icon: 'langchain',
    description: 'RAG, agents and orchestration',
    tags: ['Chains', 'Evaluators'],
    url: 'https://langchain.com',
    category: 'GenAI',
    highlight: true,
  },
  {
    name: 'Vector DB',
    icon: 'vectordb',
    description: 'FAISS / Chroma retrieval stack',
    tags: ['Chunking', 'Embeddings'],
    url: 'https://github.com/facebookresearch/faiss',
    category: 'GenAI',
  },
  {
    name: 'FastAPI',
    icon: 'fastapi',
    description: 'High-performance APIs for serving',
    tags: ['Pydantic', 'Uvicorn'],
    url: 'https://fastapi.tiangolo.com',
    category: 'Infra',
  },
  {
    name: 'Docker',
    icon: 'docker',
    description: 'Containers and reproducible builds',
    tags: ['Compose', 'CI/CD'],
    url: 'https://www.docker.com',
    category: 'Infra',
  },
  {
    name: 'AWS',
    icon: 'aws',
    description: 'Deployments across Lambda, EC2, S3',
    tags: ['S3', 'Lambda'],
    url: 'https://aws.amazon.com',
    category: 'Infra',
  },
  {
    name: 'Vercel',
    icon: 'vercel',
    description: 'Frontend edge hosting',
    tags: ['Edge', 'Serverless'],
    url: 'https://vercel.com',
    category: 'Infra',
  },
  {
    name: 'PostgreSQL',
    icon: 'postgres',
    description: 'Relational storage with PGVector',
    tags: ['JSONB', 'Vector'],
    url: 'https://www.postgresql.org',
    category: 'Infra',
  },
];
