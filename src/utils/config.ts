import * as yaml from 'js-yaml';
import { Config } from '../types';

const defaultConfig: Config = {
  title: "GitHub Showcase",
  subtitle: "Discover and explore my collection of public repositories",
  github_username: "leslieleung",
  footer: {
    github_link: "https://github.com/leslieleung",
    copyright: "© 2025 Leslie Leung. All rights reserved."
  },
  repository: {
    source_link: "https://github.com/leslieleung/showcase",
    source_text: "View source on GitHub"
  },
  repositories: {
    pinned: [],
    hidden: []
  }
};

let cachedConfig: Config | null = null;

export async function loadConfig(): Promise<Config> {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch(`${(import.meta as any).env.BASE_URL}config.yaml`);
    if (!response.ok) {
      console.warn('Could not load config.yaml, using default configuration');
      cachedConfig = defaultConfig;
      return defaultConfig;
    }
    
    const yamlText = await response.text();
    const parsed = yaml.load(yamlText) as Partial<Config>;
    
    // Merge with defaults to ensure all required fields are present
    cachedConfig = {
      title: parsed.title ?? defaultConfig.title,
      subtitle: parsed.subtitle ?? defaultConfig.subtitle,
      github_username: parsed.github_username ?? defaultConfig.github_username,
      footer: {
        github_link: parsed.footer?.github_link ?? defaultConfig.footer.github_link,
        copyright: parsed.footer?.copyright ?? defaultConfig.footer.copyright,
      },
      repository: {
        source_link: parsed.repository?.source_link ?? defaultConfig.repository.source_link,
        source_text: parsed.repository?.source_text ?? defaultConfig.repository.source_text,
      },
      repositories: {
        pinned: parsed.repositories?.pinned ?? defaultConfig.repositories.pinned,
        hidden: parsed.repositories?.hidden ?? defaultConfig.repositories.hidden,
      },
      umami: parsed.umami
    };
    
    return cachedConfig;
  } catch (error) {
    console.error('Error loading config:', error);
    cachedConfig = defaultConfig;
    return defaultConfig;
  }
}

export function clearConfigCache(): void {
  cachedConfig = null;
}