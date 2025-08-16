import { Repository } from '../types';

interface RepositoryCardProps {
  repository: Repository;
  isPinned?: boolean;
}

export function RepositoryCard({ repository, isPinned = false }: RepositoryCardProps) {
  const getLanguageColor = (language: string | null): string => {
    const colors: Record<string, string> = {
      JavaScript: 'bg-yellow-400',
      TypeScript: 'bg-blue-500',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      'C++': 'bg-pink-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600',
      PHP: 'bg-purple-500',
      Ruby: 'bg-red-600',
      Swift: 'bg-orange-500',
      Kotlin: 'bg-purple-600',
      Dart: 'bg-blue-400',
      Shell: 'bg-gray-500',
      HTML: 'bg-orange-400',
      CSS: 'bg-blue-400',
    };
    
    return language ? colors[language] || 'bg-gray-400' : 'bg-gray-400';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200 p-6 h-52 flex flex-col justify-between group hover:shadow-sm dark:hover:shadow-lg dark:hover:shadow-gray-900/20">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-gray-900 dark:text-gray-100 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {repository.name}
            </a>
            {isPinned && (
              <div className="shrink-0" title="Pinned repository">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>
          {repository.language && (
            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getLanguageColor(repository.language)} shrink-0`}>
              {repository.language}
            </span>
          )}
        </div>
        
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {repository.description || 'No description available'}
        </p>
        
        <div className="text-xs text-gray-400 dark:text-gray-500 mb-4 space-y-1">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            Created: {formatDate(repository.created_at)}
          </div>
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Updated: {formatDate(repository.updated_at)}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {repository.stargazers_count}
          </span>
          <span className="flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {repository.forks_count}
          </span>
          {repository.license && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2L3 7v10a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 8a1 1 0 000 2h4a1 1 0 100-2H8z" clipRule="evenodd" />
              </svg>
              {repository.license}
            </span>
          )}
        </div>
        
        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 text-xs font-medium transition-colors"
        >
          View →
        </a>
      </div>
    </div>
  );
}