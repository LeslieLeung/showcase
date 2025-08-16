export interface Repository {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  updated_at: string;
  created_at: string;
  license: string | null;
}

export interface Config {
  title: string;
  subtitle: string;
  github_username?: string;
  footer: {
    github_link: string;
    copyright: string;
  };
  repository: {
    source_link: string;
    source_text: string;
  };
  repositories: {
    pinned: string[];
    hidden: string[];
  };
}