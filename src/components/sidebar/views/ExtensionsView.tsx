import React, { useState } from 'react';
import { Search, MoreHorizontal, Download, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { useExtensionStore } from '@/store/extensionStore';
import { Extension } from '@/types';

const ExtensionsView: React.FC = () => {
  const { state, toggleExtension, uninstallExtension } = useExtensionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'installed' | 'popular'>('installed');
  
  const filteredExtensions = searchQuery.trim() 
    ? state.extensions.filter(ext => 
        ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ext.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : state.extensions;

  const popularExtensions: Extension[] = [
    {
      id: 'popular-1',
      name: 'Prettier - Code formatter',
      description: 'Code formatter using prettier',
      version: '9.10.4',
      isActive: false,
      icon: '✨'
    },
    {
      id: 'popular-2',
      name: 'GitLens — Git supercharged',
      description: 'Supercharge Git within VS Code',
      version: '12.2.2',
      isActive: false,
      icon: '🔍'
    },
    {
      id: 'popular-3',
      name: 'Docker',
      description: 'Makes it easy to create, manage, and debug containerized applications',
      version: '1.22.1',
      isActive: false,
      icon: '🐳'
    }
  ];

  const displayedExtensions = activeFilter === 'installed' ? filteredExtensions : popularExtensions;
  
  const handleToggleExtension = (extensionId: string) => {
    toggleExtension(extensionId);
  };
  
  const handleUninstallExtension = (extensionId: string) => {
    uninstallExtension(extensionId);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="vscode-sidebar-title">
        <div className="uppercase">Extensions</div>
        <div className="flex space-x-1">
          <button className="p-0.5 rounded hover:bg-accent">
            <RefreshCw className="h-3 w-3" />
          </button>
          <button className="p-0.5 rounded hover:bg-accent">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <div className="p-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Extensions"
            className="w-full h-7 pl-7 pr-7 text-xs bg-muted rounded-sm border border-input focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex border-b border-border">
        <button 
          className={`flex-1 text-xs py-1 px-2 ${activeFilter === 'installed' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveFilter('installed')}
        >
          Installed
        </button>
        <button 
          className={`flex-1 text-xs py-1 px-2 ${activeFilter === 'popular' ? 'border-b-2 border-primary' : ''}`}
          onClick={() => setActiveFilter('popular')}
        >
          Popular
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1">
        {displayedExtensions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 text-center h-full text-sm text-muted-foreground">
            <Download className="h-8 w-8 mb-2 opacity-20" />
            <p>No extensions found</p>
          </div>
        ) : (
          displayedExtensions.map(extension => (
            <div 
              key={extension.id} 
              className="p-3 border-b border-border hover:bg-accent"
            >
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">{extension.icon}</span>
                <span className="text-sm font-medium flex-1">{extension.name}</span>
                {activeFilter === 'installed' ? (
                  <button
                    className="p-0.5 rounded hover:bg-muted"
                    onClick={() => handleToggleExtension(extension.id)}
                    title={extension.isActive ? 'Disable' : 'Enable'}
                  >
                    {extension.isActive ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </button>
                ) : (
                  <button
                    className="p-0.5 rounded hover:bg-muted text-xs text-primary"
                    title="Install"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="text-xs text-muted-foreground">{extension.description}</div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">v{extension.version}</span>
                {activeFilter === 'installed' && (
                  <button
                    className="p-0.5 rounded hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleUninstallExtension(extension.id)}
                    title="Uninstall"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExtensionsView;