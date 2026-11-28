import type { ComponentType } from 'react';
import {
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiPython,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiGithubactions,
  SiJavascript,
  SiGit,
  SiGraphql,
  SiVite,
  SiVuedotjs,
  SiDjango,
  SiFlask,
  SiKubernetes,
  SiFirebase,
  SiRedux,
  SiApachespark,
  SiApacheairflow,
  SiApachekafka,
  SiSnowflake,
  SiPandas,
} from 'react-icons/si';
import { BrainCircuit, Sparkles, Workflow, Bot, Code2, Cloud } from 'lucide-react';
import type { TechCategory } from '@/types/models';

type IconComponent = ComponentType<{ className?: string }>;

const BRAND_ICONS: Record<string, IconComponent> = {
  react: SiReact,
  typescript: SiTypescript,
  nextjs: SiNextdotjs,
  tailwindcss: SiTailwindcss,
  nodejs: SiNodedotjs,
  express: SiExpress,
  python: SiPython,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  redis: SiRedis,
  docker: SiDocker,
  aws: Cloud,
  'github-actions': SiGithubactions,
  javascript: SiJavascript,
  git: SiGit,
  graphql: SiGraphql,
  vite: SiVite,
  vuejs: SiVuedotjs,
  django: SiDjango,
  flask: SiFlask,
  kubernetes: SiKubernetes,
  firebase: SiFirebase,
  redux: SiRedux,
  langchain: Workflow,
  langgraph: Workflow,
  rag: BrainCircuit,
  llms: Bot,
  spark: SiApachespark,
  airflow: SiApacheairflow,
  kafka: SiApachekafka,
  snowflake: SiSnowflake,
  pandas: SiPandas,
  dbt: Workflow,
};

const CATEGORY_FALLBACKS: Record<TechCategory, IconComponent> = {
  frontend: Code2,
  backend: Code2,
  database: Code2,
  'ai-data': Sparkles,
  devops: Cloud,
  language: Code2,
  tooling: Code2,
};

export function getTechIcon(slugOrIcon: string, category?: TechCategory): IconComponent {
  return BRAND_ICONS[slugOrIcon] ?? (category ? CATEGORY_FALLBACKS[category] : Code2);
}
