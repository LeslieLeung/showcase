import { useState, useEffect, useMemo } from 'react';
import { Showcase } from './components/Showcase';
import { Repository, Config } from './types';
import { loadConfig } from './utils/config';

type SortOption = 'stars' | 'created_at' | 'updated_at';
type SortDirection = 'asc' | 'desc';

function App() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [languageFilter, setLanguageFilter] = useState('');
  const [config, setConfig] = useState<Config | null>(null);
  const [isPinningActive, setIsPinningActive] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [configData, reposResponse] = await Promise.all([
          loadConfig(),
          fetch(`${window.location.pathname.includes('/showcase/') ? '/showcase/' : '/'}src/data/repositories.json`)
        ]);
        
        setConfig(configData);
        
        if (!reposResponse.ok) {
          throw new Error('Failed to load repositories');
        }
        const reposData = await reposResponse.json();
        setRepositories(reposData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (config?.umami?.host && config?.umami?.website_id) {
      const existingScript = document.querySelector("script[data-website-id]")
      if (!existingScript) {
        const script = document.createElement("script")
        script.async = true
        script.src = `${config.umami.host}/script.js`
        script.setAttribute("data-website-id", config.umami.website_id)
        document.head.appendChild(script)
      }
    }
  }, [config])

  // Disable pinning when sort/filter changes from default
  useEffect(() => {
    if (searchTerm || languageFilter || sortBy !== 'stars' || sortDirection !== 'desc') {
      setIsPinningActive(false);
    } else {
      setIsPinningActive(true);
    }
  }, [searchTerm, languageFilter, sortBy, sortDirection]);

  const uniqueLanguages = useMemo(() => {
    const languages = repositories
      .map(repo => repo.language)
      .filter((lang): lang is string => lang !== null)
      .filter((lang, index, array) => array.indexOf(lang) === index)
      .sort();
    return languages;
  }, [repositories]);

  const filteredAndSortedRepositories = useMemo(() => {
    let filtered = repositories;
    
    // Apply config-based filtering first
    if (config) {
      // Filter out hidden repositories
      filtered = filtered.filter(repo => !config.repositories.hidden.includes(repo.name));
    }
    
    if (searchTerm) {
      filtered = filtered.filter(repo => 
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (languageFilter) {
      filtered = filtered.filter(repo => repo.language === languageFilter);
    }
    
    return filtered.sort((a, b) => {
      // Handle pinned repositories first (only if pinning is active and using default sort)
      if (config && isPinningActive && sortBy === 'stars' && sortDirection === 'desc' && !searchTerm && !languageFilter) {
        const aIndex = config.repositories.pinned.indexOf(a.name);
        const bIndex = config.repositories.pinned.indexOf(b.name);
        
        if (aIndex !== -1 && bIndex !== -1) {
          // Both are pinned, sort by pin order
          return aIndex - bIndex;
        } else if (aIndex !== -1) {
          // Only a is pinned
          return -1;
        } else if (bIndex !== -1) {
          // Only b is pinned
          return 1;
        }
      }
      
      // Normal sorting for non-pinned repos
      let comparison = 0;
      switch (sortBy) {
        case 'stars':
          comparison = b.stargazers_count - a.stargazers_count;
          break;
        case 'created_at':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          break;
        default:
          return 0;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });
  }, [repositories, searchTerm, languageFilter, sortBy, sortDirection, config, isPinningActive]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-gray-100 mx-auto mb-3"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Loading repositories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-4 text-sm">Error loading repositories: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-8 sm:mb-12 gap-4 sm:gap-0">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              {config?.title || 'GitHub Showcase'}
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto sm:mx-0">
              {config?.subtitle || 'Discover and explore my collection of public repositories'}
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={config?.footer.github_link || 'https://github.com/leslieleung'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              title="View GitHub profile"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
            </a>
            
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none px-3 py-2.5 sm:py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm cursor-pointer min-w-[100px]"
                >
                  <option value="stars">⭐ Stars</option>
                  <option value="created_at">📅 Created</option>
                  <option value="updated_at">🔄 Updated</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className="px-2.5 py-2.5 sm:px-2 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                title={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
              >
                {sortDirection === 'asc' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                )}
              </button>
              
              <div className="relative">
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="appearance-none px-3 py-2.5 sm:py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all text-sm cursor-pointer min-w-[120px]"
                >
                  <option value="">🌐 All Languages</option>
                  {uniqueLanguages.map(language => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {(searchTerm || languageFilter || sortBy !== 'stars' || sortDirection !== 'desc') && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setLanguageFilter('');
                    }}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1"
                  >
                    Clear
                  </button>
                  
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setLanguageFilter('');
                      setSortBy('stars');
                      setSortDirection('desc');
                      setIsPinningActive(true);
                    }}
                    className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {filteredAndSortedRepositories.length}
            </span>
            {' '}repositories
            {searchTerm && (
              <span className="text-blue-600 dark:text-blue-400">
                {' '}matching "{searchTerm}"
              </span>
            )}
            {languageFilter && (
              <span className="text-purple-600 dark:text-purple-400">
                {' '}in {languageFilter}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>
                {filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) >= 1000 
                  ? `${(filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.stargazers_count, 0) / 1000).toFixed(1)}k`
                  : filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.stargazers_count, 0)
                } stars
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414L2.586 7l3.707-3.707a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>
                {filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.forks_count, 0) >= 1000 
                  ? `${(filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.forks_count, 0) / 1000).toFixed(1)}k`
                  : filteredAndSortedRepositories.reduce((sum, repo) => sum + repo.forks_count, 0)
                } forks
              </span>
            </div>
          </div>
        </div>
        
        <Showcase 
          repositories={filteredAndSortedRepositories} 
          config={isPinningActive ? config : null} 
        />
        
        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              <a
                href={config?.repository.source_link || 'https://github.com/leslieleung/showcase'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {config?.repository.source_text || 'View source on GitHub'}
              </a>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
              {config?.footer.copyright || '© 2025 Leslie Leung. All rights reserved.'}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;