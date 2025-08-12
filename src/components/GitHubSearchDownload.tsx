import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Star, 
  GitFork, 
  Eye, 
  Calendar, 
  User, 
  Code2, 
  ExternalLink, 
  Folder, 
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  BookOpen,
  Zap,
  Shield,
  Globe
} from 'lucide-react';

const GITHUB_API = 'https://api.github.com';

interface Repository {
  id: number;
  full_name: string;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  default_branch: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  size: number;
  open_issues_count: number;
}

interface GitHubSearchDownloadProps {
  onRepoSelect?: (repo: Repository) => void;
  onFileImport?: (files: FileList | null) => void;
  onRepoImport?: (repo: Repository) => void;
}

const GitHubSearchDownload: React.FC<GitHubSearchDownloadProps> = ({ onRepoSelect, onFileImport, onRepoImport }) => {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks'>('stars');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [importingRepo, setImportingRepo] = useState<number | null>(null);
  const [importedRepos, setImportedRepos] = useState<Set<number>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setRepos([]);
    
    try {
      let searchQuery = query;
      if (selectedLanguage) {
        searchQuery += ` language:${selectedLanguage}`;
      }
      
      const sortParam = sortBy === 'stars' ? 'stars' : sortBy === 'updated' ? 'updated' : 'forks';
      const res = await fetch(
        `${GITHUB_API}/search/repositories?q=${encodeURIComponent(searchQuery)}&sort=${sortParam}&order=desc&per_page=20`
      );
      
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        throw new Error(`GitHub API error: ${res.status}`);
      }
      
      const data = await res.json();
      setRepos(data.items || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error occurred');
    }
    setLoading(false);
  };

  const handleDownload = async (repo: Repository) => {
    try {
      // Option 1: Direct ZIP download
      const zipUrl = `https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch}.zip`;
      window.open(zipUrl, '_blank');
      
      // Option 2: If we have a callback, also notify parent component
      if (onRepoSelect) {
        onRepoSelect(repo);
      }
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleImport = async (repo: Repository) => {
    setImportingRepo(repo.id);
    
    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as imported
      setImportedRepos(prev => new Set([...prev, repo.id]));
      
      // Notify parent component
      if (onRepoImport) {
        onRepoImport(repo);
      }
      
      // Show success message
      console.log(`Successfully imported ${repo.full_name}`);
    } catch (err) {
      console.error('Import failed:', err);
    } finally {
      setImportingRepo(null);
    }
  };

  const handleClone = (repo: Repository) => {
    // Copy clone URL to clipboard
    const cloneUrl = `https://github.com/${repo.full_name}.git`;
    navigator.clipboard.writeText(cloneUrl).then(() => {
      // Show a more elegant notification instead of alert
      console.log('Clone URL copied to clipboard!');
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} KB`;
    return `${(size / 1024).toFixed(1)} MB`;
  };

  const popularLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'HTML', 'CSS'
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 w-full h-full flex flex-col">
      <div className="p-6 border-b border-[#333]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">GitHub Repository Search</h2>
              <p className="text-gray-400 text-sm">Search and import repositories directly into your workspace</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              title="Toggle Filters"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleSearch(new Event('submit') as any)}
              disabled={loading}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg transition-colors disabled:opacity-50"
              title="Refresh Results"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Search repositories (e.g., 'react components', 'machine learning', 'web scraper')..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-gray-700 rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-medium text-white mb-3">Search Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-gray-300 text-sm">Language:</label>
                  <select
                    className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                  >
                    <option value="">Any</option>
                    {popularLanguages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-gray-300 text-sm">Sort by:</label>
                  <select
                    className="flex-1 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'stars' | 'updated' | 'forks')}
                  >
                    <option value="stars">⭐ Stars</option>
                    <option value="updated">🕒 Recently Updated</option>
                    <option value="forks">🍴 Forks</option>
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLanguage('');
                      setSortBy('stars');
                    }}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Search across 100M+ repositories</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Instant import to workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300">Safe & secure downloads</span>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Error:</strong> {error}
              <div className="mt-2 text-sm text-red-200">
                Try adjusting your search terms or check your internet connection.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {repos.length > 0 && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 text-sm">
                Found {repos.length} repositories
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Sort:</span>
                <button
                  onClick={() => setSortBy(sortBy === 'stars' ? 'updated' : 'stars')}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                >
                  {sortBy === 'stars' ? <Star className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {sortBy === 'stars' ? 'Stars' : 'Updated'}
                  {sortBy === 'stars' ? <SortDesc className="w-3 h-3" /> : <SortAsc className="w-3 h-3" />}
                </button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {repos.map(repo => (
                <div key={repo.id} className="bg-gray-700 rounded-lg border border-gray-600 p-5 hover:border-blue-500 transition-all duration-200 hover:shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img 
                          src={repo.owner.avatar_url} 
                          alt={repo.owner.login}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex items-center gap-2 min-w-0">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors truncate"
                          >
                            {repo.full_name}
                          </a>
                          <ExternalLink className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {repo.description || 'No description available'}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          {repo.stargazers_count.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="w-3 h-3 text-gray-400" />
                          {repo.forks_count.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-gray-400" />
                          {repo.watchers_count.toLocaleString()}
                        </div>
                        {repo.language && (
                          <div className="flex items-center gap-1">
                            <Code2 className="w-3 h-3 text-blue-400" />
                            <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full">
                              {repo.language}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          Updated {formatDate(repo.updated_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Folder className="w-3 h-3 text-gray-400" />
                          {formatSize(repo.size)}
                        </div>
                      </div>
                      
                      {repo.open_issues_count > 0 && (
                        <div className="flex items-center gap-1 text-xs text-orange-400 mb-2">
                          <AlertTriangle className="w-3 h-3" />
                          {repo.open_issues_count} open issues
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2 lg:w-auto min-w-[140px]">
                      {importedRepos.has(repo.id) ? (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-green-900/30 text-green-400 rounded-lg border border-green-500/30">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Imported</span>
                        </div>
                      ) : (
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleImport(repo)}
                          disabled={importingRepo === repo.id}
                        >
                          {importingRepo === repo.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Importing...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Import to IDE
                            </>
                          )}
                        </button>
                      )}
                      
                      <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2 text-sm"
                        onClick={() => handleDownload(repo)}
                      >
                        <Download className="w-4 h-4" />
                        Download ZIP
                      </button>
                      
                      <button
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors flex items-center justify-center gap-2 text-sm"
                        onClick={() => handleClone(repo)}
                      >
                        <FileText className="w-4 h-4" />
                        Copy Clone URL
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!loading && repos.length === 0 && query && (
          <div className="p-8 text-center text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium text-white mb-2">No repositories found</h3>
            <p className="mb-4">No repositories found for "{query}"</p>
            <p className="text-sm">Try different keywords or adjust your filters</p>
            <button
              onClick={() => {
                setQuery('');
                setSelectedLanguage('');
                setSortBy('stars');
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
        
        {!loading && !query && (
          <div className="p-8 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Search GitHub Repositories</h3>
            <p className="mb-6 max-w-md mx-auto">
              Search through millions of open source repositories and import them directly into your workspace.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-md mx-auto">
              {['react', 'rust', 'flutter', 'android'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    handleSearch(new Event('submit') as any);
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-lg text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {loading && (
          <div className="p-8 text-center">
            <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-white mb-2">Searching GitHub...</h3>
            <p className="text-gray-400">Finding the best repositories for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubSearchDownload;