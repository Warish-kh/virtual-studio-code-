import React, { useState } from 'react';
import { Search, X, ChevronDown, RefreshCw, ChevronRight, FileText } from 'lucide-react';

const SearchView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{file: string; matches: string[]}[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        {
          file: '/src/index.js',
          matches: [
            'console.log("Hello, VS Code clone!");',
          ]
        },
        {
          file: '/README.md',
          matches: [
            '# VS Code Clone',
            'A web-based VS Code clone created with React.',
          ]
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="vscode-sidebar-title">
        <div className="uppercase">Search</div>
        <div className="flex space-x-1">
          <button 
            className="p-0.5 rounded hover:bg-accent"
            onClick={() => setSearchResults([])}
            title="Clear Search Results"
          >
            <X className="h-3 w-3" />
          </button>
          <button 
            className="p-0.5 rounded hover:bg-accent"
            onClick={handleSearch}
            title="Refresh"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full h-7 pl-7 pr-7 text-xs bg-muted rounded-sm border border-input focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          {searchQuery && (
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={clearSearch}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {isSearching ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            Searching...
          </div>
        ) : searchResults.length > 0 ? (
          <div className="text-xs">
            {searchResults.map((result, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex items-center px-4 py-1 hover:bg-accent">
                  <ChevronDown className="h-3 w-3 mr-1" />
                  <FileText className="h-4 w-4 mr-1" />
                  <span>{result.file}</span>
                </div>
                <div className="pl-8">
                  {result.matches.map((match, midx) => (
                    <div 
                      key={midx} 
                      className="px-2 py-1 hover:bg-accent cursor-pointer truncate"
                      title={match}
                    >
                      {match}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            No results found
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center h-full text-sm text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p>Search for text across all files</p>
            <p>Use Enter to search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchView;