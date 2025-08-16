import { Octokit } from '@octokit/core';
import { writeFileSync, readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Repository } from '../src/types';

async function fetchRepositories(): Promise<Repository[]> {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is required');
  }

  // Load configuration
  const configContent = readFileSync('config.yaml', 'utf8');
  const config = yaml.load(configContent) as any;
  const username = config.github_username;

  if (!username) {
    throw new Error('github_username not found in config.yaml');
  }

  const octokit = new Octokit({ auth: token });

  try {
    const response = await octokit.request('GET /users/{username}/repos', {
      username,
      type: 'owner',
      sort: 'updated',
      direction: 'desc',
      per_page: 100
    });

    const repositories: Repository[] = response.data
      .filter((repo: any) => !repo.fork)
      .map((repo: any) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        html_url: repo.html_url,
        updated_at: repo.updated_at,
        created_at: repo.created_at,
        license: repo.license?.name || null
      }));

    return repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Fetching repositories...');
    const repositories = await fetchRepositories();
    
    const dataDir = 'src/data';
    const fs = await import('fs');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    writeFileSync(
      'src/data/repositories.json',
      JSON.stringify(repositories, null, 2)
    );
    
    console.log(`Successfully fetched ${repositories.length} repositories`);
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}