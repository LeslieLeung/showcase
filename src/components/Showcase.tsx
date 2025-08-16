import { Repository, Config } from '../types';
import { RepositoryCard } from './RepositoryCard';

interface ShowcaseProps {
  repositories: Repository[];
  config?: Config | null;
}

export function Showcase({ repositories, config }: ShowcaseProps) {
  return (
    <>
      {repositories.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 dark:text-gray-500">No repositories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repositories.map((repo) => (
            <RepositoryCard 
              key={repo.name} 
              repository={repo} 
              isPinned={config?.repositories.pinned.includes(repo.name) || false}
            />
          ))}
        </div>
      )}
    </>
  );
}