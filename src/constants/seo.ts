/**
 * SEO and Site Configuration Constants
 * Centralized location for all SEO-related metadata
 */

export const SITE_CONFIG = {
  title: "Aman Awasthi • AI/ML Engineer & Full Stack Developer",
  description: "Portfolio of Aman Awasthi, a Python-first AI/ML Engineer specializing in Generative AI, RAG pipelines, Agentic Workflows, and Full Stack Web Development.",
  url: "https://developeramanawasthi.netlify.app",
  image: "/profile.png",
  author: "Aman Awasthi",
  email: "helloamanawasthi@gmail.com",
  keywords: [
    "Aman Awasthi",
    "AI Engineer",
    "Machine Learning Engineer",
    "Full Stack Developer",
    "Python",
    "Generative AI",
    "RAG",
    "LLM",
    "Agentic Workflows",
    "React",
    "TypeScript",
    "FastAPI"
  ]
} as const;

export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": SITE_CONFIG.title,
  "url": SITE_CONFIG.url,
  "description": SITE_CONFIG.description,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_CONFIG.url}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
} as const;
