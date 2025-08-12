import React, { useState } from 'react';
import { Search, Download, Star, GitFork, Eye, Calendar, User, Code2, ExternalLink, Folder, FileText } from 'lucide-react';

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
}

const GitHubSearchDownload: React.FC<GitHubSearchDownloadProps> = ({ onRepoSelect, onFileImport }) => {
  const [query, setQuery] = useState('');
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks'>('stars');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

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

  const handleClone = (repo: Repository) => {
    // Copy clone URL to clipboard
    const cloneUrl = `https://github.com/${repo.full_name}.git`;
    navigator.clipboard.writeText(cloneUrl).then(() => {
      alert('Clone URL copied to clipboard!');
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
    <div className="bg-[#1e1e1e] rounded-lg border border-[#333] max-w-6xl mx-auto">
      <div className="p-6 border-b border-[#333]">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#333] rounded-lg">
            <Search className="w-6 h-6 text-[#4f9eff]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">GitHub Repository Search</h2>
            <p className="text-[#888] text-sm">Search and import repositories directly into your workspace</p>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg bg-[#2d2d2d] text-white border border-[#444] focus:outline-none focus:border-[#4f9eff] transition-colors"
                placeholder="Search repositories (e.g., 'react components', 'machine learning', 'web scraper')..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#4f9eff] text-white rounded-lg hover:bg-[#3d8bfd] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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
          
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-[#ccc] text-sm">Language:</label>
              <select
                className="px-3 py-2 bg-[#2d2d2d] text-white border border-[#444] rounded-lg focus:outline-none focus:border-[#4f9eff]"
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
              <label className="text-[#ccc] text-sm">Sort by:</label>
              <select
                className="px-3 py-2 bg-[#2d2d2d] text-white border border-[#444] rounded-lg focus:outline-none focus:border-[#4f9eff]"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'stars' | 'updated' | 'forks')}
              >
                <option value="stars">Stars</option>
                <option value="updated">Recently Updated</option>
                <option value="forks">Forks</option>
              </select>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>

      {repos.length > 0 && (
        <div className="p-6">
          <div className="mb-4 text-[#888] text-sm">
            Found {repos.length} repositories
          </div>
          
          <div className="grid gap-4">
            {repos.map(repo => (
              <div key={repo.id} className="bg-[#2d2d2d] rounded-lg border border-[#444] p-5 hover:border-[#555] transition-colors">
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
                          className="text-[#4f9eff] font-semibold hover:underline truncate"
                        >
                          {repo.full_name}
                        </a>
                        <ExternalLink className="w-4 h-4 text-[#888] flex-shrink-0" />
                      </div>
                    </div>
                    
                    <p className="text-[#ccc] text-sm mb-3 line-clamp-2">
                      {repo.description || 'No description available'}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#888]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {repo.stargazers_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" />
                        {repo.forks_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {repo.watchers_count.toLocaleString()}
                      </div>
                      {repo.language && (
                        <div className="flex items-center gap-1">
                          <Code2 className="w-3 h-3" />
                          {repo.language}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Updated {formatDate(repo.updated_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3" />
                        {formatSize(repo.size)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-col lg:w-auto">
                    <button
                      className="px-4 py-2 bg-[#28a745] text-white rounded-lg hover:bg-[#218838] transition-colors flex items-center justify-center gap-2 text-sm"
                      onClick={() => handleDownload(repo)}
                    >
                      <Download className="w-4 h-4" />
                      Download ZIP
                    </button>
                    <button
                      className="px-4 py-2 bg-[#6c757d] text-white rounded-lg hover:bg-[#5a6268] transition-colors flex items-center justify-center gap-2 text-sm"
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
        <div className="p-8 text-center text-[#888]">
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No repositories found for "{query}"</p>
          <p className="text-sm mt-1">Try different keywords or adjust your filters</p>
        </div>
      )}
    </div>
  );
};

export default GitHubSearchDownload;